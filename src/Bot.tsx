import React, { useEffect, useState } from 'react';

import { Marker } from 'react-simple-maps';

import { Channel } from './Channel';

export interface BotInfo {
  id: string;
  city: string;
  coordinates: [number, number];
}

interface BotProps {
  channel: Channel;
  bot: BotInfo;
}

export const Bot = ({ channel, bot }: BotProps) => {
  const [text, setText] = useState('0');

  useEffect(() => {
    channel.subscribePong(bot.id, ({ seq, diff }) => {
      setText(`${seq}: ${diff}`);
    });
  }, []);

  return (
    <Marker coordinates={bot.coordinates} onClick={() => channel.publish(bot.id)}>
      <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
      <text>{text}ms</text>
    </Marker>
  );
};
