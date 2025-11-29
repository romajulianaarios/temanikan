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
    <div className="space-y-6" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="bubble-card p-6 transition-all duration-300 relative overflow-hidden" 
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              borderRadius: '32px',
              boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
              e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
              e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
            }}
          >
            {/* Bubble glow effect */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-40 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                filter: 'blur(30px)'
              }}
            ></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255, 214, 214, 0.3), transparent 70%)',
                filter: 'blur(25px)'
              }}
            ></div>
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-3 rounded-full transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(72, 128, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-sm mb-1 font-semibold" style={{ 
              color: '#608BC1',
              fontFamily: 'Nunito Sans, sans-serif'
            }}>{stat.label}</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold" style={{ 
                color: '#133E87',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 800
              }}>{stat.value}</p>
              <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card 
          className="p-6 transition-all duration-300 relative overflow-hidden" 
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
          }}
        >
          {/* Bubble glow effect */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(35px)'
            }}
          ></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-25 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 214, 214, 0.3), transparent 70%)',
              filter: 'blur(30px)'
            }}
          ></div>
          <h3 className="mb-4 font-bold text-xl" style={{ 
            color: '#133E87',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 800
          }}>Pertumbuhan Pengguna</h3>
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
        <Card 
          className="p-6 transition-all duration-300 relative overflow-hidden" 
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
          }}
        >
          {/* Bubble glow effect */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(35px)'
            }}
          ></div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full opacity-25 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 214, 214, 0.3), transparent 70%)',
              filter: 'blur(30px)'
            }}
          ></div>
          <h3 className="mb-4 font-bold text-xl" style={{ 
            color: '#133E87',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 800
          }}>Distribusi Jenis Penyakit</h3>
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
      <Card 
        className="p-6 transition-all duration-300 relative overflow-hidden" 
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
        }}
      >
        {/* Bubble glow effect */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
            filter: 'blur(35px)'
          }}
        ></div>
        <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 214, 214, 0.3), transparent 70%)',
            filter: 'blur(30px)'
          }}
        ></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl" style={{ 
            color: '#133E87',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 800
          }}>Peringatan Sistem Terbaru</h3>
          <Link 
            to="/admin/notifications" 
            className="bubble-button text-sm font-bold px-4 py-2 rounded-full transition-all duration-300" 
            style={{ 
              color: '#FFFFFF',
              backgroundColor: 'rgba(72, 128, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.5)',
              fontFamily: 'Nunito Sans, sans-serif',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(72, 128, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.6)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.3)';
            }}
          >
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '2px solid rgba(72, 128, 255, 0.15)',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.15)';
              }}
            >
              {/* Small bubble glow */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                  filter: 'blur(20px)'
                }}
              ></div>
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
                  <p className="text-sm font-semibold" style={{ 
                    color: '#133E87',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}>{alert.message}</p>
                  {alert.type === 'critical' && (
                    <Badge className="px-3 py-1 rounded-full font-bold text-xs" style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#DC2626',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}>Kritis</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ 
                  color: '#608BC1',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}>
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