import axios from 'axios';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');
export const API_ORIGIN_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export const buildAssetUrl = (path?: string | null) => {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN_URL}${normalizedPath}`;
};

// TOKEN & USER Storage Utility
const TokenStorage = {
  getToken: () => sessionStorage.getItem("access_token") || localStorage.getItem("access_token"),
  setToken: (token: string) => {
    sessionStorage.setItem("access_token", token);  // per tab
    localStorage.setItem("access_token", token);    // sebagai backup persist
  },
  removeToken: () => {
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("access_token");
  },

  getUser: () => {
    const s = sessionStorage.getItem("user");
    const l = localStorage.getItem("user");
    if (s) return JSON.parse(s);
    if (l) return JSON.parse(l);
    return null;
  },
  setUser: (user: object) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  },
  removeUser: () => {
    sessionStorage.removeItem("user"); localStorage.removeItem("user");
  }
};


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Log untuk debugging
      console.log('🔴 401 Error on URL:', originalRequest?.url);
      console.log('📍 Current path:', window.location.pathname);

      // ✅ Jangan auto-logout kalau:
      const currentPath = window.location.pathname;
      const isPublicPath = currentPath === '/' || currentPath.includes('login');
      const isAuthEndpoint = originalRequest?.url?.includes('auth');

      if (isPublicPath || isAuthEndpoint) {
        return Promise.reject(error);
      }

      // ✅ HANYA retry SATU KALI
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Validasi token
        const token = TokenStorage.getToken();
        if (token) {
          console.log('🔄 Retrying request with token...');
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }
      }

      // ✅ TOKEN REFRESH MECHANISM (OPSIONAL)
      // ⚠️ HANYA AKTIFKAN JIKA BACKEND PUNYA ENDPOINT /auth/refresh
      /*
      // Setelah retry gagal, coba refresh token
      if (originalRequest._retry && !originalRequest._refreshRetry) {
        originalRequest._refreshRetry = true;
        
        try {
          console.log('🔄 Attempting to refresh token...');
          
          // Coba refresh token (jika backend support)
          const refreshToken = TokenStorage.getRefreshToken(); // Anda perlu tambahkan method ini
          
          if (refreshToken) {
            const refreshResponse = await api.post('/auth/refresh', { 
              refresh_token: refreshToken 
            });
            
            if (refreshResponse.data.access_token) {
              console.log('✅ Token refreshed successfully!');
              
              // Set token baru
              TokenStorage.setToken(refreshResponse.data.access_token);
              
              // Update Authorization header dengan token baru
              originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
              
              // Retry request dengan token baru
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          console.log('❌ Refresh token failed:', refreshError);
          
          // Refresh token gagal, clear session dan redirect ke login
          TokenStorage.removeToken();
          TokenStorage.removeUser();
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
      */

      // ✅ Jika tidak ada refresh token mechanism, jangan langsung clear
      console.log('⚠️ 401 after retry, but NOT clearing token automatically');

      // Biarkan AuthContext yang handle logout melalui UI
      // TIDAK auto-redirect ke login
    }

    return Promise.reject(error);
  }
);


// Authentication API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.access_token) {
      TokenStorage.setToken(response.data.access_token);  // ✅ BARU
      TokenStorage.setUser(response.data.user);           // ✅ BARU
    }
    return response.data;
  },

  logout: () => {
    TokenStorage.removeToken();  // ✅ BARU
    TokenStorage.removeUser();   // ✅ BARU
    window.location.href = '/';
  },

  getCurrentUser: () => {
    return TokenStorage.getUser();  // ✅ BARU
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: string;
    age?: number;
    primary_fish_type?: string;
    password?: string
  }) => {
    const token = TokenStorage.getToken();  // ✅ BARU

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.put(
      'http://localhost:5000/api/users/profile',
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // ✅ TAMBAHKAN INI: Update user di storage setelah profile update
    if (response.data.success && response.data.user) {
      TokenStorage.setUser(response.data.user);
    }

    return response.data;
  },
};

// Device API
export const deviceAPI = {
  getDevices: async () => {
    const response = await api.get('/devices');
    return response.data;
  },

  getDevice: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}`);
    return response.data;
  },

  addDevice: async (data: { name: string; device_code?: string }) => {
    const response = await api.post('/devices', data);
    return response.data;
  },

  updateDevice: async (deviceId: number, data: any) => {
    const response = await api.put(`/devices/${deviceId}`, data);
    return response.data;
  },

  deleteDevice: async (deviceId: number) => {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
  },

  // Get user's devices with formatted data
  getUserDevices: async () => {
    const response = await api.get('/member/devices');
    return response.data;
  },

  // Device Dashboard Data Methods
  getDashboardWaterLatest: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}/dashboard/water-latest`);
    return response.data;
  },

  getDashboardRobotStatus: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}/dashboard/robot-status`);
    return response.data;
  },

  getDashboardDiseaseLatest: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}/dashboard/disease-latest`);
    return response.data;
  },

  getDashboardNotificationsRecent: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}/dashboard/notifications-recent`);
    return response.data;
  },
};

