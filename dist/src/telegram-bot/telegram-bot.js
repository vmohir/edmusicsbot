"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TelegramBotAPI = require("node-telegram-bot-api");
var config_1 = require("../../config");
var utilties_1 = require("utils/utilties");
var TelegramBotHandlerClass = /** @class */ (function () {
    function TelegramBotHandlerClass() {
        this.bot = new TelegramBotAPI(config_1.TOKEN, { polling: true });
        this.channelMusicsQueue = [];
        this.setupHandlers();
    }
    TelegramBotHandlerClass.prototype.setupHandlers = function () {
        var _this = this;
        this.bot.on('audio', function (msg, metadata) { return _this.handleAudioInput(msg); });
    };
    TelegramBotHandlerClass.prototype.handleAudioInput = function (msg) {
        var audio = msg.audio;
        console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> msg', audio);
        try {
            if (audio) {
                var fileSizeString = Math.round(((audio.file_size || 0) / 1024 / 1024) * 100) / 100 + "MB";
                var musicStr = "\uD83C\uDFA7 Music: " + utilties_1.default.titleFunction(audio.title);
                var performerStr = "\uD83D\uDC64 By: " + (audio.performer || 'UNKNOWN');
                var durationStr = "\uD83D\uDD52 Duration: " + Math.floor(audio.duration / 60) + ":" + audio.duration % 60;
                var sizeStr = "\uD83D\uDCBE Size: " + fileSizeString;
                var idStr = '🆔 @edmusics';
                var caption = this.createCaption(musicStr, performerStr, durationStr, sizeStr, idStr);
                console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> caption', caption);
                this.channelMusicsQueue.push(new MusicMsg(config_1.CHANNEL_ID, audio.file_id, caption));
                console.log('TCL: TelegramBotHandlerClass -> handleAudioInput -> this.channelMusicsQueue', this.channelMusicsQueue);
            }
            else {
                this.bot.sendMessage(config_1.BOT_ADMIN_ID, 'Please send an audio');
            }
        }
        catch (error) {
            console.error('captured error', error);
        }
    };
    TelegramBotHandlerClass.prototype.sendAtMostTwoMusics = function () {
        this.sendOneMusic();
        this.sendOneMusic();
    };
    TelegramBotHandlerClass.prototype.sendBufferMusicsToAdmin = function () {
        var _this = this;
        if (!this.channelMusicsQueue.length)
            return;
        this.bot.sendMessage(config_1.BOT_ADMIN_ID, "\u0633\u0631\u0648\u0631 \u0627\u0648\u0645\u062F \u067E\u0627\u06CC\u06CC\u0646 \u0627\u06CC\u0646\u0627 \u0631\u0648 \u0647\u0646\u0648\u0632 \u0646\u0641\u0631\u0633\u062A\u0627\u062F\u0645").then(function (_) {
            _this.channelMusicsQueue.forEach(function (musicMsg) {
                _this.bot.sendAudio(config_1.BOT_ADMIN_ID, musicMsg.fileId, { caption: musicMsg.caption });
            });
        });
    };
    TelegramBotHandlerClass.prototype.sendOneMusic = function () {
        var queue = this.channelMusicsQueue;
        var musicMsg = queue.pop();
        if (!musicMsg)
            return;
        this.bot.sendAudio(musicMsg.chatId, musicMsg.fileId, { caption: musicMsg.caption });
    };
    TelegramBotHandlerClass.prototype.createCaption = function (musicStr, performerStr, durationStr, sizeStr, idStr) {
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
        return caption;
    };
    return TelegramBotHandlerClass;
}());
var TelegramBot = new TelegramBotHandlerClass();
exports.default = TelegramBot;
var MusicMsg = /** @class */ (function () {
    function MusicMsg(chatId, fileId, caption) {
        this.chatId = chatId;
        this.fileId = fileId;
        this.caption = caption;
    }
    return MusicMsg;
}());
//# sourceMappingURL=telegram-bot.js.map