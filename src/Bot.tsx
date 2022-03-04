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

export const Colors = [
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
  const [pong, setPong] = useState<Pong>();
  const [color, setColor] = useState(Colors[0]);

  const colorFor = (pong: Pong) => {
      const colorIndex = Math.floor(pong.diff / 225 * Colors.length);

      return Colors[colorIndex] || Colors[Colors.length - 1];
  };

  useEffect(() => {
    const callback = (pong: Pong) => {
      setPong(pong);
      setColor(colorFor(pong))
    };

    channel.onPong(bot.id, callback);

    return () => {
      channel.offPong(bot.id, callback);
    };
  }, [channel, bot.id]);

  return (
    <Marker coordinates={bot.coordinates}>
      <text x="0" y="-15" font-size="0.8em" text-anchor="middle">{bot.city}</text>
      <circle r={10} fill={color} stroke="#fff" strokeWidth={2} cursor="pointer" onClick={() => channel.publish(bot.id)} />
      {pong && (
        <text x="0" y="4" font-size="0.8em" text-anchor="middle">{pong.seq}</text>
      )}
      <text x="0" y="22" font-size="0.8em" text-anchor="middle">
        {pong ? `${pong.diff}ms` : '-'}
      </text>
    </Marker>
  );
};
