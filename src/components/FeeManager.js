'use client';
import API_BASE_URL from '@/config/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function FeeManager({ classes = [], students = [] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Bulk Assign State
    const [bulkClass, setBulkClass] = useState('');
    const [bulkAmount, setBulkAmount] = useState('');
    const [bulkDate, setBulkDate] = useState('');
    const [bulkDesc, setBulkDesc] = useState('');

    // Fetch Transactions
    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE_URL}/fees/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (activeTab === 'transactions') fetchTransactions();
    }, [activeTab]);

    const handleBulkAssign = async (e) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to assign this fee to all students in the selected class?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_BASE_URL}/fees/bulk-assign`, {
                classId: bulkClass,
                amount: bulkAmount,
                dueDate: bulkDate,
                description: bulkDesc
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Fees assigned successfully');
            setBulkAmount(''); setBulkDesc('');
        } catch (err) { alert('Failed to assign fees'); } finally { setLoading(false); }
    };

    const handleMarkPaid = async (studentId, amount, type = 'Cash') => {
        let remarks = 'Cash Payment Received (Admin)';

        if (type === 'UPI') {
            const refId = prompt('Enter UPI Transaction ID / UTR Number:');
            if (!refId) return;
            remarks = `UPI Ref: ${refId}`;
        } else {
            if (!confirm('Mark full payment received via Cash?')) return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API_BASE_URL}/fees/${studentId}`, {
                feeStatus: 'Paid',
                feeAmount: 0,
                remarks
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh logic needs to come from parent or context, for now alert
            alert('Payment recorded. Refreshing...');
            window.location.reload(); // Simple reload to refresh data
        } catch (err) { alert('Error recording payment'); }
    };

    // Calculate Stats
    const totalPending = students.reduce((acc, s) => acc + (s.feeAmount || 0), 0);
    const pendingCount = students.filter(s => s.feeStatus === 'Pending').length;

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                {['overview', 'collect', 'structure', 'transactions'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg min-h-[400px]">

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">Total Outstanding</h3>
                            <div className="text-4xl font-black text-slate-900">₹{totalPending.toLocaleString()}</div>
                            <p className="text-slate-500 mt-2">{pendingCount} students with pending dues</p>
                        </div>
                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2">Recent Collections</h3>
                            <div className="text-4xl font-black text-slate-900">Check History</div>
                            <p className="text-slate-500 mt-2">View transactions tab for details</p>
                        </div>
                    </div>
                )}

                {/* COLLECT FEES */}
                {activeTab === 'collect' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Dues</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.filter(s => s.feeStatus === 'Pending').map(student => (
                                    <tr key={student._id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            {student.name}
                                            <div className="text-[10px] text-slate-400 font-normal">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-800">₹{student.feeAmount?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-600">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleMarkPaid(student._id, student.feeAmount)}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors"
                                            >
                                                Mark Paid (Cash)
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {students.filter(s => s.feeStatus === 'Pending').length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">No pending dues found. Good job! 🎉</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* FEE STRUCTURES */}
                {activeTab === 'structure' && (
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Bulk Assign Fees</h2>
                        <form onSubmit={handleBulkAssign} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Class</label>
                                <select required value={bulkClass} onChange={e => setBulkClass(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-orange-500">
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount (₹)</label>
                                <input required type="number" value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500" placeholder="e.g. 5000" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                                <input required type="text" value={bulkDesc} onChange={e => setBulkDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500" placeholder="e.g. Term 2 Tuition Fee" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Due Date</label>
                                <input type="date" value={bulkDate} onChange={e => setBulkDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500" />
                            </div>
                            <button disabled={loading} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50">
                                {loading ? 'Processing...' : 'Assign Fee to Class'}
                            </button>
                        </form>
                    </div>
                )}

                {/* TRANSACTIONS */}
                {activeTab === 'transactions' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions.map(txn => (
                                    <tr key={txn._id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-slate-500 text-xs">{new Date(txn.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{txn.student?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${txn.type === 'Credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">₹{txn.amount}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">{txn.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
