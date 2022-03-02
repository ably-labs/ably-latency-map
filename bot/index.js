const Ably = require('ably');

const me = {
  id: 'eu-west-1',
  city: 'Ireland',
  coordinates: [-8, 53 ],
};

const client = new Ably.Realtime({
  authUrl: 'https://ably.com/ably-auth/token/demos',
  clientId: me.id,
});

const channel = client.channels.get('ably-latency-map');

const cleanup = () => {
  channel.presence.leave();
  client.close();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

const main = async () => {
  console.log(`Entering channel: ${JSON.stringify(me)}`);
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

main();
