import _values from 'lodash/values';
import { RtmClient, WebClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import toMarkdown from 'to-markdown';
import lunch from './src/lunch';

const token = process.env.SLACK_API_TOKEN;

const rtm = new RtmClient(token, { logLevel: 'info' });
const web = new WebClient(token);
let whoami = 'neptr';  // Actual name will be filled in upon connecting
let myTest = new RegExp(`^${whoami}:?\\s+`);

function isDirectMessage(channelName) {
  return channelName[0] === 'D';
}

function formatText(venues) {
  function formatSpecial(special) {
    return special ? toMarkdown(special.html()) : '';
  }

  function formatDistance(venue) {
    return venue.distance ? `distance: ${venue.distance}m` : '';
  }

  return _values(venues)
    .map((x) => ({
      fallback: x.data.name,
      title: x.data.name,
      title_link: x.data.url,
      text: formatSpecial(x.data.special),
      footer: formatDistance(x),
      mrkdown_in: ['text'],
    }));
}

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  whoami = rtmStartData.self.name;
  myTest = new RegExp(`^${whoami}:?\\s+`);
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (!message.text) {
    return;
  }

  if (!myTest.test(message.text) && !isDirectMessage(message.channel)) {
    return;
  }

  const messageContent = message.text.replace(myTest, '');

  if (messageContent.search(/^lunch$/) !== -1) {
    const venues = lunch();
    const attachments = formatText(venues);

    const venueMeta = venues._meta;
    delete venues._meta;

    web.chat.postMessage(message.channel, undefined, { attachments }, (__, sentMessage) => {
      // console.log('postMessage', sentMessage)
      Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
      .then((values) => {
        values.forEach((x) => {
          Object.assign(venues[x.name], { data: x });
        });
        web.chat.update(sentMessage.ts, sentMessage.channel, undefined,
                        { attachments: formatText(venues) }, (err, res) => {
          console.log('updateMessage', err, res);
        });
      });
    });
  }
});

rtm.start();
