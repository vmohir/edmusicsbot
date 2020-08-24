class MiscUtilClass {
  private removeStrings = (str: string, strings: string[]) => strings.reduce((result, s) => result.replace(s, ''), str);

  titleFunction = (title: string | undefined): string => {
    if (!title) return '';
    return this.removeStrings(title, [
      'FREE DOWNLOAD',
      '[FREE DOWNLOAD]',
      '[ORIGINAL MIX]',
      '[EXTENDED MIX]',
      'ORIGINAL MIX',
      'EXTENDED MIX',
    ]).trim();
  };

  arrayByteToBuffer(buffer: number[] | null | undefined) {
    if (!buffer) return;
    return Buffer.from(buffer);
  }
}

const MiscUtils = new MiscUtilClass();
export default MiscUtils;
