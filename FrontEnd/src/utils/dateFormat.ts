/**
 * Utility functions untuk format tanggal dan waktu Indonesia
 * Menggunakan timezone Asia/Jakarta (WIB)
 */

/**
 * Format tanggal dan waktu ke format Indonesia
 * @param dateString - ISO date string atau Date object
 * @param options - Opsi format
 * @returns String tanggal/waktu yang sudah diformat
 */
export const formatDateTime = (
  dateString: string | Date,
  options: {
    includeTime?: boolean;
    includeDate?: boolean;
    format?: 'short' | 'long' | 'relative';
  } = {}
): string => {
  const { includeTime = true, includeDate = true, format = 'short' } = options;
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Convert ke timezone Indonesia (UTC+7)
  const indonesiaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  
  if (format === 'relative') {
    return formatTimeAgo(dateString);
  }
  
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const day = indonesiaDate.getDate();
  const month = indonesiaDate.getMonth();
  const year = indonesiaDate.getFullYear();
  const dayName = dayNames[indonesiaDate.getDay()];
  
  const hours = indonesiaDate.getHours().toString().padStart(2, '0');
  const minutes = indonesiaDate.getMinutes().toString().padStart(2, '0');
  
  let result = '';
  
  if (includeDate) {
    if (format === 'long') {
      result = `${dayName}, ${day} ${monthNames[month]} ${year}`;
    } else {
      result = `${day} ${monthNamesShort[month]} ${year}`;
    }
  }
  
  if (includeTime) {
    if (result) {
      result += `, ${hours}:${minutes}`;
    } else {
      result = `${hours}:${minutes}`;
    }
  }
  
  return result;
};

/**
 * Format waktu relatif (misalnya: "2 menit yang lalu", "Baru saja")
 * @param dateString - ISO date string atau Date object
 * @returns String waktu relatif
 */
export const formatTimeAgo = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  
  // Convert ke timezone Indonesia
  const indonesiaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const indonesiaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  
  const diffInSeconds = Math.floor((indonesiaNow.getTime() - indonesiaDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} tahun yang lalu`;
};

/**
 * Format tanggal saja (tanpa waktu)
 * @param dateString - ISO date string atau Date object
 * @param format - Format output
 * @returns String tanggal yang sudah diformat
 */
export const formatDate = (
  dateString: string | Date,
  format: 'short' | 'long' = 'short'
): string => {
  return formatDateTime(dateString, { includeTime: false, includeDate: true, format });
};

/**
 * Format waktu saja (tanpa tanggal)
 * @param dateString - ISO date string atau Date object
 * @returns String waktu yang sudah diformat (HH:MM)
 */
export const formatTime = (dateString: string | Date): string => {
  return formatDateTime(dateString, { includeTime: true, includeDate: false });
};

/**
 * Format untuk notifikasi (tanggal pendek + waktu)
 * @param dateString - ISO date string atau Date object
 * @returns String format: "30 Nov, 06.51"
 */
export const formatNotificationTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const indonesiaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  
  const day = indonesiaDate.getDate();
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = monthNamesShort[indonesiaDate.getMonth()];
  const hours = indonesiaDate.getHours().toString().padStart(2, '0');
  const minutes = indonesiaDate.getMinutes().toString().padStart(2, '0');
  
  return `${day} ${month}, ${hours}.${minutes}`;
};

