import React from 'react';
import StudentSidebar from './StudentSidebar';

const StudentLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#0f111a]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <StudentSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
