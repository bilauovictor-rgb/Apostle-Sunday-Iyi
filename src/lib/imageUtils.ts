/**
 * Shared Image Optimization Utilities
 * Bridges the "discovery delay" by ensuring all URLs are correctly formatted
 * for Cloudinary and Unsplash CDNs with auto-format and auto-quality.
 */

export const optimizeCloudinaryUrl = (url: string, options: { 
  width?: number; 
  height?: number; 
  crop?: string; 
  blur?: number; 
  quality?: number | 'auto'; 
  lqip?: boolean 
} = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const transforms = ['f_auto'];
  
  if (options.lqip) {
    // Lightweight Low-Quality Image Placeholder (LQIP)
    transforms.push('w_50', 'e_blur:1000', 'q_10');
  } else {
    transforms.push(`q_${options.quality || 'auto'}`);
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop},g_auto`);
    if (options.blur) transforms.push(`e_blur:${options.blur}`);
  }
  
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
};

export const optimizeUnsplashUrl = (url: string, options: { 
  width?: number; 
  quality?: number; 
  format?: string 
} = {}) => {
  if (!url || !url.includes('unsplash.com')) return url;
  
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  
  params.set('auto', 'format,compress');
  params.set('q', (options.quality || 70).toString());
  if (options.width) params.set('w', options.width.toString());
  if (options.format) params.set('fm', options.format);
  
  return `${baseUrl}?${params.toString()}`;
};
