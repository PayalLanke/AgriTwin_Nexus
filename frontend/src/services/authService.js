// Authentication Service for AgriTwin Nexus
// Decoupled layer allowing seamless transition from LocalStorage session to FastAPI JWT Auth

const USERS_STORAGE_KEY = 'agritwin_users';
const ADMINS_STORAGE_KEY = 'agritwin_admins';
const CURRENT_USER_KEY = 'agritwin_current_user';
const ADMIN_SESSION_KEY = 'agritwin_admin_session';

export const authService = {
  /**
   * Register a new farmer account (Full Name, Email, Mobile Number, Password)
   */
  async register({ fullName, email, mobileNumber = '', password }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Check if email already registered
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email: email.toLowerCase(),
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
    await new Promise((resolve) => setTimeout(resolve, 400));

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
   * Login farmer
   */
  async login({ email, password }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Default demo farmer user fallback
    if (!user && email.toLowerCase() === 'farmer@agritwin.com' && password === 'farmer123') {
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
      throw new Error('Invalid email or password. Please try again.');
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
    await new Promise((resolve) => setTimeout(resolve, 400));

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
  },

  /**
   * Logout administrator session
   */
  adminLogout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
