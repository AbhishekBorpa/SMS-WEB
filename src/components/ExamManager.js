import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../../config/api';

export default function ExamManager() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newExam, setNewExam] = useState({
        title: '',
        subject: '',
        date: '',
        startTime: '',
        endTime: '',
        totalMarks: 100,
        classId: ''
    });
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchExams();
        fetchClasses();
    }, []);

    const fetchExams = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE_URL}/exams`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExams(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE_URL}/classes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_BASE_URL}/exams`, newExam, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Exam scheduled successfully!');
            setShowCreateModal(false);
            fetchExams();
            setNewExam({ title: '', subject: '', date: '', startTime: '', endTime: '', totalMarks: 100, classId: '' });
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Failed to schedule exam.');
        }
    };

    const handlePublish = async (examId) => {
        if (!confirm('Are you sure you want to publish results for this exam?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API_BASE_URL}/exams/${examId}/publish`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Exam results published!');
            fetchExams();
        } catch (error) {
            console.error('Error publishing exam:', error);
            alert('Failed to publish results.');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Exam Management
                </h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg hover:shadow-purple-500/20"
                >
                    + Schedule Exam
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading exams...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <div key={exam._id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{exam.title}</h3>
                                    <span className="text-sm text-slate-400">{exam.subject} • {exam.class?.name}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.status === 'Published'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    }`}>
                                    {exam.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-slate-300 text-sm">
                                    <span className="w-24 text-slate-500">Date:</span>
                                    {new Date(exam.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-slate-300 text-sm">
                                    <span className="w-24 text-slate-500">Time:</span>
                                    {exam.startTime} - {exam.endTime}
                                </div>
                                <div className="flex items-center text-slate-300 text-sm">
                                    <span className="w-24 text-slate-500">Total Marks:</span>
                                    {exam.totalMarks}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {exam.status !== 'Published' && (
                                    <button
                                        onClick={() => handlePublish(exam._id)}
                                        className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-600/30 py-2 rounded-lg text-sm font-semibold transition-all"
                                    >
                                        Publish Results
                                    </button>
                                )}
                                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-semibold transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-lg">
                        <h3 className="text-2xl font-bold text-white mb-6">Schedule New Exam</h3>
                        <form onSubmit={handleCreateExam} className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Exam Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="e.g. Midterm 2025"
                                    value={newExam.title}
                                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        value={newExam.subject}
                                        onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Class</label>
                                    <select
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        value={newExam.classId}
                                        onChange={(e) => setNewExam({ ...newExam, classId: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        value={newExam.date}
                                        onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Total Marks</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        value={newExam.totalMarks}
                                        onChange={(e) => setNewExam({ ...newExam, totalMarks: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        value={newExam.startTime}
                                        onChange={(e) => setNewExam({ ...newExam, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                        value={newExam.endTime}
                                        onChange={(e) => setNewExam({ ...newExam, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
                                >
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
