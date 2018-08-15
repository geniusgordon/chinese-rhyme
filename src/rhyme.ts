import ProgressBar from 'progress';
import getChewing from './chewing';
import { Chewing, Dictionary, DictionaryItem } from './types';

function isToneRhyme(t0: number, t1: number): boolean {
  return (t0 <= 2 && t1 <= 2) || (t0 > 2 && t1 > 2);
}

function isSingleWordRhyme(c0: Chewing, c1: Chewing, tone: boolean): boolean {
  return c0.rhyme === c1.rhyme && (!tone || isToneRhyme(c0.tone, c1.tone));
}

function isRhyme(
  w0: Array<Chewing>,
  w1: Array<Chewing>,
  options: {
    count: number;
    tone: boolean;
  },
): boolean {
  if (w0.length < options.count || w1.length < options.count) {
    return false;
  }

  for (let i = 0; i < options.count; i++) {
    const c0 = w0[w0.length - 1 - i];
    const c1 = w1[w1.length - 1 - i];
    if (!isSingleWordRhyme(c0, c1, options.tone)) {
      return false;
    }
  }

  return true;
}

function compareDictionaryItem(
  d1: DictionaryItem,
  d2: DictionaryItem,
  count?: number,
): number {
  const len1 = d1.word.length;
  const len2 = d2.word.length;
  const lmin = Math.min(len1, len2);
  const min = count ? Math.min(lmin, count) : lmin;
  const c1 = d1.chewing;
  const c2 = d2.chewing;

  let k = 0;
  while (k < min) {
    const r1 = c1[len1 - k - 1].rhyme;
    const r2 = c2[len2 - k - 1].rhyme;
    if (r1 !== r2) {
      return r1 - r2;
    }
    k++;
  }
  return len1 - len2;
}

function binarySearch(
  dictionary: Dictionary,
  chewing: Array<Chewing>,
  index: number,
  from: number,
  to: number,
): [number, number] {
  const target = chewing[chewing.length - index - 1].rhyme;
  let left = from;
  let right = to;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    const c = dictionary[mid].chewing;
    if (c[c.length - index - 1].rhyme < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  const start = left;

  left = from;
  right = to;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    const c = dictionary[mid].chewing;
    if (c[c.length - index - 1].rhyme <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  const end = left;

  return [start, end];
}

function searchRhyme(
  dictionary: Dictionary = [],
  word: string,
  options: {
    count: number;
    tone: boolean;
  },
): Dictionary {
  const cw = getChewing(word);
  dictionary.sort(compareDictionaryItem);
  let start = 0;
  let end = dictionary.length;
  for (let i = 0; i < options.count; i++) {
    [start, end] = binarySearch(dictionary, cw, i, start, end);
  }
  return dictionary.slice(start - 1, end + 1);
}

export default searchRhyme;
export { isSingleWordRhyme, compareDictionaryItem };
