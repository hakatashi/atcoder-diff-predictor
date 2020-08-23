const fs = require('fs-extra');

const tasks = new Map();

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
    data.push({taskName, solves: solves});
  }
  await fs.writeJson('data/problem-solves.json', data);
})();