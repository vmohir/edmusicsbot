class UtilitiesClass {
  private removeStrings = (str: string, strings: string[]) => strings.reduce((result, s) => result.replace(s, ''), str);

  titleFunction = (title: string | undefined): string => {
    if (!title) return '';
    return this.removeStrings(title, [
      'FREE DOWNLOAD',
      '[FREE DOWNLOAD]',
      '[ORIGINAL MIX]',
      '[EXTENDED MIX]',
      'ORIGINAL MIX',
      'EXTENDED MIX'
    ]).trim();
  };
}

const Utilities = new UtilitiesClass();
export default Utilities;
