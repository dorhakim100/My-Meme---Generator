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

let gKeywordSearchCountMap = { funny: 10, cute: 12, sarcasm: 5, animal: 8 }

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

function onUploadImg() {
  // Gets the image from the canvas
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

  function onSuccess(uploadedImgUrl) {
    // Handle some special characters
    const url = encodeURIComponent(uploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
  }

  // Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}

// Upload the image to a server, get back a URL
// call the function onSuccess when done
function doUploadImg(imgDataUrl, onSuccess) {
  // Pack the image for delivery
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  // Send a post req with the image to the server
  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    // If the request is not done, we have no business here yet, so return
    if (XHR.readyState !== XMLHttpRequest.DONE) return
    // if the response is not ok, show an error
    if (XHR.status !== 200) return console.error('Error uploading image')
    const { responseText: url } = XHR
    // Same as
    // const url = XHR.responseText

    // If the response is ok, call the onSuccess callback function,
    // that will create the link to facebook using the url we got
    console.log('Got back live url:', url)
    onSuccess(url)
  }
  XHR.onerror = (req, ev) => {
    console.error(
      'Error connecting to server with request:',
      req,
      '\nGot response data:',
      ev
    )
  }
  XHR.open('POST', '//ca-upload.com/here/upload.php')
  XHR.send(formData)
}
