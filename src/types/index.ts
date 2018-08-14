type CharToChewingTable = {
  [ch: string]: Array<string>;
};

type Chewing = {
  vowel: string;
  tone: number;
  rhyme: number;
};

type DictionaryItem = {
  word: string;
  freq: number;
};
type Dictionary = Array<DictionaryItem>;

export { Chewing, Dictionary, CharToChewingTable };
