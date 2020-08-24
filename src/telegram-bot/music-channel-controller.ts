import { MusicMsg } from 'models/music-msg';
import * as TelegramBotAPI from 'node-telegram-bot-api';
import { BOT_ADMIN_ID, CHANNEL_ID } from '../../config';
import { Tlg } from './telegram-bot-api';

class MusicChannelControllerClass {
  channelMusicsQueue: MusicMsg[] = [];
  channelAudioCount = 1;

  sendMusicsToChannel() {
    for (let i = 0; i < this.channelAudioCount; i++) {
      this.sendOneMusicToChannel();
    }
  }

  sendBufferMusicsToAdmin() {
    if (!this.channelMusicsQueue.length) return;
    Tlg.bot.sendMessage(BOT_ADMIN_ID, `سرور اومد پایین اینا رو هنوز نفرستادم`).then(_ => {
      this.channelMusicsQueue.forEach(musicMsg => {
        Tlg.bot.sendAudio(BOT_ADMIN_ID, musicMsg.fileId, { caption: musicMsg.audioCaption });
      });
    });
  }

  async sendOneMusicToChannel() {
    const musicMsg = this.channelMusicsQueue.pop();
    this.sendWhatIsNotSentToAdmin();
    if (!musicMsg) return;

    const { chatId, imageBuffer, audioCaption, photoCaption, fileId, sourceChatId, sourceMessageId } = musicMsg;
    console.log('TelegramBotHandlerClass -> sendOneMusicToChannel -> imageData', chatId, !!imageBuffer);

    if (imageBuffer) {
      const sentPhoto = await Tlg.bot.sendPhoto(chatId, imageBuffer, { caption: photoCaption });
      await Tlg.bot.sendAudio(chatId, fileId, { caption: audioCaption, reply_to_message_id: sentPhoto.message_id });
    } else {
      await Tlg.bot.sendAudio(chatId, fileId, { caption: audioCaption });
    }

    // remove the music
    Tlg.bot.editMessageCaption('اینو فرستادم', { chat_id: sourceChatId, message_id: sourceMessageId });
  }

  sendWhatIsNotSentToAdmin() {
    Tlg.bot.sendMessage(
      BOT_ADMIN_ID,
      `اینا رو هنوز نفرستادم ${this.channelMusicsQueue.reduce((res, musicMsg) => `${musicMsg.audioTitle}\n${res}`, '')}`,
    );
  }

  handleAudioCountCommand(audioCount: number, msg: TelegramBotAPI.Message) {
    this.channelAudioCount = audioCount;
    Tlg.bot.sendMessage(msg.chat.id, `تعداد آهنگ در روز تنظیم شد به: ${this.channelAudioCount}`);
  }

  async handleAudioFromAdmin(msg: TelegramBotAPI.Message) {
    const audio = msg.audio;
    console.log('TelegramBotHandlerClass -> handleAudioInput -> audio', audio);
    try {
      if (!audio) {
        Tlg.bot.sendMessage(BOT_ADMIN_ID, 'Please send an audio');
        return;
      }

      const sentMessageToAdmin = await Tlg.bot.sendAudio(msg.chat.id, audio.file_id, {
        caption: `Done! Got this: ${audio.title}-${audio.performer}`,
        disable_notification: true,
      });

      // remove the music
      Tlg.bot.deleteMessage(msg.chat.id, msg.message_id.toString());

      const musicData = await MusicMsg.create({
        chatId: CHANNEL_ID,
        audio,
        sourceChatId: sentMessageToAdmin.chat.id,
        sourceMessageId: sentMessageToAdmin.message_id,
      });

      this.channelMusicsQueue.push(musicData);
    } catch (error) {
      console.error('captured error', error);
    }
  }
}

export const MusicChannelController = new MusicChannelControllerClass();
