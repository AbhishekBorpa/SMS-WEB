'use client';
import { useState } from 'react';

export default function LibraryManager({ books, loans, students, onIssue, onReturn, onAddBook, onDeleteBook }) {
    const [view, setView] = useState('inventory'); // 'inventory' or 'loans'
    const [showAddModal, setShowAddModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    // Form States
    const [newBook, setNewBook] = useState({ title: '', author: '', subject: '', totalCopies: 1 });
    const [issueDetails, setIssueDetails] = useState({ studentId: '', dueDate: '' });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        onAddBook(newBook);
        setShowAddModal(false);
        setNewBook({ title: '', author: '', subject: '', totalCopies: 1 });
    };

    const openIssueModal = (book) => {
        setSelectedBook(book);
        setShowIssueModal(true);
    };

    const handleIssueSubmit = (e) => {
        e.preventDefault();
        onIssue({ bookId: selectedBook._id, ...issueDetails });
        setShowIssueModal(false);
        setIssueDetails({ studentId: '', dueDate: '' });
        setSelectedBook(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setView('inventory')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'inventory' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setView('loans')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'loans' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                        Circulation
                    </button>
                </div>
                {view === 'inventory' && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all"
                    >
                        + Add New Book
                    </button>
                )}
            </div>

            {view === 'inventory' ? (
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Book Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Subject</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {books.map(book => (
                                <tr key={book._id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700">{book.title}</div>
                                        <div className="text-xs text-slate-400">by {book.author}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{book.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {book.availableCopies} / {book.totalCopies} Available
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        {book.availableCopies > 0 && (
                                            <button
                                                onClick={() => openIssueModal(book)}
                                                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                                            >
                                                Issue
                                            </button>
                                        )}
                                        <button onClick={() => onDeleteBook(book._id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Book</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Due Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loans.map(loan => (
                                <tr key={loan._id}>
                                    <td className="px-6 py-4 font-bold text-slate-700">{loan.student?.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{loan.book?.title}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(loan.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {loan.status === 'Issued' && (
                                            <button
                                                onClick={() => onReturn(loan._id)}
                                                className="px-4 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold"
                                            >
                                                Return
                                            </button>
                                        )}
                                        {loan.status === 'Returned' && (
                                            <span className="text-emerald-500 text-xs font-bold">Returned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Book Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Book</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input
                                placeholder="Book Title"
                                required
                                className="w-full p-3 border rounded-lg"
                                value={newBook.title}
                                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                            />
                            <input
                                placeholder="Author"
                                required
                                className="w-full p-3 border rounded-lg"
                                value={newBook.author}
                                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Subject"
                                    required
                                    className="w-full p-3 border rounded-lg"
                                    value={newBook.subject}
                                    onChange={e => setNewBook({ ...newBook, subject: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Copies"
                                    min="1"
                                    required
                                    className="w-full p-3 border rounded-lg"
                                    value={newBook.totalCopies}
                                    onChange={e => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold">Add Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Issue Book Modal */}
            {showIssueModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-2">Issue Book</h3>
                        <p className="text-slate-500 mb-6">Issuing: <span className="font-bold text-slate-800">{selectedBook?.title}</span></p>

                        <form onSubmit={handleIssueSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-1">Select Student</label>
                                <select
                                    required
                                    className="w-full p-3 border rounded-lg bg-white"
                                    value={issueDetails.studentId}
                                    onChange={e => setIssueDetails({ ...issueDetails, studentId: e.target.value })}
                                >
                                    <option value="">Choose Student...</option>
                                    {students?.map(student => (
                                        <option key={student._id} value={student._id}>{student.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full p-3 border rounded-lg"
                                    value={issueDetails.dueDate}
                                    onChange={e => setIssueDetails({ ...issueDetails, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold">Issue Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
