'use client';
import API_BASE_URL from '@/config/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function BillingPage() {
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUpiModal, setShowUpiModal] = useState(null);

    const fetchSubscription = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE_URL}/schools/subscription`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSub(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const handleUpgrade = async (plan) => {
        // if (!confirm(`Upgrade to ${plan} Plan? Payment will be simulated.`)) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_BASE_URL}/schools/subscription/upgrade`, {
                plan,
                durationMonths: 12
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Payment Verified! Subscription Active.');
            setShowUpiModal(null);
            fetchSubscription();
        } catch (err) { alert('Upgrade failed'); } finally { setLoading(false); }
    };

    if (!sub) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Billing Info...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Navbar />
            <div className="pt-32 px-4 max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Billing & Subscription</h1>
                    <p className="text-slate-400">Manage your school's plan and billing details.</p>
                </div>

                {/* Current Plan Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-3xl mb-16 flex flex-col md:flex-row justify-between items-center shadow-2xl">
                    <div className="mb-6 md:mb-0">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Current Plan</div>
                        <div className="text-5xl font-black text-white mb-2">{sub.plan} <span className="text-lg font-medium text-slate-500">Tier</span></div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${sub.isExpired ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            {sub.status} • {sub.daysLeft} Days Left
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-400 text-sm mb-1">Expires On</div>
                        <div className="text-2xl font-bold text-white mb-6">{new Date(sub.expiry).toLocaleDateString()}</div>
                        {sub.isExpired && <button onClick={() => setShowUpiModal({ plan: sub.plan, amount: 15000 })} className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all">Renew Now</button>}
                    </div>
                </div>

                {/* Upgrade Options */}
                <h2 className="text-2xl font-bold mb-8 text-center">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {['Basic', 'Premium', 'Enterprise'].map((plan, idx) => (
                        <div key={plan} className={`relative p-8 rounded-3xl border transition-all hover:transform hover:-translate-y-2 ${sub.plan === plan ? 'bg-orange-500 border-orange-500 shadow-2xl shadow-orange-500/20' : 'bg-slate-800/50 border-slate-700 hover:border-orange-500/50'}`}>
                            {sub.plan === plan && <div className="absolute top-0 right-0 bg-white text-orange-600 px-4 py-1 text-xs font-bold uppercase rounded-bl-xl rounded-tr-2xl">Current</div>}
                            <h3 className="text-xl font-bold mb-2">{plan}</h3>
                            <div className="text-4xl font-black mb-6">
                                {idx === 0 ? '₹15k' : idx === 1 ? '₹45k' : 'Custom'}
                                <span className="text-sm font-medium opacity-60">/year</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-sm opacity-80">
                                <li className="flex items-center space-x-2"><span>✓</span> <span>{idx === 0 ? 'Up to 500 Students' : idx === 1 ? 'Unlimited Students' : 'Custom Limits'}</span></li>
                                <li className="flex items-center space-x-2"><span>✓</span> <span>{idx === 0 ? 'Basic Reports' : 'Advanced Analytics'}</span></li>
                                <li className="flex items-center space-x-2"><span>✓</span> <span>{idx === 0 ? 'Email Support' : '24/7 Priority Support'}</span></li>
                            </ul>
                            <button
                                onClick={() => setShowUpiModal({ plan, amount: idx === 0 ? 15000 : 45000 })}
                                disabled={sub.plan === plan || loading}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${sub.plan === plan ? 'bg-white text-orange-600' : 'bg-slate-700 hover:bg-orange-500 hover:text-white'}`}
                            >
                                {sub.plan === plan ? 'Active Plan' : 'Pay via UPI'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* UPI Modal */}
                {showUpiModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full animate-in zoom-in duration-300">
                            <h3 className="text-2xl font-bold mb-2">Scan & Pay</h3>
                            <p className="text-slate-500 mb-6">Upgrade to {showUpiModal.plan} Plan</p>

                            <div className="bg-slate-100 p-4 rounded-xl flex justify-center mb-6">
                                {/* Simulated QR Code using API */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=neuralv@upi&pn=NeuralV&am=${showUpiModal.amount}&cu=INR`}
                                    alt="UPI QR Code"
                                    className="rounded-lg shadow-sm"
                                />
                            </div>

                            <div className="text-center mb-6">
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Amount to Pay</div>
                                <div className="text-4xl font-black text-slate-900">₹{showUpiModal.amount.toLocaleString()}</div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleUpgrade(showUpiModal.plan)}
                                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
                                >
                                    I have completed payment
                                </button>
                                <button
                                    onClick={() => setShowUpiModal(null)}
                                    className="w-full py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
