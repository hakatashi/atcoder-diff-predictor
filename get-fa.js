const problemSolves = require('./data/problem-solves.json');
const {minBy} = require('lodash');
const stringify = require('csv-stringify')
const fs = require('fs-extra');

const data = [];
const stringifier = stringify();
const writer = fs.createWriteStream('data/fa.csv');

stringifier.pipe(writer);

for (const problem of problemSolves) {
  const fa = minBy(problem.solves.filter((solve) => solve.solved), (solve) => solve.elapsed);
  if (fa && problem.difficulty) {
    stringifier.write([problem.difficulty, problem.score, fa.elapsed, fa.rating]);
  }
}

stringifier.end();
