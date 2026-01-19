import { Course, Lesson } from './course';

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  lesson?: Lesson;
  completed: boolean;
  watchedDuration: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  progress: number;
  enrolledAt: string;
  completedAt?: string | null;
  lessonProgress?: LessonProgress[];
}

export interface UpdateLessonProgressData {
  lessonId: string;
  watchedDuration: number;
  completed: boolean;
}
