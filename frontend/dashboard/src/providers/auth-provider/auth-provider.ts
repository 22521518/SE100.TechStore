'use client';

import { API_DEV_URL, API_PRO_URL, API_URL } from '@constant/api.constant';
import type { AuthProvider } from '@refinedev/core';
import Cookies from 'js-cookie';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const rep = await fetch(`${API_URL}/auth/login/dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text().then((text) => (text ? JSON.parse(text) : {}));
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (rep) {
      Cookies.set('access_token', JSON.stringify(rep), {
        expires: rep?.expires_in, // 10 days
        path: '/'
      });

      return {
        success: true,
        redirectTo: '/'
      };
    }

    return {
      success: false,
      error: {
        name: 'LoginError',
        message: 'Invalid username or password'
      }
    };
  },
  logout: async () => {
    Cookies.remove('access_token', { path: '/' });
    return {
      success: true,
      redirectTo: '/login'
    };
  },
  check: async () => {
    const auth = Cookies.get('access_token');
    if (auth) {
      return {
        authenticated: true
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: '/login'
    };
  },
  getPermissions: async () => {
    const token = Cookies.get('access_token');
    const access_token = token ? JSON.parse(token).access_token : '';

    if (!access_token) {
      return [];
    }

    const rep = await fetch(`${API_URL}/profile/staff/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text().then((text) => (text ? JSON.parse(text) : {}));
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (rep) {
      return rep;
    }
    return null;
  },
  getIdentity: async () => {
    const token = Cookies.get('access_token');
    const access_token = token ? JSON.parse(token).access_token : '';

    if (!access_token) {
      return [];
    }

    const rep = await fetch(`${API_URL}/profile/staff`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response
          .text()
          .then((text) => (text ? JSON.parse(text) : {}));
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (rep) {
      return rep;
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true
      };
    }

    return { error };
  }
};

// type AuthProvider = {
//   login: (params: any) => Promise<AuthActionResponse>;
//   logout: (params: any) => Promise<AuthActionResponse>;
//   check: (params?: any) => Promise<CheckResponse>;
//   onError: (error: any) => Promise<OnErrorResponse>;
//   register?: (params: any) => Promise<AuthActionResponse>;
//   forgotPassword?: (params: any) => Promise<AuthActionResponse>;
//   updatePassword?: (params: any) => Promise<AuthActionResponse>;
//   getPermissions?: (
//     params?: Record<string, any>,
//   ) => Promise<PermissionResponse>;
//   getIdentity?: (params?: any) => Promise<IdentityResponse>;
// };

// type AuthActionResponse = {
//   success: boolean;
//   redirectTo?: string;
//   error?: RefineError | Error;
//   [key: string]: unknown;
//   successNotification?: SuccessNotificationResponse;
// };

// type CheckResponse = {
//   authenticated: boolean;
//   redirectTo?: string;
//   logout?: boolean;
//   error?: RefineError | Error;
// };

// type OnErrorResponse = {
//   redirectTo?: string;
//   logout?: boolean;
//   error?: RefineError | Error;
// };
