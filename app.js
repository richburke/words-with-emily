const fs = require('fs');
const readline = require('readline');
const debug = require('debug')('words');
const debugv = require('debug')('words:verbose');
const debugvv = require('debug')('words:verbose:high');

const FN = process.cwd() + '/data/enable-list.txt';
debugv('Read from', FN);

let WORDS = [];

const rdlnCli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

const askForLetters = () => {
  return new Promise((resolve) => {
    rdlnCli.question('Available letters... ', (resp) => {
      debug('response: ', resp);
      resolve(resp.trim());
    });
  });
};

const doesWordMatch = (word, suppliedLetters) => {
  debugvv('doesWordMatch comparing', word, word.length, suppliedLetters, suppliedLetters.length);
  if (word.length > suppliedLetters.length) {
    return false;
  }

  const wordsLetters = word.split('');

  for (let i = 0; i < wordsLetters.length; i++) {
    let letter = wordsLetters[i];
    debugvv('doesWordMatch is letter', letter, suppliedLetters);

    if (suppliedLetters.indexOf(letter) === -1) {
      return false;
    }
    debugvv('doesWordMatch found match', letter, suppliedLetters);
  }

  return true;
};

const findMatchingWords = (words, suppliedLetters) => {
  return words.reduce((acc, word) => {
    if (doesWordMatch(word, suppliedLetters)) {
      acc.push(word);
    }
    return acc;
  }, []);
};

const rdlnDictionary = readline.createInterface({
    input: fs.createReadStream(FN),
    terminal: false
  })
  .on('line', (line) => {
     WORDS.push(line);
  })
  .on('close', () => {
    askForLetters()
      .then((letters) => {
        console.log(letters);
        console.log(WORDS.length);
        console.log(findMatchingWords(WORDS, letters.split('')));
        process.exit(0);
      });
  });
