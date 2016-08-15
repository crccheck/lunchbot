import _values from 'lodash/values';
import _toPairs from 'lodash/toPairs';
import { RtmClient, WebClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import toMarkdown from 'to-markdown';
import lunch from './src/lunch';

const token = process.env.SLACK_API_TOKEN;

const rtm = new RtmClient(token, { logLevel: 'info' });
const web = new WebClient(token);
let whoami = 'hubot';  // Actual name will be filled in upon connecting
let myTest = new RegExp(`^${whoami}:?\\s+`);

function isDirectMessage(channelName) {
  return channelName[0] === 'D';
}

function formatText(venues) {
  function formatMenu(menu) {
    return (menu && (menu.html ? toMarkdown(menu.html()) : menu)) || '';
  }

  function formatDistance(venue) {
    return venue.distance ? `distance: ${venue.distance}m` : '';
  }

  const justVenues = _toPairs(venues)
    .filter((x) => x[0][0] !== '_');

  const text = `Here's ${_values(justVenues).length} options (out of ${venues._meta.total})`;

  return justVenues
    .map((x, idx) => ({
      fallback: x[1].data.name,
      title: x[1].data.name,
      title_link: x[1].data.url,
      pretext: !idx && text,
      text: formatMenu(x[1].data.menu),
      footer: formatDistance(x[1]),
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

    web.chat.postMessage(message.channel, undefined, { attachments }, (__, sentMessage) => {
      // console.log('postMessage', sentMessage)
      Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
      .then((values) => {
        values.forEach((x) => {
          Object.assign(venues[x.name], { data: x });
        });
        web.chat.update(
          sentMessage.ts, sentMessage.channel, undefined,
          { attachments: formatText(venues) }, (err, res) => {
            console.log('updateMessage', err, res);
          }
        );
      });
    });
  }
});

rtm.start();
