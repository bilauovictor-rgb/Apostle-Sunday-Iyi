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
  Save,
  ChevronUp,
  ChevronDown,
  Eye
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { useDropzone } from 'react-dropzone';
import { db } from '../firebase';
import { uploadToCloudinary } from '../lib/cloudinary';

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
  public_id: string;
  order: number;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: any;
  updatedAt: any;
}

interface PendingUpload {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function StateGalleryManager() {
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Upload state
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [optimisticImages, setOptimisticImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', caption: '', featured: false });

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Safest possible query: filter by state only to avoid composite index requirements
    const q = query(
      collection(db, 'state_galleries'),
      where('state', '==', selectedState)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      
      // Sort in memory by order
      imageData.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setImages(imageData);
      setLoading(false);
      
      // Clear optimistic images that have now been confirmed by Firestore
      // We match by title and order as a heuristic
      setOptimisticImages(prev => prev.filter(opt => 
        !imageData.some(real => real.title === opt.title && Math.abs(real.order - opt.order) < 0.1)
      ));
      
      setError(null);
    }, (err) => {
      console.error("Firestore Gallery Error:", err);
      setError(`Failed to load gallery images: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedState]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }));
    setPendingUploads(prev => [...prev, ...newUploads]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    disabled: isUploading
  });

  const removePendingUpload = (index: number) => {
    setPendingUploads(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const startBulkUpload = async () => {
    if (pendingUploads.length === 0 || isUploading) return;
    
    setIsUploading(true);
    setError(null);
    
    const folder = `state-galleries/${selectedState.toLowerCase()}`;
    const baseOrder = images.length > 0 ? Math.max(...images.map(img => img.order || 0)) + 1 : 0;
    const uploadsToProcess = [...pendingUploads];
    
    // 1. Create Optimistic Entries for immediate UI feedback in the main list
    const newOptimistic = uploadsToProcess.map((upload, index) => ({
      id: `temp-${Date.now()}-${index}`,
      state: selectedState,
      title: upload.file.name.split('.')[0],
      caption: 'Uploading...',
      imageUrl: upload.preview,
      order: baseOrder + index,
      featured: false,
      status: 'active',
      isOptimistic: true,
      createdAt: null // Will be set by server
    }));

    setOptimisticImages(prev => [...prev, ...newOptimistic]);
    
    // Clear pending list immediately as they move to "Optimistic" state in the main grid
    setPendingUploads([]);

    // 2. Execute all uploads in parallel
    const uploadTasks = uploadsToProcess.map(async (upload, index) => {
      try {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(upload.file, folder);
        
        // Add to Firestore - onSnapshot will handle the update
        await addDoc(collection(db, 'state_galleries'), {
          state: selectedState,
          title: upload.file.name.split('.')[0],
          caption: '',
          imageUrl: result.secure_url,
          public_id: result.public_id,
          order: baseOrder + index,
          featured: false,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Cleanup local preview URL
        URL.revokeObjectURL(upload.preview);
      } catch (err: any) {
        console.error(`Upload failed for ${upload.file.name}:`, err);
        // Mark optimistic entry as failed
        setOptimisticImages(prev => prev.map(img => 
          img.id === newOptimistic[index].id ? { ...img, error: err.message, status: 'inactive' } : img
        ));
        setError(`Failed to upload ${upload.file.name}`);
      }
    });

    // Don't block the UI - let them run in background
    Promise.all(uploadTasks).finally(() => {
      setIsUploading(false);
    });
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm("Are you sure you want to delete this image? This will only remove the record from the website. The file will remain in Cloudinary.")) return;
    
    try {
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
    
    // Swap orders
    const currentOrder = currentImg.order ?? index;
    const targetOrder = targetImg.order ?? newIndex;
    
    batch.update(doc(db, 'state_galleries', currentImg.id), { 
      order: targetOrder,
      updatedAt: serverTimestamp()
    });
    batch.update(doc(db, 'state_galleries', targetImg.id), { 
      order: currentOrder,
      updatedAt: serverTimestamp()
    });
    
    try {
      await batch.commit();
    } catch (err) {
      console.error("Reorder error:", err);
      setError("Failed to reorder images.");
    }
  };

  const displayImages = [
    ...images,
    ...optimisticImages.filter(opt => 
      !images.some(real => real.title === opt.title && Math.abs(real.order - opt.order) < 0.1)
    )
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

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
      <div className="space-y-6 mb-12">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer
            ${isDragActive ? 'border-secondary bg-secondary/5' : 'border-slate-200 hover:border-secondary/50 hover:bg-slate-50'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-primary mb-2">
              Click or drag images to upload
            </h3>
            <p className="text-slate-500 font-light">Support JPG, PNG, WEBP. Max 10MB per image.</p>
          </div>
        </div>

        {/* Pending Uploads List */}
        <AnimatePresence>
          {pendingUploads.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-50 rounded-3xl p-6 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Pending Uploads ({pendingUploads.length})</h4>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setPendingUploads([])}
                    disabled={isUploading}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={startBulkUpload}
                    disabled={isUploading}
                    className="px-6 py-2 bg-secondary text-primary rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Start Upload'
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pendingUploads.map((upload, idx) => (
                  <motion.div 
                    key={idx}
                    layout
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-white"
                  >
                    <img src={upload.preview} alt="Preview" className="w-full h-full object-cover" />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                      upload.status === 'uploading' ? 'bg-black/40' : 
                      upload.status === 'success' ? 'bg-emerald-500/40' : 
                      upload.status === 'error' ? 'bg-red-500/40' : 
                      'bg-black/0 group-hover:bg-black/20'
                    }`}>
                      {upload.status === 'uploading' && <Loader2 className="w-6 h-6 text-white animate-spin" />}
                      {upload.status === 'success' && <Check className="w-8 h-8 text-white" />}
                      {upload.status === 'error' && <AlertCircle className="w-8 h-8 text-white" />}
                      
                      {upload.status === 'pending' && (
                        <button 
                          onClick={() => removePendingUpload(idx)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-white/90 text-red-500 rounded-full shadow-lg transition-all transform hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {upload.status === 'error' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-[10px] text-white p-1 text-center truncate">
                        {upload.error}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-serif text-primary">{displayImages.length} Images in {selectedState}</h4>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Manage Gallery</div>
        </div>

        {loading && images.length === 0 ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : displayImages.length === 0 ? (
          <div className="py-20 text-center border border-slate-100 rounded-[2rem] bg-slate-50">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-light">No images uploaded for {selectedState} yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {displayImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group bg-white border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all ${
                    image.isOptimistic ? 'border-secondary/30 bg-secondary/5' : 'border-slate-100 hover:shadow-md'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-40 aspect-video md:aspect-square rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className={`w-full h-full object-cover ${image.isOptimistic ? 'opacity-50' : ''}`}
                    />
                    {image.isOptimistic && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                      </div>
                    )}
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
                        <div className="flex items-center space-x-2">
                          <h5 className="text-lg font-serif text-primary truncate">{image.title}</h5>
                          {image.featured && <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Featured</span>}
                          {image.isOptimistic && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Uploading...</span>}
                        </div>
                        <p className="text-sm text-slate-500 font-light line-clamp-2">
                          {image.caption || (image.isOptimistic ? "Preparing image for ministry gallery..." : "No caption provided.")}
                        </p>
                        <div className="flex items-center space-x-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          <span>Order: {image.order}</span>
                          <span>•</span>
                          <span>{image.createdAt ? new Date(image.createdAt.toDate()).toLocaleDateString() : (image.isOptimistic ? 'Uploading...' : 'Just now')}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {image.isOptimistic ? (
                      <div className="text-xs text-slate-400 font-medium italic px-4">Processing...</div>
                    ) : editingId === image.id ? (
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
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-400 transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={index === images.length - 1}
                            onClick={() => moveImage(index, 'down')}
                            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-400 transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
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
