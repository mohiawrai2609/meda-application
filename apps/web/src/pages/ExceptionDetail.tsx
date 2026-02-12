import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, ArrowLeft, FileText, Clock, User, File } from 'lucide-react';
import { Exception, ExceptionStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function ExceptionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exception, setException] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchException();
    }, [id]);

    const fetchException = async () => {
        try {
            const response = await axios.get(`${API_URL}/exceptions/${id}`);
            setException(response.data);
        } catch (error) {
            console.error('Failed to fetch exception', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'resolve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this exception?`)) return;

        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/exceptions/${id}/${action}`, action === 'reject' ? { reason: 'Processor Rejection' } : {});
            await fetchException(); // Refresh data
        } catch (error) {
            console.error(`Failed to ${action}`, error);
            alert(`Failed to ${action} exception`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!exception) return <div className="p-8 text-center text-red-500">Exception not found</div>;

    const document = exception.documents && exception.documents.length > 0 ? exception.documents[0] : null;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/exceptions')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Exception #{exception.id.slice(0, 8)}</h1>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{new Date(exception.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                ${exception.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                                    exception.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                        'bg-blue-100 text-blue-800'}`}>
                                {exception.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3">
                    {exception.status !== 'RESOLVED' && (
                        <>
                            <button
                                onClick={() => handleAction('reject')}
                                disabled={actionLoading}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                            <button
                                onClick={() => handleAction('resolve')}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Approve
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Loan Info */}
                <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Loan Details</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Borrower</label>
                            <div className="flex items-center gap-2 mt-1">
                                <User size={16} className="text-gray-400" />
                                <span className="text-gray-900">{exception.loan?.borrowerName || 'Unknown'}</span>
                            </div>
                            <div className="text-sm text-gray-500 ml-6">{exception.loan?.borrowerEmail}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Loan Number</label>
                            <div className="font-mono text-gray-900 mt-1">{exception.loan?.loanNumber}</div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Required Document</label>
                            <div className="font-medium text-blue-600 mt-1">{exception.documentType}</div>
                            <p className="text-sm text-gray-600 mt-1">{exception.description}</p>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mt-8 mb-4 pb-2 border-b">History</h3>
                    <div className="space-y-4">
                        {exception.auditLogs?.map((log: any) => (
                            <div key={log.id} className="relative pl-4 border-l-2 border-gray-200 py-1">
                                <div className="text-sm font-medium text-gray-900">{log.action}</div>
                                <div className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Panel: Document Viewer */}
                <div className="flex-1 bg-gray-100 flex flex-col p-4">
                    {document ? (
                        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                            <div className="p-3 border-b flex justify-between bg-gray-50">
                                <span className="font-medium text-sm flex items-center gap-2">
                                    <File size={16} /> {document.fileName}
                                </span>
                                <a href={`http://localhost:3000${document.storageUrl}`} target="_blank" className="text-blue-600 text-sm hover:underline">Download</a>
                            </div>
                            {/* In a real app, use PDF.js or similar for better rendering. For MVP, using iframe/img */}
                            <iframe
                                src={`http://localhost:3000${document.storageUrl}`}
                                className="w-full h-full bg-gray-100"
                                title="Document Preview"
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <FileText size={48} className="mb-4 text-gray-300" />
                            <p>No document uploaded yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
