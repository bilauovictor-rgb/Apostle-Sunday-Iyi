const CLOUDINARY_UPLOAD_PRESET = 'state_gallery_upload';
const CLOUDINARY_CLOUD_NAME = 'dg5zoqaxo';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export async function uploadToCloudinary(
  file: File, 
  folder: string
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Cloudinary upload failed');
  }

  return response.json();
}
