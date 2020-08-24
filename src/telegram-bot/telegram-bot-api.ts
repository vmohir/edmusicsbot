import * as TelegramBotAPI from 'node-telegram-bot-api';
import { TOKEN } from '../../config';

class TelegramBotApiClass {
  bot = new TelegramBotAPI(TOKEN, { polling: true });
  constructor() {
    this.bot.stopPolling().then(() => {
      this.bot.startPolling();
    });
  }
}
export const Tlg = new TelegramBotApiClass();
