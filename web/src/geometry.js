const rect = (x, y, width, height) => ({ x, y, width, height })
const template = (id, name, ...cells) => ({ id, name, cells })

const TEMPLATES = {
  1: [template('one', '单图', rect(0, 0, 1, 1))],
  2: [
    template('two-v', '左右', rect(0, 0, .5, 1), rect(.5, 0, .5, 1)),
    template('two-h', '上下', rect(0, 0, 1, .5), rect(0, .5, 1, .5)),
    template('two-main', '主次', rect(0, 0, .64, 1), rect(.64, 0, .36, 1)),
  ],
  3: [
    template('three-top', '上方主图', rect(0, 0, 1, .62), rect(0, .62, .5, .38), rect(.5, .62, .5, .38)),
    template('three-left', '左侧主图', rect(0, 0, .62, 1), rect(.62, 0, .38, .5), rect(.62, .5, .38, .5)),
    template('three-rows', '三行', rect(0, 0, 1, 1 / 3), rect(0, 1 / 3, 1, 1 / 3), rect(0, 2 / 3, 1, 1 / 3)),
    template('three-cols', '三列', rect(0, 0, 1 / 3, 1), rect(1 / 3, 0, 1 / 3, 1), rect(2 / 3, 0, 1 / 3, 1)),
  ],
  4: [
    template('four-grid', '2×2', rect(0, 0, .5, .5), rect(.5, 0, .5, .5), rect(0, .5, .5, .5), rect(.5, .5, .5, .5)),
    template('four-left', '左侧主图', rect(0, 0, .62, 1), rect(.62, 0, .38, 1 / 3), rect(.62, 1 / 3, .38, 1 / 3), rect(.62, 2 / 3, .38, 1 / 3)),
    template('four-top', '上方主图', rect(0, 0, 1, .6), rect(0, .6, 1 / 3, .4), rect(1 / 3, .6, 1 / 3, .4), rect(2 / 3, .6, 1 / 3, .4)),
    template('four-cols', '四列', rect(0, 0, .25, 1), rect(.25, 0, .25, 1), rect(.5, 0, .25, 1), rect(.75, 0, .25, 1)),
  ],
  5: [
    template('five-feature', '自适应', rect(0, 0, .48, .5), rect(.48, 0, .52, .62), rect(0, .5, .48, .22), rect(0, .72, .48, .28), rect(.48, .62, .52, .38)),
    template('five-left', '左侧主图', rect(0, 0, .58, 1), rect(.58, 0, .42, .25), rect(.58, .25, .42, .25), rect(.58, .5, .42, .25), rect(.58, .75, .42, .25)),
    template('five-top', '上方主图', rect(0, 0, 1, .56), rect(0, .56, .25, .44), rect(.25, .56, .25, .44), rect(.5, .56, .25, .44), rect(.75, .56, .25, .44)),
    template('five-mosaic', '错落', rect(0, 0, .4, .5), rect(.4, 0, .6, .34), rect(.4, .34, .3, .66), rect(.7, .34, .3, .33), rect(.7, .67, .3, .33)),
  ],
  6: [
    template('six-grid', '2×3', rect(0, 0, .5, 1 / 3), rect(.5, 0, .5, 1 / 3), rect(0, 1 / 3, .5, 1 / 3), rect(.5, 1 / 3, .5, 1 / 3), rect(0, 2 / 3, .5, 1 / 3), rect(.5, 2 / 3, .5, 1 / 3)),
    template('six-feature', '主图拼接', rect(0, 0, .58, .66), rect(.58, 0, .42, 1 / 3), rect(.58, 1 / 3, .42, 1 / 3), rect(0, .66, 1 / 3, .34), rect(1 / 3, .66, 1 / 3, .34), rect(2 / 3, .66, 1 / 3, .34)),
  ],
}

export function getTemplates(count) {
  return TEMPLATES[Math.max(1, Math.min(6, count))]
}

export function canvasSize(ratioText, longEdge) {
  const [rw, rh] = ratioText.split(':').map(Number)
  return rw >= rh
    ? { width: longEdge, height: Math.round(longEdge * rh / rw) }
    : { width: Math.round(longEdge * rw / rh), height: longEdge }
}

export function pixelCells(layout, width, height, gap) {
  const half = gap / 2
  return layout.cells.map((cell) => {
    const left = cell.x === 0 ? gap : half
    const top = cell.y === 0 ? gap : half
    const right = cell.x + cell.width > .9999 ? gap : half
    const bottom = cell.y + cell.height > .9999 ? gap : half
    const x = Math.round(cell.x * width + left)
    const y = Math.round(cell.y * height + top)
    const farX = Math.round((cell.x + cell.width) * width - right)
    const farY = Math.round((cell.y + cell.height) * height - bottom)
    return { x, y, width: Math.max(1, farX - x), height: Math.max(1, farY - y) }
  })
}

export function coverCrop(sourceWidth, sourceHeight, targetWidth, targetHeight, offsetX = 0, offsetY = 0) {
  const targetRatio = targetWidth / targetHeight
  const sourceRatio = sourceWidth / sourceHeight
  let sw = sourceWidth
  let sh = sourceHeight
  if (sourceRatio > targetRatio) sw = Math.round(sourceHeight * targetRatio)
  else if (sourceRatio < targetRatio) sh = Math.round(sourceWidth / targetRatio)
  const x = Math.max(-1, Math.min(1, offsetX))
  const y = Math.max(-1, Math.min(1, offsetY))
  return {
    sx: Math.round((sourceWidth - sw) * (1 - x) / 2),
    sy: Math.round((sourceHeight - sh) * (1 - y) / 2),
    sw,
    sh,
  }
}
