import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Import() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('IDLE');
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('UPLOADING');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
            setStatus('SUCCESS');
        } catch (err: any) {
            console.error('Upload error:', err);
            setStatus('ERROR');
            setError(err.response?.data?.error || 'Failed to import CSV file. Please check the format.');
        }
    };

    const downloadTemplate = () => {
        const headers = 'loan_number,borrower_name,borrower_email,exception_type,document_type,description,severity';
        const sampleRow = '\n123456789,John Doe,john.doe@example.com,MISSING_DOCUMENT,BANK_STATEMENT,"Missing last 2 months of statements",HIGH';
        const blob = new Blob([headers + sampleRow], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meda_import_template.csv';
        a.click();
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Import Exceptions</h1>
                    <p className="text-gray-500 mt-1">Bulk upload loan exceptions from your LOS system via CSV</p>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <Download size={16} />
                    Download Template
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    {status === 'IDLE' && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors bg-gray-50 relative group">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-gray-900 font-semibold text-lg">
                                        {file ? file.name : 'Click or drag CSV file to upload'}
                                    </p>
                                    <p className="text-gray-500 mt-2">Only .csv files are supported (Max 5MB)</p>
                                </div>
                            </div>

                            {file && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleUpload}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                                    >
                                        Process Import
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'UPLOADING' && (
                        <div className="py-12 text-center">
                            <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Uploading & Parsing...</h3>
                            <p className="text-gray-500 mt-2">Checking records and triggering AI Chase Loop</p>
                        </div>
                    )}

                    {status === 'SUCCESS' && (
                        <div className="py-8 text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Successful!</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Successfully imported <strong>{result?.count || 0}</strong> exceptions.
                                The AI Chase Loop has been triggered for newly contacted borrowers.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => { setFile(null); setStatus('IDLE'); }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Import More
                                </button>
                                <a
                                    href="/exceptions"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md"
                                >
                                    View Queue
                                </a>
                            </div>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="py-8 text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Failed</h2>
                            <p className="text-red-600 mb-8 max-w-md mx-auto">{error}</p>
                            <button
                                onClick={() => setStatus('IDLE')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText size={14} />
                        Supported CSV Format
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div>
                            <span className="text-gray-500 font-medium">loan_number</span>
                            <p className="text-gray-400">Unique identifier</p>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">borrower_email</span>
                            <p className="text-gray-400">Where requests are sent</p>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">exception_type</span>
                            <p className="text-gray-400">MISSING_DOCUMENT, etc.</p>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">severity</span>
                            <p className="text-gray-400">LOW, MEDIUM, HIGH, CRITICAL</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
