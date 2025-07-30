import React from 'react';

const PageHeader = ({ title, subtitle, children }) => (
    <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">
            {title}
        </h1>
        <p className="text-lg text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
    </div>
);

export default PageHeader;