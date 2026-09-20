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
import Card from '../../components/ui/Card';
import { Alert, AlertDescription } from '../../components/ui/Alert';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <AlertDescription className="font-semibold ml-2">
            {error}
          </AlertDescription>
        </Alert>
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
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20'
    },
    {
      title: 'Marketplace',
      value: kpis.totalListings,
      subValue: `${kpis.activeListings} Available`,
      icon: Store,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20'
    },
    {
      title: 'Housing Posts',
      value: kpis.totalHousing,
      subValue: `${kpis.activeHousing} Active`,
      icon: Home,
      color: 'text-success',
      bg: 'bg-success/10 border-success/20'
    },
    {
      title: 'Reports',
      value: kpis.totalReports,
      subValue: `${kpis.pendingReports} Pending`,
      icon: Flag,
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/20'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-2">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground font-heading">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          Real-time analytics and platform metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6 flex items-start justify-between border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {stat.title}
                </p>
                <h3 className="text-4xl font-extrabold text-foreground font-heading tracking-tight">
                  {stat.value.toLocaleString()}
                </h3>
                <p className={`text-xs font-bold mt-2 ${stat.color}`}>
                  {stat.subValue}
                </p>
              </div>
              <div className={`p-3.5 rounded-2xl border shadow-sm ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <Card className="p-6 border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">New Signups (Last 7 Days)</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="_id" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    return `${date.getDate()}/${date.getMonth()+1}`;
                  }}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3F7D5A" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--background)' }}
                  activeDot={{ r: 6, fill: '#3F7D5A' }} 
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Marketplace Categories Chart */}
        <Card className="p-6 border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Store className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-base font-bold text-foreground">Marketplace Categories</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="_id" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                  cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#E27D5F" 
                  radius={[4, 4, 0, 0]}
                  name="Listings"
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
