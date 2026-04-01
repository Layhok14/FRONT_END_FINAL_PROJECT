import { UploadIcon } from './Icons'

function readFileAsDataUrl(file, onLoad) {
  const reader = new FileReader()
  reader.onload = () => onLoad(reader.result)
  reader.readAsDataURL(file)
}

export default function ImageUploadField({
  label,
  imageUrl,
  uploadText = 'Upload image',
  helper = 'Image slot ready for upload',
  onChange,
  compact = false,
}) {
  return (
    <label className={`image-upload ${compact ? 'compact' : ''}`}>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          readFileAsDataUrl(file, onChange)
        }}
      />
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="uploaded-image" />
      ) : (
        <div className="image-placeholder">
          <UploadIcon />
          <span>{uploadText}</span>
          <small>{helper}</small>
        </div>
      )}
    </label>
  )
}
