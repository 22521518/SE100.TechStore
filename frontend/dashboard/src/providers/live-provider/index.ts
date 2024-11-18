'use client';

import { LiveEvent, LiveProvider } from '@refinedev/core';
import { LiveSubscribeOptions } from './live-subscription.type';
import { subscribeHandler } from './socket-subscribe-handle';
import { unsubscribeHandler } from './socket-unsubscribe-handle';
import { publishHandler } from './socket-publish-handle';

export const liveProvider: LiveProvider = {
  subscribe: ({
    channel,
    types,
    params,
    callback
  }: LiveSubscribeOptions): any => {
    subscribeHandler({ channel, types, params, callback });
  },
  unsubscribe: (subscription) => {
    unsubscribeHandler(subscription);
  },
  publish: ({ channel, type, payload, date, meta }: LiveEvent) => {
    publishHandler({ channel, type, payload, date, meta });
  }
};
