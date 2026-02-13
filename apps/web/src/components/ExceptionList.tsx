import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, MoreHorizontal, Search, FileText, AlertCircle, CheckCircle, FileWarning } from 'lucide-react';
import axios from 'axios';
import { ExceptionStatus, Severity } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function ExceptionList() {
    const [exceptions, setExceptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExceptions();
    }, []);

    const fetchExceptions = async () => {
        try {
            const response = await axios.get(`${API_URL}/exceptions`);
            setExceptions(response.data);
        } catch (error) {
            console.error('Failed to fetch exceptions', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading exceptions...</div>;

    if (exceptions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Exceptions Found</h3>
                <p className="text-gray-500 mt-2 mb-6">There are no active exceptions requiring attention right now.</p>
                <div className="text-xs text-gray-400">Import a CSV file to get started.</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Exception Queue</h3>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Loan #</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Borrower</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Exception Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Severity</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Created</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {exceptions.map((exc) => (
                            <tr
                                key={exc.id}
                                className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer"
                                onClick={() => navigate(`/exceptions/${exc.id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                    #{exc.loan?.loanNumber || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                            {exc.loan?.borrowerName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{exc.loan?.borrowerName || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{exc.loan?.borrowerEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {formatExceptionType(exc.exceptionType)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SeverityBadge severity={exc.severity} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={exc.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                    {new Date(exc.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-t border-slate-200 flex items-center justify-between text-slate-500 text-sm font-medium">
                <span>Showing {exceptions.length} results</span>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-colors" disabled>Previous</button>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-colors" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ExceptionStatus | string }) {
    const styles = {
        OPEN: 'bg-amber-100 text-amber-700 border border-amber-200',
        CONTACTING: 'bg-blue-100 text-blue-700 border border-blue-200',
        DOCUMENT_RECEIVED: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
        RESOLVED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        REJECTED: 'bg-rose-100 text-rose-700 border border-rose-200',
    };

    // Fallback for potentially unstructured string
    const statusKey = status as keyof typeof styles;
    const style = styles[statusKey] || 'bg-slate-100 text-slate-600 border border-slate-200';

    return (
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${style} shadow-sm`}>
            {status}
        </span>
    );
}

function SeverityBadge({ severity }: { severity: Severity }) {
    const styles = {
        LOW: 'text-slate-500 bg-slate-100 border-slate-200',
        MEDIUM: 'text-amber-600 bg-amber-50 border-amber-100',
        HIGH: 'text-orange-600 bg-orange-50 border-orange-100',
        CRITICAL: 'text-red-600 bg-red-50 border-red-100',
    };

    const style = styles[severity] || styles.MEDIUM;
    const baseClasses = "flex items-center px-2.5 py-0.5 rounded-full border text-xs font-bold w-fit";
    const Icon = severity === Severity.CRITICAL ? AlertCircle : severity === Severity.LOW ? CheckCircle : FileWarning;

    return (
        <div className={`${baseClasses} ${style}`}>
            <Icon size={12} className="mr-1.5" />
            {severity}
        </div>
    );
}

function formatExceptionType(type: string) {
    if (!type) return '';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
