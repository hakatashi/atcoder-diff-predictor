const parse = require('csv-parse');
const fs = require('fs');
const contests = require('./data/contests.json');

contests.sort((a, b) => a.start_epoch_second - b.start_epoch_second)
const latestContests = new Set(contests.filter(({rate_change}) => rate_change !== '-').map(({id}) => id));
const contestsMap = new Map(contests.map((contest) => [contest.id, contest]));

const reader = fs.createReadStream('data/submissions.csv');
const parser = parse({columns: true});

parser.on('data', (row) => {
  console.log(row);
});

reader.pipe(parser);