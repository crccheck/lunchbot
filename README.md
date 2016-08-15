Lunchbot
========

Lunchbot helps you get lunch.


Usage
-----

Import the lunch library. Calling it with no options will ask for all lunch
options with the default filters.

```
>>> import lunch from './src/lunch';
>>> lunch();
{
  "Cluckin' Bell": {},
  "Out-n-in": {},
  "Wacdonalds": {}
}
```

You can control the results by passing in an options object:
```
lunch({distance: 500});
```

### Options

* 'limit': `int` -- Only return this many venues
* `openAt`: `Date` --  Only return venues that are open at this datetime
* `withinMeters` : `Number` -- Only return venues that are within this many meters

Adding more venues
------------------

Each venue is described by a module. See `src/venues` for examples. At minimum,
a venue module must export a `data` object that has `name` and `coordinates`.
To support more features, you can also export an `openAt` function :
```
export function openAt(date: Date): boolean
```
And a `scrape` function that should return a promise that resolves into a copy
of the `data` object:
```
export async function scrape(): object
```
or if you're old school:
```
export function scrape(): Promise
```

### The `data` object

The `data` object has all the context needed to render a template to the user:

* `name` (required) -- The human friendly name of the venue
* `coordinates` (required) -- The lat/long of the venue
* `url` -- The url to link to. If there's a url to the daily specials, this is it
* `menu` -- A `cheerio` object representing the html for what the menu/special is.
  This is always scraped from `url`. Can also just be a String.

> Why didn't you create a Venue class?
We didn't need it
