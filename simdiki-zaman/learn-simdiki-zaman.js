const fs = require('fs');

const readline = require('readline');

function askQuestion (query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

function randomNumber (min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function findFirstVowel (root) {
  for (let i = root.length - 1; i; i--) {
    if (isVowel(root[i])) {
      return root[i];
    }
  }

  if (isVowel(root[0])) {
    return root[0];
  }

  throw new Error(`Cannot find vowel for "${root}"`);
}

function conjugVerb (root, suffix) {
  let vowel = findFirstVowel(root);
  let newRoot = root;
  // yemek
  if (vowel === 'y') {
    newRoot = newRoot + 'i';
    vowel = 'i';
  }

  const group = findGroup(vowel);

  let liaisonLetter;

  switch (group) {
    case 1:
      liaisonLetter = 'ı';
      break;
    case 2:
      liaisonLetter = 'i';
      break;
    case 3:
      liaisonLetter = 'u';
      break;
    case 4:
      liaisonLetter = 'ü';
      break;
  }

  if (! isVowel(newRoot[newRoot.length - 1])) {
    return newRoot + liaisonLetter + 'yor' + suffix;
  }

  return newRoot + 'y' + liaisonLetter + 'yor' + suffix;
}

const conjugPerson = {
  ben: root => conjugVerb(root, 'um'),
  sen: root => conjugVerb(root, 'sun'),
  biz: root => conjugVerb(root, 'uz'),
  siz: root => conjugVerb(root, 'sunuz'),
};

function findGroup (vowel) {
  const groups = [
    ['a', 'ı'],
    ['e', 'i'],
    ['o', 'u'],
    ['ö', 'ü'],
  ];

  for (let i = 0; i < groups.length; i++) {
    if (groups[i].includes(vowel.toLowerCase())) {
      return i + 1;
    }
  }

  throw new Error(`Letter "${vowel.toLowerCase()}" group unknown`);
}

function isVowel (letter) {
  return [
    'a', 'ı',
    'e', 'i',
    'o', 'u',
    'ö', 'ü',
    'y',
  ].includes(letter.toLowerCase());
}

function findRoot (infinitive) {
  const root = infinitive.split('');

  root.splice(infinitive.length - 3);

  if (['a', 'e'].includes(root[root.length - 1])) {
    root.splice(root.length - 1)
  }

  return root.join('')
}

function conjug (infinitive, person) {
  const root = findRoot(infinitive);

  const result = conjugPerson[person](root);

  return result;
}

const persons = ['ben', 'sen', 'biz', 'siz'];
const verbs = Object.entries(require('./fiiler'));

async function run () {
  const seeTurkish = process.argv[2] === '--also-english' ?
    randomNumber(0, 1) === 0
    : true;

  const person = persons[randomNumber(0, 3)];
  const [ verbTR, verbEN ] = verbs[randomNumber(0, verbs.length - 1)];

  if (seeTurkish) {
    await askQuestion(`${person} ${verbTR}`);
    console.log(`${person} ${conjug(verbTR, person)} (${verbEN})`)
  }
  else {
    await askQuestion(`${person} (${verbEN})`);
    console.log(`${person} ${conjug(verbTR, person)} (${verbTR})`)

  }
}

run();