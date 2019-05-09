import * as TelegramBotAPI from 'node-telegram-bot-api';
import { TOKEN, CHANNEL_ID, BOT_ADMIN_ID } from '../config';
const bot = new TelegramBotAPI(TOKEN, { polling: true });

bot.on('audio', (msg, metadata) => {
  const audio = msg.audio;
  try {
    if (audio) {
      const fileSizeString = `${Math.round(((audio.file_size || 0) / 1024 / 1024) * 100) / 100}MB`;

      const musicStr = `🎧 Music: ${titleFunction(audio.title)}`;
      const performerStr = `👤 By: ${audio.performer || 'UNKNOWN'}`;
      const durationStr = `🕒 Duration: ${Math.floor(audio.duration / 60)}:${audio.duration % 60}`;
      const sizeStr = `💾 Size: ${fileSizeString}`;
      const idStr = '🆔 @edmusics';

      let caption = `${musicStr}
${performerStr}
${durationStr}
${sizeStr}
${idStr}`;

      if (caption.length > 200) {
        caption = `${musicStr}
${performerStr}
${sizeStr}
${idStr}`;
      }
      if (caption.length > 200) {
        caption = `${musicStr}
${performerStr}
${idStr}`;
      }
      if (caption.length > 200) {
        caption = `${musicStr}
${idStr}`;
      }

      // const reply_markup = getLikeDislikeKeyboard(0, 0);
      bot.sendAudio(CHANNEL_ID, audio.file_id, { caption, title: 'vahid' }).then(x => {});
      // 'parse_mode' => 'markdown'
    } else {
      bot.sendMessage(BOT_ADMIN_ID, 'send an audio');
    }
  } catch (error) {
    console.error('captured error', error);
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
const removeStrings = (str: string, strings: string[]) => strings.reduce((result, s) => result.replace(s, ''), str);
const titleFunction = (title: string | undefined): string => {
  if (!title) return '';
  return removeStrings(title, [
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
