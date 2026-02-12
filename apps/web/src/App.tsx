import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExceptionList } from './components/ExceptionList';
import ExceptionDetail from './pages/ExceptionDetail';
import Settings from './pages/Settings';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

function StatCard({ label, value, change, icon }: any) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-blue-50 text-blue-600`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className={change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {change}
                </span>
                <span className="text-gray-400 ml-2">from last week</span>
            </div>
        </div>
    );
}

function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Active Exceptions" value="23" change="+2" icon={<Activity size={20} />} />
                <StatCard label="Awaiting Response" value="12" change="-1" icon={<Clock size={20} />} />
                <StatCard label="Resolved Today" value="8" change="+3" icon={<CheckCircle size={20} />} />
                <StatCard label="Escalated" value="2" change="0" icon={<AlertCircle size={20} />} />
            </div>
            <ExceptionList />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/exceptions" element={<ExceptionList />} />
                    <Route path="/exceptions/:id" element={<ExceptionDetail />} />
                    <Route path="/import" element={<div className="p-8 text-center text-gray-500">CSV Import UI Coming Soon</div>} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
