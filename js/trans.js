'use strict'

let gTrans = {
  appTitle: {
    en: 'My MEME Generator',
    he: 'מימ ג׳נרייטור',
  },
  randomMeme: {
    en: 'Random Meme',
    he: 'מימ רנדומלי',
  },
  gallery: {
    en: 'Gallery',
    he: 'גלרייה',
  },
  about: {
    en: 'About',
    he: 'אודות',
  },
  generateMeme: {
    en: 'Generate Meme',
    he: 'מכולל המימ',
  },
  text: {
    en: 'Text:',
    he: 'טקסט:',
  },
  yourText: {
    en: 'Your Text Here',
    he: 'הקלד כאן:',
  },
  addText: {
    en: 'Add Text',
    he: 'הוסף טקסט',
  },
  clearText: {
    en: 'Clear Text',
    he: 'נקה טקסט',
  },
  switchLine: {
    en: 'Switch Line',
    he: 'החלף שורה',
  },
  color: {
    en: 'Color:',
    he: 'צבע:',
  },
  textAlign: {
    en: 'Text Align:',
    he: 'סידור טקסט:',
  },
  fontStyle: {
    en: 'Font Style:',
    he: 'סגנון טקסט:',
  },
}

function getTrans(transKey, lang) {
  // return gTrans.transKey.lang
  console.log('transKey:', transKey)
  console.log('lang:', lang)
  console.log('word:', gTrans[transKey][lang])
  return gTrans[transKey][lang]
}

function doTrans() {
  var lang = gLang
  const els = document.querySelectorAll('[data-trans]')
  console.log('els:', els)
  els.forEach((el) => {
    const transKey = el.dataset.trans
    const trans = getTrans(transKey, lang)
    el.innerText = trans
  })
}
