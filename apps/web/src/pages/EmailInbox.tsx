import { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, RefreshCw, User, Calendar, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008/api';

export default function EmailInbox() {
    const [emails, setEmails] = useState<any[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/communications`);
            setEmails(response.data);
            if (response.data.length > 0 && !selectedEmail) {
                setSelectedEmail(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch emails', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
            {/* Email List - Left Side */}
            <div className="w-1/3 min-w-[320px] bg-slate-50 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center h-16">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-100/50 text-blue-600 rounded-lg">
                            <Mail size={18} />
                        </div>
                        Inbox <span className="font-normal text-slate-400 text-sm">({emails.length})</span>
                    </h3>
                    <button onClick={fetchEmails} className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-100 transition-all duration-200">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {loading && (
                        <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                            <RefreshCw className="animate-spin mb-2" />
                            Loading messages...
                        </div>
                    )}

                    {emails.length === 0 && !loading && (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Mail size={24} className="opacity-50" />
                            </div>
                            <p className="font-medium">No messages yet</p>
                            <p className="text-sm mt-1">Communications will appear here.</p>
                        </div>
                    )}

                    {emails.map((email) => (
                        <div
                            key={email.id}
                            onClick={() => setSelectedEmail(email)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group border
                                ${selectedEmail?.id === email.id
                                    ? 'bg-white border-blue-200 shadow-lg shadow-blue-100/50 ring-1 ring-blue-100'
                                    : 'bg-white/50 hover:bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedEmail?.id === email.id ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                    <span className={`text-sm truncate pr-2 ${selectedEmail?.id === email.id ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                        {email.subject}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap font-medium">
                                    {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2 pl-4">
                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                                    {email.exception?.loan?.borrowerName?.charAt(0) || '?'}
                                </div>
                                <span className="text-xs text-slate-500 truncate font-medium">
                                    {email.exception?.loan?.borrowerName || 'Unknown Borrower'}
                                </span>
                            </div>

                            <div className="text-xs text-slate-400 pl-4 line-clamp-2 leading-relaxed">
                                {email.body ? email.body.substring(0, 100) : 'No preview available...'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Email Viewer - Right Side */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                {selectedEmail ? (
                    <>
                        <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedEmail.subject}</h2>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        Email
                                    </span>
                                    {selectedEmail.direction === 'OUTBOUND' && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                                            Sent
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-blue-50">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-lg">
                                            {selectedEmail.exception?.loan?.borrowerName}
                                        </div>
                                        <div className="text-sm text-slate-500 font-medium">
                                            {selectedEmail.exception?.loan?.borrowerEmail}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-400 font-medium flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Calendar size={14} />
                                        {new Date(selectedEmail.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        {new Date(selectedEmail.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
                            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                                <div className="prose prose-slate max-w-none font-sans text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedEmail.body.split(/(https?:\/\/[^\s]+)/g).map((part: string, i: number) =>
                                        part.match(/https?:\/\/[^\s]+/) ? (
                                            <a
                                                key={i}
                                                href={part}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 font-medium hover:text-blue-700 hover:underline break-all inline-flex items-center gap-1 bg-blue-50 px-1 rounded transition-colors"
                                            >
                                                {part} <ExternalLink size={12} />
                                            </a>
                                        ) : part
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Mail size={48} className="opacity-20 translate-y-1" />
                        </div>
                        <p className="font-medium text-lg text-slate-500">Select a message to read</p>
                        <p className="text-sm text-slate-400 mt-2">Choose an email from the list on the left</p>
                    </div>
                )}
            </div>
        </div>
    );
}
