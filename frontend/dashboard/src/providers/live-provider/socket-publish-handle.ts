import { LiveEvent } from '@refinedev/core';

export const publishHandler = (event: LiveEvent) => {};

// type LiveEvent = {
//   channel: string;
//   type: "deleted" | "updated" | "created" | "*" | string;
//   payload: {
//     ids?: BaseKey[];
//     [x: string]: any;
//   };
//   date: Date;
//   meta?: MetaQuery & {
//     dataProviderName?: string;
//   };
// };
