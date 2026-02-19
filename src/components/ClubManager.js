
import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../config/api';

const ClubManager = ({ teachers }) => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClub, setCurrentClub] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        meetingDay: '',
        meetingTime: '',
        facultyAdvisor: ''
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE_URL}/clubs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClubs(data);
        } catch (error) {
            console.error('Failed to fetch clubs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            if (currentClub) {
                await axios.put(`${API_BASE_URL}/clubs/${currentClub._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Club updated successfully!');
            } else {
                await axios.post(`${API_BASE_URL}/clubs`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Club created successfully!');
            }
            closeModal();
            fetchClubs();
        } catch (error) {
            console.error('Error saving club', error);
            alert('Failed to save club');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this club?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_BASE_URL}/clubs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchClubs();
        } catch (error) {
            console.error('Error deleting club', error);
            alert('Failed to delete club');
        }
    };

    const openModal = (club = null) => {
        if (club) {
            setCurrentClub(club);
            setFormData({
                name: club.name,
                description: club.description,
                meetingDay: club.meetingDay || '',
                meetingTime: club.meetingTime || '',
                facultyAdvisor: club.facultyAdvisor?._id || club.facultyAdvisor || ''
            });
        } else {
            setCurrentClub(null);
            setFormData({
                name: '',
                description: '',
                meetingDay: '',
                meetingTime: '',
                facultyAdvisor: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentClub(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Clubs & Societies</h2>
                <button
                    onClick={() => openModal()}
                    className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create New Club
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clubs.map(club => (
                    <div key={club._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl font-bold text-orange-500">
                                {club.name.charAt(0)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(club)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onClick={() => handleDelete(club._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-1">{club.name}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{club.description}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                {club.meetingDay || 'TBA'} • {club.meetingTime || 'TBA'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                {club.facultyAdvisor?.name || 'No Advisor'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                {club.members?.length || 0} Members
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">{currentClub ? 'Edit Club' : 'Create New Club'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Club Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none font-medium min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Day</label>
                                    <select
                                        value={formData.meetingDay}
                                        onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none font-medium bg-white"
                                    >
                                        <option value="">Select Day</option>
                                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Time</label>
                                    <input
                                        type="time"
                                        value={formData.meetingTime}
                                        onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Faculty Advisor</label>
                                <select
                                    value={formData.facultyAdvisor}
                                    onChange={(e) => setFormData({ ...formData, facultyAdvisor: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none font-medium bg-white"
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/50 transition-all mt-4"
                            >
                                {currentClub ? 'Update Club' : 'Create Club'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubManager;
