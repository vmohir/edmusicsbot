"use strict";
exports.__esModule = true;
var node_telegram_bot_api_1 = require("node-telegram-bot-api");
var config_1 = require("../config");
var bot = new node_telegram_bot_api_1["default"](config_1.TOKEN, { polling: true });
bot.on('audio', function (msg, metadata) {
    //   const chat = msg.chat;
    //   const chat_id = chat.id;
    var audio = msg.audio;
    //   const $message_id = msg.message_id;
    try {
        if (audio) {
            // dbg(audio);
            var fileSizeString = Math.round((audio.file_size / 1024 / 1024) * 100) / 100 + "MB";
            var musicStr = audio.title ? '🎧 `Music:` ' + titleFunction(audio.title) : '`🎧 Music`';
            var performerStr = audio.performer ? '👤 `By:` ' + audio.performer : '`👤 By:` Unknown';
            var durationStr = '🕒 `Duration:` ' + Math.floor(audio.duration / 60) + ':' + (audio.duration % 60);
            var sizeStr = "\uD83D\uDCBE `Size:`" + fileSizeString;
            var idStr = '🆔 @edmusics';
            var caption = musicStr + "\n" + performerStr + "\n" + durationStr + "\n" + sizeStr + "\n" + idStr;
            if (caption.length > 200) {
                caption = musicStr + "\n" + performerStr + "\n" + sizeStr + "\n" + idStr;
            }
            if (caption.length > 200) {
                caption = musicStr + "\n" + performerStr + "\n" + idStr;
            }
            if (caption.length > 200) {
                caption = musicStr + "\n" + idStr;
            }
            // const reply_markup = getLikeDislikeKeyboard(0, 0);
            bot.sendAudio(config_1.CHANNEL_ID, audio.file_id, { caption: caption });
            // 'parse_mode' => 'markdown'
        }
        else {
            // $telegram->sendMessage([
            //     'chat_id' => 92454,
            //     'text' => 'test',
            // ]);
        }
    }
    catch (error) {
        // dbg(make_exception_array($e));
    }
});
// function get_file_link($file_id: string) {
//     global $telegram, $token;
//     $file = $telegram->getFile([
//         'file_id' => $file_id,
//     ]);
//     return 'https://api.telegram.org/file/bot' . $token . '/' . $file->getFilePath();
// }
// function make_exception_array($e)
// {
//     return [
//         'exception' => 'exception',
//         'file' => $e->getFile(),
//         'line' => $e->getLine(),
//         'message' => $e->getMessage(),
//         'code' => $e->getCode(),
//         'trace' => $e->getTraceAsString(),
//     ];
// }
// function dbg($data, $chat_id = 92454)
// {
//     $text = var_export($data, true);
//     global $telegram;
//     $telegram->sendMessage([
//         'chat_id' => $chat_id,
//         'text' => $text,
//     ]);
// }
var removeStrings = function (str, strings) { return strings.reduce(function (s) { return "" + str.replace(s, ''); }, ''); };
var titleFunction = function ($title) {
    return removeStrings($title, [
        'FREE DOWNLOAD',
        '[FREE DOWNLOAD]',
        '[ORIGINAL MIX]',
        '[EXTENDED MIX]',
        'ORIGINAL MIX',
        'EXTENDED MIX'
    ]).trim();
};
// function makeInlineKeyboard($keyboard)
// {
//     return Telegram\Bot\Keyboard\Keyboard::make(['inline_keyboard' => $keyboard]);
// }
// function getLikeDislikeKeyboard($likes, $dislikes)
// {
//     $keyboard = [
//         [[
//             'text' => ((string) ($likes === 0 ? '' : $likes)) . ' 👍',
//             'callback_data' => json_encode(['type' => 'like', 'likes' => $likes, 'dislikes' => $dislikes]),
//         ], [
//             'text' => ((string) ($dislikes === 0 ? '' : $dislikes)) . ' 👎',
//             'callback_data' => json_encode(['type' => 'dislike', 'likes' => $likes, 'dislikes' => $dislikes]),
//         ]],
//     ];
//     return makeInlineKeyboard($keyboard);
// }
// get user message
// $updates = $telegram->getWebhookUpdates();
// $message = $updates->getMessage();
// $callback_query = $updates->getCallbackQuery();
// if ($callback_query === null && $message !== null) {
// }
// if ($callback_query != null) {
//     // dbg('wp');
//     $message = $callback_query->getMessage();
//     $data = $callback_query->getData();
//     $data = json_decode($data, true);
//     $likes = $data['likes'];
//     $dislikes = $data['dislikes'];
//     if ($data['type'] === 'like') {
//         $likes += 1;
//     }
//     if ($data['type'] === 'dislike') {
//         $dislikes -= 1;
//     }
//     // dbg($value);
//     $reply_markup = getLikeDislikeKeyboard($likes, $dislikes);
//     $telegram->editMessageReplyMarkup([
//         'chat_id' => $message->getChat()->getId(),
//         'message_id' => $message->getMessageId(),
//         'reply_markup' => $reply_markup,
//     ]);
//     // dbg($message);
//     // dbg($data);
// }
