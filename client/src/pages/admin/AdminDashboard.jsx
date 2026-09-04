import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardAnalytics } from '../../redux/slices/adminSlice';
import {
  Users,
  Store,
  Home,
  Flag,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { kpis, userGrowth, categoryBreakdown } = analytics;

  const statCards = [
    {
      title: 'Total Students',
      value: kpis.totalStudents,
      subValue: `${kpis.activeUsers} Active`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Marketplace',
      value: kpis.totalListings,
      subValue: `${kpis.activeListings} Available`,
      icon: Store,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Housing Posts',
      value: kpis.totalHousing,
      subValue: `${kpis.activeHousing} Active`,
      icon: Home,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Reports',
      value: kpis.totalReports,
      subValue: `${kpis.pendingReports} Pending`,
      icon: Flag,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-main)] font-heading">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Real-time analytics and platform metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="sn-card p-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black text-[var(--text-main)] font-mono">
                  {stat.value.toLocaleString()}
                </h3>
                <p className={`text-xs font-medium mt-1 ${stat.color}`}>
                  {stat.subValue}
                </p>
              </div>
              <div className={`p-3 rounded-2xl border ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="sn-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" /> New Signups (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    return `${date.getDate()}/${date.getMonth()+1}`;
                  }}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '12px' }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                  itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }} 
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marketplace Categories Chart */}
        <div className="sn-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
            <Store className="w-4 h-4 text-purple-500" /> Marketplace Categories
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '12px' }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                  itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                  cursor={{ fill: 'var(--border-light)', opacity: 0.4 }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                  name="Listings"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
