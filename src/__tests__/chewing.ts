import getChewing from '../chewing';

describe('getChewing', () => {
  const testcases = [
    { description: '1 no tone', word: '之', chewing: { vowel: 'ㄓ', tone: 1 } },
    {
      description: '1 with tone',
      word: '直',
      chewing: { vowel: 'ㄓ', tone: 2 },
    },
    {
      description: '2 no tone single vowel',
      word: '八',
      chewing: { vowel: 'ㄚ', tone: 1 },
    },
    {
      description: '2 with tone single vowel',
      word: '拔',
      chewing: { vowel: 'ㄚ', tone: 2 },
    },
    {
      description: '2 no tone double vowel',
      word: '壓',
      chewing: { vowel: 'ㄧㄚ', tone: 1 },
    },
    {
      description: '2 with tone double vowel',
      word: '牙',
      chewing: { vowel: 'ㄧㄚ', tone: 2 },
    },
    {
      description: '3 no tone',
      word: '標',
      chewing: { vowel: 'ㄧㄠ', tone: 1 },
    },
    {
      description: '3 with tone',
      word: '表',
      chewing: { vowel: 'ㄧㄠ', tone: 3 },
    },
  ];

  testcases.forEach(t => {
    it(t.description, () => {
      const c = getChewing(t.word)[0];
      expect(c.vowel).toEqual(t.chewing.vowel);
      expect(c.tone).toEqual(t.chewing.tone);
    });
  });
});
