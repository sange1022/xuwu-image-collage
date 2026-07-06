import { useEffect, useRef } from 'react'
import { ImagePlus } from 'lucide-react'
import { renderCollage } from '../renderer.js'

export function CanvasPreview({ photos, settings, template, onFiles }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!photos.length || !canvasRef.current) return
    const previewEdge = 1100
    const scale = previewEdge / settings.longEdge
    renderCollage(canvasRef.current, {
      photos, template, ratio: settings.ratio, longEdge: previewEdge,
      gap: Math.round(settings.gap * scale), radius: Math.round(settings.radius * scale),
      background: settings.background,
    })
  }, [photos, settings, template])

  const drop = (event) => {
    event.preventDefault()
    onFiles(event.dataTransfer.files)
  }

  return <main className="preview-zone" onDragOver={(e) => e.preventDefault()} onDrop={drop}>
    <div className={`canvas-frame ${photos.length ? '' : 'is-empty'}`}>
      {photos.length
        ? <canvas ref={canvasRef} aria-label="拼图预览" />
        : <div className="empty-state"><ImagePlus size={42}/><strong>把图片拖到这里</strong><span>支持 JPG、PNG、WebP，最多 6 张</span></div>}
    </div>
  </main>
}
