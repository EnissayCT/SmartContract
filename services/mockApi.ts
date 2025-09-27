
import { User, UserRole, Contract, ContractStatus, Signature, AuditLog, HederaResponse, ContractType } from '../types';
import { mockHash } from '../utils';

// --- MOCK DATABASE ---
// Try loading persisted state from localStorage first
const STORAGE_KEY = 'msc_demo_state_v1';

const defaultUsers: User[] = [
    { id: 'user-1', email: 'admin@business.ma', role: 'Business/Admin' },
    { id: 'user-2', email: 'client@partner.ma', role: 'Client/Partner' },
];

const defaultContracts: Contract[] = [
    {
        id: 'contract-1',
        title: 'Q1 Service Agreement',
        creatorId: 'user-1',
        status: ContractStatus.PENDING,
        type: 'form',
        parties: [{ email: 'admin@business.ma', userId: 'user-1' }, { email: 'client@partner.ma', userId: 'user-2' }],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        hederaResponse: {
            transaction_id: '0.0.12345-abcde',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'SUCCESS',
        },
        hederaContractId: '0.0.90001',
        description: 'This agreement outlines the services to be provided in Q1.',
        obligations: 'Deliver marketing report by end of March.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
        signatures: [
             {
                id: 'sig-1',
                userId: 'user-1',
                userEmail: 'admin@business.ma',
                signatureHash: 'mock-hash-admin-q1',
                signedAt: new Date(Date.now() - 72000000).toISOString(),
                hederaSignatureId: '0.0.56789-sig-admin',
                hederaTransactionId: '0.0.56789-xyz-admin',
            }
        ],
    },
    {
        id: 'contract-2',
        title: 'NDA for Project Phoenix',
        creatorId: 'user-1',
        status: ContractStatus.ACTIVE,
        type: 'file',
        parties: [{ email: 'admin@business.ma', userId: 'user-1' }, { email: 'client@partner.ma', userId: 'user-2' }],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        hederaResponse: {
            transaction_id: '0.0.67890-fghij',
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
            status: 'SUCCESS',
        },
        hederaContractId: '0.0.90002',
        fileName: 'Project_Phoenix_NDA.pdf',
        fileHash: 'mock-file-hash-phoenix',
        fileUrl: '#',
        signatures: [
            {
                id: 'sig-2',
                userId: 'user-1',
                userEmail: 'admin@business.ma',
                signatureHash: 'mock-hash-admin-phoenix',
                signedAt: new Date(Date.now() - 1.5 * 86400000).toISOString(),
                hederaSignatureId: '0.0.11111-sig-admin',
                hederaTransactionId: '0.0.11111-xyz-admin',
            },
            {
                id: 'sig-3',
                userId: 'user-2',
                userEmail: 'client@partner.ma',
                signatureHash: 'mock-hash-client-phoenix',
                signedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
                hederaSignatureId: '0.0.22222-sig-client',
                hederaTransactionId: '0.0.22222-xyz-client',
            }
        ],
    }
];

const defaultAuditLogs: { [contractId: string]: AuditLog[] } = {
    'contract-1': [
        { id: 'log-1-1', action: 'Contract Created', userEmail: 'admin@business.ma', timestamp: defaultContracts[0].createdAt, hederaTransactionId: defaultContracts[0].hederaResponse.transaction_id },
        { id: 'log-1-2', action: 'Signed Contract', userEmail: 'admin@business.ma', timestamp: defaultContracts[0].signatures[0].signedAt, hederaTransactionId: defaultContracts[0].signatures[0].hederaTransactionId }
    ],
    'contract-2': [
        { id: 'log-2-1', action: 'Contract Created', userEmail: 'admin@business.ma', timestamp: defaultContracts[1].createdAt, hederaTransactionId: defaultContracts[1].hederaResponse.transaction_id },
        { id: 'log-2-2', action: 'Signed Contract', userEmail: 'admin@business.ma', timestamp: defaultContracts[1].signatures[0].signedAt, hederaTransactionId: defaultContracts[1].signatures[0].hederaTransactionId },
        { id: 'log-2-3', action: 'Signed Contract', userEmail: 'client@partner.ma', timestamp: defaultContracts[1].signatures[1].signedAt, hederaTransactionId: defaultContracts[1].signatures[1].hederaTransactionId },
        { id: 'log-2-4', action: 'Contract Activated', userEmail: 'System', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), hederaTransactionId: 'N/A' }
    ]
};

let users: User[] = [];
let contracts: Contract[] = [];
let auditLogs: { [contractId: string]: AuditLog[] } = {};

const loadState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            users = defaultUsers.slice();
            contracts = defaultContracts.slice();
            auditLogs = { ...defaultAuditLogs };
            return;
        }
        const parsed = JSON.parse(raw);
        users = parsed.users || defaultUsers.slice();
        contracts = parsed.contracts || defaultContracts.slice();
        auditLogs = parsed.auditLogs || { ...defaultAuditLogs };
    } catch (e) {
        users = defaultUsers.slice();
        contracts = defaultContracts.slice();
        auditLogs = { ...defaultAuditLogs };
    }
};

const saveState = () => {
    try {
        const payload = { users, contracts, auditLogs };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        // ignore storage errors in demo
        console.warn('Failed to persist demo state', e);
    }
};

loadState();

