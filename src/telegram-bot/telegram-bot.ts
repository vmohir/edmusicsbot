import * as TelegramBotAPI from 'node-telegram-bot-api';
import { BOT_ADMIN_ID } from '../../config';
import { MusicChannelController } from './music-channel-controller';
import { Tlg } from './telegram-bot-api';

class TelegramBotHandlerClass {
  private readonly AUDIO_COUNT = '/audiocount';
  private readonly SEND_NOW = '/sendnow';
  private readonly WHAT_IS_NOT_SENT = '/whatisnotsent';

  constructor() {
    this.setupHandlers();
  }

  private setupHandlers() {
    console.log('BOT IS READY');
    Tlg.bot.on('polling_error', error => {
      // console.error('bot error', error);
    });
    Tlg.bot.on('text', msg => {
      const { text } = msg;
      console.log('TelegramBotHandlerClass -> setupHandlers -> text', text);
      if (msg.chat.id.toString() === BOT_ADMIN_ID) {
        if (text?.startsWith(this.AUDIO_COUNT)) this.handleAudioCountCommand(msg);
        if (text?.startsWith(this.SEND_NOW)) this.handleSendNowCommand(msg);
        if (text?.startsWith(this.WHAT_IS_NOT_SENT)) this.handleWhatIsNotSentCommand(msg);
        return;
      }
      setTimeout(() => Tlg.bot.deleteMessage(msg.chat.id, msg.message_id.toString()), 10000);
    });
    Tlg.bot.on('audio', msg => this.handleAudioInput(msg));
  }

  private handleWhatIsNotSentCommand(msg: TelegramBotAPI.Message) {
    MusicChannelController.sendWhatIsNotSentToAdmin();
  }
  private handleSendNowCommand(msg: TelegramBotAPI.Message) {
    MusicChannelController.sendOneMusicToChannel();
  }
  private handleAudioCountCommand(msg: TelegramBotAPI.Message) {
    const { text } = msg;
    if (!text) return;

    const audioCount = parseInt(text.substring(this.AUDIO_COUNT.length + 1), 10) ?? 1;
    MusicChannelController.handleAudioCountCommand(audioCount, msg);
  }

  private async handleAudioInput(msg: TelegramBotAPI.Message) {
    MusicChannelController.handleAudioFromAdmin(msg);
  }

  onExit() {
    MusicChannelController.sendBufferMusicsToAdmin();
    Tlg.bot.stopPolling();
  }
}

const TelegramBot = new TelegramBotHandlerClass();
export default TelegramBot;
