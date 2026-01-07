"use client";

import { useState, useCallback, useEffect } from 'react';

const Wordle = () => {
  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;
  
  // Curated solution words (smaller, high-quality list)
  const SOLUTION_WORDS = [
    'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
    'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
    'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
    'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT',
    'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN',
    'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST',
    'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE',
    'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT',
    'BUYER', 'CABLE', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART',
    'CHASE', 'CHEAP', 'CHECK', 'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL',
    'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH',
    'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME',
    'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT',
    'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK',
    'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH',
    'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT',
    'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH',
    'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS',
    'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT',
    'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE',
    'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD',
    'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HEART', 'HEAVY', 'HENCE', 'HORSE', 'HOTEL', 'HOUSE',
    'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JOINT', 'JUDGE', 'KNOWN',
    'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE',
    'LEGAL', 'LEVEL', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER',
    'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MATCH', 'MAYBE', 'MAYOR',
    'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH',
    'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER',
    'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER',
    'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PHASE',
    'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE',
    'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE',
    'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE',
    'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'RIDER', 'RIDGE',
    'RIGHT', 'RIGID', 'RISKY', 'RIVER', 'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL',
    'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE',
    'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT',
    'SHORT', 'SHOWN', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP',
    'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMOKE', 'SNAKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND',
    'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT',
    'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STEEP', 'STEER',
    'STERN', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP',
    'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TAKEN',
    'TASTE', 'TAXES', 'TEACH', 'TELLS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE',
    'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGHT',
    'TIRED', 'TODAY', 'TOKEN', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE',
    'TRAIL', 'TRAIN', 'TRAIT', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES',
    'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'UNCLE', 'UNDER', 'UNDUE', 'UNION',
    'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO',
    'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE',
    'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE',
    'WORST', 'WORTH', 'WOULD', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOUTH'
  ];

  // Comprehensive dictionary for validation (includes solution words + many more valid words)
  const VALID_WORDS = new Set([
    ...SOLUTION_WORDS,
    // Add many more valid 5-letter words that can be guessed but aren't solutions
    'AAHED', 'AALII', 'AARGH', 'AARTI', 'ABACA', 'ABACI', 'ABACK', 'ABACS', 'ABAFT', 'ABAKA',
    'ABAMP', 'ABASE', 'ABASH', 'ABASK', 'ABAYA', 'ABBAS', 'ABBED', 'ABBES', 'ABBEY', 'ABBOT',
    'ABCEE', 'ABEAM', 'ABEAR', 'ABELE', 'ABERS', 'ABETS', 'ABHOR', 'ABIDE', 'ABLED', 'ABLER',
    'ABLES', 'ABLET', 'ABLOW', 'ABMHO', 'ABODE', 'ABOHM', 'ABOIL', 'ABOMA', 'ABOON', 'ABORD',
    'ABORE', 'ABORT', 'ABOS', 'ABOUD', 'ABOULIA', 'ABOWN', 'ABRAY', 'ABRIM', 'ABRIN', 'ABRIS',
    'ABSEY', 'ABSIT', 'ABUNA', 'ABUNE', 'ABURST', 'ABUSIVE', 'ABUTS', 'ABUZZ', 'ABYES', 'ABYSM',
    'ABYSS', 'ACAIS', 'ACARI', 'ACCAS', 'ACCOY', 'ACERB', 'ACERS', 'ACETA', 'ACHAR', 'ACHED',
    'ACHER', 'ACHES', 'ACHOO', 'ACIDS', 'ACIDY', 'ACING', 'ACINI', 'ACKED', 'ACMES', 'ACNED',
    'ACNES', 'ACOCK', 'ACOLD', 'ACORN', 'ACRED', 'ACRES', 'ACRID', 'ACROS', 'ACTED', 'ACTIN',
    'ACTON', 'ACTORS', 'ACTOS', 'ACTUS', 'ACUITY', 'ACUMEN', 'ACUTE', 'ACYLS', 'ADAGE', 'ADAPT',
    'ADDAX', 'ADDED', 'ADDER', 'ADDIO', 'ADDLE', 'ADEEM', 'ADEPT', 'ADHAN', 'ADIEU', 'ADIOS',
    'ADITS', 'ADJUS', 'ADMIX', 'ADOBE', 'ADOBO', 'ADOPT', 'ADORE', 'ADORN', 'ADOWN', 'ADOZE',
    // ... many more valid words
    'BIKES', 'BILLS', 'BINDS', 'BIRDS', 'BIRTH', 'BITES', 'BITSY', 'BLADE', 'BLAME', 'BLANK',
    'BLAST', 'BLAZE', 'BLEAK', 'BLEAT', 'BLEED', 'BLESS', 'BLIMP', 'BLIND', 'BLINK', 'BLISS',
    'BLITZ', 'BLOAT', 'BLOB', 'BLOCK', 'BLOND', 'BLOOD', 'BLOOM', 'BLOWN', 'BLUES', 'BLUFF',
    'BLUNT', 'BLURB', 'BLURT', 'BLUSH', 'BOARD', 'BOARS', 'BOAST', 'BOATS', 'BOBBY', 'BODED',
    'BODES', 'BOGEY', 'BOGUS', 'BOILS', 'BOING', 'BOLTS', 'BOMBS', 'BONDS', 'BONED', 'BONES',
    'BONGS', 'BONUS', 'BOOBS', 'BOOED', 'BOOKS', 'BOOMS', 'BOOST', 'BOOTH', 'BOOTS', 'BOOZE',
    'BOOZY', 'BORAX', 'BORED', 'BORER', 'BORES', 'BORNE', 'BOSOM', 'BOSSY', 'BOTCH', 'BOUGH',
    // Common letter combinations and word patterns
    'CAULK', 'CEDAR', 'CHAMP', 'CHAOS', 'CHARM', 'CHARS', 'CHART', 'CHASE', 'CHEAP', 'CHEAT',
    'CHECK', 'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHEWS', 'CHILD', 'CHILL', 'CHIMP', 'CHINA',
    'CHIPS', 'CHOIR', 'CHORD', 'CHORE', 'CHOSE', 'CHUCK', 'CHUNK', 'CHURN', 'CHUTE', 'CIDER',
    'CIGAR', 'CINCH', 'CIRCA', 'CITED', 'CITES', 'CIVIC', 'CIVIL', 'CLACK', 'CLADS', 'CLAIM',
    'CLAMP', 'CLAMS', 'CLANG', 'CLANK', 'CLAPS', 'CLASH', 'CLASP', 'CLASS', 'CLAWS', 'CLAYS',
    'CLEAN', 'CLEAR', 'CLEAT', 'CLEFT', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLING', 'CLINK',
    'CLIPS', 'CLOAK', 'CLOCK', 'CLOGS', 'CLONE', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOUT', 'CLOWN',
    'CLUBS', 'CLUCK', 'CLUED', 'CLUES', 'CLUMP', 'CLUNG', 'CLUNK', 'COACH', 'COALS', 'COAST',
    'COATS', 'COCOA', 'CODED', 'CODER', 'CODES', 'COINS', 'COLDS', 'COLIC', 'COLOR', 'COLTS',
    'COMAS', 'COMBO', 'COMBS', 'COMER', 'COMES', 'COMET', 'COMIC', 'CONCH', 'CONDO', 'CONED',
    'CONES', 'COOKS', 'COOLS', 'COOPS', 'CORAL', 'CORDS', 'CORES', 'CORGI', 'CORKS', 'CORNS',
    'CORPS', 'COSTS', 'COUCH', 'COUGH', 'COULD', 'COUNT', 'COUPE', 'COURT', 'COVEN', 'COVER',
    'COWED', 'COWER', 'COWLS', 'CRABS', 'CRACK', 'CRAFT', 'CRAMP', 'CRANE', 'CRANK', 'CRASH',
    'CRASS', 'CRATE', 'CRAVE', 'CRAWL', 'CRAZE', 'CRAZY', 'CREAK', 'CREAM', 'CREED', 'CREEK',
    'CREEP', 'CREME', 'CREPE', 'CRESS', 'CREST', 'CREWS', 'CRIBS', 'CRICK', 'CRIED', 'CRIER',
    'CRIES', 'CRIME', 'CRIMP', 'CRISP', 'CROAK', 'CROCK', 'CROFT', 'CRONE', 'CRONY', 'CROOK',
    'CROPS', 'CROSS', 'CROUP', 'CROWD', 'CROWN', 'CROWS', 'CRUDE', 'CRUEL', 'CRUET', 'CRUMB',
    'CRUNK', 'CRUSH', 'CRUST', 'CRYPT', 'CUBED', 'CUBES', 'CUBIC', 'CUBIT', 'CUFFS', 'CUING',
    'CUMIN', 'CUPID', 'CURBS', 'CURDS', 'CURED', 'CURES', 'CURLS', 'CURLY', 'CURRY', 'CURSE',
    'CURVE', 'CURVY', 'CUSHY', 'CUSPS', 'CUTER', 'CUTIE', 'CYCLE', 'CYNIC', 'CYSTS',
    // Plural forms and common variations
    'DADS', 'DAILY', 'DAIRY', 'DAISY', 'DALES', 'DAMES', 'DAMPS', 'DANCE', 'DANDY', 'DARED',
    'DARES', 'DARKS', 'DARNS', 'DARTS', 'DASH', 'DATED', 'DATES', 'DATUM', 'DAUBS', 'DAWN',
    'DAYS', 'DAZED', 'DEALS', 'DEALT', 'DEANS', 'DEARS', 'DEATH', 'DEBIT', 'DEBTS', 'DEBUG',
    'DEBUT', 'DECAF', 'DECAY', 'DECKS', 'DECOR', 'DECOY', 'DEEDS', 'DEEMS', 'DEEPS', 'DEFER',
    'DEIFY', 'DEIGN', 'DEITY', 'DELAY', 'DELVE', 'DEMON', 'DEMOS', 'DENSE', 'DENTS', 'DEPOT',
    'DEPTH', 'DERBY', 'DESKS', 'DETOX', 'DEUCE', 'DEVIL', 'DIARY', 'DICED', 'DICES', 'DICEY',
    'DIETS', 'DIGIT', 'DIGS', 'DIMLY', 'DINAR', 'DINED', 'DINER', 'DINES', 'DINGY', 'DIODE',
    'DIPSO', 'DIRTY', 'DISCO', 'DISKS', 'DITCH', 'DITTO', 'DITTY', 'DIVAN', 'DIVED', 'DIVER',
    'DIVES', 'DIZZY', 'DOCKS', 'DODGE', 'DODGY', 'DODOS', 'DOERS', 'DOGES', 'DOGMA', 'DOILY',
    'DOING', 'DOLCE', 'DOLLS', 'DOLLY', 'DOLOR', 'DOMED', 'DOMES', 'DONEE', 'DONNA', 'DONOR',
    'DONUT', 'DOOMS', 'DOORS', 'DOPED', 'DOPES', 'DOPEY', 'DORKS', 'DORKY', 'DORMS', 'DOSED',
    'DOSES', 'DOTED', 'DOTES', 'DOTTY', 'DOUBT', 'DOUGH', 'DOUSE', 'DOVES', 'DOWDY', 'DOWED',
    'DOWEL', 'DOWER', 'DOWNS', 'DOWNY', 'DOWRY', 'DOZED', 'DOZEN', 'DOZER', 'DOZES', 'DRABS',
    'DRAFT', 'DRAGS', 'DRAIN', 'DRAKE', 'DRAMA', 'DRAMS', 'DRANK', 'DRAPE', 'DRAWL', 'DRAWN',
    'DRAWS', 'DRAYS', 'DREAD', 'DREAM', 'DREAR', 'DREGS', 'DRESS', 'DRIBS', 'DRIED', 'DRIER',
    'DRIES', 'DRIFT', 'DRILL', 'DRILY', 'DRINK', 'DRIPS', 'DRIVE', 'DROIT', 'DROLL', 'DRONE',
    'DROOL', 'DROOP', 'DROPS', 'DROSS', 'DROVE', 'DROWN', 'DRUBS', 'DRUGS', 'DRUID', 'DRUMS',
    'DRUNK', 'DRUPE', 'DRYER', 'DRYLY', 'DUALS', 'DUCAL', 'DUCAT', 'DUCKS', 'DUCKY', 'DUCTS',
    'DUDES', 'DUELS', 'DUETS', 'DUFFS', 'DUKE', 'DULLS', 'DULLY', 'DULSE', 'DUMAS', 'DUMBO',
    'DUMBS', 'DUMMY', 'DUMPS', 'DUMPY', 'DUNCE', 'DUNES', 'DUNGS', 'DUNKS', 'DUOMO', 'DUPE',
    // Add more common words people might try
    'EARTH', 'EASED', 'EASEL', 'EASER', 'EASES', 'EASTS', 'EATEN', 'EATER', 'EAVES', 'EBBED',
    'EBONY', 'EBOOK', 'ECHO', 'ECLAT', 'EDDIE', 'EDEMA', 'EDGED', 'EDGES', 'EDICT', 'EDIFY',
    'EDITS', 'EELS', 'EERIE', 'EGGED', 'EGRET', 'EIGHT', 'EJECT', 'EKING', 'ELBOW', 'ELDER',
    'ELECT', 'ELEGY', 'ELFIN', 'ELIDE', 'ELITE', 'ELOPE', 'ELUDE', 'ELVES', 'EMAIL', 'EMBED',
    'EMBER', 'EMCEE', 'EMITS', 'EMOJI', 'EMOTE', 'EMPTY', 'ENACT', 'ENDED', 'ENDOW', 'ENEMA',
    'ENEMY', 'ENJOY', 'ENNUI', 'ENROL', 'ENTER', 'ENTRY', 'ENVOY', 'EPICS', 'EPOCH', 'EPOXY',
    'EQUAL', 'EQUIP', 'ERASE', 'ERECT', 'ERGOT', 'ERROR', 'ERUPT', 'ESSAY', 'ESTER', 'ESTOP',
    'ETHER', 'ETHIC', 'ETHOS', 'ETHYL', 'EURO', 'EVADE', 'EVENT', 'EVERY', 'EVICT', 'EVILS',
    'EVOKE', 'EWERS', 'EXACT', 'EXALT', 'EXAMS', 'EXCEL', 'EXECS', 'EXERT', 'EXILE', 'EXIST',
    'EXITS', 'EXPAT', 'EXPEL', 'EXPO', 'EXTRA', 'EXUDE', 'EXULT', 'EYED', 'EYING', 'EYRIE'
  ]);

  const [currentWord, setCurrentWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [keyboardState, setKeyboardState] = useState({});
  const [showMessage, setShowMessage] = useState('');

  // Keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Initialize game
  const initGame = useCallback(() => {
    const newWord = SOLUTION_WORDS[Math.floor(Math.random() * SOLUTION_WORDS.length)];
    setCurrentWord(newWord);
    setGuesses(Array(MAX_GUESSES).fill(''));
    setCurrentGuess(0);
    setCurrentInput('');
    setGameState('playing');
    setKeyboardState({});
    setShowMessage('');
  }, []);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check word guess
  const checkGuess = useCallback((guess) => {
    const result = [];
    const wordArray = currentWord.split('');
    const guessArray = guess.split('');
    const used = Array(WORD_LENGTH).fill(false);
    
    // First pass: mark correct letters (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArray[i] === wordArray[i]) {
        result[i] = 'correct';
        used[i] = true;
      }
    }
    
    // Second pass: mark present letters (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i]) continue;
      
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (!used[j] && guessArray[i] === wordArray[j]) {
          result[i] = 'present';
          used[j] = true;
          break;
        }
      }
      
      if (!result[i]) {
        result[i] = 'absent';
      }
    }
    
    return result;
  }, [currentWord]);

  // Update keyboard state
  const updateKeyboard = useCallback((guess, result) => {
    const newKeyboardState = { ...keyboardState };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const state = result[i];
      
      // Only update if current state isn't better
      if (!newKeyboardState[letter] || 
          (newKeyboardState[letter] === 'absent' && state !== 'absent') ||
          (newKeyboardState[letter] === 'present' && state === 'correct')) {
        newKeyboardState[letter] = state;
      }
    }
    
    setKeyboardState(newKeyboardState);
  }, [keyboardState]);

  // Submit guess
  const submitGuess = useCallback(() => {
    if (currentInput.length !== WORD_LENGTH) {
      setShowMessage('Not enough letters');
      setTimeout(() => setShowMessage(''), 1500);
      return;
    }
    
    // Check against comprehensive dictionary, not just solution words
    if (!VALID_WORDS.has(currentInput)) {
      setShowMessage('Not in word list');
      setTimeout(() => setShowMessage(''), 1500);
      return;
    }
    
    const result = checkGuess(currentInput);
    const newGuesses = [...guesses];
    newGuesses[currentGuess] = currentInput;
    setGuesses(newGuesses);
    
    updateKeyboard(currentInput, result);
    
    if (currentInput === currentWord) {
      setGameState('won');
      setShowMessage('Congratulations!');
    } else if (currentGuess === MAX_GUESSES - 1) {
      setGameState('lost');
      setShowMessage(`The word was: ${currentWord}`);
    } else {
      setCurrentGuess(prev => prev + 1);
    }
    
    setCurrentInput('');
  }, [currentInput, currentWord, guesses, currentGuess, checkGuess, updateKeyboard]);

  // ... rest of your component code stays exactly the same ...

  // Handle key input
  const handleKey = useCallback((key) => {
    if (gameState !== 'playing') return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentInput(prev => prev.slice(0, -1));
    } else if (key.length === 1 && currentInput.length < WORD_LENGTH) {
      setCurrentInput(prev => prev + key);
    }
  }, [gameState, currentInput, submitGuess]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKey]);

  // Get cell style based on guess result
  const getCellStyle = (rowIndex, colIndex) => {
    const guess = guesses[rowIndex];
    if (!guess || colIndex >= guess.length) {
      if (rowIndex === currentGuess && colIndex < currentInput.length) {
        return 'border-gray-500 border-2 bg-white text-black';
      }
      return 'border-gray-300 bg-white text-black';
    }
    
    const result = checkGuess(guess);
    const state = result[colIndex];
    
    switch (state) {
      case 'correct':
        return 'bg-green-500 border-green-500 text-white';
      case 'present':
        return 'bg-yellow-500 border-yellow-500 text-white';
      case 'absent':
        return 'bg-gray-500 border-gray-500 text-white';
      default:
        return 'border-gray-300 bg-white text-black';
    }
  };

  // Get keyboard key style
  const getKeyStyle = (key) => {
    const state = keyboardState[key];
    let baseStyle = "px-3 py-4 m-1 rounded font-bold transition-all duration-200 cursor-pointer select-none ";
    
    if (key === 'ENTER' || key === 'BACKSPACE') {
      baseStyle += "px-4 text-sm ";
    } else {
      baseStyle += "min-w-[40px] ";
    }
    
    switch (state) {
      case 'correct':
        return baseStyle + "bg-green-500 text-white hover:bg-green-600";
      case 'present':
        return baseStyle + "bg-yellow-500 text-white hover:bg-yellow-600";
      case 'absent':
        return baseStyle + "bg-gray-500 text-white hover:bg-gray-600";
      default:
        return baseStyle + "bg-gray-200 text-black hover:bg-gray-300";
    }
  };

  // ... keep all your existing JSX return exactly the same ...
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 p-4">
        <h1 className="text-3xl font-bold text-center tracking-wider">WORDLE UNLIMITED</h1>
      </header>

      {/* Main Game */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        
        {/* Message Display */}
        {showMessage && (
          <div className="mb-4 px-4 py-2 bg-gray-700 rounded-md text-center font-medium">
            {showMessage}
          </div>
        )}

        {/* Game Grid */}
        <div className="grid grid-rows-6 gap-2 mb-8">
          {Array(MAX_GUESSES).fill().map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-2">
              {Array(WORD_LENGTH).fill().map((_, colIndex) => {
                const guess = guesses[rowIndex];
                const letter = rowIndex === currentGuess && colIndex < currentInput.length 
                  ? currentInput[colIndex] 
                  : guess ? guess[colIndex] : '';
                
                return (
                  <div
                    key={colIndex}
                    className={`
                      w-16 h-16 border-2 flex items-center justify-center text-2xl font-bold
                      transition-all duration-300 ${getCellStyle(rowIndex, colIndex)}
                    `}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Game Over Actions */}
        {gameState !== 'playing' && (
          <div className="text-center mb-8">
            <div className={`text-2xl font-bold mb-4 ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}>
              {gameState === 'won' ? '🎉 You Win!' : '😅 Better luck next time!'}
            </div>
            <button
              onClick={initGame}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Virtual Keyboard */}
        <div className="w-full max-w-lg">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-2">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={getKeyStyle(key)}
                  disabled={gameState !== 'playing'}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-400 text-sm mt-8 max-w-md">
          <p className="mb-2">Guess the 5-letter word in 6 tries!</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              Correct
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              Wrong position
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              Not in word
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wordle;