'use strict'

let gId = 0

let gCanvasMiddle

let gImgs = [
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['cute', 'animal'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['cute', 'animal'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['cute', 'animal'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['cute', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
  {
    id: ++gId,
    url: `meme-imgs/${gId}.jpg`,
    keywords: ['funny', 'sarcasm'],
  },
]

let gKeywordSearchCountMap = { funny: 10, cute: 12, sarcasm: 5 }

let gMeme = createMeme()

var gIsSelected

function getImgs() {
  return gImgs
}

function createMeme(id = getRandomIntInclusive(1, gImgs.length)) {
  const meme = {
    selectedImgId: id,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'Hello',
        size: 120,
        color: '#ffffff',
        position: { x: gCanvasMiddle, y: 100 },
      },
    ],
    memeId: makeId(),
  }

  return meme
}

function createLine() {
  const line = {
    txt: 'Insert Txt',
    size: 80,
    color: '#ff0000',
    position: { x: gCanvasMiddle, y: gCanvasContainerWidth - 100 },
  }

  return line
}

function getMeme() {
  return gMeme
}

function resizeCanvas() {
  const gElContainer = document.querySelector('.canvas-container')
  // Changing the canvas dimension clears the canvas
  gElCanvas.width = gElContainer.clientWidth
  gElCanvas.height = gElContainer.clientWidth
  gCanvasContainerWidth = gElContainer.clientWidth

  gCanvasMiddle = gElCanvas.width / 2
  console.log(gElContainer)
  console.log(gElCanvas.width, gElCanvas.height)
  renderMeme(gCanvasContainerWidth)
}

// Gallery

function getGallerySrc(searchValue) {
  const imgs = getImgs()

  if (searchValue && searchValue !== 'All') {
    searchValue = searchValue.toLowerCase()
    const filtered = imgs.filter(
      (img) =>
        img.keywords[0] === searchValue || img.keywords[1] === searchValue
    )
    console.log(filtered)
    let strHtmls = filtered.map(
      (img) =>
        `<img id="${img.id}" onclick="onSelectMEME(this)" src="${img.url}" alt="" style="cursor: pointer;">`
    )
    return strHtmls
  }

  let strHtmls = imgs.map(
    (img) =>
      `<img id="${img.id}" onclick="onSelectMEME(this)" src="${img.url}" alt="" style="cursor: pointer;">`
  )
  return strHtmls
}

function onSelectMEME(elImg) {
  console.log(elImg.id)

  gMeme = createMeme(+elImg.id)
  saveToStorage('selectedMeme', gMeme)
  saveToStorage('selected', true)

  console.log(loadFromStorage('selectedMeme'))
  window.location.href = 'http://127.0.0.1:5500/index.html'
}

function createKeywords() {
  const elKeywordsContainer = document.querySelector('.keywords-search')
  if (loadFromStorage('keywordMap'))
    gKeywordSearchCountMap = loadFromStorage('keywordMap')
  for (const search in gKeywordSearchCountMap) {
    const count = gKeywordSearchCountMap[search]
    elKeywordsContainer.innerHTML += `<span id="${search}" onclick="onSearchKeyword(this)">${search}</span>`
    // console.log(`${search}: ${count}`)
  }
  const spans = elKeywordsContainer.querySelectorAll('span')
  for (var i = 0; i < spans.length; i++) {
    const word = spans[i].id
    const countStr = gKeywordSearchCountMap[word] * 3 + 'px'
    console.log(countStr)
    spans[i].style.fontSize = countStr
  }
}
