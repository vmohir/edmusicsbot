import * as TelegramBotAPI from 'node-telegram-bot-api';
import { TOKEN, CHANNEL_ID, BOT_ADMIN_ID } from '../../config';
import Utilities from 'utils/utilties';

const CHANNEL_ID_STRING = '🆔 @edmusics';

class TelegramBotHandlerClass {
  private bot = new TelegramBotAPI(TOKEN, { polling: true });
  channelMusicsQueue: MusicMsg[] = [];
  channelAudioCount = 1;

  private readonly AUDIO_COUNT = '/audiocount';
  private readonly SEND_NOW = '/sendnow';

  constructor() {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.bot.on('text', msg => {
      const { text } = msg;
      if (msg.chat.id.toString() === BOT_ADMIN_ID) {
        if (text?.startsWith(this.AUDIO_COUNT)) this.handleAudioCountCommand(msg);
        if (text?.startsWith(this.SEND_NOW)) this.handleSendNowCommand(msg);
        return;
      }
      setTimeout(() => this.bot.deleteMessage(msg.chat.id, msg.message_id.toString()), 10000);
    });
    this.bot.on('audio', msg => this.handleAudioInput(msg));
  }

  private handleSendNowCommand(msg: TelegramBotAPI.Message) {
    this.sendOneMusicToChannel();
  }
  private handleAudioCountCommand(msg: TelegramBotAPI.Message) {
    const { text } = msg;
    if (!text) return;
    this.channelAudioCount = parseInt(text.substring(this.AUDIO_COUNT.length + 1), 10) || 1;
    this.bot.sendMessage(msg.chat.id, `تعداد آهنگ در روز تنظیم شد به: ${this.channelAudioCount}`);
  }

  private handleAudioInput(msg: TelegramBotAPI.Message) {
    const audio = msg.audio;
    // console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> msg', audio);
    try {
      if (!audio) {
        this.bot.sendMessage(BOT_ADMIN_ID, 'Please send an audio');
        return;
      }

      const caption = this.getAudioCaption(audio);
      // console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> caption', caption);

      // console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> this.channelMusicsQueue', this.channelMusicsQueue);

      this.bot
        .sendAudio(msg.chat.id, audio.file_id, { caption: `Done! Got this: ${audio.title}-${audio.performer}`, disable_notification: true })
        .then(data => {
          this.bot.deleteMessage(msg.chat.id, msg.message_id.toString()); // remove the music
          this.channelMusicsQueue.push(new MusicMsg(CHANNEL_ID, audio.file_id, caption, audio.title, data.chat.id, data.message_id));
        });
    } catch (error) {
      console.error('captured error', error);
    }
  }

  sendMusicsToChannel() {
    for (let i = 0; i < this.channelAudioCount; i++) {
      this.sendOneMusicToChannel();
    }
  }

  sendBufferMusicsToAdmin() {
    if (!this.channelMusicsQueue.length) return;
    this.bot.sendMessage(BOT_ADMIN_ID, `سرور اومد پایین اینا رو هنوز نفرستادم`).then(_ => {
      this.channelMusicsQueue.forEach(musicMsg => {
        this.bot.sendAudio(BOT_ADMIN_ID, musicMsg.fileId, { caption: musicMsg.caption });
      });
    });
  }

  private sendOneMusicToChannel() {
    const musicMsg = this.channelMusicsQueue.pop();
    this.bot.sendMessage(
      BOT_ADMIN_ID,
      `اینا رو هنوز نفرستادم ${this.channelMusicsQueue.reduce((res, musicMsg) => `${musicMsg.audioTitle}\n${res}`, '')}`
    );
    if (!musicMsg) return;

    this.bot.sendAudio(musicMsg.chatId, musicMsg.fileId, { caption: musicMsg.caption }).then(data => {
      this.bot.editMessageCaption('اینو فرستادم', { chat_id: musicMsg.sourceChatId, message_id: musicMsg.sourceMessageId }); // remove the music
    });
  }

  private getAudioCaption(audio: TelegramBotAPI.Audio) {
    const musicStr = this.getAudioTitleString(audio);
    const performerStr = this.getAudioPerformerString(audio);
    const durationStr = this.getDurationString(audio);
    const sizeStr = this.getSizeString(audio);
    const caption = this.createCaption(musicStr, performerStr, durationStr, sizeStr, CHANNEL_ID_STRING);
    return caption;
  }

  private getSizeString(audio: TelegramBotAPI.Audio) {
    const fileSizeString = this.getFileSizeString(audio);
    const sizeStr = `💾 Size: ${fileSizeString}`;
    return sizeStr;
  }

  private getDurationString(audio: TelegramBotAPI.Audio) {
    return `🕒 Duration: ${Math.floor(audio.duration / 60)}:${audio.duration % 60}`;
  }

  private getAudioPerformerString(audio: TelegramBotAPI.Audio) {
    return `👤 By: ${audio.performer || 'UNKNOWN'}`;
  }

  private getAudioTitleString(audio: TelegramBotAPI.Audio) {
    return `🎧 Music: ${Utilities.titleFunction(audio.title)}`;
  }

  private getFileSizeString(audio: TelegramBotAPI.Audio) {
    return `${Math.round(((audio.file_size || 0) / 1024 / 1024) * 100) / 100}MB`;
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
  constructor(
    public chatId: string,
    public fileId: string,
    public caption: string,
    public audioTitle: string | undefined,
    public sourceChatId: number,
    public sourceMessageId: number
  ) {}
}
