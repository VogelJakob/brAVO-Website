<?php
/*
 * AVO-Anmeldung: nimmt das Anmeldeformular der Startseite entgegen
 * (POST per fetch aus assets/js/avo.js) und verschickt es per SMTP über
 * das IONOS-Postfach an die Adresse des Jahrgangs.
 *
 * Konfiguration (Zugangsdaten, Absender, Empfänger) liegt NUR auf dem
 * Server in /config/avo-anmeldung-mail.php – eine Ebene über dem
 * Document-Root /public, also nicht öffentlich erreichbar und nie im Repo.
 * Dieses Skript liegt in /public/api/, daher zwei Ebenen nach oben.
 *
 * Antwort immer JSON: { "ok": true } bzw. { "ok": false, "message": "…" }.
 * Fehlerdetails (SMTP, Pfade) gehen nie an den Browser, und in Logs landen
 * keine personenbezogenen Daten.
 */

declare(strict_types=1);

ini_set('display_errors', '0');

use PHPMailer\PHPMailer\PHPMailer;

const CONFIG_FILE = __DIR__ . '/../../config/avo-anmeldung-mail.php';
const TERMINE_FILE = __DIR__ . '/../assets/data/termine.js';

/* Rate-Limit: höchstens RATE_MAX Anfragen pro IP in RATE_WINDOW Sekunden */
const RATE_MAX = 5;
const RATE_WINDOW = 600;

/* Höchstlängen pro Feld (Zeichen) */
const MAX_LEN = [
    'vorsprechen'     => 20,
    'anzahl_personen' => 20,
    'name'            => 150,
    'email'           => 254,
];

/* Erlaubte Werte für "Anzahl Personen" – identisch mit index.html */
const PERSONEN = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'mehr als 10'];

const MSG_GENERIC = 'Die Anmeldung konnte gerade nicht verarbeitet werden.';

function antwort(int $status, bool $ok, string $message = ''): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    $daten = ['ok' => $ok];
    if (!$ok) {
        $daten['message'] = $message !== '' ? $message : MSG_GENERIC;
    }
    echo json_encode($daten, JSON_UNESCAPED_UNICODE);
    exit;
}

/*
 * Wert aus $_POST holen: nur Strings, Zeilenumbrüche und sonstige
 * Steuerzeichen entfernen (Schutz vor Header-Injection), trimmen.
 */
function feld(string $name): string
{
    $wert = $_POST[$name] ?? '';
    if (!is_string($wert)) {
        return '';
    }
    $wert = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $wert) ?? '';
    return trim($wert);
}

function zuLang(string $wert, int $max): bool
{
    return (function_exists('mb_strlen') ? mb_strlen($wert, 'UTF-8') : strlen($wert)) > $max;
}

/*
 * Gültige AVO-Termine aus der zentralen Termin-Datei assets/data/termine.js
 * lesen (Block "avo: [ … ]"), damit Termine nur an EINER Stelle gepflegt
 * werden. Ergebnis: [ "JJJJ-MM-TT" => [ d, stadt, venue, zeit ], … ].
 */
function avoTermine(): array
{
    $js = @file_get_contents(TERMINE_FILE);
    if ($js === false || !preg_match('/\bavo\s*:\s*\[(.*?)\]/s', $js, $block)) {
        return [];
    }
    $termine = [];
    preg_match_all('/\{([^{}]*)\}/', $block[1], $eintraege);
    foreach ($eintraege[1] as $eintrag) {
        preg_match_all('/(\w+)\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/', $eintrag, $paare, PREG_SET_ORDER);
        $t = [];
        foreach ($paare as $p) {
            $t[$p[1]] = stripcslashes($p[2]);
        }
        if (isset($t['d'], $t['stadt']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $t['d'])) {
            $termine[$t['d']] = $t;
        }
    }
    return $termine;
}

/*
 * Einfaches Rate-Limit pro IP in einer Datei außerhalb von /public
 * (bevorzugt /config, sonst das Temp-Verzeichnis). Die IP wird nur als
 * HMAC-Hash gespeichert, nie im Klartext. Gibt false zurück, wenn das
 * Limit überschritten ist.
 */
function rateLimitOk(string $geheimnis): bool
{
    $ordner = dirname(CONFIG_FILE);
    if (!is_dir($ordner) || !is_writable($ordner)) {
        $ordner = sys_get_temp_dir();
    }
    $datei = $ordner . '/avo-anmeldung-ratelimit.json';

    $fh = @fopen($datei, 'c+');
    if ($fh === false) {
        return true; /* Speicher nicht verfügbar: Anmeldung nicht blockieren */
    }
    flock($fh, LOCK_EX);
    $inhalt = stream_get_contents($fh);
    $daten = json_decode($inhalt !== false && $inhalt !== '' ? $inhalt : '[]', true);
    if (!is_array($daten)) {
        $daten = [];
    }

    $jetzt = time();
    foreach ($daten as $schluessel => $zeiten) {
        $daten[$schluessel] = array_values(array_filter(
            is_array($zeiten) ? $zeiten : [],
            static fn($z) => is_int($z) && $z > $jetzt - RATE_WINDOW
        ));
        if (!$daten[$schluessel]) {
            unset($daten[$schluessel]);
        }
    }

    $ip = hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''), $geheimnis);
    $ok = count($daten[$ip] ?? []) < RATE_MAX;
    if ($ok) {
        $daten[$ip][] = $jetzt;
    }

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($daten));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    return $ok;
}

