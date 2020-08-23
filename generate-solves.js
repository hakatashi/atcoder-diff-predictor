const fs = require('fs-extra');
const problemModels = require('./data/problem-models.json');

const tasks = new Map();
const scores = new Map();

(async () => {
  const contests = await fs.readdir('data/standings');
  for (const contest of contests) {
    console.log(`Processing ${contest}...`);
    const standings = await fs.readJson(`data/standings/${contest}`);
    for (const task of standings.TaskInfo) {
      if (!tasks.has(task.TaskScreenName)) {
        tasks.set(task.TaskScreenName, []);
      }
    }
    for (const rank of standings.StandingsData) {
      if (rank.TotalResult.Count === 0) {
        continue;
      }
      for (const taskInfo of standings.TaskInfo) {
        if (rank.TaskResults.hasOwnProperty(taskInfo.TaskScreenName)) {
          const task = rank.TaskResults[taskInfo.TaskScreenName];
          tasks.get(taskInfo.TaskScreenName).push({
            user: rank.UserScreenName,
            solved: task.Status === 1,
            elapsed: Math.round(task.Elapsed / 1000000000),
            rating: rank.OldRating,
            penalty: task.Penalty,
          });
          if (task.Status === 1 && !scores.has(taskInfo.TaskScreenName)) {
            scores.set(taskInfo.TaskScreenName, Math.round(task.Score / 100));
          }
        } else {
          tasks.get(taskInfo.TaskScreenName).push({
            user: rank.UserScreenName,
            solved: false,
            elapsed: 0,
            rating: rank.OldRating,
            penalty: 0,
          });
        }
      }
    }
  }
  const data = [];
  for (const [taskName, solves] of tasks) {
    if (problemModels.hasOwnProperty(taskName)) {
      data.push({
        taskName,
        solves,
        score: scores.get(taskName) || null,
        difficulty: problemModels[taskName].difficulty,
      });
    }
  }
  await fs.writeJson('data/problem-solves.json', data);
})();