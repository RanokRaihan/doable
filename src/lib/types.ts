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
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
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
  hasApplied: boolean; // Whether current user has applied
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
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;
export type ApplicationStatusType =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

// Sort fields supported by GET /application/my-applications
export type ApplicationSortField =
  | "createdAt"
  | "updatedAt"
  | "proposedCompensation"
  | "status";

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
    payments?: TaskPaymentRecord[];
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

// Payment record embedded in task responses
export interface TaskPaymentRecord {
  id: string;
  transactionId: string;
  taskId?: string;
  amount: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  cashStatus: CashStatusType | null;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  posterConfirmedAt?: string | null;
  payeeConfirmedAt?: string | null;
  createdAt: string;
}

// Task as returned by GET /task/my-posted-task/:id (owner view)
export interface MyPostedTask extends Task {
  postedById: string;
  agreedCompensation: string | null;
  approvedApplicationId: string | null;
  applications: TaskApplication[];
  payments: TaskPaymentRecord[];
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
export type PaymentMethodType =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Payment Status
export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatusType =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

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

// Commission Due Status
export const CommissionDueStatus = {
  DUE: "DUE",
  PAID: "PAID",
} as const;
export type CommissionDueStatusType =
  (typeof CommissionDueStatus)[keyof typeof CommissionDueStatus];

export type CommissionDueSortField = "amount" | "createdAt" | "updatedAt";

export interface CommissionDue {
  id: string;
  walletId: string;
  taskId: string;
  amount: string;
  status: CommissionDueStatusType;
  paidAt: string | null;
  paidViaPayment: string | null;
  paidViaTxn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionDueDetail extends CommissionDue {
  wallet: {
    id: string;
    userId: string;
    balance: string;
    updatedAt: string;
    createdAt: string;
  };
  task: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    baseCompensation: string;
    agreedCompensation: string;
    postedBy: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface CommissionsDueListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    data: CommissionDue[];
    meta: PaginationMeta;
  };
  timestamp: string;
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

// Wallet Transaction Type
export const WalletTransactionType = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
} as const;
export type WalletTransactionTypeType =
  (typeof WalletTransactionType)[keyof typeof WalletTransactionType];

// Wallet Transaction Category
export const WalletTransactionCategory = {
  TASK_PAYMENT: "TASK_PAYMENT",
  DIRECT_COMMISSION_DEDUCTION: "DIRECT_COMMISSION_DEDUCTION",
  COMMISSION_PAYMENT: "COMMISSION_PAYMENT",
  WITHDRAWAL: "WITHDRAWAL",
  REFUND: "REFUND",
  ADJUSTMENT: "ADJUSTMENT",
} as const;
export type WalletTransactionCategoryType =
  (typeof WalletTransactionCategory)[keyof typeof WalletTransactionCategory];

// Wallet Transaction Status
export const WalletTransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REVERSED: "REVERSED",
} as const;
export type WalletTransactionStatusType =
  (typeof WalletTransactionStatus)[keyof typeof WalletTransactionStatus];

export type WalletTransactionSortField = "createdAt" | "amount";

export interface Wallet {
  id: string;
  userId: string;
  balance: string;
  updatedAt: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface MyWalletResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Wallet;
  timestamp: string;
}

export interface WalletTransaction {
  id: string;
  transactionId: string;
  walletId: string;
  amount: string;
  type: WalletTransactionTypeType;
  category: WalletTransactionCategoryType;
  status: WalletTransactionStatusType;
  refPaymentId: string | null;
  refCommissionDueId: string | null;
  description: string;
  metadata: unknown;
  balanceBefore: string;
  balanceAfter: string;
  createdAt: string;
}

export interface WalletTransactionDetail extends WalletTransaction {
  wallet: {
    id: string;
    userId: string;
    balance: string;
    updatedAt: string;
    createdAt: string;
  };
}

export interface WalletTransactionsListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    data: WalletTransaction[];
    meta: PaginationMeta;
  };
  timestamp: string;
}

export interface WalletTransactionDetailResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: WalletTransactionDetail;
  timestamp: string;
}

// Payment list & detail types
export type PaymentSortField = "amount" | "createdAt" | "updatedAt";

export interface PaymentMadeItem {
  id: string;
  transactionId: string;
  amount: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  cashStatus: CashStatusType | null;
  paidAt: string | null;
  createdAt: string;
  payee: { id: string; name: string; email: string };
  taskId: string;
}

export interface PaymentReceivedItem {
  id: string;
  transactionId: string;
  amount: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  cashStatus: CashStatusType | null;
  paidAt: string | null;
  createdAt: string;
  payer: { id: string; name: string; email: string };
  commissionAmount: string;
  commissionDeducted: boolean;
  taskId: string;
}

export interface PaymentDetail {
  id: string;
  transactionId: string;
  amount: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  cashStatus: CashStatusType | null;
  paidAt: string | null;
  createdAt: string;
  failedAt: string | null;
  failureReason: string | null;
  commissionAmount: string;
  commissionDeducted: boolean;
  task: { title: string; category: string; location: string; status: string };
  payer: { id: string; name: string; email: string };
  payee: { id: string; name: string; email: string };
}

export interface PaymentsMadeListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: { data: PaymentMadeItem[]; meta: PaginationMeta };
}

export interface PaymentsReceivedListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: { data: PaymentReceivedItem[]; meta: PaginationMeta };
}

// Response shape for GET /payment/session/:sessionToken
export interface PaymentSessionDetail {
  id: string;
  transactionId: string;
  sessionToken: string;
  amount: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  cashStatus: CashStatusType | null;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  sessionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  task: {
    id: string;
    title: string;
    category: string;
    status: string;
  } | null;
  payer: {
    id: string;
    name: string;
    email: string;
  } | null;
  payee: {
    id: string;
    name: string;
    email: string;
  } | null;
}
