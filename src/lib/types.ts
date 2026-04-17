// Task Priority Enum
export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority];

// Task Category Enum
export const TaskCategory = {
  DELIVERY: "DELIVERY",
  CLEANING: "CLEANING",
  REPAIR: "REPAIR",
  TUTORING: "TUTORING",
  GARDENING: "GARDENING",
  MOVING: "MOVING",
  PET_CARE: "PET_CARE",
  TECH_SUPPORT: "TECH_SUPPORT",
  OTHER: "OTHER",
} as const;

export type TaskCategoryType = (typeof TaskCategory)[keyof typeof TaskCategory];

// Task Status
export const TaskStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

// Task Image (returned by task details endpoint)
export interface TaskImage {
  id: string;
  url: string;
  altText: string | null;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

// Task Interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategoryType;
  priority: TaskPriorityType;
  status: TaskStatusType;
  location: string;
  latitude?: number;
  longitude?: number;
  baseCompensation: string;
  scheduledAt: string;
  estimatedDuration?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  images: TaskImage[];
}

// User info for task poster
export interface TaskPoster {
  id: string;
  name: string;
  image: string | null;
}

// Extended Task with poster info (for details page)
export interface TaskDetails extends Task {
  postedById: string;
  postedBy: TaskPoster;
}

// Single Task API Response
export interface TaskDetailsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: TaskDetails;
  timestamp: string;
}

// Pagination Meta
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API Response
export interface TasksResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Task[];
  timestamp: string;
  meta: PaginationMeta;
}

// Task returned by POST /task/post-task
export interface CreatedTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategoryType;
  priority: TaskPriorityType;
  status: TaskStatusType;
  location: string;
  latitude: number | null;
  longitude: number | null;
  baseCompensation: string;
  scheduledAt: string;
  estimatedDuration: number | null;
  expiresAt: string | null;
  postedById: string;
  createdAt: string;
  updatedAt: string;
}

// Sort Options
export type SortField = "createdAt" | "updatedAt" | "title";
export type SortOrder = "asc" | "desc";

// Filter State
export interface FilterState {
  categories: TaskCategoryType[];
  priorities: TaskPriorityType[];
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}
