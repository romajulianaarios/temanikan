import { useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from '../icons';

export default function DiseaseTrends() {
  const [periodFilter, setPeriodFilter] = useState('6 Bulan Terakhir');
  const [diseaseFilter, setDiseaseFilter] = useState('Semua Penyakit');
  const [locationFilter, setLocationFilter] = useState('Semua Lokasi');

  // Full dataset for all periods
  const allMonthlyData = {
    '1 Bulan Terakhir': [
      { month: 'Nov', parasitic: 145, bacterial: 98, whiteTail: 56, other: 43 },
    ],
    '3 Bulan Terakhir': [
      { month: 'Sep', parasitic: 128, bacterial: 89, whiteTail: 48, other: 32 },
      { month: 'Okt', parasitic: 142, bacterial: 95, whiteTail: 54, other: 38 },
      { month: 'Nov', parasitic: 145, bacterial: 98, whiteTail: 56, other: 43 },
    ],
    '6 Bulan Terakhir': [
      { month: 'Jun', parasitic: 120, bacterial: 85, whiteTail: 45, other: 30 },
      { month: 'Jul', parasitic: 135, bacterial: 92, whiteTail: 52, other: 35 },
      { month: 'Aug', parasitic: 145, bacterial: 98, whiteTail: 58, other: 40 },
      { month: 'Sep', parasitic: 128, bacterial: 89, whiteTail: 48, other: 32 },
      { month: 'Okt', parasitic: 142, bacterial: 95, whiteTail: 54, other: 38 },
      { month: 'Nov', parasitic: 145, bacterial: 98, whiteTail: 56, other: 43 },
    ],
    '1 Tahun Terakhir': [
      { month: 'Des', parasitic: 110, bacterial: 78, whiteTail: 42, other: 28 },
      { month: 'Jan', parasitic: 115, bacterial: 82, whiteTail: 44, other: 29 },
      { month: 'Feb', parasitic: 118, bacterial: 84, whiteTail: 46, other: 30 },
      { month: 'Mar', parasitic: 122, bacterial: 86, whiteTail: 47, other: 31 },
      { month: 'Apr', parasitic: 125, bacterial: 88, whiteTail: 49, other: 32 },
      { month: 'Mei', parasitic: 130, bacterial: 90, whiteTail: 50, other: 33 },
      { month: 'Jun', parasitic: 120, bacterial: 85, whiteTail: 45, other: 30 },
      { month: 'Jul', parasitic: 135, bacterial: 92, whiteTail: 52, other: 35 },
      { month: 'Aug', parasitic: 145, bacterial: 98, whiteTail: 58, other: 40 },
      { month: 'Sep', parasitic: 128, bacterial: 89, whiteTail: 48, other: 32 },
      { month: 'Okt', parasitic: 142, bacterial: 95, whiteTail: 54, other: 38 },
      { month: 'Nov', parasitic: 145, bacterial: 98, whiteTail: 56, other: 43 },
    ]
  };

  // Regional data for all locations
  const allRegionalData = {
    'Semua Lokasi': [
      { region: 'Jakarta', cases: 145 },
      { region: 'Surabaya', cases: 98 },
      { region: 'Bandung', cases: 87 },
      { region: 'Medan', cases: 65 },
      { region: 'Semarang', cases: 54 },
      { region: 'Yogyakarta', cases: 42 },
    ],
    'Jakarta': [
      { region: 'Jakarta', cases: 145 },
    ],
    'Surabaya': [
      { region: 'Surabaya', cases: 98 },
    ],
    'Bandung': [
      { region: 'Bandung', cases: 87 },
    ],
    'Medan': [
      { region: 'Medan', cases: 65 },
    ],
    'Semarang': [
      { region: 'Semarang', cases: 54 },
    ],
    'Yogyakarta': [
      { region: 'Yogyakarta', cases: 42 },
    ],
  };

  // Get filtered data based on selected filters
  const monthlyTrends = useMemo(() => {
    const data = allMonthlyData[periodFilter as keyof typeof allMonthlyData] || allMonthlyData['6 Bulan Terakhir'];

    // Filter by disease type if not "Semua Penyakit"
    if (diseaseFilter === 'Semua Penyakit') {
      return data;
    } else {
      // Return data with only selected disease visible
      return data.map(item => ({
        month: item.month,
        parasitic: diseaseFilter === 'Parasitic Diseases' ? item.parasitic : 0,
        bacterial: diseaseFilter === 'Bacterial Diseases' ? item.bacterial : 0,
        whiteTail: diseaseFilter === 'White Tail Diseases' ? item.whiteTail : 0,
        other: diseaseFilter === 'Lainnya' ? item.other : 0,
      }));
    }
  }, [periodFilter, diseaseFilter]);

  const regionalData = useMemo(() => {
    return allRegionalData[locationFilter as keyof typeof allRegionalData] || allRegionalData['Semua Lokasi'];
  }, [locationFilter]);

  // Calculate disease stats based on current filters
  const diseaseStats = useMemo(() => {
    const latestData = monthlyTrends[monthlyTrends.length - 1];
    const prevData = monthlyTrends[monthlyTrends.length - 2] || latestData;

    return [
      {
        name: 'Parasitic Diseases',
        total: latestData.parasitic,
        change: prevData.parasitic > 0
          ? `${(((latestData.parasitic - prevData.parasitic) / prevData.parasitic) * 100).toFixed(1)}%`
          : '+0%',
        trend: latestData.parasitic >= prevData.parasitic ? 'up' : 'down',
        severity: 'high'
      },
      {
        name: 'Bacterial Diseases',
        total: latestData.bacterial,
        change: prevData.bacterial > 0
          ? `${(((latestData.bacterial - prevData.bacterial) / prevData.bacterial) * 100).toFixed(1)}%`
          : '+0%',
        trend: latestData.bacterial >= prevData.bacterial ? 'up' : 'down',
        severity: 'medium'
      },
      {
        name: 'White Tail Diseases',
        total: latestData.whiteTail,
        change: prevData.whiteTail > 0
          ? `${(((latestData.whiteTail - prevData.whiteTail) / prevData.whiteTail) * 100).toFixed(1)}%`
          : '+0%',
        trend: latestData.whiteTail >= prevData.whiteTail ? 'up' : 'down',
        severity: 'medium'
      },
      {
        name: 'Lainnya',
        total: latestData.other,
        change: prevData.other > 0
          ? `${(((latestData.other - prevData.other) / prevData.other) * 100).toFixed(1)}%`
          : '+0%',
        trend: latestData.other >= prevData.other ? 'up' : 'down',
        severity: 'low'
      },
    ];
  }, [monthlyTrends]);

  return (
    <div className="space-y-6">
      {/* Disease Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {diseaseStats.map((stat, index) => (
          <Card key={index} className="p-6" style={{ backgroundColor: 'white' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl" style={{ color: '#133E87' }}>{stat.total}</p>
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="mt-3">
              {stat.severity === 'high' && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                  Tinggi
                </span>
              )}
              {stat.severity === 'medium' && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Sedang
                </span>
              )}
              {stat.severity === 'low' && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  Rendah
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-2" style={{ color: '#133E87' }}>
              Periode
            </label>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Bulan Terakhir">1 Bulan Terakhir</SelectItem>
                <SelectItem value="3 Bulan Terakhir">3 Bulan Terakhir</SelectItem>
                <SelectItem value="6 Bulan Terakhir">6 Bulan Terakhir</SelectItem>
                <SelectItem value="1 Tahun Terakhir">1 Tahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-2" style={{ color: '#133E87' }}>
              Jenis Penyakit
            </label>
            <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Penyakit">Semua Penyakit</SelectItem>
                <SelectItem value="Parasitic Diseases">Parasitic Diseases</SelectItem>
                <SelectItem value="Bacterial Diseases">Bacterial Diseases</SelectItem>
                <SelectItem value="White Tail Diseases">White Tail Diseases</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-2" style={{ color: '#133E87' }}>
              Lokasi
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Lokasi">Semua Lokasi</SelectItem>
                <SelectItem value="Jakarta">Jakarta</SelectItem>
                <SelectItem value="Surabaya">Surabaya</SelectItem>
                <SelectItem value="Bandung">Bandung</SelectItem>
                <SelectItem value="Medan">Medan</SelectItem>
                <SelectItem value="Semarang">Semarang</SelectItem>
                <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>Tren Deteksi Bulanan</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={monthlyTrends}
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
              cursor={{ stroke: '#608BC1', strokeWidth: 1, strokeDasharray: '5 5' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #CBDCEB',
                borderRadius: '8px'
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
            />
            {(diseaseFilter === 'Semua Penyakit' || diseaseFilter === 'Parasitic Diseases') && (
              <Line
                type="monotone"
                dataKey="parasitic"
                stroke="#608BC1"
                strokeWidth={3}
                name="Parasitic Diseases"
                dot={{ fill: '#608BC1', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 8, fill: '#608BC1', stroke: '#133E87', strokeWidth: 2 }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            )}
            {(diseaseFilter === 'Semua Penyakit' || diseaseFilter === 'Bacterial Diseases') && (
              <Line
                type="monotone"
                dataKey="bacterial"
                stroke="#133E87"
                strokeWidth={3}
                name="Bacterial Diseases"
                dot={{ fill: '#133E87', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 8, fill: '#133E87', stroke: '#608BC1', strokeWidth: 2 }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            )}
            {(diseaseFilter === 'Semua Penyakit' || diseaseFilter === 'White Tail Diseases') && (
              <Line
                type="monotone"
                dataKey="whiteTail"
                stroke="#ff9800"
                strokeWidth={3}
                name="White Tail Diseases"
                dot={{ fill: '#ff9800', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 8, fill: '#ff9800', stroke: '#133E87', strokeWidth: 2 }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            )}
            {(diseaseFilter === 'Semua Penyakit' || diseaseFilter === 'Lainnya') && (
              <Line
                type="monotone"
                dataKey="other"
                stroke="#999"
                strokeWidth={3}
                name="Lainnya"
                dot={{ fill: '#999', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 8, fill: '#999', stroke: '#133E87', strokeWidth: 2 }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Regional Distribution */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>Distribusi Regional</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={regionalData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
            <XAxis
              dataKey="region"
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
              dataKey="cases"
              fill="#608BC1"
              name="Kasus Deteksi"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Insights */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>Insight & Rekomendasi</h3>
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#fee2e2' }}
          >
            <TrendingUp className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ color: '#991b1b' }}>
                Peningkatan signifikan Parasitic Diseases di Jakarta (+25%)
              </p>
              <p className="text-sm text-red-800 mt-1">
                Rekomendasi: Kirim notifikasi preventif ke pengguna di area Jakarta
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Activity className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ color: '#92400e' }}>
                Tren seasonal terdeteksi untuk Bacterial Diseases (meningkat saat musim hujan)
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Rekomendasi: Persiapkan artikel edukasi preventif untuk bulan depan
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#dcfce7' }}
          >
            <TrendingDown className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ color: '#166534' }}>
                Penurunan kasus White Tail Diseases sebesar 5.3% bulan ini
              </p>
              <p className="text-sm text-green-800 mt-1">
                Kemungkinan efek dari artikel edukasi yang dibagikan bulan lalu
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}