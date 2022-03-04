# Ably Latency Map

A demonstration of the latency experienced when sending messages through Ably to countries around the world.

![demo](/public/demo.png)

## Bot

The `bot` directory contains a server side application which is responsible for sending and receiving messages on an Ably channel, and reporting the observed latency.

A bot is started with the following environment variables:

- `BOT_ID`: an identifier for sending messages to this bot
- `BOT_CITY`: the city the bot is running in
- `BOT_LATITUDE` & `BOT_LONGITUDE`: the co-ordinates of the location of the bot

The bot enters the `ably-latency-map` channel with its details as its presence data.

The bot listens for a `request` message with its ID and sends a `ping` message.

The bot also listens for a `ping` message, and publishes a `pong` message with the duration since the ping was sent.

To run a bot:

```
cd bot

npm install

export BOT_ID=eu-west-1
export BOT_CITY=Dublin
export BOT_LATITUDE="53"
export BOT_LONGITUDE="-8"

npm start
```

## React App

The `src` directory contains a browser React application which displays a map to the user with each bots location, allows them to instruct a bot to send a `ping` message by clicking them, and visualises the resulting `pong` messages.

To run the app:

```
npm install

npm start
```

_NOTE: the React app currently uses a hard-coded, but short lived, API key in src/App.tsx, so that may need to be updated before the app will work. I wanted this to use an authUrl, but I got hit by CORS issues :/_.
