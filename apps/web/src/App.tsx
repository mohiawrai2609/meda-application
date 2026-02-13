import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExceptionList } from './components/ExceptionList';
import ExceptionDetail from './pages/ExceptionDetail';
import Settings from './pages/Settings';
import Import from './pages/Import';
import EmailInbox from './pages/EmailInbox';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

function StatCard({ label, value, change, icon, color }: any) {
    return (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {change}
                </span>
            </div>
            <div>
                <h3 className="text-slate-500 text-sm font-medium tracking-wide uppercase">{label}</h3>
                <p className="text-3xl font-bold text-slate-800 mt-1 tracking-tight">{value}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Updated 5m ago
                </span>
            </div>
        </div>
    );
}

function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Real-time status of your loan exception pipeline.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Active Exceptions"
                    value="23"
                    change="+12%"
                    icon={<Activity size={24} />}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    label="Awaiting Response"
                    value="12"
                    change="-5%"
                    icon={<Clock size={24} />}
                    color="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <StatCard
                    label="Resolved Today"
                    value="8"
                    change="+24%"
                    icon={<CheckCircle size={24} />}
                    color="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <StatCard
                    label="Escalated"
                    value="2"
                    change="0%"
                    icon={<AlertCircle size={24} />}
                    color="bg-gradient-to-br from-rose-500 to-red-600"
                />
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Recent Exceptions</h3>
                        <p className="text-sm text-slate-500">Items requiring your attention</p>
                    </div>
                    <button className="text-sm px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg font-medium transition-colors">
                        View All
                    </button>
                </div>
                <div className="p-0">
                    <ExceptionList />
                </div>
            </div>
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
                    <Route path="/import" element={<Import />} />
                    <Route path="/emails" element={<EmailInbox />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
