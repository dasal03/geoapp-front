import "./FileInput.css";

export const FileInput = ({ setValue, accept, value }) => {
  const handleChange = (event) => {
    const file = event.target.files[0];
    setValue((prev) => ({ ...prev, image: file }));
  };

  const handleRemoveImage = () => {
    setValue((prev) => ({ ...prev, image: null }));
  };

  return (
    <div className="file-upload-container file-input">
      <input
        type="file"
        onChange={handleChange}
        accept={accept}
        value={value.value}
      />
      {value.image && (
        <button className="remove-image-btn" onClick={handleRemoveImage}>
          x
        </button>
      )}
    </div>
  );
};
