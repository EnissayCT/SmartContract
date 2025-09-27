
import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface FileUploadFormProps {
    onSubmit: (file: File, parties: {email: string}[]) => void;
    isLoading: boolean;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onSubmit, isLoading }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parties, setParties] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            const partiesArray = parties.split(',').map(email => ({ email: email.trim() }));
            onSubmit(file, partiesArray);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Upload PDF/Word Contract
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-green-600 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX up to 10MB
                        </p>
                    </div>
                </div>
                {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
            </div>
             <Input id="parties-file" label="Other Parties (comma-separated emails)" type="text" value={parties} onChange={e => setParties(e.target.value)} required />
            <div className="flex justify-end">
                <Button type="submit" variant="secondary" isLoading={isLoading} disabled={!file || isLoading}>
                    Store Contract Hash on Hedera
                </Button>
            </div>
        </form>
    );
};

export default FileUploadForm;
