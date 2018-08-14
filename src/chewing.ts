import { Chewing } from './types';
const charToChewing = require('../data/chewing.json');

const tones = 'ˊˇˋ˙'.split('');
const midVowels = 'ㄧㄨㄩ'.split('');
const rhymes = [
  ['ㄨ'],
  'ㄧㄩ'.split(''),
  'ㄓㄔㄕㄖㄗㄘㄙ'.split(''),
  'ㄚ ㄧㄚ ㄨㄚ'.split(' '),
  'ㄛ ㄡ ㄧㄡ ㄨㄛ'.split(' '),
  'ㄜ ㄦ'.split(' '),
  'ㄝ ㄟ ㄧㄝ ㄨㄟ ㄩㄝ'.split(' '),
  'ㄢ ㄨㄢ'.split(' '),
  'ㄞ ㄨㄞ'.split(' '),
  'ㄣ ㄥ'.split(' '),
  'ㄤ ㄧㄤ ㄨㄤ'.split(' '),
  'ㄠ ㄧㄠ'.split(' '),
  'ㄨㄥ ㄩㄥ'.split(' '),
  'ㄧㄢ ㄩㄢ'.split(' '),
  'ㄧㄣ ㄧㄥ'.split(' '),
  'ㄨㄣ ㄩㄣ'.split(' '),
];

function removeTone(c: string): [string, number] {
  const x = c.slice(-1);
  const i = tones.findIndex(t => t === x);
  if (i !== -1) {
    return [c.substr(0, c.length - 1), i + 2];
  }
  return [c, 1];
}

function getVowel(c: string): string {
  if (c.length === 1) {
    return c;
  } else if (c.length === 2) {
    if (midVowels.includes(c[0])) {
      return c;
    }
    return c[1];
  } else if (c.length === 3) {
    return c.substr(1);
  }
  return '';
}

function getRhyme(v: string): number {
  return rhymes.findIndex(r => r.includes(v));
}

function getChewing(word: string): Array<Chewing> {
  return word.split('').map(cur => {
    const cw = charToChewing[cur];
    if (!cw) {
      throw new Error(`no chewing for ${cur}`);
    }
    const [chewing, tone] = removeTone(cw[0]);
    const vowel = getVowel(chewing);
    return {
      vowel,
      tone,
      rhyme: getRhyme(vowel),
    };
  });
}

export default getChewing;
