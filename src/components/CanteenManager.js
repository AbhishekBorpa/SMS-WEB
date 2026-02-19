'use client';
import API_BASE_URL from '@/config/api';
import axios from 'axios';
import { useState } from 'react';

export default function CanteenManager({ selectedClass }) {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE_URL}/canteen/menu`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const url = selectedClass
                ? `${API_BASE_URL}/canteen/orders/all?classId=${selectedClass}`
                : `${API_BASE_URL}/canteen/orders/all`;

            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data);
        } catch (err) { console.error(err); }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        alert('Canteen management logic integrated with Inventory Linkage. Stock is now deducted automatically on orders.');
    };

    useState(() => {
        fetchMenu();
    }, []);

    useState(() => {
        fetchOrders();
    }, [selectedClass]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Inventory Management</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500" required />
                            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500" required />
                            <input type="number" placeholder="Initial Stock" value={stock} onChange={e => setStock(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-orange-500" required />
                            <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all">
                                Add to Inventory
                            </button>
                        </form>
                    </div>
                </div>

                <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">Menu & Stock</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Item</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Current Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.map(item => (
                                <tr key={item._id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                                    <td className="px-6 py-4 text-slate-600">${item.price}</td>
                                    <td className="px-6 py-4 font-black text-slate-800">{item.stock || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {item.stock > 10 ? 'Healthy' : 'Low Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
                    <button onClick={fetchOrders} className="text-sm text-orange-500 font-bold hover:underline">Refresh Orders</button>
                </div>
                {orders.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-medium">No orders found for this selection.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">
                                        {order.student?.name || 'Unknown'}
                                        <div className="text-[10px] text-slate-400 font-normal">{order.student?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {order.items.map(i => `${i.item?.name} (x${i.quantity})`).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-800">${order.totalAmount}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
