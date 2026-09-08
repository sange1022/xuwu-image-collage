import { canvasSize, imagePlacement, pixelCells } from './geometry.js'

export function loadPhoto(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => resolve({
      id: crypto.randomUUID(), name: file.name, url, image,
      width: image.naturalWidth, height: image.naturalHeight, offsetX: 0, offsetY: 0, zoom: 1,
      captionEnabled: true, caption: file.name.replace(/\.[^.]+$/, ''), captionBackground: true,
    })
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`无法读取 ${file.name}`)) }
    image.src = url
  })
}

export function qaDemoFiles() {
  const colors = [
    ['#2864a8','#9fd0ee'], ['#de7e42','#f4d3a6'], ['#315b48','#b7cf91'],
    ['#724b87','#e5bdd8'], ['#1f6d87','#e4d59a'], ['#a14c5d','#f0b7a4'],
    ['#514a8f','#b9b6ed'], ['#3f7a75','#b6ded4'], ['#8a673e','#e8c890'],
  ]
  return colors.map(([a, b], index) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="900" height="1200" fill="url(#g)"/><circle cx="${200 + index * 90}" cy="${260 + index * 80}" r="150" fill="#fff" opacity=".28"/><path d="M0 900 L260 620 470 820 650 540 900 760V1200H0Z" fill="#102436" opacity=".35"/><text x="60" y="1120" fill="white" font-size="72" font-family="sans-serif">PHOTO ${index + 1}</text></svg>`
    return new File([svg], `示例图片-${index + 1}.svg`, { type: 'image/svg+xml' })
  })
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function fitCaption(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text
  let shortened = text
  while (shortened.length && ctx.measureText(`${shortened}…`).width > maxWidth) shortened = shortened.slice(0, -1)
  return shortened ? `${shortened}…` : ''
}

function drawCaption(ctx, photo, cell) {
  const text = photo.caption?.trim()
  if (!photo.captionEnabled || !text) return

  const shortEdge = Math.min(cell.width, cell.height)
  const fontSize = Math.max(16, Math.min(42, shortEdge * .09))
  const inset = Math.max(9, shortEdge * .04)
  const horizontalPadding = Math.max(8, fontSize * .58)
  const labelHeight = fontSize * 1.68
  const maxLabelWidth = Math.max(1, cell.width - inset * 2)
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif`
  const fittedText = fitCaption(ctx, text, maxLabelWidth - horizontalPadding * 2)
  if (!fittedText) return

  const labelWidth = Math.min(maxLabelWidth, ctx.measureText(fittedText).width + horizontalPadding * 2)
  const x = cell.x + inset
  const y = cell.y + cell.height - inset - labelHeight
  if (photo.captionBackground !== false) {
    ctx.fillStyle = 'rgba(255, 255, 255, .92)'
    roundedRect(ctx, x, y, labelWidth, labelHeight, labelHeight * .28)
    ctx.fill()
    ctx.fillStyle = '#1d1d1f'
    ctx.shadowColor = 'transparent'
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0, 0, 0, .5)'
    ctx.shadowBlur = Math.max(2, fontSize * .2)
    ctx.shadowOffsetY = Math.max(1, fontSize * .08)
  }
  ctx.textBaseline = 'middle'
  ctx.fillText(fittedText, x + (photo.captionBackground !== false ? horizontalPadding : 0), y + labelHeight / 2)
  ctx.shadowColor = 'transparent'
}

export function renderCollage(canvas, { photos, template, ratio, longEdge, gap, radius, background }) {
  const size = canvasSize(ratio, longEdge)
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.fillStyle = background
  ctx.fillRect(0, 0, size.width, size.height)
  const cells = pixelCells(template, size.width, size.height, gap)
  cells.forEach((cell, index) => {
    const photo = photos[index]
    if (!photo) return
    const placement = imagePlacement(photo.width, photo.height, cell.width, cell.height, photo.offsetX, photo.offsetY, photo.zoom)
    ctx.save()
    roundedRect(ctx, cell.x, cell.y, cell.width, cell.height, radius)
    ctx.clip()
    ctx.drawImage(photo.image, cell.x + placement.dx, cell.y + placement.dy, placement.dw, placement.dh)
    drawCaption(ctx, photo, cell)
    ctx.restore()
  })
  return size
}

export function exportCollage(options, format) {
  const canvas = document.createElement('canvas')
  renderCollage(canvas, options)
  const mime = format === 'JPG' ? 'image/jpeg' : format === 'WebP' ? 'image/webp' : 'image/png'
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('浏览器无法生成该格式')), mime, .94))
}
