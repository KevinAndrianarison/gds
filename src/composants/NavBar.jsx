import React, { useState } from 'react';
import NavMenu from './NavMenu';
import UserSection from './UserSection';
import LogoTitle from './LogoTitle';

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white sticky border-b-5 border-blue-400 top-0 z-50">
            <div className="max-w-7xl mx-auto px-6  flex items-center justify-between">
                <LogoTitle />
                <NavMenu isOpen={isOpen} />
                <div className="flex items-center space-x-6">
                    <UserSection toggleMenu={toggleMenu} isOpen={isOpen}/>
                </div>
            </div>
        </nav>
    );
}
