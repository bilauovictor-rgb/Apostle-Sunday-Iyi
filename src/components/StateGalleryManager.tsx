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
    <div className="bg-white/[0.02] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/5 backdrop-blur-md">
      <div className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-serif text-white mb-1">Gallery <span className="gold-gradient-text italic">Manager</span></h2>
          <p className="text-slate-400 font-light text-sm">Curate and organize ministry moments across states.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select 
              id="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none pl-5 pr-12 py-3 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 outline-none text-slate-200 text-sm font-medium transition-all cursor-pointer"
            >
              {STATES.map(state => (
                <option key={state} value={state} className="bg-primary text-white">{state}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-secondary transition-colors">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start text-red-400">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center text-emerald-400">
          <Check className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Upload Area - Redesigned */}
      <div className="space-y-6 mb-12">
        <div 
          {...getRootProps()} 
          className={`group relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer overflow-hidden
            ${isDragActive ? 'border-secondary bg-secondary/5' : 'border-white/10 hover:border-secondary/30 hover:bg-white/[0.02]'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 border border-secondary/20 group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif text-white mb-1">
              {isDragActive ? 'Release to upload moments' : 'Upload Ministry Moments'}
            </h3>
            <p className="text-slate-500 font-light text-sm max-w-xs mx-auto">
              Drag and drop images here, or click to browse. <span className="text-secondary/60">JPG, PNG, WEBP (Max 10MB)</span>
            </p>
          </div>
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Pending Uploads List - Redesigned */}
        <AnimatePresence>
          {pendingUploads.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.03] rounded-[2rem] p-6 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Queue: {pendingUploads.length} Assets</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setPendingUploads([])}
                    disabled={isUploading}
                    className="text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={startBulkUpload}
                    disabled={isUploading}
                    className="px-6 py-2.5 bg-secondary text-primary rounded-xl text-xs font-bold shadow-xl hover:shadow-secondary/20 transition-all disabled:opacity-50 flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Deploy to Gallery'
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {pendingUploads.map((upload, idx) => (
                  <motion.div 
                    key={idx}
                    layout
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-primary/40"
                  >
                    <img src={upload.preview} alt="Preview" className="w-full h-full object-cover" />
                    
                    <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                      upload.status === 'uploading' ? 'bg-black/60' : 
                      upload.status === 'success' ? 'bg-emerald-500/40' : 
                      upload.status === 'error' ? 'bg-red-500/40' : 
                      'bg-black/0 group-hover:bg-black/40'
                    }`}>
                      {upload.status === 'uploading' && <Loader2 className="w-5 h-5 text-secondary animate-spin" />}
                      {upload.status === 'success' && <Check className="w-6 h-6 text-emerald-400" />}
                      {upload.status === 'error' && <AlertCircle className="w-6 h-6 text-red-400" />}
                      
                      {upload.status === 'pending' && (
                        <button 
                          onClick={() => removePendingUpload(idx)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-lg shadow-xl transition-all transform hover:scale-110"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Grid - Redesigned into Compact Media Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">{displayImages.length} Assets in {selectedState}</h4>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <Eye className="w-3 h-3" />
            Live Preview
          </div>
        </div>

        {loading && images.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-secondary/40" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Synchronizing...</span>
          </div>
        ) : displayImages.length === 0 ? (
          <div className="py-20 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.01]">
            <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 font-light text-sm italic">The gallery for {selectedState} is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {displayImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative bg-white/[0.02] border rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-5 transition-all duration-500 ${
                    image.isOptimistic ? 'border-secondary/30 bg-secondary/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-2xl'
                  }`}
                >
                  {/* Thumbnail - Compact */}
                  <div className="relative w-full sm:w-24 aspect-video sm:aspect-square rounded-xl overflow-hidden flex-shrink-0 border border-white/5 shadow-lg">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${image.isOptimistic ? 'opacity-40 blur-[2px]' : ''}`}
                    />
                    {image.isOptimistic && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                      </div>
                    )}
                    {image.featured && (
                      <div className="absolute top-1.5 right-1.5 bg-secondary text-primary p-1 rounded-md shadow-xl z-10">
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Details - Compact & Refined */}
                  <div className="flex-grow min-w-0 space-y-1 text-center sm:text-left">
                    {editingId === image.id ? (
                      <div className="grid grid-cols-1 gap-2 pr-4">
                        <input 
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 focus:border-secondary/50 outline-none text-xs text-white"
                          placeholder="Title"
                        />
                        <input 
                          type="text"
                          value={editForm.caption}
                          onChange={(e) => setEditForm({...editForm, caption: e.target.value})}
                          className="w-full bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 focus:border-secondary/50 outline-none text-xs text-slate-300"
                          placeholder="Caption"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h5 className="text-sm font-serif text-white truncate max-w-[200px]">{image.title}</h5>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            {image.featured && <span className="text-[8px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Featured</span>}
                            {image.isOptimistic && <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">Syncing</span>}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-light line-clamp-1 italic">
                          {image.caption || "No description provided."}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start space-x-3 text-[9px] text-slate-600 font-bold uppercase tracking-[0.15em]">
                          <span className="flex items-center gap-1"><GripVertical className="w-2.5 h-2.5" /> Pos: {image.order}</span>
                          <span>•</span>
                          <span>{image.createdAt ? new Date(image.createdAt.toDate()).toLocaleDateString() : 'Pending'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions - Elegant & Compact */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
                    {image.isOptimistic ? (
                      <div className="px-4 py-1.5">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                      </div>
                    ) : editingId === image.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(image.id)}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-0.5 px-1 border-r border-white/5 mr-1">
                          <button 
                            disabled={index === 0}
                            onClick={() => moveImage(index, 'up')}
                            className="p-0.5 rounded hover:bg-white/5 disabled:opacity-10 text-slate-600 hover:text-secondary transition-colors"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button 
                            disabled={index === images.length - 1}
                            onClick={() => moveImage(index, 'down')}
                            className="p-0.5 rounded hover:bg-white/5 disabled:opacity-10 text-slate-600 hover:text-secondary transition-colors"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => toggleFeatured(image)}
                          className={`p-2 rounded-lg transition-all ${image.featured ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'text-slate-500 hover:text-secondary hover:bg-white/5'}`}
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${image.featured ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button 
                          onClick={() => startEditing(image)}
                          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(image)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
