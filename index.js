import _values from 'lodash/values';
import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';

const venues = require('require-all')(`${__dirname}/venues`);

const token = process.env.SLACK_API_TOKEN;

const rtm = new RtmClient(token, { logLevel: 'info' });

let whoami = 'neptr';  // Actual name will be filled in upon connecting
let myTest = new RegExp(`^${whoami}:?\\s+`);
const venuesHash = {};
_values(venues).forEach((x) => { venuesHash[x.data.name] = x.data; });


function makeMessage() {
  function formatSpecial(special) {
    if (!special) {
      return '';
    }

    return `\`\`\`\n${special.text()}\n\`\`\``;
  }

  return _values(venuesHash)
    .map((x) => `* ${x.name} ${x.url || ''} ${formatSpecial(x.special)}`)
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
    const lunchList = makeMessage();

    rtm.sendMessage(lunchList, message.channel, (authenticated, sentMessage) => {
      console.log('send!', sentMessage);

      Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
      .then((values) => {
        values.forEach((x) => {
          Object.assign(venuesHash[x.name], x);
        });
        const text = makeMessage();
        const newMessage = Object.assign({}, sentMessage, { text });
        rtm.updateMessage(newMessage, (err, res) => {
          console.log('updateMessage', err, res);
        });
      });
    });
  }
});

rtm.start();
