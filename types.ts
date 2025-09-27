
export type UserRole = 'Business/Admin' | 'Client/Partner';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export enum ContractStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export type ContractType = 'form' | 'file';

export interface HederaResponse {
  transaction_id: string;
  timestamp: string;
  status: string;
}

export interface Signature {
  id: string;
  userId: string;
  userEmail: string;
  signatureDataUrl?: string; // For drawn signatures
  signatureHash: string;
  signedAt: string;
  hederaSignatureId: string;
  hederaTransactionId: string;
}

export interface Contract {
  id: string;
  title: string;
  creatorId: string;
  status: ContractStatus;
  type: ContractType;
  parties: { email: string; userId?: string }[];
  createdAt: string;
  hederaResponse: HederaResponse;
  hederaContractId?: string;

  // Form-based fields
  description?: string;
  obligations?: string;
  startDate?: string;
  endDate?: string;

  // File-based fields
  fileName?: string;
  fileHash?: string;
  fileUrl?: string; // a mock URL to the file

  signatures: Signature[];
}

export interface AuditLog {
    id: string;
    action: string;
    userEmail: string;
    timestamp: string;
    hederaTransactionId: string;
}
