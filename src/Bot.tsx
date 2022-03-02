import React, { useEffect, useState } from 'react';

import { Marker } from 'react-simple-maps';

import { Channel, Pong } from './Channel';

export interface BotInfo {
  id: string;
  city: string;
  coordinates: [number, number];
}

interface BotProps {
  channel: Channel;
  bot: BotInfo;
}

const colors = [
  '#00ff00',
  '#5bf400',
  '#7de800',
  '#96dc00',
  '#aad000',
  '#bbc300',
  '#cab500',
  '#d7a700',
  '#e29700',
  '#eb8700',
  '#f27600',
  '#f86400',
  '#fc4f00',
  '#ff3500',
  '#ff0000',
];

export const Bot = ({ channel, bot }: BotProps) => {
  const [text, setText] = useState('0');
  const [color, setColor] = useState(colors[0]);

  const colorFor = (pong: Pong) => {
      const colorIndex = Math.floor(pong.diff / 150 * colors.length);

      return colors[colorIndex] || colors[colors.length - 1];
  };

  useEffect(() => {
    const callback = (pong: Pong) => {
      setColor(colorFor(pong))
      setText(`${pong.seq}: ${pong.diff}`);
    };

    channel.onPong(bot.id, callback);

    return () => {
      channel.offPong(bot.id, callback);
    };
  }, []);

  return (
    <Marker coordinates={bot.coordinates} onClick={() => channel.publish(bot.id)}>
      <circle r={10} fill={color} stroke="#fff" strokeWidth={2} />
      <text>{text}ms</text>
    </Marker>
  );
};