/* ------------------------------------------------------------------ */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    antwort(405, false, 'Nur POST-Anfragen sind erlaubt.');
}

/* Konfiguration laden – bei Fehlen nur generische Meldung, keine Pfade */
$config = is_file(CONFIG_FILE) ? require CONFIG_FILE : null;
$pflicht = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'from_email', 'from_name', 'to_email'];
if (!is_array($config) || array_diff($pflicht, array_keys($config))) {
    error_log('AVO-Anmeldung: Konfiguration fehlt oder ist unvollständig.');
    antwort(500, false);
}

/* Honeypot ausgefüllt → Erfolg vortäuschen, nichts senden */
if (feld('website') !== '') {
    antwort(200, true);
}

if (!rateLimitOk((string)$config['smtp_pass'])) {
    antwort(429, false, 'Zu viele Anfragen – bitte versucht es in einigen Minuten erneut.');
}

/* --- Validierung --- */
$werte = [];
foreach (MAX_LEN as $name => $max) {
    $werte[$name] = feld($name);
    if (zuLang($werte[$name], $max)) {
        antwort(400, false, 'Eine Angabe ist zu lang.');
    }
}

$termine = avoTermine();
if (!$termine) {
    error_log('AVO-Anmeldung: Termine konnten nicht gelesen werden.');
    antwort(500, false);
}
/* Vergangene Termine sind nicht mehr wählbar (der heutige noch) */
$heute = (new DateTime('now', new DateTimeZone('Europe/Berlin')))->format('Y-m-d');
if (!isset($termine[$werte['vorsprechen']]) || $werte['vorsprechen'] < $heute) {
    antwort(400, false, 'Bitte wählt ein gültiges Vorsprechen aus.');
}
if (!in_array($werte['anzahl_personen'], PERSONEN, true)) {
    antwort(400, false, 'Bitte wählt die Anzahl der Personen aus.');
}
if ($werte['email'] !== '' && !filter_var($werte['email'], FILTER_VALIDATE_EMAIL)) {
    antwort(400, false, 'Bitte gebt eine gültige E-Mail-Adresse an.');
}

/* --- Mail zusammenstellen --- */
$t = $termine[$werte['vorsprechen']];
[$jahr, $monat, $tag] = explode('-', $t['d']);
$datum = $tag . '.' . $monat . '.' . $jahr;
$zeit = ($t['zeit'] ?? '') !== '' ? $t['zeit'] : 'Uhrzeit folgt';
$terminText = $datum . ' – ' . $t['stadt'] . ', ' . $zeit
    . (($t['venue'] ?? '') !== '' ? ' (' . $t['venue'] . ')' : '');

$name = $werte['name'] !== '' ? $werte['name'] : 'ohne Namen';
$betreff = 'AVO-Anmeldung: ' . $datum . ' ' . $t['stadt'] . ' – ' . $name;

$eingang = new DateTime('now', new DateTimeZone('Europe/Berlin'));
$text = "Neue Anmeldung zum Abschlussvorsprechen über die Website\n"
    . "\n"
    . 'Vorsprechen:           ' . $terminText . "\n"
    . 'Anzahl Personen:       ' . $werte['anzahl_personen'] . "\n"
    . 'Name / Institution:    ' . ($werte['name'] !== '' ? $werte['name'] : '–') . "\n"
    . 'E-Mail für Rückfragen: ' . ($werte['email'] !== '' ? $werte['email'] : '–') . "\n"
    . "\n"
    . 'Eingegangen am:        ' . $eingang->format('d.m.Y, H:i') . " Uhr\n";

/* --- Versand per PHPMailer (SMTP, STARTTLS) --- */
require __DIR__ . '/../lib/PHPMailer/Exception.php';
require __DIR__ . '/../lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/../lib/PHPMailer/SMTP.php';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = (string)$config['smtp_host'];
    $mail->Port = (int)$config['smtp_port'];
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Username = (string)$config['smtp_user'];
    $mail->Password = (string)$config['smtp_pass'];
    $mail->SMTPDebug = 0;
    $mail->Timeout = 15;

    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_QUOTED_PRINTABLE;
    $mail->setFrom((string)$config['from_email'], (string)$config['from_name']);
    /* to_email: eine Adresse oder eine Liste von Adressen */
    foreach ((array)$config['to_email'] as $empfaenger) {
        $mail->addAddress((string)$empfaenger);
    }
    if ($werte['email'] !== '') {
        $mail->addReplyTo($werte['email'], $werte['name']);
    }

    $mail->isHTML(false);
    $mail->Subject = $betreff;
    $mail->Body = $text;

    $mail->send();
} catch (\Throwable $e) {
    /* Bewusst ohne $e->getMessage(): kann Adressen enthalten */
    error_log('AVO-Anmeldung: Mailversand fehlgeschlagen.');
    antwort(500, false);
}

antwort(200, true);
