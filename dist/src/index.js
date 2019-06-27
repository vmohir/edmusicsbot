"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegram_bot_1 = require("telegram-bot/telegram-bot");
var Cron = require("cron");
var Scheduler = /** @class */ (function () {
    function Scheduler() {
        this.setupScheduler();
    }
    Scheduler.prototype.setupScheduler = function () {
        new Cron.CronJob('0 0 7 * * *', this.onEveryDaySixOclock).start();
    };
    Scheduler.prototype.onEveryDaySixOclock = function () {
        telegram_bot_1.default.sendAtMostTwoMusics();
    };
    return Scheduler;
}());
var exitHandler = function () {
    telegram_bot_1.default.sendBufferMusicsToAdmin();
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
//# sourceMappingURL=index.js.map