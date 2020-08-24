import * as TelegramBotAPI from 'node-telegram-bot-api';
import MiscUtils from 'utils/utilties';

class MessageTemplatesClass {
  private readonly CHANNEL_ID_STRING = '🆔 @edmusics';

  getCompleteAudioInfoCaption(audio: TelegramBotAPI.Audio) {
    const musicStr = this.getAudioTitleString(audio);
    const performerStr = this.getAudioPerformerString(audio);
    const caption = this.createCaption({ musicStr, performerStr, idStr: this.CHANNEL_ID_STRING });
    return caption;
  }

  getChannelIdCaption() {
    return this.CHANNEL_ID_STRING;
  }

  private createCaption({ musicStr, performerStr, idStr }: { musicStr: string; performerStr: string; idStr: string }) {
    let caption = `${musicStr}
${performerStr}
${idStr}`;
    if (caption.length > 200) {
      caption = `${musicStr}
${idStr}`;
    }
    return caption;
  }

  private getAudioPerformerString(audio: TelegramBotAPI.Audio) {
    return `👤 By: ${audio.performer || 'UNKNOWN'}`;
  }

  private getAudioTitleString(audio: TelegramBotAPI.Audio) {
    return `🎧 Music: ${MiscUtils.titleFunction(audio.title)}`;
  }
}
export const TelegramMessageTemplates = new MessageTemplatesClass();
