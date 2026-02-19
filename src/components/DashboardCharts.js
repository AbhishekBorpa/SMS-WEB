'use client';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function DashboardCharts({ revenueTrend, attendanceStats, academicStats }) {
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Transform academic data for charts
    const academicData = academicStats?.labels?.map((label, index) => ({
        subject: label,
        score: academicStats.data[index]
    })) || [];

    // Transform attendance data
    const attendanceData = attendanceStats?.labels?.map((label, index) => ({
        label: label,
        value: attendanceStats.data[index]
    })) || [];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Revenue Area Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Revenue Growth</h3>
                        <p className="text-sm text-slate-400 mt-1">Monthly income trends.</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueTrend?.labels?.map((l, i) => ({ name: l, revenue: revenueTrend.data[i] })) || []}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Attendance Radar/Line Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Attendance Analysis</h3>
                        <p className="text-sm text-slate-400 mt-1">Attendance percentage.</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {attendanceData.length > 5 ? (
                            <LineChart data={attendanceData}>
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px' }} />
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        ) : (
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attendanceData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Attendance" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Academic Performance Bar Chart */}
            <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Academic Performance</h3>
                        <p className="text-sm text-slate-400 mt-1">Average scores.</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={academicData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                            <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                                {academicData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
