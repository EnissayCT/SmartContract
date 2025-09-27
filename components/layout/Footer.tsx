
import React from 'react';
import HederaIcon from '../icons/HederaIcon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-primary text-white">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <div className="flex items-center space-x-2">
                             <HederaIcon className="h-10 w-10 text-secondary"/>
                             <span className="font-display font-bold text-2xl">Moroccan Contracts</span>
                        </div>
                        <p className="text-gray-300 text-base">
                            Secure, Transparent, and Efficient Smart Contracts for Morocco.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Solutions</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Business Contracts</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">NGO Agreements</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Government Processes</a></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">contact@m-contracts.ma</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">+212 5 00 00 00 00</a></li>
                                </ul>
                            </div>
                             <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Social</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">LinkedIn</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Twitter</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-primary-light pt-8 flex justify-between items-center">
                    <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Moroccan Smart Contract Solution. All rights reserved.</p>
                     <div className="flex items-center space-x-2">
                         <span className="text-sm text-gray-400">Powered by</span>
                         <HederaIcon className="h-6 w-6 text-white"/>
                         <span className="font-semibold text-white">Hedera</span>
                     </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
