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

let gLang
let gElDirection

let gUpperY
let gLowerY

let gUpperX
let gLowerX

let gIsClicked = false

const memeFont = new FontFace('meme', url('impact.ttf'))

function init() {
  const elImgContainer = document.querySelector('.gallery-container')
  elImgContainer.innerHTML += getGallerySrc().join('')

  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  resizeCanvas()
  resizeXY()
  resizeFontSize()

  renderMeme()

  changeColorInput()
  displayFontSize()
  createKeywords()
  const elShareOptions = document.querySelector('.share-options')
  elShareOptions.style.display = 'none'
}

function resizeXY() {
  gUpperY = gCanvasContainerWidth / 5
  gLowerY = gCanvasContainerWidth - gCanvasContainerWidth / 5

  gUpperX = gCanvasMiddle
  gLowerX = gCanvasMiddle
}

function renderMeme(containerWidth) {
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

  const { selectedImgId } = gMeme
  img.src = `meme-imgs/${selectedImgId}.jpg`

  const { selectedLineIdx } = gMeme

  img.onload = () => {
    gCtx.drawImage(img, 0, 0, containerWidth, containerWidth)
    if (gMeme.lines.length > 1) {
      const otherLine = getOtherLineIdx()
      isOther = true

      addText(otherLine)
    }
    addText(selectedLineIdx)
  }
  saveToStorage('currentMeme', gMeme)
}

function resizeFontSize() {
  const { selectedLineIdx } = gMeme

  gMeme.lines[selectedLineIdx].size = gCanvasContainerWidth / 5

  displayFontSize()
  const elSizeDisplay = document.querySelector('.font-size-display')
  elSizeDisplay.innerText = gMeme.lines[selectedLineIdx].size
}

function addText(line) {
  if (loadFromStorage('selected')) gMeme = loadFromStorage('selectedMeme')

  let y
  let x

  if (line === 0) {
    y = gUpperY
    x = gUpperX
  } else {
    y = gLowerY
    x = gLowerX
  }

  gCtx.lineWidth = 3
  gCtx.strokeStyle = gColor

  gCtx.textBaseline = 'middle'

  gCtx.textAlign = gTextAlign
  if (isOther) {
    const otherLine = getOtherLineIdx()

    gCtx.font = `${gMeme.lines[otherLine].size}px ${gFontStyle}`

    gCtx.fillStyle = gMeme.lines[otherLine].color

    gCtx.fillText(gMeme.lines[otherLine].txt.toUpperCase(), x, y)
    gCtx.strokeText(gMeme.lines[otherLine].txt.toUpperCase(), x, y)

    isOther = false
  }

  gCtx.font = `${gMeme.lines[line].size}px ${gFontStyle}`

  gCtx.fillStyle = gMeme.lines[line].color

  gCtx.fillText(gMeme.lines[line].txt.toUpperCase(), x, y)
  gCtx.strokeText(gMeme.lines[line].txt.toUpperCase(), x, y)
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onChangeMemeText() {
  if (loadFromStorage('selected')) gMeme = loadFromStorage('selectedMeme')

  const { selectedLineIdx } = gMeme

  clearCanvas()

  const elInput = document.querySelector('.text')

  gMeme.lines[selectedLineIdx].txt = elInput.value

  renderMeme(gCanvasContainerWidth)
}

function onDownloadMeme(elLink) {
  let imgContent

  imgContent = gElCanvas.toDataURL('image/png')

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

  const elLineBorder = document.querySelector('.line-select')
  elLineBorder.style.setProperty(
    'border-color',
    gMeme.lines[selectedLineIdx].color
  )

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

  gMeme.lines[selectedLineIdx].size = +gFontSize
  clearCanvas()
  renderMeme(gCanvasContainerWidth)

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

  clearCanvas()
  renderMeme(gCanvasContainerWidth)

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
  gMeme.selectedLineIdx = 1
  resizeFontSize()
  gMeme.selectedLineIdx = 0

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
  if (gIsClicked) return

  switchLine()
}

function switchLine() {
  const { selectedLineIdx } = gMeme
  const elLineBorder = document.querySelector('.line-select')
  if (gCanvasContainerWidth < 500) {
    elLineBorder.style.height = '1px'
  } else {
    elLineBorder.style.height = '1px'
  }
  if (selectedLineIdx === 0) {
    gMeme.selectedLineIdx = 1

    changeColorInput()
    elLineBorder.style.display = 'block'
    elLineBorder.style.top = ''
    // elLineBorder.style.bottom = '-50px'
    const textPos = { x: gUpperX, y: gUpperY }

    elLineBorder.style.bottom = gUpperY / 9 + 'px'
    changeLinePos()
  } else {
    gMeme.selectedLineIdx = 0

    changeColorInput()

    elLineBorder.style.top = gLowerY / 2.5 + 'px'
  }
  let otherLine
  selectedLineIdx === 0 ? (otherLine = 1) : (otherLine = 0)

  elLineBorder.style.setProperty('border-color', gMeme.lines[otherLine].color)
}

function changeLinePos() {
  const elLineBorder = document.querySelector('.line-select')
  const { selectedLineIdx } = gMeme
  let currY
  if (selectedLineIdx === 1) {
    currY = -gLowerY - gCanvasContainerWidth / 12
    elLineBorder.style.bottom = currY + gCanvasMiddle * 2 + 'px'
  } else if (selectedLineIdx === 0) {
    currY = gUpperY - gCanvasContainerWidth * 1.65

    elLineBorder.style.top = currY + gCanvasMiddle * 3.5 + 'px'
  }
  // const pos = getPosition(elLineBorder)
  // const { x, y } = pos
  // console.log(currY)
}

function getPosition(element) {
  var rect = element.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
  }
}

