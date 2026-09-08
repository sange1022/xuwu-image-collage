import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Images, ShieldCheck } from 'lucide-react'
import { CanvasPreview } from './components/CanvasPreview.jsx'
import { Inspector } from './components/Inspector.jsx'
import { PhotoRail } from './components/PhotoRail.jsx'
import { getTemplates, MAX_PHOTOS } from './geometry.js'
import { exportCollage, loadPhoto, qaDemoFiles } from './renderer.js'
import './styles.css'

const initialSettings = { ratio: '3:4', gap: 16, radius: 16, background: '#ffffff', longEdge: 2400, format: 'PNG' }

export default function App() {
  const [photos, setPhotos] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [settings, setSettings] = useState(initialSettings)
  const [templateId, setTemplateId] = useState('one')
  const [status, setStatus] = useState('准备就绪')
  const [exporting, setExporting] = useState(false)
  const qaSeeded = useRef(false)
  const latestPhotos = useRef(photos)
  latestPhotos.current = photos

  useEffect(() => () => latestPhotos.current.forEach((photo) => URL.revokeObjectURL(photo.url)), [])

  const templates = useMemo(() => getTemplates(photos.length || 1), [photos.length])
  const activeTemplate = templates.find((item) => item.id === templateId) || templates[0]
  const selected = photos.find((photo) => photo.id === selectedId) || photos[0] || null

  const addFiles = async (fileList) => {
    const available = Math.max(0, MAX_PHOTOS - photos.length)
    const files = [...fileList].filter((file) => file.type.startsWith('image/')).slice(0, available)
    if (!files.length) { setStatus(available ? '请选择图片文件' : `单张拼图最多 ${MAX_PHOTOS} 张图片`); return }
    setStatus(`正在读取 ${files.length} 张图片…`)
    const results = await Promise.allSettled(files.map(loadPhoto))
    const loaded = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
    setPhotos((current) => [...current, ...loaded])
    if (!selectedId && loaded[0]) setSelectedId(loaded[0].id)
    setTemplateId(getTemplates(photos.length + loaded.length)[0].id)
    setStatus(`已载入 ${photos.length + loaded.length} 张图片`)
  }

  useEffect(() => {
    if (!qaSeeded.current && import.meta.env.DEV && new URLSearchParams(window.location.search).has('qa')) {
      qaSeeded.current = true
      addFiles(qaDemoFiles())
    }
  // QA-only seed runs once and is excluded from normal production behavior.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeSelected = () => {
    if (!selected) return
    URL.revokeObjectURL(selected.url)
    const remaining = photos.filter((photo) => photo.id !== selected.id)
    setPhotos(remaining)
    setSelectedId(remaining[0]?.id || null)
    setTemplateId(getTemplates(remaining.length || 1)[0].id)
    setStatus('已移除图片')
  }

  const clear = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url))
    setPhotos([]); setSelectedId(null); setTemplateId('one'); setStatus('已清空图片列表')
  }

  const move = (direction) => {
    if (!selected) return
    const index = photos.findIndex((photo) => photo.id === selected.id)
    const next = index + direction
    if (next < 0 || next >= photos.length) return
    setPhotos((current) => { const copy = [...current]; [copy[index], copy[next]] = [copy[next], copy[index]]; return copy })
  }

  const nudge = (dx, dy) => {
    if (!selected) return
    setPhotos((current) => current.map((photo) => photo.id === selected.id ? {
      ...photo,
      offsetX: Math.max(-1, Math.min(1, photo.offsetX + dx)),
      offsetY: Math.max(-1, Math.min(1, photo.offsetY + dy)),
    } : photo))
  }

  const zoomSelected = (delta) => {
    if (!selected) return
    setPhotos((current) => current.map((photo) => photo.id === selected.id ? {
      ...photo,
      zoom: Math.max(.5, Math.min(3, Math.round(((photo.zoom || 1) + delta) * 100) / 100)),
    } : photo))
  }

  const setSelectedZoom = (zoom) => {
    if (!selected) return
    setPhotos((current) => current.map((photo) => photo.id === selected.id ? {
      ...photo,
      zoom: Math.max(.5, Math.min(3, zoom)),
    } : photo))
  }

  const resetPosition = () => {
    if (!selected) return
    setPhotos((current) => current.map((photo) => photo.id === selected.id ? { ...photo, offsetX: 0, offsetY: 0, zoom: 1 } : photo))
  }

  const setPhotoCaption = (key, value) => {
    if (!selected) return
    setPhotos((current) => current.map((photo) => photo.id === selected.id ? { ...photo, [key]: value } : photo))
  }

  const download = async () => {
    setExporting(true); setStatus('正在生成高清拼图…')
    try {
      const blob = await exportCollage({ photos, template: activeTemplate, ratio: settings.ratio, longEdge: settings.longEdge, gap: settings.gap, radius: settings.radius, background: settings.background }, settings.format)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      const extension = settings.format === 'JPG' ? 'jpg' : settings.format.toLowerCase()
      anchor.href = url; anchor.download = `戌無拼图_${new Date().toISOString().slice(0, 19).replaceAll(':', '-')}.${extension}`; anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus('拼图已下载')
    } catch (error) { setStatus(error.message) }
    finally { setExporting(false) }
  }

  return <div className="app-shell">
    <header className="app-header">
      <div className="window-side">
        <div className="traffic-lights" aria-hidden="true"><i/><i/><i/></div>
        <div className="brand"><span className="brand-mark"><Images size={18}/></span><h1>戌無图片拼图</h1></div>
      </div>
      <div className="document-state"><i/>{status}</div>
      <div className="header-actions">
        <div className="local-badge"><ShieldCheck size={14}/>仅在本地处理</div>
        <button className="header-export" disabled={!photos.length || exporting} onClick={download}><Download size={16}/>{exporting ? '正在导出…' : '导出拼图'}</button>
      </div>
    </header>
    <div className="workspace">
      <PhotoRail photos={photos} selectedId={selected?.id} onSelect={setSelectedId} onAdd={addFiles} onRemove={removeSelected} onClear={clear} onMove={move}/>
      <CanvasPreview photos={photos} settings={settings} template={activeTemplate} onFiles={addFiles}/>
      <Inspector photos={photos} selected={selected} settings={settings} templateId={activeTemplate.id} onSettings={(key, value) => setSettings((current) => ({ ...current, [key]: value }))} onTemplate={setTemplateId} onNudge={nudge} onZoom={zoomSelected} onSetZoom={setSelectedZoom} onReset={resetPosition} onCaption={setPhotoCaption} onExport={download} exporting={exporting}/>
    </div>
    <footer className="status-bar"><span>图片 {photos.length} / {MAX_PHOTOS}</span><span>所有处理均在浏览器本地完成</span><span>{settings.ratio} · 长边 {settings.longEdge}px · {settings.format}</span></footer>
  </div>
}
