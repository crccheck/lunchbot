import _values from 'lodash/values';
import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';

const venues = require('require-all')(`${__dirname}/venues`);

const token = process.env.SLACK_API_TOKEN;

const rtm = new RtmClient(token, { logLevel: 'info' });

let whoami = 'neptr';  // Actual name will be filled in upon connecting
let myTest = new RegExp(`^${whoami}:?\\s+`);


function makeMessage(lunchOptions) {
  return _values(lunchOptions)
    .map((x) => x.data)
    .map((x) => `* ${x.name} ${x.special && x.special.text() || ''}`)
    .join('\n');
}

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  whoami = rtmStartData.self.name;
  myTest = new RegExp(`^${whoami}:?\\s+`);
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (!myTest.test(message.text)) {
    return;
  }

  const messageContent = message.text.replace(myTest, '');

  if (messageContent.search(/^lunch$/) !== -1) {
    const lunchOptions = Object.assign([], venues);
    const lunchList = makeMessage(lunchOptions);

    rtm.sendMessage(lunchList, message.channel, (authenticated, sentMessage) => {
      console.log('send!', sentMessage);

      Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
      .then((values) => {
        const lunchData = values.map((x) => Object.assign({}, x, { special: x.special.text() }));
        console.log('.', lunchData);
        const text = sentMessage.text + '\n' + lunchData.map((x) => x.special).join('\n');
        console.log('..', text);
        const newMessage = Object.assign({}, sentMessage, { text });
        console.log('...new Message', newMessage);
        rtm.updateMessage(newMessage, (err, res) => {
          console.log('...updateMessage', err, res);
        });
      });
    });
  }
});

rtm.start();
