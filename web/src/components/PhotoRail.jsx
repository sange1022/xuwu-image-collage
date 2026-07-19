import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Trash2, X } from 'lucide-react'

export function PhotoRail({ photos, selectedId, onSelect, onAdd, onRemove, onClear, onMove }) {
  return <aside className="photo-rail">
    <div className="panel-heading"><div><h2>图片</h2><p>选择一张图片进行单独调整</p></div><span>{photos.length} / 6</span></div>
    <div className="rail-actions">
      <label className="button primary"><ImagePlus size={16}/>添加图片<input type="file" accept="image/*" multiple onChange={(e) => onAdd(e.target.files)}/></label>
      <button className="button" onClick={onRemove} disabled={!photos.length}><Trash2 size={15}/>移除</button>
      <button className="icon-button" aria-label="清空列表" title="清空列表" onClick={onClear} disabled={!photos.length}><X size={17}/></button>
    </div>
    <div className="rail-heading"><div><strong>图片顺序</strong><span>点击选中</span></div><div className="order-buttons">
      <button aria-label="上移" title="上移" onClick={() => onMove(-1)} disabled={!photos.length}><ArrowUp size={15}/></button>
      <button aria-label="下移" title="下移" onClick={() => onMove(1)} disabled={!photos.length}><ArrowDown size={15}/></button>
    </div></div>
    <div className="photo-list">
      {photos.map((photo, index) => <button key={photo.id} className={`photo-row ${selectedId === photo.id ? 'selected' : ''}`} onClick={() => onSelect(photo.id)}>
        <GripVertical size={15} className="grip"/><img src={photo.url} alt=""/><span className="photo-meta"><strong>{index + 1}. {photo.name}</strong><small>{photo.width} × {photo.height}</small></span>
      </button>)}
      {!photos.length && <label className="rail-empty"><ImagePlus size={30}/><strong>添加图片开始拼图</strong><span>支持 JPG、PNG、WebP</span><input type="file" accept="image/*" multiple onChange={(e) => onAdd(e.target.files)}/></label>}
    </div>
  </aside>
}
