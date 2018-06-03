<?php

// requirements
require 'vendor/autoload.php';
require_once 'config.php';
// file_get_contents('https://api.telegram.org/bot'.$token.'/sendMessage?chat_id=92454&text=debug');
// require 'main-controller.php';
use Telegram\Bot\Api;
// if (isset($_GET['debug'])) {
//     dbg($_GET['debug']);
// }

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
function dbg($data, $chat_id = 92454)
{
    $text = var_export($data, true);
    global $telegram;
    $telegram->sendMessage([
        'chat_id' => $chat_id,
        'text' => $text,
    ]);
}
function rstr($str, $removeText)
{
    return str_ireplace($removeText, '', $str);
}
function rstrings($str, $rstrings)
{
    for ($i = 0; $i < count($rstrings); $i++) {
        $str = rstr($str, $rstrings[0]);
    }
    return $str;
}
function titleFunction($title)
{
    return trim(rstrings($title, ['FREE DOWNLOAD', '[FREE DOWNLOAD]', '[ORIGINAL MIX]', '[EXTENDED MIX]', 'ORIGINAL MIX', 'EXTENDED MIX']));
}
function makeInlineKeyboard($keyboard)
{
    return Telegram\Bot\Keyboard\Keyboard::make(['inline_keyboard' => $keyboard]);
}
function getLikeDislikeKeyboard($likes, $dislikes)
{
    $keyboard = [
        [[
            'text' => ((string) ($likes === 0 ? '' : $likes)) . ' 👍',
            'callback_data' => json_encode(['type' => 'like', 'likes' => $likes, 'dislikes' => $dislikes]),
        ], [
            'text' => ((string) ($dislikes === 0 ? '' : $dislikes)) . ' 👎',
            'callback_data' => json_encode(['type' => 'dislike', 'likes' => $likes, 'dislikes' => $dislikes]),
        ]],
    ];
    return makeInlineKeyboard($keyboard);
}

/// begin
//
//
//
//

$telegram = new Api($token);
// get user message
$updates = $telegram->getWebhookUpdates();
$message = $updates->getMessage();
$callback_query = $updates->getCallbackQuery();

if ($callback_query === null && $message !== null) {
    $chat = $message->getChat();
    $chat_id = (int) $chat->getId();
    $audio = $message->getAudio();
    $message_id = $message->getMessageId();
    try {
        if ($audio) {
            // dbg($audio);
            $fileSizeString = round(($audio->fileSize / 1024 / 1024), 2) . 'MB';

            $musicStr = ($audio->title ? '🎧 `Music:` ' . titleFunction($audio->title) : '`🎧 Music`');
            $performerStr = ($audio->performer ? '👤 `By:` ' . $audio->performer : '`👤 By:` Unknown');
            $durationStr = '🕒 `Duration:` ' . ((int) floor($audio->duration / 60)) . ':' . ($audio->duration % 60);
            $sizeStr = '💾 `Size:` ' . $fileSizeString;
            $idStr = '🆔 @edmusics';

            $caption = $musicStr . PHP_EOL . $performerStr . PHP_EOL . $durationStr . PHP_EOL . $sizeStr . PHP_EOL . $idStr;

            if (strlen($caption) > 200) {
                $caption = $musicStr . PHP_EOL . $performerStr . PHP_EOL . $sizeStr . PHP_EOL . $idStr;
            }
            if (strlen($caption) > 200) {
                $caption = $musicStr . PHP_EOL . $performerStr . PHP_EOL . $idStr;
            }
            if (strlen($caption) > 200) {
                $caption = $musicStr . PHP_EOL . $idStr;
            }

            $reply_markup = getLikeDislikeKeyboard(0, 0);
            $telegram->sendAudio([
                'chat_id' => $channel_id,
                'audio' => $audio->fileId,
                'caption' => $caption,
                'parse_mode' => 'markdown',
                'reply_markup' => $reply_markup,
            ]);
        } else {
            // $telegram->sendMessage([
            //     'chat_id' => 92454,
            //     'text' => 'test',
            // ]);
        }

    } catch (Exception $e) {
        dbg(make_exception_array($e));
    }
}
if ($callback_query != null) {
    // dbg('wp');
    $message = $callback_query->getMessage();
    $data = $callback_query->getData();
    $data = json_decode($data, true);

    $likes = $data['likes'];
    $dislikes = $data['dislikes'];
    if ($data['type'] === 'like') {
        $likes += 1;
    }

    if ($data['type'] === 'dislike') {
        $dislikes -= 1;
    }

    // dbg($value);

    $reply_markup = getLikeDislikeKeyboard($likes, $dislikes);
    $telegram->editMessageReplyMarkup([
        'chat_id' => $message->getChat()->getId(),
        'message_id' => $message->getMessageId(),
        'reply_markup' => $reply_markup,
    ]);
    // dbg($message);
    // dbg($data);
}
