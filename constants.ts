
import { UserRole, ContractStatus } from './types';

export const USER_ROLES: UserRole[] = ['Business/Admin', 'Client/Partner'];

export const CONTRACT_STATUSES: ContractStatus[] = [
  ContractStatus.DRAFT,
  ContractStatus.PENDING,
  ContractStatus.ACTIVE,
  ContractStatus.COMPLETED,
];