function copyOtherLine() {
  let otherLine
  const { selectedLineIdx } = gMeme
  selectedLineIdx === 0 ? (otherLine = 1) : (otherLine = 0)

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

  if (y < gCanvasMiddle && selectedLineIdx === 1) {
    switchLine()
  } else if (y > gCanvasMiddle && selectedLineIdx === 0) {
    switchLine()
  }
}

function onAlignText(elInput) {
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

function onSelectMEME(elImg) {
  gMeme = createMeme(+elImg.id)
  saveToStorage('selectedMeme', gMeme)
  saveToStorage('selected', true)

  renderMeme(gCanvasContainerWidth)
  onCloseGallery()
}

function onCloseGallery() {
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
  const style = elInput.value

  const { selectedLineIdx } = gMeme

  switch (style) {
    case 'Classic Meme':
      gFontStyle = 'meme'
      break

    case 'Arial Black (Default)':
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

function onAbout() {
  const elAboutDialog = document.querySelector('.about-dialog')

  openModal('about-dialog')
  // renderMyMemeGallery()
  // const galleryClass = 'gallery'
  // openModal(galleryClass)
}

function onCloseAbout() {
  closeModal('about-dialog')
}

function onSearchMemes(elSearch) {
  const search = elSearch.value
  const elImgContainer = document.querySelector('.gallery-container')
  elImgContainer.innerHTML = getGallerySrc(search).join('')
}

function onSearchKeyword(elSpan) {
  const word = elSpan.innerText
  gKeywordSearchCountMap[word]++
  saveToStorage('keywordMap', gKeywordSearchCountMap)
  elSpan.style.fontSize = gKeywordSearchCountMap[word] * 3 + 'px'

  const elImgContainer = document.querySelector('.gallery-container')
  elImgContainer.innerHTML = getGallerySrc(word).join('')
}

function onOpenShareOptions(elBtn) {
  const elScreenWidth = document.body.clientWidth
  if (elScreenWidth < 1025) return
  const elShareOptions = document.querySelector('.share-options')

  elShareOptions.style.display = 'initial'

  elShareOptions.addEventListener('mouseenter', () => {
    elShareOptions.style.display = 'initial'
  })
  elShareOptions.addEventListener('mouseleave', () => {})
}

function closeShareOptions() {
  const elScreenWidth = document.body.clientWidth
  if (elScreenWidth < 1025) return
  const elShareOptions = document.querySelector('.share-options')

  elShareOptions.style.display = 'none'
}

function onClickShare() {
  const elScreenWidth = document.body.clientWidth
  if (elScreenWidth > 1025) return
  const elShareOptions = document.querySelector('.share-options')

  elShareOptions.style.display === 'none'
    ? (elShareOptions.style.display = 'initial')
    : (elShareOptions.style.display = 'none')
}

function onTransClick(elBtn) {
  const elBody = document.querySelector('body')
  const elTitle = document.querySelector('h1')
  switch (elBtn.innerText) {
    case 'Hebrew':
      gLang = 'he'
      gElDirection = 'rtl'
      elBody.style.direction = gElDirection
      elBtn.innerText = 'English'

      elTitle.style.fontFamily = 'meme'
      elTitle.style.color = '#385996'
      break
    case 'English':
      gLang = 'en'
      gElDirection = 'ltr'
      elBody.style.direction = gElDirection
      elBtn.innerText = 'Hebrew'

      elTitle.style.fontFamily = 'h1'
      break
  }
  doTrans()
}

function onEnterText(ev) {
  const { selectedLineIdx } = gMeme
  let y
  if (selectedLineIdx === 0) {
    y = gUpperY
  } else {
    y = gLowerY
  }
  const currentFontSize = gMeme.lines[selectedLineIdx].size
  const offsetY = ev.offsetY
  const distanceFromText = Math.abs(y - offsetY)

  if (distanceFromText <= currentFontSize / 2) {
    gElCanvas.style.cursor = 'grab'
    if (gIsClicked) {
      onMoveText(ev)
    }
  } else {
    gElCanvas.style.cursor = 'auto'
  }
}

function onMoveText(ev) {
  gElCanvas.style.cursor = 'grabbing'

  const { selectedLineIdx } = gMeme

  const currentFontSize = gMeme.lines[selectedLineIdx].size
  const offsetY = ev.offsetY
  const offsetX = ev.offsetX

  const distanceFromText = Math.abs(gUpperY - offsetY)

  if (selectedLineIdx === 0) {
    gUpperY = offsetY
    gUpperX = offsetX

    changeLinePos()
  } else {
    gLowerY = offsetY
    gLowerX = offsetX
    changeLinePos()
  }
  // clearCanvas()
  renderMeme(gCanvasContainerWidth)
}

function onDown() {
  gIsClicked = true
  gElCanvas.style.cursor = 'grabbing'
}

function onUp() {
  gIsClicked = false
}
