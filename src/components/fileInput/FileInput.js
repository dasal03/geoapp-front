import React, { useRef } from "react";
import "./FileInput.css";

export const FileInput = ({ setValue, accept, value }) => {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue((prev) => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setValue((prev) => ({ ...prev, image: null }));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="file-upload-container file-input">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
      />
      {value.image && (
        <button className="remove-image-btn" onClick={handleRemoveImage}>
          x
        </button>
      )}
    </div>
  );
};
