
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiGetContracts } from '../services/mockApi';
import { Contract, ContractStatus } from '../types';
import Button from '../components/ui/Button';
import CreateContractModal from '../components/modals/CreateContractModal';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import DocumentIcon from '../components/icons/DocumentIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import ClockIcon from '../components/icons/ClockIcon';

const ContractStatusBadge: React.FC<{ status: ContractStatus }> = ({ status }) => {
    const statusStyles: { [key in ContractStatus]: string } = {
        [ContractStatus.DRAFT]: 'bg-gray-100 text-gray-800',
        [ContractStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [ContractStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [ContractStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const ContractListItem: React.FC<{ contract: Contract }> = ({ contract }) => {
    const { user } = useAuth();
    const isSignedByCurrentUser = contract.signatures.some(s => s.userId === user?.id);
    const requiresSignature = contract.status === ContractStatus.PENDING && !isSignedByCurrentUser && user?.role === 'Client/Partner';

    return (
        <a href={`#/contract/${contract.id}`} className="block hover:bg-light-contrast transition-colors duration-200">
            <Card className="shadow-none border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-primary">{contract.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Created: {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <ContractStatusBadge status={contract.status} />
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                        {contract.type === 'file' ? <DocumentIcon className="w-5 h-5 mr-2" /> : <CheckCircleIcon className="w-5 h-5 mr-2" />}
                         {contract.type === 'file' ? contract.fileName : 'Form-Based'}
                    </div>
                    {requiresSignature && (
                         <div className="flex items-center text-sm font-semibold text-accent">
                             <ClockIcon className="w-4 h-4 mr-1.5" />
                             Action Required
                         </div>
                    )}
                </div>
            </Card>
        </a>
    )
};


const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchContracts = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const fetchedContracts = await apiGetContracts(user);
                setContracts(fetchedContracts);
            } catch (error) {
                console.error("Failed to fetch contracts", error);
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">
                    {user.role === 'Business/Admin' ? 'My Contracts' : 'Contracts for Signature'}
                </h1>
                {user.role === 'Business/Admin' && (
                    <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                        Create New Contract
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center mt-10"><Spinner/></div>
            ) : contracts.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {user.role === 'Business/Admin' ? "Get started by creating a new contract." : "You have no pending contracts at this time."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {contracts.map(contract => (
                        <ContractListItem key={contract.id} contract={contract} />
                    ))}
                </div>
            )}
            
            <CreateContractModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onContractCreated={fetchContracts}
            />
        </div>
    );
};

export default DashboardPage;
