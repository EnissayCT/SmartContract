
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiGetContractById, apiSignContract } from '../services/mockApi';
import { Contract, AuditLog, Signature, ContractStatus } from '../types';
import { formatDate, mockHash } from '../utils';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import AuditTrail from '../components/contract/AuditTrail';
import BlockchainExplorerModal from '../components/modals/BlockchainExplorerModal';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import ClockIcon from '../components/icons/ClockIcon';
import SignaturePad from '../components/signature/SignaturePad';
import Button from '../components/ui/Button';

interface ContractDetailPageProps {
    contractId: string;
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-primary">{value}</dd>
    </div>
);

const ContractDetailPage: React.FC<ContractDetailPageProps> = ({ contractId }) => {
    const { user } = useAuth();
    const [contract, setContract] = useState<Contract | null>(null);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    // Biometrics demo state
    const [faceScanned, setFaceScanned] = useState(false);
    const [fingerScanned, setFingerScanned] = useState(false);
    const [faceFile, setFaceFile] = useState<File | null>(null);
    const [facePreview, setFacePreview] = useState<string | null>(null);
    const [fingerFile, setFingerFile] = useState<File | null>(null);
    const [fingerPreview, setFingerPreview] = useState<string | null>(null);
    const [validatingFace, setValidatingFace] = useState(false);
    const [validatingFinger, setValidatingFinger] = useState(false);

    const fetchContractDetails = useCallback(async () => {
        setLoading(true);
        try {
            const { contract: fetchedContract, logs: fetchedLogs } = await apiGetContractById(contractId);
            setContract(fetchedContract);
            setLogs(fetchedLogs);
        } catch (err) {
            setError('Failed to load contract details.');
        } finally {
            setLoading(false);
        }
    }, [contractId]);

    useEffect(() => {
        fetchContractDetails();
    }, [fetchContractDetails]);
    
    const handleViewTransaction = (log: AuditLog) => {
        setSelectedTransaction({
            id: log.hederaTransactionId,
            timestamp: log.timestamp,
            hash: contract?.fileHash, // Example: Show contract hash for creation log
            status: 'SUCCESS',
            action: log.action
        });
        setIsExplorerOpen(true);
    };

    const handleSign = async (signatureDataUrl?: string) => {
        if (!user || !contract) return;
        setSigning(true);
        try {
            await apiSignContract(contract.id, user, signatureDataUrl);
            await fetchContractDetails(); // Refresh details
        } catch (e) {
            setError("Failed to sign contract");
        } finally {
            setSigning(false);
        }
    };
    
    const hasUserSigned = contract?.signatures.some(s => s.userId === user?.id);
    const needsSignature = contract && user && contract.status === ContractStatus.PENDING && !hasUserSigned;

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    if (error) return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>;
    if (!contract) return <div className="container mx-auto p-8 text-center">Contract not found.</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{contract.title}</h1>
            <p className="text-gray-500 font-mono text-sm mb-6">ID: {contract.id}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Contract Details */}
                    <Card header={<h2 className="text-xl font-semibold">Contract Details</h2>}>
                        {contract.type === 'form' ? (
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                <DetailItem label="Description" value={contract.description || 'N/A'} />
                                <DetailItem label="Obligations" value={contract.obligations || 'N/A'} />
                                <DetailItem label="Start Date" value={contract.startDate ? new Date(contract.startDate).toLocaleDateString() : 'N/A'} />
                                <DetailItem label="End Date" value={contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'} />
                            </dl>
                        ) : (
                             <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                                <DetailItem label="File Name" value={contract.fileName || 'N/A'} />
                                <DetailItem label="File Hash (SHA-256)" value={<span className="font-mono break-all">{contract.fileHash}</span>} />
                                <DetailItem label="Download" value={<a href={contract.fileUrl} download={contract.fileName} className="text-secondary hover:underline">Download Contract</a>} />
                            </dl>
                        )}
                    </Card>

                    {/* Signature Action with Biometrics Demo */}
                    {needsSignature && (
                        <Card header={<h2 className="text-xl font-semibold">Biometric Verification Required</h2>}>
                            <div className="space-y-4">
                                {!faceScanned && (
                                    <div className="bg-gray-50 p-4 rounded shadow">
                                        <div className="mb-2 text-primary font-semibold">Face Recognition (Demo)</div>
                                        <p className="text-sm text-gray-600 mb-2">Upload a clear photo (front-facing). This demo will show a preview and allow you to "validate".</p>
                                        <div className="flex items-center gap-3">
                                            <input type="file" accept="image/*" id="face-upload" className="hidden" onChange={(e) => {
                                                const f = e.target.files?.[0] || null;
                                                setFaceFile(f);
                                                if (f) setFacePreview(URL.createObjectURL(f));
                                            }} />
                                            <label htmlFor="face-upload" className="inline-flex items-center px-3 py-2 border rounded text-sm cursor-pointer bg-white">Choose Photo</label>
                                            <Button variant="outline" onClick={() => {
                                                // simple client-side validation demo
                                                if (!faceFile) return alert('Please choose a photo first');
                                                setValidatingFace(true);
                                                setTimeout(() => {
                                                    setValidatingFace(false);
                                                    setFaceScanned(true);
                                                }, 900);
                                            }}>{validatingFace ? 'Validating...' : 'Validate Face'}</Button>
                                        </div>
                                        {facePreview && (
                                            <div className="mt-3">
                                                <img src={facePreview} alt="face preview" className="w-28 h-28 rounded-full object-cover border" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {faceScanned && !fingerScanned && (
                                    <div className="bg-gray-50 p-4 rounded shadow">
                                        <div className="mb-2 text-primary font-semibold">Fingerprint Scan (Demo)</div>
                                        <p className="text-sm text-gray-600 mb-2">Click the fingerprint area to scan, or upload an image of a fingerprint.</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-28 h-28 bg-white rounded-md border flex items-center justify-center cursor-pointer" onClick={() => {
                                                setValidatingFinger(true);
                                                setTimeout(() => { setValidatingFinger(false); setFingerScanned(true); }, 900);
                                            }}>
                                                {fingerPreview ? <img src={fingerPreview} alt="finger preview" className="w-full h-full object-cover rounded-md" /> : <span role="img" aria-label="fingerprint" style={{fontSize: '2rem'}}>� fingerprint</span>}
                                            </div>
                                            <input type="file" accept="image/*" id="finger-upload" className="hidden" onChange={(e) => {
                                                const f = e.target.files?.[0] || null;
                                                setFingerFile(f);
                                                if (f) setFingerPreview(URL.createObjectURL(f));
                                            }} />
                                            <label htmlFor="finger-upload" className="inline-flex items-center px-3 py-2 border rounded text-sm cursor-pointer bg-white">Upload Fingerprint</label>
                                            <Button variant="outline" onClick={() => {
                                                if (!fingerFile) return alert('Please upload a fingerprint image or click the area to scan');
                                                setValidatingFinger(true);
                                                setTimeout(() => { setValidatingFinger(false); setFingerScanned(true); }, 900);
                                            }}>{validatingFinger ? 'Scanning...' : 'Validate Fingerprint'}</Button>
                                        </div>
                                    </div>
                                )}
                                {faceScanned && fingerScanned && (
                                    <>
                                        <SignaturePad onSave={(dataUrl) => handleSign(dataUrl)} />
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-grow border-t border-gray-200"></div>
                                            <span className="text-gray-500">OR</span>
                                            <div className="flex-grow border-t border-gray-200"></div>
                                        </div>
                                        <Button className="w-full" variant="primary" onClick={() => handleSign()} isLoading={signing}>
                                            Click-to-Sign
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Audit Trail */}
                    <Card header={<h2 className="text-xl font-semibold">Audit Trail on Hedera</h2>}>
                        <AuditTrail logs={logs} onViewTransaction={handleViewTransaction} />
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Status & Signatories */}
                    <Card>
                        <DetailItem label="Status" value={<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contract.status === ContractStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{contract.status}</span>}/>
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-primary">Signatories</h3>
                            <ul className="mt-2 divide-y divide-gray-200">
                                {contract.parties.map(party => {
                                    const signature = contract.signatures.find(s => s.userEmail === party.email);
                                    return (
                                        <li key={party.email} className="py-3 flex justify-between items-center">
                                            <p className="text-sm font-medium text-primary">{party.email}</p>
                                            {signature ? (
                                                <div className="flex items-center text-sm text-green-600">
                                                    <CheckCircleIcon className="w-5 h-5 mr-1.5"/> Signed
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-sm text-yellow-600">
                                                     <ClockIcon className="w-5 h-5 mr-1.5"/> Pending
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </Card>

                    {/* Hedera Contract Details (mock realistic) */}
                    <Card header={<h2 className="text-lg font-semibold">Hedera Smart Contract (Mock)</h2>}>
                        <div className="space-y-3 text-sm">
                            <DetailItem label="Contract ID" value={contract.hederaContractId || 'N/A'} />
                            <DetailItem label="Creation TX" value={contract.hederaResponse?.transaction_id || 'N/A'} />
                            <DetailItem label="Deployed At" value={contract.createdAt ? new Date(contract.createdAt).toLocaleString() : 'N/A'} />
                            <DetailItem label="Bytecode Hash" value={<span className="font-mono">{contract.fileHash || '0x'+Math.random().toString(16).substring(2, 18)}</span>} />
                            <div className="pt-2">
                                <a href="#" onClick={(e) => { e.preventDefault(); setIsExplorerOpen(true); setSelectedTransaction({ id: contract.hederaResponse?.transaction_id, timestamp: contract.createdAt, hash: contract.fileHash, status: 'SUCCESS', action: 'Creation' }); }} className="text-secondary hover:underline">View on Hedera Explorer (mock)</a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            
            <BlockchainExplorerModal 
                isOpen={isExplorerOpen}
                onClose={() => setIsExplorerOpen(false)}
                transaction={selectedTransaction}
            />
        </div>
    );
};

export default ContractDetailPage;
