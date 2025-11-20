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
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#CBDCEB' }}
            >
              <Bot className="w-6 h-6" style={{ color: '#608BC1' }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Robot</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>{totalRobots}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>{activeCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <Battery className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Charging</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>{chargingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <XCircle className="w-10 h-10 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Error</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>{errorCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col md:flex-row gap-4">
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
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Tidak ada robot ditemukan</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRobots.map((robot) => (
            <Card key={robot.id} className="p-6" style={{ backgroundColor: 'white' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: '#CBDCEB' }}
                  >
                    {getStatusIcon(robot.status)}
                  </div>
                  <div>
                    <h4 style={{ color: '#133E87' }}>{robot.id}</h4>
                    <p className="text-sm text-gray-600">{robot.owner}</p>
                  </div>
                </div>
                {getStatusBadge(robot.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lokasi</span>
                  <span style={{ color: '#133E87' }}>{robot.location}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Baterai</span>
                    <span style={{ color: getBatteryColor(robot.battery) }}>
                      {robot.battery}%
                    </span>
                  </div>
                  <Progress 
                    value={robot.battery} 
                    className="h-2"
                    style={{ 
                      backgroundColor: '#CBDCEB'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Aktivitas Terakhir</span>
                  <span style={{ color: '#133E87' }}>{robot.lastActivity}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Pembersihan</span>
                  <span style={{ color: '#133E87' }}>{robot.totalCleanings}x</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Versi Firmware</span>
                  <span style={{ color: '#133E87' }}>{robot.firmwareVersion}</span>
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