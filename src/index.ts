import inquirer from 'inquirer';
import searchRhyme from './rhyme';
import initDictionary from './dictionary';

async function main() {
  const filePath = process.env.DICT;
  if (filePath) {
    const dictionary = await initDictionary(filePath);
    while (true) {
      const { word, count, tone } = await inquirer.prompt<{
        word: string;
        count: number;
        tone: boolean;
      }>([
        {
          name: 'word',
          message: '輸入想押韻的詞',
        },
        {
          name: 'count',
          message: '輸入押韻字數',
        },
        {
          type: 'confirm',
          name: 'tone',
          message: '是否要押平仄',
        },
      ]);
      if (word === 'q') {
        break;
      }
      const result = searchRhyme(dictionary, word, { count, tone });
      result
        .sort((a, b) => b.freq - a.freq)
        .slice(0, 100)
        .forEach(r => {
          console.log(r.word, r.freq);
        });
    }
  } else {
    console.log('請指定字典路徑');
  }
}

main();
