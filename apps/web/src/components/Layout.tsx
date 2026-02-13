import React from 'react';
import { LayoutDashboard, FileText, Upload, Settings, Bell, LogOut, Inbox } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [showNotifications, setShowNotifications] = React.useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar with Glassmorphism feel */}
            <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-3 tracking-tight">
                        <FileText className="w-8 h-8 text-blue-400" />
                        MEDA
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">INTELLIGENT LOAN PROCESSING</p>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 mb-4 px-4 uppercase tracking-wider">Main Menu</p>
                    <NavItem to="/" icon={<LayoutDashboard />} label="Dashboard" />
                    <NavItem to="/exceptions" icon={<FileText />} label="Exceptions Queue" />
                    <NavItem to="/import" icon={<Upload />} label="Import Data" />
                    <NavItem to="/emails" icon={<Inbox />} label="Communications" />
                </nav>

                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <nav className="space-y-2">
                        <NavItem to="/settings" icon={<Settings />} label="Settings" />
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to sign out?')) {
                                    window.location.href = '/login'; // Redirect to login (conceptual)
                                }
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 mt-2 text-left group"
                        >
                            <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 pointer-events-none -z-10" />

                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Processor Dashboard</h2>
                        <p className="text-sm text-slate-500">Welcome back, Jason</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors"
                            >
                                <Bell size={22} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="font-bold text-slate-800">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400">
                                                <Bell className="mx-auto mb-3 opacity-20" size={32} />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                                                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                                                        <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">
                                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                            <button className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-widest">
                                                View All Activity
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link to="/settings" className="flex items-center gap-3 pl-6 border-l border-slate-200 hover:bg-slate-50 transition-colors p-2 rounded-lg cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-700">Jason Statham</p>
                                <p className="text-xs text-slate-500">Senior Processor</p>
                            </div>
                            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white hover:ring-blue-100 transition-all">
                                JS
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1'
                : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
        >
            <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                {/* Clone element to force size if needed, or rely on CSS */}
                {React.cloneElement(icon as React.ReactElement, { size: 20 })}
            </span>
            <span className="font-medium tracking-wide text-sm">{label}</span>
        </Link>
    );
}
