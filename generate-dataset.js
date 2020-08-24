const problemSolves = require('./data/problem-solves.json');
const stringify = require('csv-stringify')
const fs = require('fs-extra');

const stringifier = stringify();
const writer = fs.createWriteStream('data/abc155_f.csv');

stringifier.pipe(writer);

const problem = problemSolves.find(({taskName}) => taskName === 'abc155_f');
for (const solve of problem.solves) {
  stringifier.write([solve.rating, solve.solved ? 1 : 0]);
}

stringifier.end();