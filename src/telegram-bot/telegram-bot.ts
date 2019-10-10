import * as TelegramBotAPI from 'node-telegram-bot-api';
import { TOKEN, CHANNEL_ID, BOT_ADMIN_ID } from '../../config';
import Utilities from 'utils/utilties';

class TelegramBotHandlerClass {
  private bot = new TelegramBotAPI(TOKEN, { polling: true });
  channelMusicsQueue: MusicMsg[] = [];
  constructor() {
    this.setupHandlers();
  }
  private setupHandlers() {
    this.bot.on('text', (msg, metadata) => {
      setTimeout(() => {
        this.bot.deleteMessage(msg.chat.id, msg.message_id.toString());
      }, 10000);
    });
    this.bot.on('audio', (msg, metadata) => this.handleAudioInput(msg));
  }

  private handleAudioInput(msg: TelegramBotAPI.Message) {
    const audio = msg.audio;
    console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> msg', audio);
    try {
      if (audio) {
        const fileSizeString = `${Math.round(((audio.file_size || 0) / 1024 / 1024) * 100) / 100}MB`;

        const musicStr = `🎧 Music: ${Utilities.titleFunction(audio.title)}`;
        const performerStr = `👤 By: ${audio.performer || 'UNKNOWN'}`;
        const durationStr = `🕒 Duration: ${Math.floor(audio.duration / 60)}:${audio.duration % 60}`;
        const sizeStr = `💾 Size: ${fileSizeString}`;
        const idStr = '🆔 @edmusics';

        const caption = this.createCaption(musicStr, performerStr, durationStr, sizeStr, idStr);
        console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> caption', caption);

        this.channelMusicsQueue.push(new MusicMsg(CHANNEL_ID, audio.file_id, caption, audio.title));
        console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> this.channelMusicsQueue', this.channelMusicsQueue);
        this.bot.sendMessage(msg.chat.id, `Done! Got this: ${audio.title}`).then(data => {
          setTimeout(() => {
            this.bot.deleteMessage(data.chat.id, data.message_id.toString());
          }, 4000);
        });
      } else {
        this.bot.sendMessage(BOT_ADMIN_ID, 'Please send an audio');
      }
    } catch (error) {
      console.error('captured error', error);
    }
  }

  sendAtMostTwoMusics() {
    this.sendOneMusic();
    // this.sendOneMusic();
  }

  sendBufferMusicsToAdmin() {
    if (!this.channelMusicsQueue.length) return;
    this.bot.sendMessage(BOT_ADMIN_ID, `سرور اومد پایین اینا رو هنوز نفرستادم`).then(_ => {
      this.channelMusicsQueue.forEach(musicMsg => {
        this.bot.sendAudio(BOT_ADMIN_ID, musicMsg.fileId, { caption: musicMsg.caption });
      });
    });
  }

  private sendOneMusic() {
    const musicMsg = this.channelMusicsQueue.pop();
    this.bot.sendMessage(
      BOT_ADMIN_ID,
      `اینا رو هنوز نفرستادم ${this.channelMusicsQueue.reduce((res, musicMsg) => `${musicMsg.audioTitle}\n${res}`, '')}`
    );
    if (!musicMsg) return;

    this.bot.sendAudio(musicMsg.chatId, musicMsg.fileId, { caption: musicMsg.caption });
  }
  private createCaption(musicStr: string, performerStr: string, durationStr: string, sizeStr: string, idStr: string) {
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
    return caption;
  }
}

const TelegramBot = new TelegramBotHandlerClass();
export default TelegramBot;

class MusicMsg {
  constructor(public chatId: string, public fileId: string, public caption: string, public audioTitle: string | undefined) {}
}
