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
          <Card key={index} className="p-6" style={{ backgroundColor: 'white' }}>
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#CBDCEB' }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl" style={{ color: '#133E87' }}>{stat.value}</p>
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <h3 className="mb-4" style={{ color: '#133E87' }}>Pertumbuhan Pengguna</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={userGrowthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(96, 139, 193, 0.1)' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #CBDCEB',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar 
                dataKey="users" 
                fill="#608BC1" 
                name="Pengguna"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Disease Distribution */}
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <h3 className="mb-4" style={{ color: '#133E87' }}>Distribusi Jenis Penyakit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                innerRadius={0}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-in-out"
                paddingAngle={2}
              >
                {diseaseDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #CBDCEB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {diseaseDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: '#133E87' }}>Peringatan Sistem Terbaru</h3>
          <Link to="/admin/notifications" className="text-sm hover:underline" style={{ color: '#608BC1' }}>Lihat Semua</Link>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-lg"
              style={{ backgroundColor: '#F3F3E0' }}
            >
              {alert.type === 'critical' && (
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              {alert.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              {alert.type === 'info' && (
                <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#608BC1' }} />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm" style={{ color: '#133E87' }}>{alert.message}</p>
                  {alert.type === 'critical' && (
                    <Badge className="bg-red-100 text-red-800">Kritis</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{alert.user}</span>
                  <span>•</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}