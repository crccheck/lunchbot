import _values from 'lodash/values';
import _toPairs from 'lodash/toPairs';
import toMarkdown from 'to-markdown';
import { WebClient } from '@slack/client';
import lunch from './lunch';

const token = process.env.SLACK_API_TOKEN;
const web = new WebClient(token);

export function formatText(venues) {
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
      mrkdwn_in: ['text'],
    }));
}

/**
 * Post
 * @param  {String} channel The slack channel id to post to
 * @param  {Object} apiOptions Options to use when searching for lunch
 * @return {undefined}
 */
export function postToChannel(channel, apiOptions) {
  const venues = lunch(apiOptions);
  const attachments = formatText(venues);

  web.chat.postMessage(channel, undefined, { attachments }, (__, sentMessage) => {
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
    }, reason => {
      console.warn(reason);
    });
  });
}
