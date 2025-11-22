import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const token = localStorage.getItem('access_token');
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
      
      // Jangan auto-logout kalau:
      const currentPath = window.location.pathname;
      const isPublicPath = currentPath === '/' || currentPath.includes('/login');
      const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
      
      // Kalau sudah di public page atau ini request auth, skip
      if (isPublicPath || isAuthEndpoint) {
        return Promise.reject(error);
      }
      
      // Cek apakah ini retry attempt
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        // Validasi token
        const token = localStorage.getItem('access_token');
        
        if (token) {
          try {
            // Decode JWT untuk cek expiry
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (!isExpired) {
              // Token masih valid, retry request
              console.log('✅ Token still valid, retrying request...');
              return api(originalRequest);
            }
          } catch (e) {
            console.error('Token decode error:', e);
          }
        }
      }
      
      // Kalau sampai sini, berarti token bener-bener expired/invalid
      console.log('🚪 Logging out due to invalid token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Pakai timeout untuk avoid race condition
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
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
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

    updateProfile: async (data: { 
    name?: string; 
    phone?: string; 
    address?: string; 
    age?: number; 
    primary_fish_type?: string; 
    password?: string 
  }) => {
    const token = localStorage.getItem('access_token');
    
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
  getSpecies: async (search?: string, category?: string) => {
    const response = await api.get('/fishpedia', {
      params: { search, category }
    });
    return response.data;
  },
  
  getSpeciesDetail: async (speciesId: number) => {
    const response = await api.get(`/fishpedia/${speciesId}`);
    return response.data;
  },
  
  addSpecies: async (data: any) => {
    const response = await api.post('/fishpedia', data);
    return response.data;
  },
  
  updateSpecies: async (speciesId: number, data: any) => {
    const response = await api.put(`/fishpedia/${speciesId}`, data);
    return response.data;
  },
  
  deleteSpecies: async (speciesId: number) => {
    const response = await api.delete(`/fishpedia/${speciesId}`);
    return response.data;
  },
};

// Forum API
export const forumAPI = {
  getTopics: async (category?: string, search?: string) => {
    const response = await api.get('/forum/topics', {
      params: { category, search }
    });
    return response.data;
  },
  
  getTopic: async (topicId: number) => {
    const response = await api.get(`/forum/topics/${topicId}`);
    return response.data;
  },
  
  createTopic: async (data: {
    title: string;
    content: string;
    category?: string;
  }) => {
    const response = await api.post('/forum/topics', data);
    return response.data;
  },
  
  updateTopic: async (topicId: number, data: any) => {
    const response = await api.put(`/forum/topics/${topicId}`, data);
    return response.data;
  },
  
  deleteTopic: async (topicId: number) => {
    const response = await api.delete(`/forum/topics/${topicId}`);
    return response.data;
  },
  
  addReply: async (topicId: number, content: string) => {
    const response = await api.post(`/forum/topics/${topicId}/replies`, { content });
    return response.data;
  },
  
  updateReply: async (replyId: number, content: string) => {
    const response = await api.put(`/forum/replies/${replyId}`, { content });
    return response.data;
  },
  
  deleteReply: async (replyId: number) => {
    const response = await api.delete(`/forum/replies/${replyId}`);
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
    const token = localStorage.getItem('access_token');
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
    const token = localStorage.getItem('access_token');
    
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
