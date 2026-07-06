import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Download, LocateFixed } from 'lucide-react'
import { getTemplates } from '../geometry.js'

const ratios = ['3:4', '1:1', '9:16', '2:3', '4:3', '3:2', '16:9']

function TemplateIcon({ template }) {
  return <svg viewBox="0 0 54 54" aria-hidden="true">{template.cells.map((cell, i) => <rect key={i} x={2 + cell.x * 50} y={2 + cell.y * 50} width={Math.max(2, cell.width * 50 - 2)} height={Math.max(2, cell.height * 50 - 2)} rx="2"/>)}</svg>
}

export function Inspector({ photos, selected, settings, templateId, onSettings, onTemplate, onNudge, onReset, onExport, exporting }) {
  const templates = getTemplates(photos.length || 1)
  return <aside className="inspector">
    <section><h2>拼图设置</h2><label>画布比例<select value={settings.ratio} onChange={(e) => onSettings('ratio', e.target.value)}>{ratios.map((ratio) => <option key={ratio}>{ratio}</option>)}</select></label></section>
    <section><div className="section-title"><h3>布局模板</h3><span>{photos.length || 1} 图</span></div><div className="template-grid">{templates.map((item) => <button key={item.id} className={templateId === item.id ? 'active' : ''} title={item.name} onClick={() => onTemplate(item.id)}><TemplateIcon template={item}/><span>{item.name}</span></button>)}</div></section>
    <section><div className="section-title"><h3>调整图片位置</h3><span>{selected ? selected.name : '未选择'}</span></div><div className="position-controls">
      <div className="dpad"><button aria-label="上移图片" onClick={() => onNudge(0, -.1)}><ArrowUp/></button><button aria-label="左移图片" onClick={() => onNudge(-.1, 0)}><ArrowLeft/></button><button aria-label="图片居中" onClick={onReset}><LocateFixed/></button><button aria-label="右移图片" onClick={() => onNudge(.1, 0)}><ArrowRight/></button><button aria-label="下移图片" onClick={() => onNudge(0, .1)}><ArrowDown/></button></div>
      <div className="position-readout"><span>水平</span><strong>{Math.round((selected?.offsetX || 0) * 100)}%</strong><span>垂直</span><strong>{Math.round((selected?.offsetY || 0) * 100)}%</strong></div>
    </div></section>
    <section className="sliders">
      <label><span>间隙</span><input type="range" min="0" max="80" value={settings.gap} onChange={(e) => onSettings('gap', Number(e.target.value))}/><output>{settings.gap} px</output></label>
      <label><span>圆角</span><input type="range" min="0" max="80" value={settings.radius} onChange={(e) => onSettings('radius', Number(e.target.value))}/><output>{settings.radius} px</output></label>
      <label className="color-row"><span>背景颜色</span><input type="color" value={settings.background} onChange={(e) => onSettings('background', e.target.value)}/><code>{settings.background.toUpperCase()}</code></label>
    </section>
    <section><h3>导出设置</h3><div className="export-grid"><label>输出尺寸<select value={settings.longEdge} onChange={(e) => onSettings('longEdge', Number(e.target.value))}>{[1600, 2400, 3200, 4096].map((size) => <option key={size} value={size}>长边 {size} px</option>)}</select></label><label>输出格式<select value={settings.format} onChange={(e) => onSettings('format', e.target.value)}><option>PNG</option><option>JPG</option><option>WebP</option></select></label></div>
      <button className="download-button" disabled={!photos.length || exporting} onClick={onExport}><Download size={18}/>{exporting ? '正在生成…' : '下载拼图'}</button><p className="privacy-note">图片仅在当前浏览器处理，不会上传。</p>
    </section>
  </aside>
}
