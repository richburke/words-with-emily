const fs = require('fs');
const readline = require('readline');
const jsonfile = require('jsonfile');
const debug = require('debug')('create-dictionary');
const debugv = require('debug')('create-dictionary:verbose');

const IN = process.cwd() + '/data/enable-list.txt';
const OUT = process.cwd() + '/data/dictionary.json';

debugv('Read from', IN);

let words = [];

/**
 * Frequencies from
 * @link https://en.wikipedia.org/wiki/Letter_frequency
 */
const scoreLetterByInfrequency = (letter) => {
  switch (letter) {
    case 'e':
      return 12.7;
    case 't':
      return 9.1;
    case 'a':
      return 8.2;
    case 'o':
      return 7.5;
    case 'i':
      return 7.0;
    case 'n':
      return 6.8;
    case 's':
      return 6.3;
    case 'h':
      return 6.1;
    case 'r':
      return 6.0;
    case 'd':
      return 4.3;
    case 'l':
      return 4.0;
    case 'c':
    case 'u':
      return 2.8;
    case 'm':
      return 2.4;
    case 'w':
      return 2.4;
    case 'f':
      return 2.2;
    case 'g':
    case 'y':
      return 2.0;
    case 'p':
      return 1.9;
    case 'b':
      return 1.5;
    case 'v':
      return 1.0;
    case 'k':
      return 0.8;
    case 'j':
    case 'x':
      return 0.2;
    case 'q':
    case 'z':
      return 0.1;
    default:
      return 0;
  }
};

const sortLettersByInfrequency = (letters) => {
  return letters.map((letter) => {
      return {
        letter,
        score: scoreLetterByInfrequency(letter)
      };
    })
    .sort((a, b) => {
      return a.score - b.score;
    })
    .map((item) => {
      return item.letter;
    });
};

const findUniqueLetters = (word) => {
  return word.split('').reduce((acc, item) => {
    if (acc.indexOf(item) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);
};

const rdln = readline.createInterface({
    input: fs.createReadStream(IN),
    terminal: false
  })
  .on('line', (line) => {
     words.push(line.toLowerCase());
  })
  .on('close', () => {
    const dictionary = words.map((word) => {
      return {
        word,
        length: word.length,
        uniqueLetters: sortLettersByInfrequency(findUniqueLetters(word))
      };
    });

    // jsonfile.writeFileSync(OUT, dictionary, {spaces: 2});
    jsonfile.writeFileSync(OUT, dictionary);
  });
