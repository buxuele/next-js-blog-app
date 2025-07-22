// 图片处理和优化工具函数

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata {
  src: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

// 支持的图片格式
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// 图片尺寸预设
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200 },
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 900 },
  hero: { width: 1920, height: 1080 },
} as const;

// 最大文件大小 (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // 检查文件类型
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as any)) {
    return {
      valid: false,
      error: `不支持的图片格式。支持的格式: ${SUPPORTED_IMAGE_FORMATS.join(
        ', '
      )}`,
    };
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `文件大小超过限制。最大允许 ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * 获取图片尺寸
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法读取图片尺寸'));
    };

    img.src = url;
  });
}

/**
 * 压缩图片
 */
export function compressImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 900,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(file);

    if (!ctx) {
      reject(new Error('无法创建 Canvas 上下文'));
      return;
    }

    img.onload = () => {
      URL.revokeObjectURL(url);

      // 计算新尺寸
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // 设置 canvas 尺寸
      canvas.width = width;
      canvas.height = height;

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法加载图片'));
    };

    img.src = url;
  });
}

/**
 * 生成图片的多个尺寸版本
 */
export async function generateImageVariants(
  file: File,
  variants: Array<{ name: string; width: number; height: number }>
): Promise<Array<{ name: string; file: File; dimensions: ImageDimensions }>> {
  const results = [];

  for (const variant of variants) {
    try {
      const compressedFile = await compressImage(
        file,
        variant.width,
        variant.height,
        0.8
      );

      const dimensions = await getImageDimensions(compressedFile);

      results.push({
        name: variant.name,
        file: compressedFile,
        dimensions,
      });
    } catch (error) {
      console.error(`生成 ${variant.name} 尺寸失败:`, error);
    }
  }

  return results;
}

/**
 * 创建图片预览 URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * 清理图片预览 URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * 从 URL 获取图片元数据
 */
export async function getImageMetadata(
  src: string
): Promise<Partial<ImageMetadata>> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: getImageFormatFromUrl(src),
      });
    };

    img.onerror = () => {
      resolve({ src });
    };

    img.src = src;
  });
}

/**
 * 从 URL 推断图片格式
 */
function getImageFormatFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

/**
 * 生成响应式图片的 srcSet
 */
export function generateSrcSet(
  baseSrc: string,
  variants: Array<{ width: number; suffix: string }>
): string {
  return variants
    .map(({ width, suffix }) => {
      const src = baseSrc.replace(/(\.[^.]+)$/, `${suffix}$1`);
      return `${src} ${width}w`;
    })
    .join(', ');
}

/**
 * 生成适合不同设备的 sizes 属性
 */
export function generateSizes(
  breakpoints: Array<{ maxWidth: string; size: string }>
): string {
  return breakpoints
    .map(({ maxWidth, size }) => `(max-width: ${maxWidth}) ${size}`)
    .join(', ');
}