// Water Monitoring API
export const waterAPI = {
  getWaterData: async (deviceId: number, hours: number = 24, limit: number = 100) => {
    const response = await api.get(`/devices/${deviceId}/water-data`, {
      params: { hours, limit }
    });
    return response.data;
  },

  addWaterData: async (deviceId: number, data: {
    temperature?: number;
    ph_level?: number;
    turbidity?: number;
    oxygen_level?: number;
    ammonia_level?: number;
  }) => {
    const response = await api.post(`/devices/${deviceId}/water-data`, data);
    return response.data;
  },
};

// Robot Control API
export const robotAPI = {
  getCleaningHistory: async (deviceId: number, limit: number = 50) => {
    const response = await api.get(`/devices/${deviceId}/cleaning-history`, {
      params: { limit }
    });
    return response.data;
  },

  startCleaning: async (deviceId: number, cleaningType: string = 'manual') => {
    const response = await api.post(`/devices/${deviceId}/start-cleaning`, {
      cleaning_type: cleaningType
    });
    return response.data;
  },

  stopCleaning: async (deviceId: number, data?: {
    status?: string;
    area_cleaned?: number;
    notes?: string;
  }) => {
    const response = await api.post(`/devices/${deviceId}/stop-cleaning`, data || {});
    return response.data;
  },
};