// --- API FUNCTIONS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Mock Hedera Functions ---
const hedera_create_contract = (): HederaResponse => ({
    transaction_id: `0.0.${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    status: 'SUCCESS'
});

const hedera_deploy_contract = (): { contract_id: string; transaction_id: string; timestamp: string } => {
    const tx = hedera_create_contract();
    return { contract_id: `0.0.${Math.floor(90000 + Math.random() * 90000)}`, transaction_id: tx.transaction_id, timestamp: tx.timestamp };
};

const hedera_sign_contract = (): { signature_id: string; transaction_id: string; timestamp: string; status: string } => ({
    signature_id: `0.0.${Math.floor(10000 + Math.random() * 90000)}-sig`,
    transaction_id: `0.0.${Math.floor(10000 + Math.random() * 90000)}-xyz`,
    timestamp: new Date().toISOString(),
    status: 'SIGNED'
});

// --- Auth ---
export const apiLogin = async (email: string): Promise<User> => {
    await delay(500);
    const user = users.find(u => u.email === email);
    if (user) return user;
    throw new Error('User not found');
};

export const apiRegister = async (email: string, role: UserRole): Promise<User> => {
    await delay(500);
    if (users.some(u => u.email === email)) {
        throw new Error('User already exists');
    }
    const newUser: User = { id: `user-${users.length + 1}`, email, role };
    users.push(newUser);
    saveState();
    return newUser;
};

// --- Contracts ---
export const apiGetContracts = async (user: User): Promise<Contract[]> => {
    await delay(700);
    if (user.role === 'Business/Admin') {
        return contracts.filter(c => c.creatorId === user.id);
    }
    return contracts.filter(c => c.parties.some(p => p.email === user.email));
};

export const apiGetContractById = async (id: string): Promise<{ contract: Contract, logs: AuditLog[] }> => {
    await delay(600);
    const contract = contracts.find(c => c.id === id);
    if (!contract) throw new Error('Contract not found');
    return { contract, logs: auditLogs[id] || [] };
};

export const apiCreateFormContract = async (data: Omit<Contract, 'id' | 'creatorId' | 'status' | 'type' | 'createdAt' | 'hederaResponse' | 'signatures'>, user: User): Promise<Contract> => {
    await delay(1200);
    const hederaResponse = hedera_create_contract();
    const deployment = hedera_deploy_contract();
    const newContract: Contract = {
        id: `contract-${contracts.length + 1}`,
        ...data,
        creatorId: user.id,
        status: ContractStatus.PENDING,
        type: 'form',
        createdAt: new Date().toISOString(),
        hederaResponse,
        hederaContractId: deployment.contract_id,
        signatures: [],
    };
    contracts.push(newContract);
    const log: AuditLog = { id: `log-${newContract.id}-1`, action: 'Contract Created', userEmail: user.email, timestamp: hederaResponse.timestamp, hederaTransactionId: hederaResponse.transaction_id };
    auditLogs[newContract.id] = [log];
    saveState();
    return newContract;
};

export const apiCreateFileContract = async (file: File, parties: {email: string}[], user: User): Promise<Contract> => {
    await delay(1500);
    const fileContent = await file.text();
    const fileHash = await mockHash(fileContent);
    const hederaResponse = hedera_create_contract(); // Simulates storing the hash
    const deployment = hedera_deploy_contract();
    const newContract: Contract = {
        id: `contract-${contracts.length + 1}`,
        title: file.name,
        creatorId: user.id,
        status: ContractStatus.PENDING,
        type: 'file',
        parties,
        createdAt: new Date().toISOString(),
        hederaResponse,
        hederaContractId: deployment.contract_id,
        fileName: file.name,
        fileHash,
        fileUrl: URL.createObjectURL(file),
        signatures: [],
    };
    contracts.push(newContract);
    const log: AuditLog = { id: `log-${newContract.id}-1`, action: 'Contract Created', userEmail: user.email, timestamp: hederaResponse.timestamp, hederaTransactionId: hederaResponse.transaction_id };
    auditLogs[newContract.id] = [log];
    saveState();
    return newContract;
};

export const apiSignContract = async (contractId: string, user: User, signatureDataUrl?: string): Promise<Contract> => {
    await delay(1000);
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) throw new Error('Contract not found');

    const hederaSignResponse = hedera_sign_contract();
    const signatureHash = await mockHash(signatureDataUrl || user.id);
    
    const newSignature: Signature = {
        id: `sig-${Math.random()}`,
        userId: user.id,
        userEmail: user.email,
        signatureDataUrl,
        signatureHash,
        signedAt: hederaSignResponse.timestamp,
        hederaSignatureId: hederaSignResponse.signature_id,
        hederaTransactionId: hederaSignResponse.transaction_id
    };
    contract.signatures.push(newSignature);

    const log: AuditLog = { id: `log-${contract.id}-${auditLogs[contract.id].length+1}`, action: 'Signed Contract', userEmail: user.email, timestamp: newSignature.signedAt, hederaTransactionId: newSignature.hederaTransactionId };
    auditLogs[contract.id].push(log);
    
    // Check if all parties signed
    if (contract.signatures.length === contract.parties.length) {
        contract.status = ContractStatus.ACTIVE;
        const finalLog: AuditLog = { id: `log-${contract.id}-${auditLogs[contract.id].length+1}`, action: 'Contract Activated', userEmail: 'System', timestamp: new Date().toISOString(), hederaTransactionId: 'N/A' };
        auditLogs[contract.id].push(finalLog);
    }

    saveState();
    
    return contract;
};
