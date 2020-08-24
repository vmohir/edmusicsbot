const jsmediatags = require('jsmediatags');

class AudioUtilsClass {
  constructor() {}

  readTags(audioUrl: string) {
    return new Promise<number[] | undefined>((resolve, reject) => {
      jsmediatags.read(audioUrl, {
        onSuccess: function (tag) {
          resolve(tag?.tags?.picture?.data);
        },
        onError: function (error) {
          reject(error);
          console.error(':(', error.type, error.info);
        },
      });
    });
  }
}

export const AudioUtils = new AudioUtilsClass();
