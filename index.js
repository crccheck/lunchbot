// Reference implementation of a Slack client
import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import { postToChannel } from './src/slack';

const token = process.env.SLACK_API_TOKEN;

const rtm = new RtmClient(token, { logLevel: 'info' });
let whoami = 'hubot';  // Actual name will be filled in upon connecting
let myTest = new RegExp(`^${whoami}:?\\s+`);

function isDirectMessage(channelName) {
  return channelName[0] === 'D';
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

  if (messageContent.search(/^lunch\b/) !== -1) {
    const apiOptions = {
      onlyScrape: messageContent.search(/spec/) !== -1,
      // TODO support more options
    };
    postToChannel(message.channel, apiOptions);
  }
});

rtm.start();
