import request from 'request-promise';

const FB_URL = 'https://graph.facebook.com/v2.7/200414600091489/feed';

export const data = {
  name: 'My Thai Mom',
  url: 'https://www.facebook.com/MyThaiMom',
  coordinates: [30.2720917, -97.7437975],
};

export async function scrape() {
  const body = await request.get({
    url: FB_URL,
    qs: { access_token: process.env.FACEBOOK_APP_TOKEN },
    json: true,
  });
  const now = new Date();
  const recentPosts = body.data.filter((x) => (now - new Date(x.created_time)) < 86400 * 1000);
  const recentMenuPosts = recentPosts.filter((x) => x.message.search(/menu/i) !== -1);
  const menu = recentMenuPosts.length ? recentMenuPosts[0].message : undefined;

  return recentMenuPosts.length && Object.assign({ menu }, data);
}
