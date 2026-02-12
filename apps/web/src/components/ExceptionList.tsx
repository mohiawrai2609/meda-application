import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, MoreHorizontal, Search, FileText, AlertCircle, CheckCircle, Clock, FileWarning } from 'lucide-react';
import axios from 'axios';
import { ExceptionStatus, ExceptionType, Severity } from '../types';

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
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exception Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exceptions.map((exc) => (
                            <tr
                                key={exc.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/exceptions/${exc.id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {exc.loan?.loanNumber || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {exc.loan?.borrowerName || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatExceptionType(exc.exceptionType)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SeverityBadge severity={exc.severity} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={exc.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(exc.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">Showing {exceptions.length} results</span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ExceptionStatus | string }) {
    const styles = {
        OPEN: 'bg-yellow-100 text-yellow-800',
        CONTACTING: 'bg-blue-100 text-blue-800',
        DOCUMENT_RECEIVED: 'bg-indigo-100 text-indigo-800',
        RESOLVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };

    // Fallback for potentially unstructured string
    const statusKey = status as keyof typeof styles;
    const style = styles[statusKey] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
            {status}
        </span>
    );
}

function SeverityBadge({ severity }: { severity: Severity }) {
    const styles = {
        LOW: 'text-gray-500',
        MEDIUM: 'text-yellow-600',
        HIGH: 'text-orange-600',
        CRITICAL: 'text-red-600',
    };

    const style = styles[severity] || styles.MEDIUM;
    const Icon = severity === Severity.CRITICAL ? AlertCircle : severity === Severity.LOW ? CheckCircle : FileWarning;

    return (
        <div className={`flex items-center text-xs font-medium ${style}`}>
            <Icon size={14} className="mr-1.5" />
            {severity}
        </div>
    );
}

function formatExceptionType(type: string) {
    if (!type) return '';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
