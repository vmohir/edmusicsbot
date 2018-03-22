<?php

// requirements
require 'vendor/autoload.php';
require_once 'config.php';
// file_get_contents('https://api.telegram.org/bot'.$token.'/sendMessage?chat_id=92454&text=debug');
// require 'main-controller.php';
use Telegram\Bot\Api;

// connecting
$telegram = new Api($token);
// get user message
$updates = $telegram->getWebhookUpdates();
$message = $updates->getMessage();
$callback_query = $updates->getCallbackQuery();

if (isset($_GET['debug'])) {
    log_debug($_GET['debug']);
}

function get_file_link($file_id)
{
    global $telegram, $token;
    $file = $telegram->getFile([
        'file_id' => $file_id,
    ]);
    return 'https://api.telegram.org/file/bot' . $token . '/' . $file->getFilePath();
}
function make_exception_array($e)
{
    return [
        'exception' => 'exception',
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
        'trace' => $e->getTraceAsString(),
    ];
}
function log_debug($data, $chat_id = 92454)
{
    $text = var_export($data, true);
    global $telegram;
    $telegram->sendMessage([
        'chat_id' => $chat_id,
        'text' => $text,
    ]);
}

if ($message != null) {
    $chat = $message->getChat();
    $chat_id = (int) $chat->getId();
    // $text       = $message->getText();
    $audio = $message->getAudio();
    $message_id = $message->getMessageId();
    // $username   = $message->getFrom()->getUsername();
    // $user       = $message->getFrom();
    // $username   = $user->getUsername();
    // $fullname   = $user->getFirstName() . ' ' . $user->getLastName();
    try {
        log_debug($message);
        // $file_url = get_file_link($audio->fileId);
        $fileSizeString = ($audio->fileId / 1024) . 'MB';

        $caption =  '🎧 Music: ' . $audio->title
                    . PHP_EOL . '👤 By: ' . $audio->performer
                    . PHP_EOL . '🕒 Duration: ' . ($audio->duration / 60) . ':' ($audio->duration % 60)
                    . PHP_EOL . '💾 Size: ' . $fileSizeString;
                    
        $telegram->sendAudio([
            'chat_id' => $admin_id,
            'audio' => $audio->fileId,
            'caption' => $caption,
        ]);

    } catch (Exception $e) {
        log_debug(make_exception_array($e));
    }
}
