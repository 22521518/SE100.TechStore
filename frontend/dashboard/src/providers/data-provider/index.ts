'use client';

import { API_URL } from '@constant/api.constant';
import dataProviderSimpleRest from '@refinedev/simple-rest';

export const dataProvider = dataProviderSimpleRest(API_URL);
