// Authentication Service for AgriTwin Nexus
// Decoupled layer allowing seamless transition from LocalStorage session to FastAPI JWT Auth

import { apiClient, isBackendAvailable } from './api';

const USERS_STORAGE_KEY = 'agritwin_users';
const ADMINS_STORAGE_KEY = 'agritwin_admins';
const CURRENT_USER_KEY = 'agritwin_current_user';
const ADMIN_SESSION_KEY = 'agritwin_admin_session';

export const authService = {
  /**
   * Register a new farmer account (Full Name, Email, Mobile Number, Password)
   */
  async register({ fullName, email, mobileNumber = '', password }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // 1. Local storage check for existing duplicate account
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    // 2. Register with FastAPI backend database if available
    try {
      if (await isBackendAvailable()) {
        await apiClient.post('/auth/register', {
          full_name: cleanName,
          email: cleanEmail,
          password: password
        });
      }
    } catch (e) {
      console.warn('Backend API registration notice:', e?.response?.data?.detail || e.message);
      if (e?.response?.status === 400) {
        throw new Error(e.response.data.detail || 'An account with this email address already exists.');
      }
    }

    // 3. Save account locally so login always works seamlessly everywhere
    const newUser = {
      id: 'usr_' + Date.now(),
      fullName: cleanName,
      email: cleanEmail,
      mobileNumber,
      password,
      role: 'farmer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return { success: true, message: 'Farmer registration successful!' };
  },

  /**
   * Register a new Administrator account
   */
  async adminRegister({ fullName, email, mobileNumber = '', password, designation = 'Platform Admin' }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '[]');
    
    const existingAdmin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existingAdmin) {
      throw new Error('An administrator account with this email address already exists.');
    }

    const newAdmin = {
      id: 'adm_' + Date.now(),
      fullName,
      email: email.toLowerCase(),
      mobileNumber,
      password,
      designation,
      role: 'administrator',
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));

    return { success: true, message: 'Administrator registered successfully!' };
  },

  /**
   * Login farmer against Backend API or Local Registry
   */
  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try FastAPI Backend API Authentication first
    try {
      if (await isBackendAvailable()) {
        const response = await apiClient.post('/auth/login', {
          email: cleanEmail,
          password: password
        });

        if (response.data && response.data.user) {
          const apiUser = response.data.user;
          const sessionUser = {
            id: apiUser.id,
            fullName: apiUser.full_name || apiUser.fullName || 'Farmer User',
            email: apiUser.email,
            role: 'farmer',
            token: response.data.access_token || ('jwt_token_' + Date.now())
          };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
          localStorage.setItem('agritwin_jwt_token', sessionUser.token);
          return { success: true, user: sessionUser };
        }
      }
    } catch (e) {
      console.warn('Backend login endpoint fallback to local storage:', e?.response?.data?.detail || e.message);
      // Fall through to local storage registry if backend DB doesn't have the user yet
    }

    // 2. Local Storage Authentication Fallback
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    // Default demo farmer user fallback
    if (!user && cleanEmail === 'farmer@agritwin.com' && password === 'farmer123') {
      const demoUser = {
        id: 'usr_demo_1',
        fullName: 'Rajesh Kumar',
        email: 'farmer@agritwin.com',
        role: 'farmer',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: 'farmer',
      token: 'jwt_mock_token_' + Date.now()
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  /**
   * Login Administrator
   */
  async adminLogin({ usernameOrEmail, password }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '[]');
    const registeredAdmin = admins.find(
      (a) => (a.email.toLowerCase() === usernameOrEmail.toLowerCase() || a.fullName.toLowerCase() === usernameOrEmail.toLowerCase()) && a.password === password
    );

    // Default system root admin fallback
    const isRootAdmin =
      (usernameOrEmail.toLowerCase() === 'admin@agritwin.com' || usernameOrEmail.toLowerCase() === 'admin') &&
      password === 'admin123';

    if (!registeredAdmin && !isRootAdmin) {
      throw new Error('Invalid administrator credentials. Access restricted.');
    }

    const adminSession = registeredAdmin
      ? {
          id: registeredAdmin.id,
          fullName: registeredAdmin.fullName,
          email: registeredAdmin.email,
          designation: registeredAdmin.designation || 'System Admin',
          role: 'administrator',
          token: 'admin_jwt_token_' + Date.now()
        }
      : {
          id: 'admin_root',
          fullName: 'System Administrator',
          email: 'admin@agritwin.com',
          designation: 'Root Platform Admin',
          role: 'administrator',
          token: 'admin_jwt_token_' + Date.now()
        };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    return { success: true, admin: adminSession };
  },

  /**
   * Get active farmer session
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Get active admin session
   */
  getAdminUser() {
    const adminStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!adminStr) return null;
    try {
      return JSON.parse(adminStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Logout farmer session
   */
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('agritwin_jwt_token');
  },

  /**
   * Logout administrator session
   */
  adminLogout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
