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
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
  // {
  //   id: ++gId,
  //   url: `meme-imgs/${gId}.jpg`,
  //   keywords: ['funny', 'sarcasm'],
  // },
]

addImgs(12)

function addImgs(imgsLength) {
  for (var i = 0; i < imgsLength; i++) {
    const img = {
      id: ++gId,
      url: `meme-imgs/${gId}.jpg`,
      keywords: ['funny', 'sarcasm'],
    }
    gImgs.push(img)
  }
}

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
    txt: 'Txt',
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

  gElCanvas.width = gElContainer.clientWidth - 15
  gElCanvas.height = gElContainer.clientWidth - 15
  gCanvasContainerWidth = gElContainer.clientWidth

  gCanvasMiddle = gElCanvas.width / 2
  resizeFontSize()
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

function createKeywords() {
  const elKeywordsContainer = document.querySelector('.keywords-search')
  if (loadFromStorage('keywordMap'))
    gKeywordSearchCountMap = loadFromStorage('keywordMap')
  for (const search in gKeywordSearchCountMap) {
    const count = gKeywordSearchCountMap[search]
    elKeywordsContainer.innerHTML += `<span id="${search}" onclick="onSearchKeyword(this)">${search}</span>`
  }
  const spans = elKeywordsContainer.querySelectorAll('span')
  for (var i = 0; i < spans.length; i++) {
    const word = spans[i].id
    const countStr = gKeywordSearchCountMap[word] * 3 + 'px'
    spans[i].style.fontSize = countStr
  }
}

function onUploadImg(elBtn) {
  // Gets the image from the canvas
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

  function onSuccess(uploadedImgUrl) {
    // Handle some special characters
    const url = encodeURIComponent(uploadedImgUrl)
    if (elBtn.id === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`
      )
    } else if (elBtn.id === 'whatsapp') {
      window.location =
        'whatsapp://send?text=' + encodeURIComponent(uploadedImgUrl)
    }
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
