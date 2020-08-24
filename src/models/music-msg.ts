import * as TelegramBotAPI from 'node-telegram-bot-api';
import { Tlg } from 'telegram-bot/telegram-bot-api';
import { AudioUtils } from 'utils/audio-utils';
import MiscUtils from 'utils/utilties';
import { TelegramMessageTemplates } from 'telegram-bot/message-templates';

interface MusicMsgConstructorData {
  chatId: string;
  audio: TelegramBotAPI.Audio;
  sourceChatId: number;
  sourceMessageId: number;
}

export class MusicMsg {
  audioCaption?: string;
  photoCaption?: string;
  imageBuffer: Buffer | undefined;
  chatId: string;
  audio: TelegramBotAPI.Audio;
  sourceChatId: number;
  sourceMessageId: number;
  get audioTitle() {
    return this.audio.title;
  }
  get fileId() {
    return this.audio.file_id;
  }
  private constructor({ audio, chatId, sourceChatId, sourceMessageId }: MusicMsgConstructorData) {
    this.chatId = chatId;
    this.audio = audio;
    this.sourceChatId = sourceChatId;
    this.sourceMessageId = sourceMessageId;
  }
  static async create(data: MusicMsgConstructorData) {
    const instance = new MusicMsg(data);
    await instance.getData();
    return instance;
  }

  private async getData() {
    const fileLink = await Tlg.bot.getFileLink(this.fileId);

    const imageData = await AudioUtils.readTags(fileLink);
    this.imageBuffer = MiscUtils.arrayByteToBuffer(imageData);

    if (this.imageBuffer) {
      this.photoCaption = TelegramMessageTemplates.getCompleteAudioInfoCaption(this.audio);
      this.audioCaption = TelegramMessageTemplates.getChannelIdCaption();
    } else {
      this.audioCaption = TelegramMessageTemplates.getCompleteAudioInfoCaption(this.audio);
    }
  }
}
