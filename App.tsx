
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ContractDetailPage from './pages/ContractDetailPage';
import Navbar from './components/layout/Navbar';


const AppRouter: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash);
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-light">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-secondary rounded-full animate-spin"></div>
        </div>
    }

    const renderContent = () => {
        if (!user) {
            if (route === '#/login' || route === '#/register') {
                return <AuthPage />;
            }
            return <LandingPage />;
        }

        if (route.startsWith('#/contract/')) {
            const id = route.split('/')[2];
            return <ContractDetailPage contractId={id} />;
        }
        
        if (route.startsWith('#/dashboard')) {
            return <DashboardPage />;
        }
        
        // Default to dashboard if logged in but no specific route
        window.location.hash = '#/dashboard';
        return <DashboardPage />;
    };

    return (
        <div className="min-h-screen bg-light text-primary">
            <Navbar />
            <main>{renderContent()}</main>
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
  );
};

export default App;
