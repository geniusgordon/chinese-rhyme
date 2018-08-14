import fs from 'fs';
import readline from 'readline';
import ProgressBar from 'progress';
import { CharToChewingTable } from './types';

function initPhoneCin(filePath: string): Promise<CharToChewingTable> {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    const charToChewing: CharToChewingTable = {};
    const keyToChewing: { [key: string]: string } = {};
    let section = 0;
    rl.on('line', (line: string) => {
      const [a, b] = line.split(/\s+/);
      if (a === '%keyname') {
        section = 1;
        return;
      }
      if (a === '%chardef') {
        section = 2;
        return;
      }
      if (section === 1) {
        keyToChewing[a] = b;
      } else if (section === 2) {
        const chewing = a
          .split('')
          .map(ch => keyToChewing[ch])
          .join('');
        if (!charToChewing[b]) {
          charToChewing[b] = [];
        }
        charToChewing[b].push(chewing);
      }
    });
    rl.on('close', () => {
      resolve(charToChewing);
    });
  });
}

const phoneCinPath = process.env.PHONE_CIN;
if (phoneCinPath) {
  initPhoneCin(phoneCinPath).then(charToChewing => {
    console.log(JSON.stringify(charToChewing, null, 2));
  });
} else {
  console.error('請指定路徑');
}
