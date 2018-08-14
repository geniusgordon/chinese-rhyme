declare module 'pinyin' {
  type Pinyin = {
    (word: string, options: any): Array<Array<string>>;
    STYLE_NORMAL: number;
    STYLE_TONE: number;
    STYLE_TONE2: number;
    STYLE_TO3NE: number;
    STYLE_INITIALS: number;
    STYLE_FIRST_LETTER: number;
  };
  const pinyin: Pinyin;

  export default pinyin;
}
