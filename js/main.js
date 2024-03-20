'use strict'

let gElCanvas
let gCtx

let gText = 'Hello'
let gFontSize = 120

let gColor = '#000000'
let gFillColor = '#ffffff'

let gCurrentMeme

// let gCanvasMiddle
let gCanvasContainerWidth

let gOtherLine
let isOther = false

let gTextAlign = 'center'

let gFontStyle = 'Arial Black'

let gIsShare

function init() {
  const elImgContainer = document.querySelector('.gallery-container')
  elImgContainer.innerHTML += getGallerySrc().join('')

  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  resizeCanvas()

  renderMeme()

  changeColorInput()
  displayFontSize()
  createKeywords()

  const elShareOptions = document.querySelector('.share-options')
  elShareOptions.style.display = 'none'
}

function renderMeme(containerWidth) {
  console.log(loadFromStorage('selected'))

  if (loadFromStorage('selected') !== true) {
    if (loadFromStorage('currentMeme')) {
      // gMeme = loadFromStorage('currentMeme')
    } else {
      gMeme = createMeme()
      gCurrentMeme = gMeme
    }
  } else {
    gMeme = loadFromStorage('selectedMeme')

    saveToStorage('currentMeme', gMeme)
    saveToStorage('selected', false)
  }

  const img = new Image()
  if (!containerWidth) containerWidth = img.naturalWidth
  console.log(gMeme)
  const { selectedImgId } = gMeme
  img.src = `meme-imgs/${selectedImgId}.jpg`
  console.log(img)

  const { selectedLineIdx } = gMeme

  img.onload = () => {
    gCtx.drawImage(img, 0, 0, containerWidth, containerWidth)
    if (gMeme.lines.length > 1) {
      const otherLine = getOtherLineIdx()
      isOther = true
      console.log(otherLine)
      addText(otherLine)
    }
    addText(selectedLineIdx)
  }
  saveToStorage('currentMeme', gMeme)
}

