import React, { type ReactNode, } from 'react';
import Header from './Header'; // Assuming Header is in the same directory

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col max-w-sm">
      <Header />
      {children}
    </div>
  );
};

export default Layout;