const problemSolves = require('./data/problem-solves.json');
const {minBy} = require('lodash');
const stringify = require('csv-stringify')
const fs = require('fs-extra');

const normalizeRating = (rating) => {
  if (rating > 400) {
    return rating;
  }
  return 3000 / Math.exp((400 - rating) / 3000) - 2600;
};

const stringifiers = Array(4).fill().map(() => stringify());
const writers = [
  fs.createWriteStream('data/fa.csv'),
  fs.createWriteStream('data/fa3.csv'),
  fs.createWriteStream('data/fa10.csv'),
  fs.createWriteStream('data/fa30.csv'),
];

for (const [i, stringifier] of stringifiers.entries()) {
  stringifier.pipe(writers[i])
  stringifier.write(['difficulty', 'score', 'elapsed', 'rating']);
}


for (const problem of problemSolves) {
  const solves = problem.solves.filter((solve) => solve.solved)
  solves.sort((a, b) => a.elapsed - b.elapsed);

  if (problem.difficulty) {
    if (solves.length >= 1 && problem.difficulty) {
      stringifiers[0].write([normalizeRating(problem.difficulty), problem.score, solves[0].elapsed, solves[0].rating]);
    }
    if (solves.length >= 3 && problem.difficulty) {
      stringifiers[1].write([normalizeRating(problem.difficulty), problem.score, solves[2].elapsed, solves[2].rating]);
    }
    if (solves.length >= 10 && problem.difficulty) {
      stringifiers[2].write([normalizeRating(problem.difficulty), problem.score, solves[9].elapsed, solves[9].rating]);
    }
    if (solves.length >= 30 && problem.difficulty) {
      stringifiers[3].write([normalizeRating(problem.difficulty), problem.score, solves[29].elapsed, solves[29].rating]);
    }
  }
}

for (const stringifier of stringifiers) {
  stringifier.end();
}
