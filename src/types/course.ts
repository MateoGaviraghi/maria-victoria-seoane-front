export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  duration?: number;
  order: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  thumbnailUrl?: string | null;
  previewVideoUrl?: string | null;
  duration?: number | null;
  level?: string | null;
  language: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  categories?: Category[];
  modules?: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  duration?: number;
  level?: string;
  language?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
  categoryIds?: string[];
}

export interface UpdateCourseData {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  price?: number;
  discountPrice?: number;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  duration?: number;
  level?: string;
  language?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
  categoryIds?: string[];
}
