'use client';

import { IInboxMessage, IStaff } from '@constant/interface.constant';
import { Button, InputBase, Paper } from '@mui/material';
import { useGetIdentity } from '@refinedev/core';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import React from 'react';

type InboxChatBarProps = {
  onSend: (message: IInboxMessage) => void;
};

const InboxChatBar = ({ onSend }: InboxChatBarProps) => {
  const { data: identity } = useGetIdentity<IStaff>();

  const [message, setMessage] = React.useState<IInboxMessage>({
    message: '',
    sender: {
      sender_id: identity?.staff_id || '',
      sender_name: identity?.full_name || ''
    },
    created_at: new Date(),
    is_seen: false
  });
  // const { query } = useShow<IInboxMessage, HttpError>();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(message.message.trim()==="") return
    // query.create({ message: 'Hello' });
    const sendMessage = {
      ...message,
      created_at: new Date().toISOString()
    };
    onSend(sendMessage);
    setMessage((prev) => ({
      ...prev,
      message: ''
    }));
  };

  React.useEffect(() => {
    setMessage((prev) => ({
      ...prev,
      sender: {
        sender_id: identity?.staff_id || '',
        sender_name: identity?.full_name || ''
      }
    }));
  }, [identity]);

  return (
    <div className="w-[95%] h-4/5 items-center content-center justify-center flex flex-row bg-secondary-300 rounded-full shadow-2xl p-0">
      <Paper
        component="form"
        onSubmit={onSubmit}
        className="w-full h-full justify-between items-center flex flex-row rounded-full bg-transparent shadow-none overflow-hidden"
      >
        <InputBase
          sx={{
            '& .MuiInputBase-root': {
              padding: 0,
              height: 'max-content'
            }
          }}
          placeholder={`Enter text`}
          className="flex-1 px-4"
          value={message.message}
          onChange={(e) =>
            setMessage((prev) => ({
              ...prev,
              message: e.target.value
            }))
          }
        />
        <Button
          className="h-full aspect-square p-0 rounded-full hover:bg-slate-900 "
          type="submit"
        >
          <SendRoundedIcon className="-rotate-45 text-3xl -mt-1 text-accent w-max" />
        </Button>
      </Paper>
    </div>
  );
};

export default InboxChatBar;
