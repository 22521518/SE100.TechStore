'use client';

import InboxRoomShow from '@components/inbox/show/inbox-show';
import { IInboxRoom, IInboxRoomCard } from '@constant/interface.constant';
import { HttpError, useOne } from '@refinedev/core';
import React from 'react';

type InboxShowProps = {
  showRoom: IInboxRoomCard;
};

const InboxShow = ({ showRoom }: InboxShowProps) => {
  const { data, isLoading } = useOne<IInboxRoom, HttpError>({
    resource: 'inbox',
    id: showRoom.customer.customer_id
  });

  if (isLoading || !data) return <div>Loading...</div>;

  return <>{<InboxRoomShow showRoom={data?.data} />}</>;
};

export default InboxShow;
