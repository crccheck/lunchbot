Lunchbot
========

Lunchbot helps you get lunch.


Lunch SDK
---------

Import the lunch library. Calling it with no options will ask for all lunch
options with the default filters.

```
> import lunch from './src/lunch';
> lunch();
{
  "Cluckin' Bell": {},
  "Out-n-in": {},
  "Wacdonalds": {}
}
```

You can control the results by passing in an options object:

    lunch({distance: 500});

### Options

See documentation for `src/lunch._get`;

Adding more venues
------------------

Each venue is described by a module. See `src/venues` for examples. At minimum,
a venue module must export a `data` object that has `name` and `coordinates`.
To support more features, you can also export an `openAt` function:

    export function openAt(date: Date): Boolean

And a `scrape` function that should return a promise that resolves into a copy
of the `data` object:

    export async function scrape(): Object

or if you're old school:

    export function scrape(): Promise


### The `data` object

The `data` object has all the context needed to render a template to the user:

* `name` (required) -- The human friendly name of the venue
* `coordinates` (required) -- The lat/long of the venue
* `url` -- The url to link to.
* `menu` -- A `cheerio` object representing the html for what the menu/special is.
  This is always scraped from `url`. Can also just be a String.

> Why didn't you create a Venue class?
We didn't need it


Slack integration
-----------------

You can send lunch options to a Slack channel using the Slack web client. You
must have the `SLACK_API_TOKEN` environment variable set. The `options` are the
same options as above.

```
> import {postToChannel} from './src/slack';
> postToChannel('C0FF33', options)
```


The reference Slackbot
----------------------

There's a proof of concept reference Slackbot you can run with:

    ./node_modules/.bin/babel-node index.js
