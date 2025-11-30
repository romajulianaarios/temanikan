import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar as CalendarIcon, Droplets, Thermometer, Activity, TrendingUp, AlertCircle, CheckCircle } from '../icons';

type TimeRange = '24h' | '7d' | '30d' | 'custom';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Helper function to format date
const formatDate = (date: Date, formatStr: string = 'dd MMM yyyy') => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (formatStr === 'dd MMM yyyy') {
    return `${day} ${month} ${year}`;
  } else if (formatStr === 'PPP') {
    return `${day} ${month} ${year}`;
  }
  return date.toLocaleDateString('id-ID');
};

export default function WaterMonitoring() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [tempFrom, setTempFrom] = useState<Date | undefined>(undefined);

  // Current water parameters
  const currentParams = [
    {
      label: 'pH',
      value: '7.2',
      status: 'Optimal',
      icon: Activity,
      iconColor: '#8280FF',
      iconBg: 'rgba(130, 128, 255, 0.1)',
      range: '6.5 - 7.5',
      trend: '+0.1',
      trendUp: true
    },
    {
      label: 'Suhu',
      value: '26°C',
      status: 'Optimal',
      icon: Thermometer,
      iconColor: '#FEC53D',
      iconBg: 'rgba(254, 197, 61, 0.1)',
      range: '24 - 28°C',
      trend: '-0.2',
      trendUp: false
    },
    {
      label: 'Kekeruhan',
      value: '2.1 NTU',
      status: 'Baik',
      icon: Droplets,
      iconColor: '#4AD991',
      iconBg: 'rgba(74, 217, 145, 0.1)',
      range: '< 5 NTU',
      trend: '+0.3',
      trendUp: true
    }
  ];

  // Generate data based on time range
  const getDataForTimeRange = (range: TimeRange) => {
    if (range === '24h') {
      return {
        ph: [
          { time: '00:00', value: 7.1 },
          { time: '04:00', value: 7.2 },
          { time: '08:00', value: 7.3 },
          { time: '12:00', value: 7.2 },
          { time: '16:00', value: 7.1 },
          { time: '20:00', value: 7.2 },
          { time: '24:00', value: 7.2 },
        ],
        temp: [
          { time: '00:00', value: 25.5 },
          { time: '04:00', value: 25.2 },
          { time: '08:00', value: 26.1 },
          { time: '12:00', value: 26.8 },
          { time: '16:00', value: 26.5 },
          { time: '20:00', value: 26.0 },
          { time: '24:00', value: 25.8 },
        ],
        turbidity: [
          { time: '00:00', value: 2.0 },
          { time: '04:00', value: 2.1 },
          { time: '08:00', value: 2.3 },
          { time: '12:00', value: 2.2 },
          { time: '16:00', value: 2.1 },
          { time: '20:00', value: 1.9 },
          { time: '24:00', value: 2.0 },
        ]
      };
    } else if (range === '7d') {
      return {
        ph: [
          { time: 'Sen', value: 7.0 },
          { time: 'Sel', value: 7.1 },
          { time: 'Rab', value: 7.2 },
          { time: 'Kam', value: 7.3 },
          { time: 'Jum', value: 7.1 },
          { time: 'Sab', value: 7.2 },
          { time: 'Min', value: 7.2 },
        ],
        temp: [
          { time: 'Sen', value: 25.8 },
          { time: 'Sel', value: 25.9 },
          { time: 'Rab', value: 26.2 },
          { time: 'Kam', value: 26.5 },
          { time: 'Jum', value: 26.3 },
          { time: 'Sab', value: 26.1 },
          { time: 'Min', value: 26.0 },
        ],
        turbidity: [
          { time: 'Sen', value: 2.2 },
          { time: 'Sel', value: 2.1 },
          { time: 'Rab', value: 2.0 },
          { time: 'Kam', value: 2.3 },
          { time: 'Jum', value: 2.1 },
          { time: 'Sab', value: 2.0 },
          { time: 'Min', value: 2.0 },
        ]
      };
    } else if (range === '30d') {
      return {
        ph: [
          { time: 'Minggu 1', value: 7.0 },
          { time: 'Minggu 2', value: 7.1 },
          { time: 'Minggu 3', value: 7.2 },
          { time: 'Minggu 4', value: 7.3 },
        ],
        temp: [
          { time: 'Minggu 1', value: 25.5 },
          { time: 'Minggu 2', value: 26.0 },
          { time: 'Minggu 3', value: 26.3 },
          { time: 'Minggu 4', value: 26.2 },
        ],
        turbidity: [
          { time: 'Minggu 1', value: 2.3 },
          { time: 'Minggu 2', value: 2.1 },
          { time: 'Minggu 3', value: 2.0 },
          { time: 'Minggu 4', value: 2.1 },
        ]
      };
    } else {
      // Custom range - use 7 day data as placeholder
      return {
        ph: [
          { time: '1 Nov', value: 7.1 },
          { time: '5 Nov', value: 7.2 },
          { time: '10 Nov', value: 7.3 },
          { time: '15 Nov', value: 7.2 },
          { time: '20 Nov', value: 7.1 },
          { time: '25 Nov', value: 7.2 },
          { time: '30 Nov', value: 7.2 },
        ],
        temp: [
          { time: '1 Nov', value: 25.5 },
          { time: '5 Nov', value: 25.8 },
          { time: '10 Nov', value: 26.1 },
          { time: '15 Nov', value: 26.4 },
          { time: '20 Nov', value: 26.2 },
          { time: '25 Nov', value: 26.0 },
          { time: '30 Nov', value: 25.9 },
        ],
        turbidity: [
          { time: '1 Nov', value: 2.2 },
          { time: '5 Nov', value: 2.1 },
          { time: '10 Nov', value: 2.0 },
          { time: '15 Nov', value: 2.3 },
          { time: '20 Nov', value: 2.1 },
          { time: '25 Nov', value: 2.0 },
          { time: '30 Nov', value: 2.0 },
        ]
      };
    }
  };

  const currentData = getDataForTimeRange(timeRange);

  const handleTimeRangeChange = (value: string) => {
    const newRange = value as TimeRange;
    setTimeRange(newRange);
  };

  const handleExportData = () => {
    // In production, this would generate and download actual CSV/Excel file
    alert(`Exporting data for ${timeRange === 'custom' && dateRange.from && dateRange.to
      ? `${formatDate(dateRange.from, 'dd MMM yyyy')} - ${formatDate(dateRange.to, 'dd MMM yyyy')}`
      : timeRange === '24h' ? '24 Jam Terakhir'
        : timeRange === '7d' ? '7 Hari Terakhir'
          : '30 Hari Terakhir'}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl mb-2" style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
          Monitoring <span style={{ color: '#FFFFFF' }}>Kualitas Air</span>
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
          Pantau parameter air akuarium Anda secara real-time
        </p>
      </div>

      {/* Filters */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
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
        {/* Bubble glow effect */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>
              Rentang Waktu
            </label>
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Jam Terakhir</SelectItem>
                <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                <SelectItem value="custom">Kustom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range Picker */}
          {timeRange === 'custom' && (
            <div className="flex-1">
              <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>
                Pilih Tanggal
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.to ? (
                      <>
                        {formatDate(dateRange.from, 'dd MMM yyyy')} -{' '}
                        {formatDate(dateRange.to, 'dd MMM yyyy')}
                      </>
                    ) : (
                      <span>Pilih rentang tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" style={{ backgroundColor: 'white' }}>
                  <div className="p-4 space-y-3">
                    <div className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                      {!tempFrom ? 'Pilih tanggal mulai' : 'Pilih tanggal akhir'}
                    </div>
                    <Calendar
                      mode="range"
                      selected={tempFrom ? { from: tempFrom, to: undefined } : dateRange}
                      onSelect={(date: any) => {
                        if (!tempFrom) {
                          setTempFrom(date);
                        } else {
                          if (date && tempFrom && date >= tempFrom) {
                            setDateRange({ from: tempFrom, to: date });
                            setTempFrom(undefined);
                          } else if (date && tempFrom && date < tempFrom) {
                            setDateRange({ from: date, to: tempFrom });
                            setTempFrom(undefined);
                          }
                        }
                      }}
                      disabled={(date) => false}
                      className="rounded-md border-0"
                    />
                    {tempFrom && (
                      <div className="text-xs text-gray-600 text-center">
                        Mulai: {formatDate(tempFrom, 'dd MMM yyyy')}
                      </div>
                    )}
                    {dateRange.from && dateRange.to && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setDateRange({ from: undefined, to: undefined });
                            setTempFrom(undefined);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button
            className="bubble-button text-white rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 700
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
            }}
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </Card>

      {/* pH Chart */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
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
        {/* Bubble glow effect */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(130, 128, 255, 0.3), rgba(72, 128, 255, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(130, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(130, 128, 255, 0.2)'
            }}
          >
            <Activity className="w-6 h-6" style={{ color: '#8280FF' }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Grafik pH</h3>
            <p className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Tren perubahan pH dalam waktu yang dipilih</p>
          </div>
        </div>
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={currentData.ph}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="gradientPh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8280FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8280FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              domain={[6, 8]}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              cursor={{ stroke: '#8280FF', strokeWidth: 2 }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8280FF"
              strokeWidth={3}
              fill="url(#gradientPh)"
              name="pH"
              dot={{
                fill: '#8280FF',
                strokeWidth: 2,
                r: 5,
                stroke: 'white'
              }}
              activeDot={{
                r: 8,
                fill: '#8280FF',
                stroke: 'white',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 rounded-xl flex items-start gap-3 relative z-10" style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#4AD991' }} />
          <div>
            <p className="text-sm" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
              Status: Optimal
            </p>
            <p className="text-xs mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Rentang Ideal: 6.5 - 7.5 | Nilai Saat Ini: 7.2
            </p>
          </div>
        </div>
      </Card>

      {/* Temperature Chart */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
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
        {/* Bubble glow effect */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(254, 197, 61, 0.3), rgba(245, 158, 11, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(254, 197, 61, 0.3)',
              boxShadow: '0 4px 15px rgba(254, 197, 61, 0.2)'
            }}
          >
            <Thermometer className="w-6 h-6" style={{ color: '#FEC53D' }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Grafik Suhu</h3>
            <p className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Tren perubahan suhu dalam waktu yang dipilih</p>
          </div>
        </div>
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={currentData.temp}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="gradientTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FEC53D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FEC53D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              domain={[24, 28]}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              cursor={{ stroke: '#FEC53D', strokeWidth: 2 }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FEC53D"
              strokeWidth={3}
              fill="url(#gradientTemp)"
              name="Suhu (°C)"
              dot={{
                fill: '#FEC53D',
                strokeWidth: 2,
                r: 5,
                stroke: 'white'
              }}
              activeDot={{
                r: 8,
                fill: '#FEC53D',
                stroke: 'white',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 rounded-xl flex items-start gap-3 relative z-10" style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#4AD991' }} />
          <div>
            <p className="text-sm" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
              Status: Optimal
            </p>
            <p className="text-xs mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Rentang Ideal: 24 - 28°C | Nilai Saat Ini: 26°C
            </p>
          </div>
        </div>
      </Card>

      {/* Turbidity Chart */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
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
        {/* Bubble glow effect */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
            }}
          >
            <Droplets className="w-6 h-6" style={{ color: '#4AD991' }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Grafik Kekeruhan</h3>
            <p className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Tren perubahan kekeruhan dalam waktu yang dipilih</p>
          </div>
        </div>
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={currentData.turbidity}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="gradientTurbidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4AD991" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4AD991" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              domain={[0, 5]}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              cursor={{ stroke: '#4AD991', strokeWidth: 2 }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4AD991"
              strokeWidth={3}
              fill="url(#gradientTurbidity)"
              name="Kekeruhan (NTU)"
              dot={{
                fill: '#4AD991',
                strokeWidth: 2,
                r: 5,
                stroke: 'white'
              }}
              activeDot={{
                r: 8,
                fill: '#4AD991',
                stroke: 'white',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 rounded-xl flex items-start gap-3 relative z-10" style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#4AD991' }} />
          <div>
            <p className="text-sm" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
              Status: Baik
            </p>
            <p className="text-xs mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Rentang Ideal: {'<'} 5 NTU | Nilai Saat Ini: 2.1 NTU
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}