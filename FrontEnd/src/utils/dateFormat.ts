/**
 * Format notification time to a human-readable string
 * @param dateString - ISO date string or date string
 * @param t - Optional translation function
 * @returns Formatted time string (e.g., "2 jam yang lalu", "Kemarin", "30 Nov 2024")
 */
export function formatNotificationTime(dateString: string, t?: (key: string, params?: Record<string, string | number>) => string, language?: 'id' | 'en'): string {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Use translation if provided
  if (t) {
    // Less than 1 minute ago
    if (diffInSeconds < 60) {
      return t('time.justNow');
    }

    // Less than 1 hour ago
    if (diffInMinutes < 60) {
      return t('time.minutesAgo', { minutes: diffInMinutes });
    }

    // Less than 24 hours ago
    if (diffInHours < 24) {
      return t('time.hoursAgo', { hours: diffInHours });
    }

    // Yesterday
    if (diffInDays === 1) {
      return t('time.yesterday');
    }

    // Less than 7 days ago
    if (diffInDays < 7) {
      return t('time.daysAgo', { days: diffInDays });
    }

    // More than 7 days ago - show formatted date
    const locale = (language === 'en' ? 'en-US' : 'id-ID');
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  // Fallback to default Indonesian
  // Less than 1 minute ago
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }

  // Less than 1 hour ago
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  // Less than 24 hours ago
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  // Yesterday
  if (diffInDays === 1) {
    return 'Kemarin';
  }

  // Less than 7 days ago
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  }

  // More than 7 days ago - show formatted date
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Format time ago (alias for formatNotificationTime, used in forum components)
 * @param dateString - ISO date string or date string
 * @param t - Optional translation function
 * @returns Formatted time string (e.g., "2 jam yang lalu", "Kemarin", "30 Nov 2024")
 */
export function formatTimeAgo(dateString: string, t?: (key: string, params?: Record<string, string | number>) => string, language?: 'id' | 'en'): string {
  return formatNotificationTime(dateString, t, language);
}

/**
 * Format date to Indonesian locale
 * @param dateString - ISO date string or date string
 * @returns Formatted date string (e.g., "30 November 2024")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format time to Indonesian locale
 * @param dateString - ISO date string or date string
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format date and time with options
 * @param dateString - ISO date string or date string
 * @param options - Formatting options
 * @returns Formatted date/time string
 */
export function formatDateTime(
  dateString: string,
  options?: {
    includeTime?: boolean;
    format?: 'short' | 'long';
  }
): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  const includeTime = options?.includeTime !== false;
  const format = options?.format || 'short';

  if (includeTime) {
    if (format === 'long') {
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } else {
    if (format === 'long') {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }
}

