'use client';
import API_BASE_URL from '@/config/api';
import axios from 'axios';
import { useState } from 'react';

export default function BroadcastCenter({ notices, onRefresh, classes = [], selectedClass = '' }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [targetAudience, setTargetAudience] = useState('All');
    const [targetClassId, setTargetClassId] = useState(selectedClass || '');
    const [loading, setLoading] = useState(false);

    // Update local state when prop changes
    useState(() => {
        if (selectedClass) setTargetClassId(selectedClass);
    }, [selectedClass]);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_BASE_URL}/notices`, {
                title,
                message: content,
                priority,
                targetAudience,
                targetClassId: targetAudience === 'Student' ? targetClassId : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTitle(''); setContent('');
            onRefresh();
        } catch (err) { alert('Broadcast failed'); } finally { setLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">New Broadcast</h2>
                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none" placeholder="Emergency Holiday..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Priority</label>
                                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none bg-white">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Audience</label>
                                <select value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none bg-white">
                                    <option value="All">Everyone</option>
                                    <option value="Student">Students Only</option>
                                    <option value="Teacher">Teachers Only</option>
                                </select>
                            </div>
                        </div>

                        {targetAudience === 'Student' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Target Class (Optional)</label>
                                <select value={targetClassId} onChange={e => setTargetClassId(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none bg-white">
                                    <option value="">All Classes</option>
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                                    ))}
                                </select>
                                {selectedClass && <p className="text-[10px] text-orange-500 mt-1">* Pre-selected from dashboard filter</p>}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Message Content</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} required rows="4" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none" placeholder="Type your message here..."></textarea>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
                            {loading ? 'Sending...' : 'Send Broadcast'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="xl:col-span-2 space-y-4">
                {notices.map(notice => (
                    <div key={notice._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        {notice.targetClass && (
                            <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl">
                                {notice.targetClass?.name || 'Class Specific'}
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex space-x-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${notice.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                                    {notice.priority || 'General'}
                                </span>
                                {notice.targetAudience && notice.targetAudience !== 'All' && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-500">
                                        {notice.targetAudience} Only
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{new Date(notice.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{notice.title}</h3>
                        <p className="text-slate-500 mt-2 text-sm leading-relaxed">{notice.message || notice.content}</p>
                        <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                {notice.postedBy?.name?.[0] || 'A'}
                            </div>
                            <span>Posted by {notice.postedBy?.name || 'Admin'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
