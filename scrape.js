require('dotenv').config();

const fs = require('fs-extra');
const download = require('download');
const contests = require('./data/contests.json');

(async () => {
  await fs.ensureDir('data/standings');
  await fs.ensureDir('data/results');

  const ratedContests = contests.filter(({rate_change}) => rate_change !== '-');
  for (const contest of ratedContests) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    {
      const url = `https://atcoder.jp/contests/${contest.id}/standings/json`;
      console.log(`Downloading ${url}...`);
      await download(url, 'data/standings', {filename: `${contest.id}.json`, headers: {cookie: `REVEL_SESSION=${process.env.ATCODER_SESSIONID}`}});
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    {
      const url = `https://atcoder.jp/contests/${contest.id}/results/json`;
      console.log(`Downloading ${url}...`);
      await download(url, 'data/results', {filename: `${contest.id}.json`, headers: {cookie: `REVEL_SESSION=${process.env.ATCODER_SESSIONID}`}});
    }
  }
})();
