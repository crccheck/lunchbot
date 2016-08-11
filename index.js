import _values from 'lodash/values';
import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import toMarkdown from 'to-markdown';
import lunch from './src/lunch';

const token = process.env.SLACK_API_TOKEN;

const rtm = new RtmClient(token, { logLevel: 'info' });
let whoami = 'neptr';  // Actual name will be filled in upon connecting
let myTest = new RegExp(`^${whoami}:?\\s+`);


function formatText(venues) {
  function formatSpecial(special) {
    if (!special) {
      return '';
    }

    return `\`\`\`\n${toMarkdown(special.html())}\n\`\`\``;
  }

  function formatDistance(venue) {
    if (!venue.distance) {
      return '';
    }

    return `${venue.distance}m`;
  }

  return _values(venues)
    .map((x) => `* ${x.data.name} (${formatDistance(x)}) ${formatSpecial(x.data.special)}`)
    .join('\n');
}

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  whoami = rtmStartData.self.name;
  myTest = new RegExp(`^${whoami}:?\\s+`);
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // TODO privmsg
  if (!myTest.test(message.text)) {
    return;
  }

  const messageContent = message.text.replace(myTest, '');

  if (messageContent.search(/^lunch$/) !== -1) {
    const venues = lunch();
    const lunchList = formatText(venues);

    rtm.sendMessage(lunchList, message.channel, (authenticated, sentMessage) => {
      console.log('send!', sentMessage);
      Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
      .then((values) => {
        values.forEach((x) => {
          Object.assign(venues[x.name], { data: x });
        });
        const text = formatText(venues);
        const newMessage = Object.assign({}, sentMessage, { text });
        rtm.updateMessage(newMessage, (err, res) => {
          console.log('updateMessage', err, res);
        });
      });
    });
  }
});

rtm.start();