// Disease Detection API
export const diseaseAPI = {
  getAllDetections: async (limit: number = 50, deviceId?: number) => {
    const response = await api.get('/disease-detections', {
      params: {
        limit,
        device_id: deviceId
      }
    });
    return response.data;
  },

  getDetections: async (deviceId: number, limit: number = 50) => {
    const response = await api.get(`/devices/${deviceId}/disease-detections`, {
      params: { limit }
    });
    return response.data;
  },

  addDetection: async (deviceId: number, data: {
    disease_name: string;
    confidence?: number;
    severity?: string;
    image_url?: string;
    symptoms?: string;
    recommended_treatment?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/devices/${deviceId}/disease-detections`, data);
    return response.data;
  },

  updateDetection: async (detectionId: number, data: {
    status?: string;
    notes?: string;
  }) => {
    const response = await api.put(`/disease-detections/${detectionId}`, data);
    return response.data;
  },
};

// Fishpedia API
export const fishpediaAPI = {
  // ===== PUBLIC ENDPOINTS (untuk Member & Public) =====
  getSpecies: async (search?: string, category?: string) => {
    const response = await api.get('/fishpedia', { params: { search, category } });
    return response.data;
  },

  getSpeciesDetail: async (speciesId: number) => {
    const response = await api.get(`/fishpedia/${speciesId}`);
    return response.data;
  },

  // ===== ADMIN ENDPOINTS (untuk Admin CRUD) =====
  admin: {
    // Get all articles (for admin management table)
    getAllArticles: async (params?: {
      search?: string;
      category?: string;
      page?: number;
      per_page?: number;
    }) => {
      const response = await api.get('/admin/fishpedia', { params });
      return response.data;
    },

    // Get article detail for editing
    getArticleById: async (articleId: number) => {
      const response = await api.get(`/admin/fishpedia/${articleId}`);
      return response.data;
    },

    // Create new article
    createArticle: async (data: {
      title: string;
      name_latin: string;
      category: string;
      habitat: string;
      size?: string;
      temperament?: string;
      diet?: string;
      care_level?: string;
      ph_range?: string;
      temperature_range?: string;
      tank_size?: string;
      lifespan?: string;
      breeding?: string;
      image_url?: string;
    }) => {
      const response = await api.post('/admin/fishpedia', data);
      return response.data;
    },

    // Update article
    updateArticle: async (articleId: number, data: {
      title?: string;
      name_latin?: string;
      category?: string;
      habitat?: string;
      size?: string;
      temperament?: string;
      diet?: string;
      care_level?: string;
      ph_range?: string;
      temperature_range?: string;
      tank_size?: string;
      lifespan?: string;
      breeding?: string;
      image_url?: string;
    }) => {
      const response = await api.put(`/admin/fishpedia/${articleId}`, data);
      return response.data;
    },

    // Delete article
    deleteArticle: async (articleId: number) => {
      const response = await api.delete(`/admin/fishpedia/${articleId}`);
      return response.data;
    },
  },
};

// Forum API
export const forumAPI = {
  // Get all topics
  getTopics: async (category?: string, search?: string) => {
    const response = await api.get('/forum/topics', {
      params: { category, search }
    });
    return response.data;
  },

  // Get single topic detail with replies
  getTopic: async (topicId: number) => {
    const response = await api.get(`/forum/topics/${topicId}`);
    return response.data;
  },

  // Create new topic
  createTopic: async (data: {
    title: string;
    content: string;
    category?: string;
  }) => {
    const response = await api.post('/forum/topics', data);
    return response.data;
  },

  // Update topic
  updateTopic: async (topicId: number, data: any) => {
    const response = await api.put(`/forum/topics/${topicId}`, data);
    return response.data;
  },

  // Delete topic
  deleteTopic: async (topicId: number) => {
    const response = await api.delete(`/forum/topics/${topicId}`);
    return response.data;
  },

  // Add reply to topic
  addReply: async (topicId: number, content: string) => {
    const response = await api.post(`/forum/topics/${topicId}/replies`, { content });
    return response.data;
  },

  // Update reply
  updateReply: async (replyId: number, content: string) => {
    const response = await api.put(`/forum/replies/${replyId}`, { content });
    return response.data;
  },

  // Delete reply
  deleteReply: async (replyId: number) => {
    const response = await api.delete(`/forum/replies/${replyId}`);
    return response.data;
  },

  // ==================== NEW: LIKE ENDPOINTS ====================

  // Toggle like on topic
  toggleTopicLike: async (topicId: number) => {
    const response = await api.post(`/forum/topics/${topicId}/like`);
    return response.data;
  },

  // Toggle like on reply
  toggleReplyLike: async (replyId: number) => {
    const response = await api.post(`/forum/replies/${replyId}/like`);
    return response.data;
  },

  // ==================== NEW: REPORT ENDPOINTS ====================

  // Report a topic
  reportTopic: async (topicId: number, data: {
    reason: string;
    description?: string;
  }) => {
    const response = await api.post(`/forum/topics/${topicId}/report`, data);
    return response.data;
  },

  // ==================== NEW: ADMIN ENDPOINTS ====================

  // Admin: Get all reports
  getReports: async (status: string = 'pending') => {
    const response = await api.get('/admin/forum/reports', {
      params: { status }
    });
    return response.data;
  },

  // Admin: Approve report (delete topic)
  approveReport: async (reportId: number, adminNotes?: string) => {
    const response = await api.post(`/admin/forum/reports/${reportId}/approve`, {
      admin_notes: adminNotes
    });
    return response.data;
  },

  // Admin: Reject report (keep topic)
  rejectReport: async (reportId: number, adminNotes?: string) => {
    const response = await api.post(`/admin/forum/reports/${reportId}/reject`, {
      admin_notes: adminNotes
    });
    return response.data;
  },

  getAllTopics: async () => {
    const response = await api.get('/forum/topics');
    return response.data;
  },

  // Get topik milik user (Topik Saya)
  getUserTopics: async () => {
    const response = await api.get('/forum/my-topics');
    return response.data;
  },

  // Get replies untuk topik tertentu
  getTopicReplies: async (topicId: number) => {
    const response = await api.get(`/forum/topics/${topicId}/replies`);
    return response.data;
  },
};

// AI Chat API
export const aiChatAPI = {
  // Send message to AI
  sendMessage: async (message: string, image?: string, imageUrl?: string) => {
    const response = await api.post('/ai/chat', {
      message,
      image,
      image_url: imageUrl
    });
    return response.data;
  },

  // Get chat history
  getHistory: async (limit: number = 50) => {
    const response = await api.get('/ai/chat/history', {
      params: { limit }
    });
    return response.data;
  },

  // Delete chat
  deleteChat: async (chatId: number) => {
    const response = await api.delete(`/ai/chat/${chatId}`);
    return response.data;
  },
};

// Order API
export const orderAPI = {
  // Member: Get my orders with filter
  getMyOrders: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  // Member: Create new order
  createOrder: async (data: {
    product_name: string;
    quantity?: number;
    total_price: number;
    shipping_address?: string;
    payment_method?: string;
    notes?: string;
  }) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Member: Get order detail
  getOrderDetail: async (orderId: number) => {
    const response = await api.get(`/orders/${orderId}/detail`);
    return response.data;
  },

  // Member: Cancel order
  cancelOrder: async (orderId: number) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Admin: Get all orders with filters and pagination
  getAllOrders: async (filters?: {
    status?: string;
    payment_status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get('/admin/orders', { params: filters });
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Admin: Update payment status
  updatePaymentStatus: async (orderId: number, payment_status: string) => {
    const response = await api.put(`/admin/orders/${orderId}/payment`, { payment_status });
    return response.data;
  },

  // Admin: Get order statistics
  getOrderStats: async () => {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },

  // Admin: Get order analytics (weekly trend, revenue, distribution)
  getOrderAnalytics: async () => {
    const response = await api.get('/admin/orders/analytics');
    return response.data;
  },

  // ✅ ADD THIS METHOD:
  uploadPaymentProof: async (orderId: number, file: File) => {
    const token = TokenStorage.getToken();  // ✅ BARU
    const formData = new FormData();
    formData.append('payment_proof', file);

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/upload-payment-proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload payment proof');
    }

    return await response.json();
  },

  // ✅ ADD THIS METHOD TOO:
  getPaymentProof: async (orderId: number) => {
    const token = TokenStorage.getToken();  // ✅ BARU

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-proof`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get payment proof');
    }

    return await response.json();
  }
};

// Notification API
export const notificationAPI = {
  getNotifications: async (limit: number = 50, unreadOnly: boolean = false) => {
    const response = await api.get('/notifications', {
      params: { limit, unread_only: unreadOnly }
    });
    return response.data;
  },

  markAsRead: async (notificationId: number) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  getNotificationDetail: async (notificationId: number) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: string;
    password?: string;
  }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createUser: async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (userId: number, data: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  toggleUserStatus: async (userId: number) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getDiseaseTrends: async (days: number = 30) => {
    const response = await api.get('/admin/disease-trends', {
      params: { days }
    });
    return response.data;
  },
};

export default api;

