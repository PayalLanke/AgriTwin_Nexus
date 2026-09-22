// Authentication Service for AgriTwin Nexus
// Decoupled layer allowing seamless transition from LocalStorage session to FastAPI JWT Auth

const USERS_STORAGE_KEY = 'agritwin_users';
const CURRENT_USER_KEY = 'agritwin_current_user';

export const authService = {
  /**
   * Register a new farmer account
   */
  async register({ fullName, email, password }) {
    // Simulating API network delay
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
      password, // In production, FastAPI backend handles secure bcrypt hashing
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return { success: true, message: 'Registration successful!' };
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

    // Default demo user fallback if first run
    if (!user && email.toLowerCase() === 'farmer@agritwin.com' && password === 'farmer123') {
      const demoUser = {
        id: 'usr_demo_1',
        fullName: 'Rajesh Kumar',
        email: 'farmer@agritwin.com',
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
      token: 'jwt_mock_token_' + Date.now()
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  /**
   * Get active logged in farmer session
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
   * Logout farmer session
   */
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
