import { useState } from 'react';
import axios from 'axios';
import { Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Settings() {
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

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

                <div className="p-6 bg-red-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-800">Reset System Data</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-md">
                                Permanently delete all exceptions, loans, import history, and communications. This action cannot be undone.
                            </p>
                        </div>

                        {!confirming ? (
                            <button
                                onClick={() => setConfirming(true)}
                                className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 font-semibold transition-all shadow-sm hover:shadow"
                            >
                                Reset Data
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 bg-red-50 p-2 rounded-xl border border-red-100">
                                <span className="text-sm text-red-700 font-medium px-2">Are you sure?</span>
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium hover:bg-white/50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-sm shadow-red-200"
                                >
                                    {loading ? 'Resetting...' : <><Trash2 size={16} /> Confirm Reset</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* System Status Section */}
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-xl">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">System Status</h2>
                            <p className="text-slate-500 text-sm mt-1">Operational health and environment details</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">API Version</label>
                        <div className="mt-2 font-mono text-slate-700 font-semibold">v1.0.0 (MVP)</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Environment</label>
                        <div className="mt-2 font-mono text-slate-700 font-semibold">Development (Local)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
