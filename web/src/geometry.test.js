import { describe, expect, it } from 'vitest'
import { canvasSize, coverCrop, getTemplates, imagePlacement, pixelCells } from './geometry.js'

describe('collage geometry', () => {
  it('creates portrait canvas from long edge', () => {
    expect(canvasSize('3:4', 1600)).toEqual({ width: 1200, height: 1600 })
  })

  it('only returns templates matching photo count', () => {
    expect(getTemplates(5).every((template) => template.cells.length === 5)).toBe(true)
  })

  it('applies gap while keeping cells inside canvas', () => {
    const cells = pixelCells(getTemplates(4)[0], 1200, 1600, 20)
    expect(cells).toHaveLength(4)
    expect(cells.every((cell) => cell.x >= 0 && cell.y >= 0 && cell.x + cell.width <= 1200 && cell.y + cell.height <= 1600)).toBe(true)
    expect(cells[0].x).toBe(20)
  })

  it('moves image content left by revealing the right side', () => {
    expect(coverCrop(2000, 1000, 1000, 1000, -1, 0)).toEqual({ sx: 1000, sy: 0, sw: 1000, sh: 1000 })
  })

  it('scales a single image inside its cell without changing the cell', () => {
    const placement = imagePlacement(1000, 1000, 500, 500, 0, 0, 1.5)
    expect(placement).toEqual({ dx: -125, dy: -125, dw: 750, dh: 750 })
  })
})
