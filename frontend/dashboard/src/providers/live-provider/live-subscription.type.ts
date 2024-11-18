import {
  LiveCommonParams,
  LiveListParams,
  LiveManyParams,
  LiveOneParams,
  LiveEvent
} from '@refinedev/core';

// I re-define this type to make it more readable
// the original type is exported from the core package
export type LiveSubscribeOptions = {
  channel: string;
  types: Array<LiveEvent['type']>;
  callback: (event: LiveEvent) => void;
  params?: LiveCommonParams & LiveListParams & LiveOneParams & LiveManyParams;
};

// type LiveListParams = {
//   resource?: string;
//   pagination?: Pagination;
//   hasPagination?: boolean;
//   sorters?: CrudSort[];
//   filters?: CrudFilter[];
//   meta?: MetaQuery;
//   metaData?: MetaQuery;
// };

// type LiveOneParams = {
//   resource?: string;
//   id?: BaseKey;
// };

// type LiveManyParams = {
//   resource?: string;
//   ids?: BaseKey[];
// };

// type LiveCommonParams = {
//   subscriptionType?: "useList" | "useOne" | "useMany";
//   [key: string]: unknown;
// };

// type LiveSubscribeOptions = {
//   channel: string;
//   types: Array<LiveEvent["type"]>;
//   callback: (event: LiveEvent) => void;
//   params?: LiveCommonParams & LiveListParams & LiveOneParams & LiveManyParams;
// };
