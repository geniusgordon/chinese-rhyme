import { compareDictionaryItem } from '../rhyme';

describe('compareDictionaryItem', () => {
  const testcases: Array<[string, string]> = [
    ['1', '2'],
    ['11', '21'],
    ['1', '11'],
    ['000', '10'],
    ['010', '90'],
  ];
  testcases.forEach(t => {
    const d0 = {
      word: t[0],
      freq: 0,
      chewing: t[0].split('').map(n => ({
        vowel: '',
        tone: 0,
        rhyme: parseInt(n),
      })),
    };
    const d1 = {
      word: t[1],
      freq: 0,
      chewing: t[1].split('').map(n => ({
        vowel: '',
        tone: 0,
        rhyme: parseInt(n),
      })),
    };
    it(`${t[0]} ${t[1]}`, () => {
      expect(compareDictionaryItem(d0, d1)).toBeLessThan(0);
      expect(compareDictionaryItem(d1, d0)).toBeGreaterThan(0);
    });
  });
});
