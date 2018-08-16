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
  d0: DictionaryItem,
  d1: DictionaryItem,
  count?: number,
): number {
  const len0 = d0.word.length;
  const len1 = d1.word.length;
  const lmin = Math.min(len0, len1);
  const min = count ? Math.min(lmin, count) : lmin;
  const c0 = d0.chewing;
  const c1 = d1.chewing;

  let k = 0;
  while (k < min) {
    const r0 = c0[len0 - k - 1].rhyme;
    const r1 = c1[len1 - k - 1].rhyme;
    const t0 = c0[len0 - k - 1].tone;
    const t1 = c1[len1 - k - 1].tone;
    if (r0 !== r1) {
      return r0 - r1;
    }
    if (t0 !== t1) {
      return t0 - t1;
    }
    k++;
  }
  return len0 - len1;
}

function binarySearch(
  dictionary: Dictionary,
  chewing: Array<Chewing>,
  tone: boolean,
  index: number,
  from: number,
  to: number,
): [number, number] {
  const target = chewing[chewing.length - index - 1];
  let left = from;
  let right = to;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    const c = dictionary[mid].chewing;
    const cur = c[c.length - index - 1];
    if (cur.rhyme < target.rhyme) {
      left = mid + 1;
    } else if (cur.rhyme > target.rhyme) {
      right = mid;
    } else {
      if (tone && cur.tone < target.tone) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
  }
  const start = left;

  left = from;
  right = to;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    const c = dictionary[mid].chewing;
    const cur = c[c.length - index - 1];
    if (cur.rhyme < target.rhyme) {
      left = mid + 1;
    } else if (cur.rhyme > target.rhyme) {
      right = mid;
    } else {
      if (tone) {
        if (cur.tone <= target.tone) {
          left = mid + 1;
        } else {
          right = mid;
        }
      } else {
        left = mid + 1;
      }
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
  const candidate = dictionary.filter(d => d.word.length >= options.count);
  let start = 0;
  let end = candidate.length;
  for (let i = 0; i < options.count; i++) {
    [start, end] = binarySearch(candidate, cw, options.tone, i, start, end);
  }
  return candidate.slice(start - 1, end + 1);
}

export default searchRhyme;
export { isSingleWordRhyme, compareDictionaryItem };
