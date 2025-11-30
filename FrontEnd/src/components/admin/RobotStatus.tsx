import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bot, Battery, CheckCircle, AlertCircle, XCircle, Search } from '../icons';
import { Progress } from '../ui/progress';

interface Robot {
  id: string;
  owner: string;
  location: string;
  status: 'active' | 'charging' | 'error' | 'offline';
  battery: number;
  lastActivity: string;
  totalCleanings: number;
  firmwareVersion: string;
}

export default function RobotStatus() {
  const [robots] = useState<Robot[]>([
    {
      id: 'ROB-001',
      owner: 'Ahmad Wijaya',
      location: 'Jakarta',
      status: 'active',
      battery: 87,
      lastActivity: '2 jam yang lalu',
      totalCleanings: 156,
      firmwareVersion: '2.1.0'
    },
    {
      id: 'ROB-002',
      owner: 'Siti Nurhaliza',
      location: 'Bandung',
      status: 'active',
      battery: 65,
      lastActivity: '1 jam yang lalu',
      totalCleanings: 203,
      firmwareVersion: '2.1.0'
    },
    {
      id: 'ROB-003',
      owner: 'Budi Santoso',
      location: 'Surabaya',
      status: 'charging',
      battery: 34,
      lastActivity: '30 menit yang lalu',
      totalCleanings: 98,
      firmwareVersion: '2.0.5'
    },
    {
      id: 'ROB-004',
      owner: 'Eko Prasetyo',
      location: 'Yogyakarta',
      status: 'error',
      battery: 12,
      lastActivity: '5 jam yang lalu',
      totalCleanings: 245,
      firmwareVersion: '2.1.0'
    },
    {
      id: 'ROB-005',
      owner: 'Dewi Lestari',
      location: 'Semarang',
      status: 'active',
      battery: 92,
      lastActivity: '45 menit yang lalu',
      totalCleanings: 187,
      firmwareVersion: '2.1.0'
    },
    {
      id: 'ROB-006',
      owner: 'Ahmad Wijaya',
      location: 'Jakarta',
      status: 'charging',
      battery: 45,
      lastActivity: '1 jam yang lalu',
      totalCleanings: 132,
      firmwareVersion: '2.1.0'
    },
    {
      id: 'ROB-007',
      owner: 'Budi Santoso',
      location: 'Surabaya',
      status: 'offline',
      battery: 0,
      lastActivity: '2 hari yang lalu',
      totalCleanings: 76,
      firmwareVersion: '2.0.3'
    },
    {
      id: 'ROB-008',
      owner: 'Siti Nurhaliza',
      location: 'Bandung',
      status: 'error',
      battery: 23,
      lastActivity: '3 jam yang lalu',
      totalCleanings: 189,
      firmwareVersion: '2.1.0'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [locationFilter, setLocationFilter] = useState('Semua Lokasi');

  // Get unique locations
  const locations = Array.from(new Set(robots.map(r => r.location)));

  // Filter robots
  const filteredRobots = robots.filter(robot => {
    const matchesSearch = 
      robot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      robot.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Aktif') matchesStatus = robot.status === 'active';
    else if (statusFilter === 'Charging') matchesStatus = robot.status === 'charging';
    else if (statusFilter === 'Error') matchesStatus = robot.status === 'error';
    else if (statusFilter === 'Offline') matchesStatus = robot.status === 'offline';
    else if (statusFilter !== 'Semua Status') matchesStatus = robot.status === statusFilter;
    
    const matchesLocation = locationFilter === 'Semua Lokasi' || robot.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Count by status
  const totalRobots = robots.length;
  const activeCount = robots.filter(r => r.status === 'active').length;
  const chargingCount = robots.filter(r => r.status === 'charging').length;
  const errorCount = robots.filter(r => r.status === 'error').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'charging':
        return <Badge className="bg-blue-100 text-blue-800">Charging</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'charging':
        return <Battery className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return '#10b981';
    if (battery > 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
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
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="p-3 rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(72, 128, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
              }}
            >
              <Bot className="w-6 h-6" style={{ color: '#608BC1' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Total Robot</p>
              <p className="text-2xl font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{totalRobots}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
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
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="p-3 rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Aktif</p>
              <p className="text-2xl font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{activeCount}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
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
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="p-3 rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
              }}
            >
              <Battery className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Charging</p>
              <p className="text-2xl font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{chargingCount}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
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
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="p-3 rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
              }}
            >
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Error</p>
              <p className="text-2xl font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{errorCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card 
        className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
        }}
      >
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Cari robot atau pemilik..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Status">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Charging">Charging</SelectItem>
              <SelectItem value="Error">Error</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Lokasi">Semua Lokasi</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Robot List */}
      {filteredRobots.length === 0 ? (
        <Card 
          className="bubble-card p-12 text-center transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300 relative z-10" />
          <p className="text-gray-500 relative z-10" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Tidak ada robot ditemukan</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRobots.map((robot) => (
            <Card 
              key={robot.id} 
              className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '2px solid rgba(72, 128, 255, 0.2)',
                borderRadius: '32px',
                boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.25), 0 0 0 2px rgba(72, 128, 255, 0.3) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                  filter: 'blur(18px)'
                }}
              ></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 214, 214, 0.3), transparent 70%)',
                  filter: 'blur(15px)'
                }}
              ></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-full transition-all duration-300"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(72, 128, 255, 0.3)',
                      boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
                    }}
                  >
                    {getStatusIcon(robot.status)}
                  </div>
                  <div>
                    <h4 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>{robot.id}</h4>
                    <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{robot.owner}</p>
                  </div>
                </div>
                {getStatusBadge(robot.status)}
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Lokasi</span>
                  <span style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>{robot.location}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Baterai</span>
                    <span style={{ color: getBatteryColor(robot.battery), fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
                      {robot.battery}%
                    </span>
                  </div>
                  <Progress 
                    value={robot.battery} 
                    className="h-2"
                    style={{ 
                      backgroundColor: '#CBDCEB',
                      borderRadius: '9999px'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Aktivitas Terakhir</span>
                  <span style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>{robot.lastActivity}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Total Pembersihan</span>
                  <span style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>{robot.totalCleanings}x</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Versi Firmware</span>
                  <span style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>{robot.firmwareVersion}</span>
                </div>
              </div>

              {robot.status === 'error' && (
                <div 
                  className="mt-4 p-3 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: '#fee2e2' }}
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    Robot mengalami error sistem. Memerlukan perhatian segera.
                  </p>
                </div>
              )}

              {robot.status === 'offline' && (
                <div 
                  className="mt-4 p-3 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Robot tidak terhubung. Terakhir online {robot.lastActivity}.
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}