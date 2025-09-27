
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import HederaIcon from '../icons/HederaIcon';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#/dashboard" className="flex items-center space-x-2 text-primary hover:text-primary-light transition">
                            <HederaIcon className="h-8 w-8 text-secondary"/>
                            <span className="font-display font-bold text-xl">Moroccan Contracts</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-primary">{user.email}</p>
                                <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                        )}
                        <Button onClick={logout} variant="outline" className="py-2 px-4">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
