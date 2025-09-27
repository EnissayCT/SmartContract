
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../constants';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import HederaIcon from '../components/icons/HederaIcon';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('Business/Admin');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLogin) {
                await login(email);
            } else {
                await register(email, role);
            }
            window.location.hash = '#/dashboard';
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                 <a href="#/" className="flex justify-center items-center space-x-2 text-primary hover:text-primary-light transition">
                    <HederaIcon className="h-12 w-auto text-secondary"/>
                    <h2 className="text-center text-3xl font-extrabold text-primary">Moroccan Contracts</h2>
                 </a>
                <h2 className="mt-6 text-center text-2xl font-bold text-primary">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input id="email" label="Email address" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                        {!isLogin && (
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm rounded-md"
                                >
                                    {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        )}
                        
                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <Button type="submit" isLoading={isLoading} className="w-full" variant="secondary">
                                {isLogin ? 'Sign in' : 'Register'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="outline" className="w-full" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                                {isLogin ? 'Create an account' : 'Sign in instead'}
                            </Button>
                        </div>
                         <div className="mt-4 text-center text-xs text-gray-500">
                            <p>Demo accounts:</p>
                            <p>admin@business.ma (Business/Admin)</p>
                            <p>client@partner.ma (Client/Partner)</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
