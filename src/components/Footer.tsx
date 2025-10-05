import { t } from 'i18next';
import React from 'react';

interface FooterProps {
  text: string;
}

const Footer: React.FC<FooterProps> = ({ text }) => {
  return (
    <footer className="w-full text-center mb-2">
      <p className="text-black text-xs sm:text-sm">{t(text)}</p>
    </footer>
  );
};

export default Footer;