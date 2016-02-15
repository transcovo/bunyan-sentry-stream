# Bunyan Sentry Stream

Write log to Sentry/Raven by using Bunyan

## Install & Use

```sh
npm i --save
```

How to :

```js

const raven = require('raven');
const bunyan = require('bunyan');
const sentryStream = require('bunyan-sentry-stream');

const client = new raven.Client(process.env.SENTRY_DSN, { /* EXTRAS */ });

const simpleLogger = bunyan.createLogger({
  name: 'logger',
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
    sentryStream(client)
  ]
});

// OR //

const SentryStream = require('bunyan-sentry-stream').SentryStream;

const advancedLogger = bunyan.createLogger({
  name: 'logger',
  streams: [
    {
      level: 'debug',
      type: 'raw', // Mandatory type for SentryStream
      stream: new SentryStream(client)
    }
  ]
});

```

## Contribute

```sh
npm start         # start the service
npm test          # start test suites (coverage + lint + mocha)
npm run coverage  # run the code coverage tool
npm run doc       # generate the api doc
npm run lint      # execute linter tool
npm run mocha     # run the tests
```
