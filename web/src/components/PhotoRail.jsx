import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Trash2, X } from 'lucide-react'

export function PhotoRail({ photos, selectedId, onSelect, onAdd, onRemove, onClear, onMove }) {
  return <aside className="photo-rail">
    <div className="rail-actions">
      <label className="button primary"><ImagePlus size={16}/>添加图片<input type="file" accept="image/*" multiple onChange={(e) => onAdd(e.target.files)}/></label>
      <button className="button" onClick={onRemove} disabled={!photos.length}><Trash2 size={15}/>移除</button>
      <button className="icon-button" aria-label="清空列表" title="清空列表" onClick={onClear} disabled={!photos.length}><X size={17}/></button>
    </div>
    <div className="rail-heading"><div><strong>图片列表</strong><span>{photos.length} / 6 张</span></div><div className="order-buttons">
      <button aria-label="上移" title="上移" onClick={() => onMove(-1)} disabled={!photos.length}><ArrowUp size={15}/></button>
      <button aria-label="下移" title="下移" onClick={() => onMove(1)} disabled={!photos.length}><ArrowDown size={15}/></button>
    </div></div>
    <div className="photo-list">
      {photos.map((photo, index) => <button key={photo.id} className={`photo-row ${selectedId === photo.id ? 'selected' : ''}`} onClick={() => onSelect(photo.id)}>
        <GripVertical size={15} className="grip"/><img src={photo.url} alt=""/><span className="photo-meta"><strong>{index + 1}. {photo.name}</strong><small>{photo.width} × {photo.height}</small></span>
      </button>)}
      {!photos.length && <div className="rail-empty">添加图片后可在这里调整顺序</div>}
    </div>
  </aside>
}
