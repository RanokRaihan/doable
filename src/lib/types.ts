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
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING_REVIEW: "PENDING_REVIEW",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
  COMPLETED: "COMPLETED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  DISPUTED: "DISPUTED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  REFUNDED: "REFUNDED",
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

// Applicant info embedded in task owner's application list
export interface TaskApplicant {
  id: string;
  name: string;
}

// Full application shape returned by GET /application/task/:taskId (owner view)
export interface TaskApplicationDetail {
  id: string;
  message: string;
  proposedCompensation: string;
  status: ApplicationStatusType;
  withdrawalReason: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  applicant: TaskApplicant;
}

// Paginated response from GET /application/task/:taskId
export interface TaskApplicationsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: TaskApplicationDetail[];
  timestamp: string;
  meta: PaginationMeta;
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

// Minimal application shape (owner sees list of applicants)
export interface TaskApplication {
  id: string;
  status: string;
  applicantId: string;
  createdAt: string;
}

// Application status
export const ApplicationStatus = {
  PENDING:   "PENDING",
  APPROVED:  "APPROVED",
  REJECTED:  "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;
export type ApplicationStatusType = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

// Sort fields supported by GET /application/my-applications
export type ApplicationSortField = "createdAt" | "updatedAt" | "proposedCompensation" | "status";

// Embedded task shape returned in /application/my-applications
export interface ApplicationTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatusType;
  postedById: string;
}

// Full application shape returned by GET /application/my-applications
export interface MyApplication {
  id: string;
  message: string;
  proposedCompensation: string;
  status: ApplicationStatusType;
  createdAt: string;
  updatedAt: string;
  task: ApplicationTask;
}

// Full application detail returned by GET /application/:applicationId
export interface ApplicationDetails {
  id: string;
  message: string;
  proposedCompensation: string;
  applicantId: string;
  taskId: string;
  status: ApplicationStatusType;
  rejectionReason: string | null;
  withdrawalReason: string | null;
  createdAt: string;
  updatedAt: string;
  task: {
    id: string;
    title: string;
    description: string;
    status: TaskStatusType;
    postedById: string;
    postedBy: { id: string; name: string; image: string | null };
  };
  applicant: { id: string; name: string; image: string | null };
}

// Paginated response from GET /application/my-applications
export interface ApplicationsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: MyApplication[];
  timestamp: string;
  meta: PaginationMeta;
}

// Task as returned by GET /task/my-posted-task/:id (owner view)
export interface MyPostedTask extends Task {
  postedById: string;
  agreedCompensation: string | null;
  approvedApplicationId: string | null;
  applications: TaskApplication[];
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

// Payment Method
export const PaymentMethod = {
  ONLINE: "ONLINE",
  CASH: "CASH",
} as const;
export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Payment Status
export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// Cash Payment Status
export const CashStatus = {
  PAYER_CLAIMED: "PAYER_CLAIMED",
  PAYEE_CONFIRMED: "PAYEE_CONFIRMED",
  PAYEE_DISPUTED: "PAYEE_DISPUTED",
  ADMIN_VERIFIED: "ADMIN_VERIFIED",
} as const;
export type CashStatusType = (typeof CashStatus)[keyof typeof CashStatus];

// Response shape for POST /payment/cash/init/:taskId
export interface CashPaymentInitData {
  id: string;
  transactionId: string;
  amount: string;
  method: "CASH";
  status: PaymentStatusType;
  cashStatus: CashStatusType;
}

// Response shape for POST /payment/online/init/:taskId
export interface OnlinePaymentInitData {
  payment: {
    id: string;
    transactionId: string;
    sessionToken: string;
    amount: string;
    method: PaymentMethodType;
    status: PaymentStatusType;
    sessionExpiresAt: string;
    gatewayResponse: unknown;
  };
  gatewayUrl: string;
  message: string;
  isExisting: boolean;
}
