import React, { useEffect, useState } from 'react';

import Ably from 'ably';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

interface Bot {
  id: string;
  city: string;
  coordinates: [number, number];
}

const client = new Ably.Realtime({
  authUrl: 'https://ably.com/ably-auth/token/demos',
});

const channel = client.channels.get('ably-latency-map');

let seq = 1;

const publish = (botId: string) => {
  channel.publish('request', { seq, botId });
  seq++;
};

function App() {
  const [bots, setBots] = useState<Bot[]>([]);
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
          <Marker key={bot.id} coordinates={bot.coordinates} onClick={() => publish(bot.id)}>
            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export default App;
