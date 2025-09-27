
import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ContractFormProps {
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit, isLoading }) => {
    const [title, setTitle] = useState('');
    const [parties, setParties] = useState('');
    const [description, setDescription] = useState('');
    const [obligations, setObligations] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const partiesArray = parties.split(',').map(email => ({ email: email.trim() }));
        onSubmit({ title, parties: partiesArray, description, obligations, startDate, endDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input id="title" label="Contract Title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            <Input id="parties" label="Other Parties (comma-separated emails)" type="text" value={parties} onChange={e => setParties(e.target.value)} required />
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows={3} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm" required />
            </div>
            <div>
                <label htmlFor="obligations" className="block text-sm font-medium text-gray-700">Obligations</label>
                <textarea id="obligations" rows={3} value={obligations} onChange={e => setObligations(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="startDate" label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                <Input id="endDate" label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div className="flex justify-end">
                <Button type="submit" variant="secondary" isLoading={isLoading}>
                    Create Contract on Hedera
                </Button>
            </div>
        </form>
    );
};

export default ContractForm;
