const Ably = require('ably');

const env = (name) => {
  const val = process.env[name];
  if(!val || val === '') {
    console.error(`ERROR: Missing env var: ${name}`);
    process.exit(1);
  }
  return val;
}

const me = {
  id: env('BOT_ID'),
  city: env('BOT_CITY'),
  coordinates: [env('BOT_LONGITUDE'), env('BOT_LATITUDE') ],
};

const client = new Ably.Realtime({
  authUrl: 'https://ably.com/ably-auth/token/demos',
  clientId: me.id,
});

const channel = client.channels.get('ably-latency-map');

const main = async () => {
  console.log(`Entering channel: me=${JSON.stringify(me)}`);
  try {
    await channel.presence.enter(me);
  } catch (err) {
    console.error(`Error entering channel: ${err}`);
    return;
  }

  console.log('Waiting for instructions...');
  channel.subscribe(({ name, data }) => {
    console.log(`Received message: name="${name}" data="${JSON.stringify(data)}"`);

    switch (name) {
      case 'request':
        if(data.botId === me.id) {
          const ping = {
            seq: data.seq,
            src: me.id,
            time: Date.now(),
          };
          console.log(`Sending ping: ${JSON.stringify(ping)}`);
          channel.publish('ping', ping);
        }
        break;
      case 'ping':
        const pong = {
          seq: data.seq,
          src: data.src,
          dst: me.id,
          diff: Date.now() - data.time,
        };
        console.log(`Sending pong: ${JSON.stringify(pong)}`);
        channel.publish('pong', pong);
        break;
      case 'pong':
        // just ignore pongs
        break;
      default:
        console.error(`Unhandled message: ${name}`);
    };
  });
};

const cleanup = () => {
  channel.presence.leave();
  client.close();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main();
