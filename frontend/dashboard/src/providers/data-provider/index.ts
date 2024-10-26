'use client';

import dataProviderSimpleRest from '@refinedev/simple-rest';

// const API_URL = "https://api.fake-rest.refine.dev";
const API_PRO_URL = 'https://se100-techstore.onrender.com';
const API_DEV_URL = 'http://[::1]:9999';
const API_URL =
  process.env.NODE_ENV === 'development' ? API_DEV_URL : API_PRO_URL;

export const dataProvider = dataProviderSimpleRest(API_URL);
