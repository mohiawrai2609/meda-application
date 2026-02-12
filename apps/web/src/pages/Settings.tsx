import { useState } from 'react';
import axios from 'axios';
import { Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Settings() {
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [createdId, setCreatedId] = useState<string | null>(null);

    const handleReset = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/admin/reset`);
            alert('System reset successfully. All data has been cleared.');
            window.location.reload();
        } catch (error) {
            console.error('Reset failed', error);
            alert('Failed to reset system');
        } finally {
            setLoading(false);
            setConfirming(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertTriangle size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                    </div>
                    <p className="text-gray-600 text-sm ml-12">
                        These actions are destructive and cannot be undone. Use with caution.
                    </p>
                </div>

                <div className="p-6 bg-red-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Reset Demo Data</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Permanently delete all exceptions, loans, and documents.
                            </p>
                        </div>

                        {!confirming ? (
                            <button
                                onClick={() => setConfirming(true)}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                            >
                                Reset Data
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-red-700 font-medium">Are you sure?</span>
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                                >
                                    {loading ? 'Resetting...' : <><Trash2 size={16} /> Confirm Reset</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Seed Demo Data</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Create a dummy loan and exception to test the flow immediately.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const res = await axios.post(`${API_URL}/admin/seed`);
                                        setCreatedId(res.data.exceptionId);
                                        setLoading(false);
                                    } catch (e: any) {
                                        console.error('Seed Error Full:', e);
                                        alert(`Failed to seed data: ${e.response?.data?.error || e.message}\n\nDetails: ${e.response?.data?.details || 'Check terminal'}`);
                                        setLoading(false);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Test Data'}
                            </button>

                            {createdId && (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                                    <p className="font-semibold text-blue-900 mb-1">Success! Exception Created:</p>
                                    <code className="bg-white px-2 py-1 rounded border border-blue-200 block mb-2 select-all">
                                        {createdId}
                                    </code>
                                    <a
                                        href={`http://localhost:5174/?id=${createdId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                                    >
                                        Open Borrower Portal →
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
                        <p className="text-gray-500 text-sm">All services operational</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="text-xs font-semibold text-gray-500 uppercase">API Version</label>
                        <div className="mt-1 font-mono text-gray-900">v1.0.0 (MVP)</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Environment</label>
                        <div className="mt-1 font-mono text-gray-900">Development (Docker)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
