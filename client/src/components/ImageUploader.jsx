import { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setImageUrl(res.data.secure_url); // ✅ Store image URL
      setLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Upload an Image</h3>
      <input type="file" onChange={handleUpload} accept="image/*" />
      {loading && <p>Uploading...</p>}
      {imageUrl && (
        <>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ width: '200px' }} />
        </>
      )}
    </div>
  );
}

export default ImageUploader;