function addText(line) {
  if (loadFromStorage('selected')) gMeme = loadFromStorage('selectedMeme')
  console.log(line)
  let y
  if (line === 0) y = 100
  else y = gCanvasContainerWidth - 100
  gCtx.lineWidth = 3
  gCtx.strokeStyle = gColor

  gCtx.textBaseline = 'middle'

  gCtx.textAlign = gTextAlign
  if (isOther) {
    const otherLine = getOtherLineIdx()

    gCtx.font = `${gMeme.lines[otherLine].size}px ${gFontStyle}`

    gCtx.fillStyle = gMeme.lines[otherLine].color

    gCtx.fillText(gMeme.lines[otherLine].txt, gCanvasMiddle, y)
    gCtx.strokeText(gMeme.lines[otherLine].txt, gCanvasMiddle, y)

    isOther = false
  }
  console.log(gMeme.lines[line])
  gCtx.font = `${gMeme.lines[line].size}px ${gFontStyle}`

  gCtx.fillStyle = gMeme.lines[line].color

  gCtx.fillText(gMeme.lines[line].txt, gCanvasMiddle, y)
  gCtx.strokeText(gMeme.lines[line].txt, gCanvasMiddle, y)
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onChangeMemeText() {
  if (loadFromStorage('selected')) gMeme = loadFromStorage('selectedMeme')
  console.log(gMeme)

  const { selectedLineIdx } = gMeme
  console.log(selectedLineIdx)
  clearCanvas()

  const elInput = document.querySelector('.text')

  gMeme.lines[selectedLineIdx].txt = elInput.value
  console.log(gMeme.lines[selectedLineIdx].txt)

  renderMeme(gCanvasContainerWidth)
}

function onDownloadMeme(elLink) {
  let imgContent

  imgContent = gElCanvas.toDataURL('image/png')
  // console.log(imgContent)
  elLink.href = imgContent
}

function onClearCanvas() {
  clearCanvas()
  const { selectedLineIdx } = gMeme
  gText = ''
  gMeme.lines[selectedLineIdx].txt = ''
  renderMeme(gCanvasContainerWidth)

  const elTextInput = document.querySelector('.text')
  elTextInput.value = ''
}

function changeColorInput() {
  const { selectedLineIdx } = gMeme
  gFillColor = gMeme.lines[selectedLineIdx].color
  const elColorInput = document.querySelector('.color')
  elColorInput.value = gFillColor
}

function onChangeColor(elColor) {
  gFillColor = elColor.value
  const { selectedLineIdx } = gMeme
  gMeme.lines[selectedLineIdx].color = gFillColor
  console.log(gMeme.lines[selectedLineIdx])
  addText(selectedLineIdx)
}

function onChangeSize(elBtn) {
  if (loadFromStorage('selected')) gMeme = loadFromStorage('selectedMeme')
  const operator = elBtn.id

  const { selectedLineIdx } = gMeme
  gFontSize = gMeme.lines[selectedLineIdx].size
  switch (operator) {
    case 'increase':
      if (gFontSize >= 205) return
      gFontSize += 10
      break
    case 'decrease':
      if (gFontSize <= 35) return
      gFontSize -= 10
      break
  }
  console.log(gFontSize)

  gMeme.lines[selectedLineIdx].size = +gFontSize
  clearCanvas()
  renderMeme(gCanvasContainerWidth)
  // addText()

  const elInputRange = document.querySelector('.size-range')
  elInputRange.value = gFontSize
  const elSizeDisplay = document.querySelector('.font-size-display')
  elSizeDisplay.innerText = gFontSize
}

function onChangeSizeRange(elInputRange) {
  if (loadFromStorage('selected')) gMeme = loadFromStorage('selectedMeme')
  const { selectedLineIdx } = gMeme
  const fontSize = elInputRange.value
  gMeme.lines[selectedLineIdx].size = +fontSize
  console.log(fontSize)
  clearCanvas()
  renderMeme(gCanvasContainerWidth)
  // addText()

  displayFontSize()
  const elSizeDisplay = document.querySelector('.font-size-display')
  elSizeDisplay.innerText = gMeme.lines[selectedLineIdx].size
}

function displayFontSize() {
  const { selectedLineIdx } = gMeme
  const elInputRange = document.querySelector('.size-range')
  elInputRange.title = gMeme.lines[selectedLineIdx].size
}

function onAddLine() {
  const elCanvas = document.querySelector('canvas')
  elCanvas.style.cursor = 'pointer'

  const line = createLine()

  gMeme.lines.push(line)

  addText(1)
  onSwitchLine()
}

function getLineOption(lineIdx) {
  gText = gMeme.lines[lineIdx].txt
  gFontSize = gMeme.lines[lineIdx].size

  gFillColor = gMeme.lines[lineIdx].color
}

function onSwitchLine() {
  if (gMeme.lines.length === 1) return
  console.log(gMeme.selectedLineIdx)
  switchLine()
  console.log(gMeme.selectedLineIdx)
}

function switchLine() {
  const { selectedLineIdx } = gMeme
  const elLineBorder = document.querySelector('.line-select')
  if (selectedLineIdx === 0) {
    gMeme.selectedLineIdx = 1

    changeColorInput()
    console.log(elLineBorder.style.top)
    console.log(elLineBorder.style.bottom)
    elLineBorder.style.display = 'block'
    elLineBorder.style.top = ''
    elLineBorder.style.bottom = '-50px'
  } else {
    gMeme.selectedLineIdx = 0

    changeColorInput()

    elLineBorder.style.top = '100px'
  }
}

function copyOtherLine() {
  let otherLine
  const { selectedLineIdx } = gMeme
  selectedLineIdx === 0 ? (otherLine = 1) : (otherLine = 0)
  console.log(gMeme.lines[otherLine])

  gOtherLine = otherLine
}

function getOtherLineIdx() {
  let otherLine
  const { selectedLineIdx } = gMeme
  selectedLineIdx === 0 ? (otherLine = 1) : (otherLine = 0)
  return otherLine
}

function onCanvasClick(ev) {
  if (gMeme.lines.length === 1) return
  const x = ev.x
  const y = ev.y

  const { selectedLineIdx } = gMeme

  console.log(gCanvasMiddle)
  if (y < gCanvasMiddle && selectedLineIdx === 1) {
    switchLine()
  } else if (y > gCanvasMiddle && selectedLineIdx === 0) {
    switchLine()
  }
}

function onAlignText(elInput) {
  console.log(elInput.value)
  switch (elInput.value) {
    case 'start':
      gTextAlign = 'end'
      break
    case 'center':
      gTextAlign = 'center'
      break
    case 'end':
      gTextAlign = 'start'
      break
  }
  clearCanvas()
  renderMeme(gCanvasContainerWidth)
}

function onRenderNewMeme() {
  clearFromStorage('selected')

  window.location.reload()
}

function onOpenGallery() {
  const galleryClass = 'gallery'

  openModal(galleryClass)
}

function openModal(elClass) {
  const elDialog = document.querySelector(`.${elClass}`)

  elDialog.showModal()

  const elScreen = document.querySelector('.screen')

  elScreen.style.display = 'block'
}

function onCloseModal() {
  const galleryClass = 'gallery'

  closeModal(galleryClass)
}

function closeModal(elClass) {
  const elDialog = document.querySelector(`.${elClass}`)

  elDialog.close()

  const elScreen = document.querySelector('.screen')

  elScreen.style.display = 'none'
}

function onChangeFontStyle(elInput) {
  console.log(elInput.value)
  const style = elInput.value

  const { selectedLineIdx } = gMeme

  switch (style) {
    case 'Classic Meme':
      gFontStyle = 'Arial Black'
      break

    case 'Monospace':
      gFontStyle = 'monospace'
      break

    case 'Verdana':
      gFontStyle = 'verdana'
      break

    case 'Courier':
      gFontStyle = 'courier'
      break
  }
  clearCanvas()
  renderMeme(gCanvasContainerWidth)
}

function onMyMemeGallery() {
  // renderMyMemeGallery()
  // const galleryClass = 'gallery'
  // openModal(galleryClass)
}
// // clearFromStorage('myMemeGallery')
// function onSaveMeme() {
//   let myMemeGallery
//   const meme = {
//     gMeme: gMeme,
//     data: gCtx.getImageData(0, 0, gElCanvas.width, gElCanvas.height),
//   }
//   if (loadFromStorage('myMemeGallery')) {
//     myMemeGallery = loadFromStorage('myMemeGallery')
//     console.log(myMemeGallery)

//     myMemeGallery.push(meme)
//     saveToStorage('myMemeGallery', myMemeGallery)
//     console.log(myMemeGallery)
//     return
//   }

//   myMemeGallery = []
//   myMemeGallery.push(meme)
//   saveToStorage('myMemeGallery', myMemeGallery)
//   console.log(myMemeGallery)
// }

// function renderMyMemeGallery() {
//   const memes = loadFromStorage('myMemeGallery')

//   let strHtmls = memes.map(
//     (meme) => `<canvas class="canvas"></canvas>`
//     // `<img onclick="onSelectMEME(this)" src="meme-imgs/${meme.selectedImgId}.jpg" alt="" style="cursor: pointer;">`
//   )
//   const elGallery = document.querySelector('.gallery-container')

//   elGallery.innerHTML = strHtmls.join('')

//   const elCanvases = elGallery.querySelectorAll('canvas')

//   for (var i = 0; i < elCanvases.length; i++) {
//     let ctx = elCanvases[i].getContext('2d')
//     ctx.putImageData(memes[i].data, 10, 10)
//   }
// }

// // function renderMyMemeGallery() {
// //   const memes = loadFromStorage('myMemeGallery')
// //   console.log(memes)
// //   let strHtmls = memes.map(
// //     (meme) =>
// //       `<canvas class="canvas" id="${meme.memeId}" height="100" width="100"></canvas>`
// //     // `<img onclick="onSelectMEME(this)" src="meme-imgs/${meme.selectedImgId}.jpg" alt="" style="cursor: pointer;">`
// //   )

// //   console.log(strHtmls)
// //   const elGallery = document.querySelector('.gallery-container')

// //   elGallery.innerHTML = strHtmls.join('')

// //   const elCanvases = elGallery.querySelectorAll('canvas')
// //   console.log(elCanvases)
// //   for (var i = 0; i < elCanvases.length; i++) {
// //     console.log('works')
// //     console.log(elCanvases)
// //     const id = elCanvases[i].id
// //     const elCanvas = document.querySelector(`#${id}`)
// //     renderMemes(id)
// //   }
// // }

// // // const meme = {
// // //   selectedImgId: id,
// // //   selectedLineIdx: 0,
// // //   lines: [
// // //     {
// // //       txt: 'Hello',
// // //       size: 120,
// // //       color: '#ffffff',
// // //       position: { x: gCanvasMiddle, y: 100 },
// // //     },
// // //   ],
// // // }

// // function renderMemes(memeId) {
// //   const memeGallery = loadFromStorage('myMemeGallery')
// //   console.log(memeId)
// //   const meme = memeGallery.find((meme) => meme.memeId === memeId)

// //   const elCanvas = document.querySelector(`#${memeId}`)
// //   const ctx = elCanvas.getContext('2d')

// //   const img = new Image()

// //   console.log(meme)
// //   // const { selectedImgId } = meme
// //   img.src = `meme-imgs/${meme.selectedImgId}.jpg`
// //   console.log(img)

// //   const { selectedLineIdx } = meme

// //   img.onload = () => {
// //     ctx.drawImage(img, 0, 0, 100, 100)
// //     if (meme.lines.length > 1) {
// //       const otherLine = getOtherLineIdx()
// //       isOther = true
// //       console.log(otherLine)
// //       addText(otherLine)
// //     }
// //     addText(selectedLineIdx)
// //   }
// // }

function onSearchMemes(elSearch) {
  const search = elSearch.value
  const elImgContainer = document.querySelector('.gallery-container')
  elImgContainer.innerHTML = getGallerySrc(search).join('')
}

function onSearchKeyword(elSpan) {
  console.log(elSpan)
  const word = elSpan.innerText
  console.log(gKeywordSearchCountMap[word])
  gKeywordSearchCountMap[word]++
  console.log(gKeywordSearchCountMap[word])
  saveToStorage('keywordMap', gKeywordSearchCountMap)
  elSpan.style.fontSize = gKeywordSearchCountMap[word] * 3 + 'px'

  const elImgContainer = document.querySelector('.gallery-container')
  elImgContainer.innerHTML = getGallerySrc(word).join('')
}

function onOpenShareOptions() {
  const elShareOptions = document.querySelector('.share-options')

  if (elShareOptions.style.display === 'none') {
    elShareOptions.style.display = 'initial'
  } else {
    elShareOptions.style.display = 'none'
  }
  console.log(elShareOptions.style.display)

  gIsShare = true
  setTimeout(() => (gIsShare = false), 10)
  // elShareOptions.style.opacity === '0'
  //   ? (elShareOptions.style.opacity = '1')
  //   : (elShareOptions.style.opacity = '0')
}

function closeShareOptions() {
  if (gIsShare) return
  const elShareOptions = document.querySelector('.share-options')

  elShareOptions.style.display = 'none'
}
