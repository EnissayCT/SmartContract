
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import ContractForm from '../contract/ContractForm';
import FileUploadForm from '../contract/FileUploadForm';
import { useAuth } from '../../contexts/AuthContext';
import { apiCreateFormContract, apiCreateFileContract } from '../../services/mockApi';

interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContractCreated: () => void;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({ isOpen, onClose, onContractCreated }) => {
    const [activeTab, setActiveTab] = useState<'form' | 'file'>('form');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    
    const handleFormSubmit = async (data: any) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            // Add creator's email to parties list
            const allParties = [...data.parties, { email: user.email }];
            const uniqueParties = Array.from(new Set(allParties.map(p => p.email)))
                .map(email => ({ email }));

            await apiCreateFormContract({ ...data, parties: uniqueParties }, user);
            onContractCreated();
            onClose();
        } catch (e) {
            setError('Failed to create contract.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSubmit = async (file: File, parties: {email: string}[]) => {
         if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const allParties = [...parties, { email: user.email }];
            const uniqueParties = Array.from(new Set(allParties.map(p => p.email)))
                .map(email => ({ email }));
            
            await apiCreateFileContract(file, uniqueParties, user);
            onContractCreated();
            onClose();
        } catch (e) {
            setError('Failed to create contract from file.');
        } finally {
            setIsLoading(false);
        }
    };

    const TabButton: React.FC<{ tabName: 'form' | 'file'; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabName ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            {label}
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Smart Contract">
            <div className="space-y-4">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                         <TabButton tabName="form" label="Form-Based Contract" />
                         <TabButton tabName="file" label="File Upload Contract" />
                    </nav>
                </div>
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
                <div>
                    {activeTab === 'form' ? (
                        <ContractForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                    ) : (
                        <FileUploadForm onSubmit={handleFileSubmit} isLoading={isLoading} />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CreateContractModal;
