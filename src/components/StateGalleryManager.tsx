import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  GripVertical,
  Star,
  Edit2,
  Save
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { useDropzone } from 'react-dropzone';
import { db, storage } from '../firebase';

const STATES = [
  'Enugu', 'Ebonyi', 'Anambra', 'Benin', 'Akure', 'Ogun', 
  'Ekiti', 'Delta', 'Ore', 'Sabo', 'Akoko', 'Shagamu'
];

interface GalleryImage {
  id: string;
  state: string;
  title: string;
  caption: string;
  imageUrl: string;
  storagePath: string;
  order: number;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: any;
}

export default function StateGalleryManager() {
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', caption: '', featured: false });

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'state_galleries'),
      where('state', '==', selectedState),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setImages(imageData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching gallery:", err);
      setError("Failed to load gallery images.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedState]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setUploadStatus({ current: 0, total: acceptedFiles.length });
    setUploadProgress(0);
    setError(null);
    
    const uploadPromises = acceptedFiles.map(async (file, index) => {
      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storagePath = `state-galleries/${selectedState.toLowerCase()}/${fileName}`;
        const storageRef = ref(storage, storagePath);
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              // We could track individual progress here if we wanted a more complex UI
              // For now, we'll just update the global status when a file finishes
            }, 
            (error) => reject(error), 
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                await addDoc(collection(db, 'state_galleries'), {
                  state: selectedState,
                  title: file.name.split('.')[0],
                  caption: '',
                  imageUrl: downloadURL,
                  storagePath: storagePath,
                  order: images.length + index, // Approximate order for bulk upload
                  featured: false,
                  status: 'active',
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });
                
                setUploadStatus(prev => {
                  const nextCurrent = prev.current + 1;
                  setUploadProgress((nextCurrent / acceptedFiles.length) * 100);
                  return { ...prev, current: nextCurrent };
                });
                resolve(true);
              } catch (e) {
                reject(e);
              }
            }
          );
        });
      } catch (err: any) {
        throw new Error(`Failed to upload ${file.name}: ${err.message}`);
      }
    });

    try {
      await Promise.all(uploadPromises);
      setSuccess(`${acceptedFiles.length} images uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Bulk upload error:", err);
      let errorMessage = err.message || "Some images failed to upload.";
      
      if (err.code === 'storage/retry-limit-exceeded') {
        errorMessage = `Upload failed: Max retry time exceeded. Check CORS and Storage Bucket settings.`;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
      setUploadStatus({ current: 0, total: 0 });
      setUploadProgress(0);
    }
  }, [selectedState, images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  });

  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      // 1. Delete from Storage
      const storageRef = ref(storage, image.storagePath);
      await deleteObject(storageRef);
      
      // 2. Delete from Firestore
      await deleteDoc(doc(db, 'state_galleries', image.id));
      
      setSuccess("Image deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Delete error:", err);
      setError("Failed to delete image: " + err.message);
    }
  };

  const startEditing = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditForm({
      title: image.title,
      caption: image.caption,
      featured: image.featured
    });
  };

  const saveEdit = async (id: string) => {
    try {
      await updateDoc(doc(db, 'state_galleries', id), {
        ...editForm,
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
      setSuccess("Image details updated.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError("Failed to update image.");
    }
  };

  const toggleFeatured = async (image: GalleryImage) => {
    try {
      await updateDoc(doc(db, 'state_galleries', image.id), {
        featured: !image.featured,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError("Failed to update featured status.");
    }
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    
    const batch = writeBatch(db);
    const currentImg = images[index];
    const targetImg = images[newIndex];
    
    batch.update(doc(db, 'state_galleries', currentImg.id), { order: newIndex });
    batch.update(doc(db, 'state_galleries', targetImg.id), { order: index });
    
    try {
      await batch.commit();
    } catch (err) {
      setError("Failed to reorder images.");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-slate-100">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif text-primary mb-2">State Gallery Manager</h2>
          <p className="text-slate-500 font-light">Upload and manage ministry moments for each state.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label htmlFor="state-select" className="text-sm font-medium text-slate-700">Select State:</label>
          <select 
            id="state-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary outline-none text-slate-800 bg-white"
          >
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start text-red-600">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center text-emerald-700">
          <Check className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`mb-12 border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer
          ${isDragActive ? 'border-secondary bg-secondary/5' : 'border-slate-200 hover:border-secondary/50 hover:bg-slate-50'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-serif text-primary mb-2">
            {uploading 
              ? `Uploading ${uploadStatus.current} of ${uploadStatus.total} images...` 
              : 'Click or drag images to upload'}
          </h3>
          <p className="text-slate-500 font-light">Support JPG, PNG, WEBP. Max 5MB per image.</p>
        </div>
        
        {uploading && (
          <div className="mt-6 w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-secondary h-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-serif text-primary">{images.length} Images in {selectedState}</h4>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Sort by Order</div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center border border-slate-100 rounded-[2rem] bg-slate-50">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-light">No images uploaded for {selectedState} yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-40 aspect-video md:aspect-square rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className="w-full h-full object-cover"
                    />
                    {image.featured && (
                      <div className="absolute top-2 right-2 bg-secondary text-primary p-1 rounded-lg shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0 space-y-2">
                    {editingId === image.id ? (
                      <div className="space-y-3">
                        <input 
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-secondary outline-none text-sm"
                          placeholder="Image Title"
                        />
                        <textarea 
                          value={editForm.caption}
                          onChange={(e) => setEditForm({...editForm, caption: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-secondary outline-none text-sm resize-none"
                          placeholder="Caption (optional)"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <>
                        <h5 className="text-lg font-serif text-primary truncate">{image.title}</h5>
                        <p className="text-sm text-slate-500 font-light line-clamp-2">
                          {image.caption || "No caption provided."}
                        </p>
                        <div className="flex items-center space-x-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          <span>Order: {image.order}</span>
                          <span>•</span>
                          <span>{new Date(image.createdAt?.toDate()).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {editingId === image.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(image.id)}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          title="Save Changes"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col space-y-1 mr-2">
                          <button 
                            disabled={index === 0}
                            onClick={() => moveImage(index, 'up')}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-400"
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </button>
                          <button 
                            disabled={index === images.length - 1}
                            onClick={() => moveImage(index, 'down')}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-400"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => toggleFeatured(image)}
                          className={`p-2 rounded-xl transition-colors ${image.featured ? 'bg-secondary/20 text-secondary' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          title={image.featured ? "Remove from Featured" : "Mark as Featured"}
                        >
                          <Star className={`w-5 h-5 ${image.featured ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button 
                          onClick={() => startEditing(image)}
                          className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(image)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Image"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
