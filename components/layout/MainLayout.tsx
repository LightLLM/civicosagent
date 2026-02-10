import React from 'react';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, header, children }) => {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
            {sidebar}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden">
                {header}
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
