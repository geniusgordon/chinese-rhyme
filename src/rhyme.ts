import ProgressBar from 'progress';
import getChewing from './chewing';
import { Chewing, Dictionary } from './types';

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

function searchRhyme(
  dictionary: Dictionary = [],
  word: string,
  options: {
    count: number;
    tone: boolean;
  },
): Dictionary {
  const bar = new ProgressBar('[:bar] :current/:total :percent :etas :elapseds', {
    total: dictionary.length,
    complete: '=',
    incomplete: ' ',
    width: 20,
  });

  const w0 = getChewing(word);

  const candidate = dictionary.filter(d => {
    bar.tick();
    return isRhyme(w0, getChewing(d.word), options);
  });

  candidate.sort((a, b) => b.freq - a.freq);
  return candidate;
}

export default searchRhyme;
export { isSingleWordRhyme };
