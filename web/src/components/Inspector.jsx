import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Download, LocateFixed, Minus, Plus } from 'lucide-react'
import { getTemplates } from '../geometry.js'

const ratios = ['3:4', '1:1', '9:16', '2:3', '4:3', '3:2', '16:9']

function TemplateIcon({ template }) {
  return <svg viewBox="0 0 54 54" aria-hidden="true">{template.cells.map((cell, i) => <rect key={i} x={2 + cell.x * 50} y={2 + cell.y * 50} width={Math.max(2, cell.width * 50 - 2)} height={Math.max(2, cell.height * 50 - 2)} rx="2"/>)}</svg>
}

export function Inspector({ photos, selected, settings, templateId, onSettings, onTemplate, onNudge, onZoom, onSetZoom, onReset, onCaption, onExport, exporting }) {
  const templates = getTemplates(photos.length || 1)
  const selectedZoom = selected?.zoom || 1
  return <aside className="inspector">
    <div className="panel-heading inspector-heading"><div><h2>设置</h2><p>实时预览所有调整</p></div></div>
    <section><div className="section-title"><h3>画布比例</h3><span>{settings.ratio}</span></div><div className="ratio-grid">{ratios.map((ratio) => <button key={ratio} className={settings.ratio === ratio ? 'active' : ''} aria-pressed={settings.ratio === ratio} onClick={() => onSettings('ratio', ratio)}>{ratio}</button>)}</div></section>
    <section><div className="section-title"><h3>拼图布局</h3><span>{photos.length || 1} 图</span></div><div className="template-grid">{templates.map((item) => <button key={item.id} className={templateId === item.id ? 'active' : ''} aria-pressed={templateId === item.id} title={item.name} onClick={() => onTemplate(item.id)}><TemplateIcon template={item}/><span>{item.name}</span></button>)}</div></section>
    <section className="sliders"><div className="section-title"><h3>间隙与圆角</h3><span>平滑边缘</span></div>
      <label><span>间隙</span><input type="range" min="0" max="80" value={settings.gap} onChange={(e) => onSettings('gap', Number(e.target.value))}/><output>{settings.gap} px</output></label>
      <label><span>圆角</span><input type="range" min="0" max="80" value={settings.radius} onChange={(e) => onSettings('radius', Number(e.target.value))}/><output>{settings.radius} px</output></label>
      <label className="color-row"><span>背景颜色</span><input type="color" value={settings.background} onChange={(e) => onSettings('background', e.target.value)}/><code>{settings.background.toUpperCase()}</code></label>
    </section>
    <section><div className="section-title"><h3>单张图片缩放</h3><span>{selected ? `${Math.round(selectedZoom * 100)}%` : '未选择'}</span></div>
      <div className="zoom-controls">
        <button aria-label="缩小当前图片" disabled={!selected} onClick={() => onZoom(-.1)}><Minus size={15}/></button>
        <input aria-label="当前图片缩放" type="range" min="50" max="300" step="5" value={Math.round(selectedZoom * 100)} disabled={!selected} onChange={(e) => onSetZoom(Number(e.target.value) / 100)}/>
        <button aria-label="放大当前图片" disabled={!selected} onClick={() => onZoom(.1)}><Plus size={15}/></button>
      </div>
    </section>
    <section><div className="section-title"><h3>图片位置</h3><span>{selected ? selected.name : '未选择'}</span></div><div className="position-controls">
      <div className="dpad"><button aria-label="上移图片" onClick={() => onNudge(0, -.1)}><ArrowUp/></button><button aria-label="左移图片" onClick={() => onNudge(-.1, 0)}><ArrowLeft/></button><button aria-label="图片居中" onClick={onReset}><LocateFixed/></button><button aria-label="右移图片" onClick={() => onNudge(.1, 0)}><ArrowRight/></button><button aria-label="下移图片" onClick={() => onNudge(0, .1)}><ArrowDown/></button></div>
      <div className="position-readout"><span>水平</span><strong>{Math.round((selected?.offsetX || 0) * 100)}%</strong><span>垂直</span><strong>{Math.round((selected?.offsetY || 0) * 100)}%</strong></div>
    </div></section>
    <section><div className="section-title"><h3>图片文字</h3><span>左下角</span></div>
      <label className="toggle-row">
        <span className="toggle-copy"><strong>显示文字说明</strong><small>仅应用到当前图片</small></span>
        <input aria-label="显示当前图片文字" type="checkbox" checked={selected?.captionEnabled || false} disabled={!selected} onChange={(e) => onCaption('captionEnabled', e.target.checked)}/><span className="switch-track" aria-hidden="true"/>
      </label>
      <label className="caption-field"><span>文字内容</span><input aria-label="当前图片说明文字" type="text" maxLength="40" value={selected?.caption || ''} disabled={!selected || !selected.captionEnabled} onChange={(e) => onCaption('caption', e.target.value)}/></label>
      <label className="toggle-row compact">
        <span className="toggle-copy"><strong>白色背景</strong><small>关闭后显示白色文字</small></span>
        <input aria-label="当前图片文字白色背景" type="checkbox" checked={selected?.captionBackground !== false} disabled={!selected || !selected.captionEnabled} onChange={(e) => onCaption('captionBackground', e.target.checked)}/><span className="switch-track" aria-hidden="true"/>
      </label>
    </section>
    <section><h3>导出设置</h3><div className="export-grid"><label>输出尺寸<select value={settings.longEdge} onChange={(e) => onSettings('longEdge', Number(e.target.value))}>{[1600, 2400, 3200, 4096].map((size) => <option key={size} value={size}>长边 {size} px</option>)}</select></label><label>输出格式<select value={settings.format} onChange={(e) => onSettings('format', e.target.value)}><option>PNG</option><option>JPG</option><option>WebP</option></select></label></div>
      <button className="download-button" disabled={!photos.length || exporting} onClick={onExport}><Download size={18}/>{exporting ? '正在生成…' : '下载拼图'}</button><p className="privacy-note">图片仅在当前浏览器处理，不会上传。</p>
    </section>
  </aside>
}
