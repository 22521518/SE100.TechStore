import { TPermission } from './permission.type';

export type RequestUserPayload = {
  id: string;
  role: string;
  permission: TPermission[];
  iat: number;
};
