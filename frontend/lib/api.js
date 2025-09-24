import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get the current user's ID token for API requests
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }
  return await user.getIdToken();
};

/**
 * Make authenticated API requests
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make unauthenticated API requests
 */
const publicApiRequest = async (endpoint, options = {}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Public API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API methods
export const authAPI = {
  // Verify token with backend
  verifyToken: () => apiRequest('/auth/verify', { method: 'POST' }),
  
  // Create user profile after authentication
  createUser: () => apiRequest('/auth/create-user', { method: 'POST' }),
  
  // Get current user profile
  getUser: () => apiRequest('/auth/user'),
  
  // Update user profile
  updateUser: (userData) => apiRequest('/auth/user', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Delete user account
  deleteUser: () => apiRequest('/auth/user', { method: 'DELETE' }),
};

// Upload API methods
export const uploadAPI = {
  // Get presigned URL for file upload
  getPresignedUrl: (fileName, fileType) => apiRequest('/upload/presigned-url', {
    method: 'POST',
    body: JSON.stringify({ fileName, fileType }),
  }),
  
  // Direct file upload to backend
  uploadFile: (formData) => {
    return apiRequest('/upload/direct', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },
  
  // Get user's uploaded files
  getUserFiles: () => apiRequest('/upload/files'),
  
  // Delete a file
  deleteFile: (fileKey) => apiRequest(`/upload/files/${encodeURIComponent(fileKey)}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthCheck = () => publicApiRequest('/health');

export default apiRequest;