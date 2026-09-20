import React from 'react';

export default function BootstrapLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            />
            {children}
        </div>
    );
}
