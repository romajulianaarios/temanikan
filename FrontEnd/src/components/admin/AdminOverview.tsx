import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Bot, Activity, AlertTriangle, TrendingUp, TrendingDown } from '../icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from '../Router';

export default function AdminOverview() {
  const stats = [
    {
      label: 'Total Pengguna',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: '#608BC1'
    },
    {
      label: 'Robot Aktif',
      value: '856',
      change: '+8.2%',
      trend: 'up',
      icon: Bot,
      color: '#133E87'
    },
    {
      label: 'Deteksi Penyakit (Bulan Ini)',
      value: '342',
      change: '-5.3%',
      trend: 'down',
      icon: Activity,
      color: '#608BC1'
    },
    {
      label: 'Peringatan Sistem',
      value: '23',
      change: '+15.2%',
      trend: 'up',
      icon: AlertTriangle,
      color: '#ff9800'
    },
  ];

  const userGrowthData = [
    { month: 'Jun', users: 850 },
    { month: 'Jul', users: 920 },
    { month: 'Aug', users: 1050 },
    { month: 'Sep', users: 1100 },
    { month: 'Okt', users: 1180 },
    { month: 'Nov', users: 1247 },
  ];

  const diseaseDistribution = [
    { name: 'White Spot', value: 145, color: '#608BC1' },
    { name: 'Fin Rot', value: 98, color: '#133E87' },
    { name: 'Ich', value: 56, color: '#CBDCEB' },
    { name: 'Lainnya', value: 43, color: '#F3F3E0' },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      message: 'Robot ID #234 mengalami error sistem',
      user: 'Ahmad Wijaya',
      time: '10 menit yang lalu'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Lonjakan deteksi penyakit di area Jakarta',
      user: 'Sistem',
      time: '1 jam yang lalu'
    },
    {
      id: 3,
      type: 'info',
      message: 'Update firmware tersedia untuk 12 robot',
      user: 'Sistem',
      time: '2 jam yang lalu'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #F3F4F6'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `${stat.color}15`, // 15 is approx 8% opacity hex
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              {stat.trend === 'up' ? (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg text-xs font-medium">
                  <TrendingDown className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#6B7280' }}>{stat.label}</p>
            <p className="text-3xl font-bold tracking-tight" style={{ color: '#111827' }}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card
          className="p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #F3F4F6'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg" style={{ color: '#111827' }}>Pertumbuhan Pengguna</h3>
            <select className="text-xs border rounded-lg px-2 py-1 bg-gray-50 text-gray-600 outline-none">
              <option>6 Bulan Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={userGrowthData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: '#F9FAFB' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="users"
                fill="#4880FF"
                name="Pengguna"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Disease Distribution */}
        <Card
          className="p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #F3F4F6'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg" style={{ color: '#111827' }}>Distribusi Jenis Penyakit</h3>
            <button className="text-xs text-blue-600 font-medium hover:underline">Lihat Detail</button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-48 space-y-3">
              {diseaseDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* System Alerts */}
      <Card
        className="p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          border: '1px solid #F3F4F6'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg" style={{ color: '#111827' }}>Peringatan Sistem Terbaru</h3>
          <Link
            to="/admin/notifications"
            className="text-sm font-semibold hover:underline transition-all"
            style={{ color: '#4880FF' }}
          >
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-100"
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${alert.type === 'critical' ? 'bg-red-50 text-red-600' :
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-blue-50 text-blue-600'
                }`}>
                {alert.type === 'critical' && <AlertTriangle className="w-5 h-5" />}
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {alert.type === 'info' && <Activity className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{alert.message}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{alert.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{alert.user}</span>
                  {alert.type === 'critical' && (
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium text-[10px]">Kritis</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}