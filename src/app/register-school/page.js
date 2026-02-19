'use client';

import API_BASE_URL from '@/config/api';
import axios from 'axios';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

export default function RegisterSchool() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        schoolType: 'K-12',
        website: '',
        address: '',
        phone: '',
        contactEmail: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSlugChange = (e) => {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setFormData({ ...formData, slug: val });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(`${API_BASE_URL}/schools`, formData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20 animate-in zoom-in duration-500">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Welcome to NeuralV! 🚀</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-md">
                    <strong>{formData.name}</strong> is now live. Your digital campus is ready to launch.
                </p>
                <div className="space-y-4 w-full max-w-sm">
                    <a href="/login" className="block w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/10">
                        Go to Admin Dashboard
                    </a>
                    <a href="/" className="block w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900 font-sans selection:bg-orange-500/30">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="flex justify-between items-center mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
                        <div className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 -z-10 rounded-full`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                        {[1, 2, 3].map((num) => (
                            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 border-slate-900 ${step >= num ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' : 'bg-slate-800 text-slate-500'}`}>
                                {num}
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/5 shadow-2xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {step === 1 && 'School Identity'}
                                {step === 2 && 'Contact Details'}
                                {step === 3 && 'Access Control'}
                            </h1>
                            <p className="text-slate-400">
                                {step === 1 && 'Tell us about your institution'}
                                {step === 2 && 'Where can we reach you?'}
                                {step === 3 && 'Create your super-admin account'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">School Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                            placeholder="e.g. Apex International School"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unique Slug</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="slug"
                                                    required
                                                    value={formData.slug}
                                                    onChange={handleSlugChange}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                                    placeholder="apex-intl"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {formData.slug && <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">Available</span>}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">Your dedicated URL: neuralv.com/school/{formData.slug || 'slug'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institution Type</label>
                                            <select
                                                name="schoolType"
                                                value={formData.schoolType}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg appearance-none"
                                            >
                                                <option value="K-12">K-12 School</option>
                                                <option value="Primary">Primary School</option>
                                                <option value="Secondary">High / Secondary School</option>
                                                <option value="University">University / College</option>
                                                <option value="Institute">Coaching Institute</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="button" onClick={nextStep} className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all mt-4 text-lg">
                                        Next Step →
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Official Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            required
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                            placeholder="admissions@school.edu"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Website (Optional)</label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                                placeholder="https://school.edu"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Physical Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                            placeholder="123 Education Lane, Knowledge City..."
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" onClick={prevStep} className="w-full bg-transparent border border-slate-700 text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                                            ← Back
                                        </button>
                                        <button type="button" onClick={nextStep} className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">
                                            Next Step →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start space-x-3">
                                        <span className="text-2xl">👑</span>
                                        <div>
                                            <h4 className="text-orange-400 font-bold text-sm">Super Admin Access</h4>
                                            <p className="text-orange-300/60 text-xs mt-1">This account will have full control over the school's digital infrastructure.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Administrator Name</label>
                                        <input
                                            type="text"
                                            name="adminName"
                                            required
                                            value={formData.adminName}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                            placeholder="e.g. Dr. Robert Ford"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Administrator Email</label>
                                        <input
                                            type="email"
                                            name="adminEmail"
                                            required
                                            value={formData.adminEmail}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                            placeholder="admin@school.edu"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Secure Password</label>
                                        <input
                                            type="password"
                                            name="adminPassword"
                                            required
                                            value={formData.adminPassword}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-lg placeholder-slate-600"
                                            placeholder="••••••••••••"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <button type="button" onClick={prevStep} className="w-full bg-transparent border border-slate-700 text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    <span>Launching...</span>
                                                </>
                                            ) : (
                                                <span>Launch School 🚀</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
