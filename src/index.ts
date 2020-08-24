import TelegramBot from 'telegram-bot/telegram-bot';
import { MusicChannelController } from 'telegram-bot/music-channel-controller';
import { isDev } from '../config';
import Cron = require('cron');

process.stdin.resume();
console.log('\x1b[33m');

class Scheduler {
  constructor() {
    if (!isDev) {
      this.setupScheduler();
    }
  }

  private setupScheduler() {
    new Cron.CronJob('0 0 7 * * *', this.onEveryDaySixOclock).start();
  }

  private onEveryDaySixOclock() {
    MusicChannelController.sendMusicsToChannel();
  }
}

const exitHandler = () => {
  TelegramBot.onExit();
};

//do something when app is closing
process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);

new Scheduler();
