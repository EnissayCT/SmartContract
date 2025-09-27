
import React from 'react';
import Modal from '../ui/Modal';
import { formatDate } from '../../utils';
import HederaIcon from '../icons/HederaIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface BlockchainExplorerModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: {
        id: string;
        timestamp: string;
        hash?: string;
        status: string;
        action: string;
    } | null;
}

const DetailRow: React.FC<{ label: string; value: string; isHash?: boolean }> = ({ label, value, isHash = false }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono ${isHash ? 'break-all' : ''}`}>{value}</dd>
    </div>
);


const BlockchainExplorerModal: React.FC<BlockchainExplorerModalProps> = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Hedera Transaction Details">
            <div className="space-y-6">
                <div className="flex items-center p-4 bg-secondary/10 rounded-lg">
                    <HederaIcon className="h-10 w-10 text-secondary mr-4"/>
                    <div>
                        <h4 className="font-semibold text-lg text-primary">Transaction Confirmed</h4>
                        <p className="text-sm text-gray-600">Your action has been successfully recorded on the (mock) Hedera network.</p>
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <dl className="divide-y divide-gray-200">
                        <DetailRow label="Action" value={transaction.action} />
                        <DetailRow label="Transaction ID" value={transaction.id} />
                        <DetailRow label="Timestamp" value={formatDate(transaction.timestamp)} />
                        {transaction.hash && <DetailRow label="Content Hash" value={transaction.hash} isHash />}
                        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircleIcon className="w-4 h-4 mr-1.5"/>
                                    {transaction.status.toUpperCase()}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </Modal>
    );
};

export default BlockchainExplorerModal;
