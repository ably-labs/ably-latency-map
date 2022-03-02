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

function App() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [error, setError] = useState<Ably.Types.ErrorInfo>();

  useEffect(() => {
    const client = new Ably.Realtime({
      authUrl: 'https://ably.com/ably-auth/token/demos',
    });

    const channel = client.channels.get('ably-latency-map');

    channel.presence.get((err, members) => {
      if(err) {
        setError(err);
        return;
      }

      const bots = members!.map(member => member.data);

      setBots(bots);
    });

    return () => {
      client.close();
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
          <Marker key={bot.id} coordinates={bot.coordinates} onClick={() => alert(bot.city)}>
            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export default App;
