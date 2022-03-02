const Ably = require('ably');

const info = {
  id: 'eu-west-1',
  city: 'Ireland',
  coordinates: [-8, 53 ],
};

const main = async () => {
  const client = new Ably.Realtime({
    authUrl: 'https://ably.com/ably-auth/token/demos',
    clientId: info.id,
  });

  const channel = client.channels.get('ably-latency-map');

  console.log(`Entering channel: ${JSON.stringify(info)}`);
  try {
    await channel.presence.enter(info);
  } catch (err) {
    console.error(`Error entering channel: ${err}`);
    return;
  }

  console.log('Waiting for instructions...');
};

main();
