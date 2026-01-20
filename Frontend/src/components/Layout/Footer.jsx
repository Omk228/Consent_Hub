import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 shadow-md p-4 mt-auto">
      <div className="container mx-auto text-center text-gray-600">
        &copy; {new Date().getFullYear()} B2B SaaS Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;