import React from 'react';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

const sites: { id: string, city: string, coordinates: [number, number] }[] = [
  { id: "us-east-1",      city: "Virginia",       coordinates: [-78.45,  38.13  ] },
  { id: "us-east-2",      city: "Ohio",           coordinates: [-83,     39.96  ] },
  { id: "us-west-1",      city: "California",     coordinates: [-121.96, 37.35  ] },
  // { id: "us-west-2",      city: "Oregon",         coordinates: [-123.88, 46.15  ] },
  { id: "eu-west-1",      city: "Ireland",        coordinates: [-8,      53     ] },
  // { id: "eu-west-2",      city: "London",         coordinates: [-0.1,    51     ] },
  // { id: "eu-west-3",      city: "Paris",          coordinates: [2.35,    48.86  ] },
  { id: "eu-central-1",   city: "Frankfurt",      coordinates: [8,       50     ] },
  // { id: "sa-east-1",      city: "Sao Paulo",      coordinates: [-46.38,  -23.34 ] },
  { id: "ap-southeast-1", city: "Singapore",      coordinates: [103.8,   1.37   ] },
  { id: "ap-southeast-2", city: "Sydney",         coordinates: [151.2,   -33.86 ] },
  // { id: "ap-northeast-1", city: "Tokyo",          coordinates: [139.42,  35.41  ] },
  // { id: "ap-northeast-2", city: "Seoul",          coordinates: [126.98,  37.56  ] },
  // { id: "ap-south-1",     city: "Mumbai",         coordinates: [72.88,   19.08  ] },
  // { id: "ca-central-1",   city: "Canada Central", coordinates: [-73.6,   45.5   ] },
];

function App() {
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
        {sites.map(site => (
          <Marker key={site.id} coordinates={site.coordinates} onClick={() => alert(site.city)}>
            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export default App;
