import React, { useEffect, useState } from 'react';

import Ably from 'ably';

import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

import './App.css';
import { Bot, BotInfo } from './Bot';
import { Channel } from './Channel';

const client = new Ably.Realtime({
  // A demo key from https://ably.com/ably-auth/api-key/demos
  key: "I2E_JQ.JE8vqw:gdkB884-fGzlcwm5k-R78fylxbO0MVdgelQdKrtOwFw",
  // authUrl: 'https://ably.com/ably-auth/token/demos', // Doesn't work with CORS
});

const channel = new Channel(client);

function App() {
  const [bots, setBots] = useState<BotInfo[]>([]);
  const [error, setError] = useState<Ably.Types.ErrorInfo>();

  const updateBots = () => {
    channel.presence.get((err, members) => {
      if(err) {
        setError(err);
        return;
      }

      const bots = members!.map(member => member.data);

      setBots(bots);
    });
  };

  useEffect(() => {
    updateBots();

    channel.presence.subscribe(updateBots);

    return () => {
      channel.presence.unsubscribe();
    };
  }, []);

  if(error) {
    return (
      <p>Error! {error}</p>
    );
  }

  return (
    <div className="App">
      <ComposableMap>
        <Geographies geography="/world-110m.json">
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
          }
        </Geographies>
        {bots.map(bot => (
          <Bot key={bot.id} bot={bot} channel={channel} />
        ))}
      </ComposableMap>
    </div>
  );
}

export default App;
