import fs from 'fs';
import readline from 'readline';
import ProgressBar from 'progress';
import { Dictionary } from './types';

function initDictionary(filePath: string): Promise<Dictionary> {
  const wordBag: Map<string, boolean> = new Map();
  const dictionary: Dictionary = [];
  let bar: ProgressBar | null = null;
  return new Promise(resolve => {
    const rd = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    rd.on('line', (line: string) => {
      const [word, freq] = line.split(/\s+/);
      if (!freq) {
        console.error('initializing dictionary');
        bar = new ProgressBar('[:bar] :current/:total :percent :etas', {
          total: parseInt(word),
          complete: '=',
          incomplete: ' ',
          width: 20,
        });
        return;
      }
      if (bar) {
        bar.tick();
      }
      if (wordBag.has(word)) {
        console.error(word);
        return;
      }
      dictionary.push({
        word,
        freq: parseInt(freq),
      });
      wordBag.set(word, true);
    });
    rd.on('close', () => {
      resolve(dictionary);
    });
  });
}

export default initDictionary;
