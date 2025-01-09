const API_PRO_URL = 'https://se100-techstore.onrender.com';
const API_DEV_URL = 'http://[::1]:4000';
export const API_URL =
  process.env.NODE_ENV === 'production' ? API_PRO_URL : API_DEV_URL; //API_PRO_URL;
