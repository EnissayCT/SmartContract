
import React from 'react';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';
import HederaIcon from '../components/icons/HederaIcon';

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary text-white mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-display font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-base text-gray-600">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-light">
            {/* Improved Minimal Hero */}
            <section className="py-12 bg-white border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="h-14 w-14 rounded-md bg-secondary/10 flex items-center justify-center">
                                <HederaIcon className="h-8 w-8 text-secondary" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary">African Smart Contract Solution</h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">Empowering Africa’s digital future with secure, automated contracts for every citizen, business, and organization.</p>

                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 justify-center md:justify-start">
                                <Button variant="secondary" className="px-5 py-2 text-sm" onClick={() => window.location.hash = '#/login'}>Try the Demo</Button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-light text-xs font-medium text-primary">Tamper-proof</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-light text-xs font-medium text-primary">Automatic enforcement</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-light text-xs font-medium text-primary">Local payments</span>
                            </div>
                        </div>

                        <div className="hidden md:block w-40">
                            {/* simple illustrative SVG (network nodes) */}
                            <svg viewBox="0 0 64 64" className="w-40 h-40" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="#3B82F6" strokeWidth="1.5">
                                    <circle cx="32" cy="18" r="4" fill="#60A5FA" />
                                    <circle cx="18" cy="42" r="4" fill="#60A5FA" />
                                    <circle cx="46" cy="42" r="4" fill="#60A5FA" />
                                    <path d="M32 22 L20 40" strokeLinecap="round" />
                                    <path d="M32 22 L44 40" strokeLinecap="round" />
                                    <path d="M20 42 L44 42" strokeLinecap="round" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>
            {/* Problem & Solution Card (placed between sections) */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-4 flex items-center space-x-3">
                            <span>
                                {/* Moroccan flag (red with green pentagram) */}
                                <svg width="36" height="24" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <rect width="36" height="24" fill="#C1272D" rx="2" />
                                    <polygon fill="#006233" points="18,6 19.47,9.98 23.71,10.15 20.38,12.77 21.53,16.85 18,14.5 14.47,16.85 15.62,12.77 12.29,10.15 16.53,9.98" />
                                </svg>
                            </span>
                            <h2 className="text-xl font-bold text-primary">The Problem Across Africa & Our Pan-African Solution</h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="bg-light rounded-lg p-4">
                                <h3 className="text-md font-semibold text-accent mb-2">The Problem Across Africa</h3>
                                <ul className="list-disc pl-5 text-sm text-gray-700">
                                    <li>Contracts in Africa often suffer from fraud, bureaucracy, and weak enforcement.</li>
                                    <li>Existing e-signature tools only prove an agreement — they don’t enforce it.</li>
                                    <li>Businesses, farmers, NGOs, and citizens lack trustworthy, automated solutions for critical transactions.</li>
                                    <li>Local payment systems (M-Pesa, Orange Money, MTN Mobile Money, EcoBank, etc.) are not integrated with contract enforcement.</li>
                                </ul>
                            </div>
                            <div className="bg-light rounded-lg p-4">
                                <h3 className="text-md font-semibold text-accent mb-2">Our Pan-African Solution</h3>
                                <ul className="list-disc pl-5 text-sm text-gray-700">
                                    <li><strong>Tamper-proof & self-executing contracts</strong> stored on blockchain, with audit trails in English, French, Arabic, and local languages.</li>
                                    <li><strong>Automatic enforcement:</strong> when conditions are met, actions (like payments) trigger instantly via African payment providers.</li>
                                    <li><strong>Local payment integration:</strong> M-Pesa, Orange Money, MTN Mobile Money, EcoBank, and support for African currencies.</li>
                                    <li><strong>Legally compliant:</strong> aligned with African digital law frameworks and e-signature regulations.</li>
                                    <li><strong>Culturally relevant:</strong> Designed for African business, agriculture, NGOs, and government processes.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Button variant="secondary" className="px-6 py-2 text-base" onClick={() => window.location.hash = '#/login'}>Try the Demo</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-bold text-primary">A Simple, Secure Process</h2>
                        <p className="mt-4 text-lg text-gray-600">Three steps to a fully executed, verifiable contract.</p>
                    </div>
                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto bg-secondary/10 text-secondary rounded-full text-2xl font-bold">1</div>
                            <h3 className="mt-5 text-xl font-semibold text-primary">Create</h3>
                            <p className="mt-2 text-gray-600">Draft a new contract using our intuitive forms or upload an existing document.</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto bg-secondary/10 text-secondary rounded-full text-2xl font-bold">2</div>
                            <h3 className="mt-5 text-xl font-semibold text-primary">Sign</h3>
                            <p className="mt-2 text-gray-600">All parties sign digitally. Each signature is cryptographically secured and recorded.</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto bg-secondary/10 text-secondary rounded-full text-2xl font-bold">3</div>
                            <h3 className="mt-5 text-xl font-semibold text-primary">Verify</h3>
                            <p className="mt-2 text-gray-600">Access an immutable audit trail on the Hedera network to verify every action.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Grid Section */}
            <section className="py-20 bg-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                         <h2 className="text-3xl font-display font-bold text-primary">Built for Modern Business</h2>
                        <p className="mt-4 text-lg text-gray-600">Our platform provides the tools you need for reliable agreements.</p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <FeatureCard title="Enhanced Security" description="Contracts and signatures are hashed and stored immutably, preventing tampering." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
                        <FeatureCard title="Full Transparency" description="All parties have access to the same version of the contract and its history." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} />
                        <FeatureCard title="Non-Repudiation" description="Cryptographic signatures provide undeniable proof of agreement." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        <FeatureCard title="Easy to Use" description="A clean, intuitive interface makes smart contract management simple for everyone." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
             <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-display font-bold text-primary">Versatile for Any Industry</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">From small businesses to large enterprises, our solution adapts to your needs.</p>
                     <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <span className="bg-primary-light/10 text-primary-light text-sm font-medium px-4 py-2 rounded-full">Business Contracts</span>
                        <span className="bg-primary-light/10 text-primary-light text-sm font-medium px-4 py-2 rounded-full">NGO Agreements</span>
                        <span className="bg-primary-light/10 text-primary-light text-sm font-medium px-4 py-2 rounded-full">Government Processes</span>
                        <span className="bg-primary-light/10 text-primary-light text-sm font-medium px-4 py-2 rounded-full">Supply Chain</span>
                        <span className="bg-primary-light/10 text-primary-light text-sm font-medium px-4 py-2 rounded-full">Real Estate</span>
                     </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <h2 className="text-3xl font-display font-bold text-white">Ready to Modernize Your Agreements?</h2>
                    <p className="mt-4 text-lg text-gray-300">Explore the future of contracts. Secure, simple, and powered by Hedera.</p>
                    <div className="mt-8">
                         <Button variant="secondary" className="px-8 py-4 text-lg" onClick={() => window.location.hash = '#/login'}>
                            Access the Demo
                        </Button>
                    </div>
                </div>
            </section>
            
            <Footer/>
        </div>
    );
};

export default LandingPage;
