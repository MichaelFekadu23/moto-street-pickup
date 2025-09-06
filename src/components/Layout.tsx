import React, { type ReactNode, useEffect, useRef } from 'react';
import Header from './Header'; // Assuming Header is in the same directory

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Let the browser layout first, then scroll
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      // or: window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
  }, []);
  return (
    <div className="h-screen flex flex-col">
      <Header />
      {children}
    </div>
  );
};

export default Layout;