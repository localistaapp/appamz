var axios = require('axios');
let lastRun = null; // track last execution time
import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchGoogleTrendsData() {

 

  
  /*console.log('Waiting for related searches data...');
  const maxWait = 60000; // 60s
  let waited = 0;
  while (!apiResponseData && waited < maxWait) {
    await sleep(1000); // <-- replaces page.waitForTimeout(1000)
    waited += 1000;
  }

  await browser.close();

  if (!apiResponseData) {
    throw new Error('Timed out waiting for relatedsearches data. Try increasing wait time or broadening parameters.');
  }*/

  /*const lists = apiResponseData.default?.rankedList || [];
  const top = lists[0]?.rankedKeyword?.map((k) => k.query) || [];
  const rising = lists[1]?.rankedKeyword?.map((k) => k.query) || [];

  console.log('\n🟢 Top Queries:', top.slice(0, 10));
  console.log('\n🔥 Rising Queries:', rising.slice(0, 10));*/

  return null;
}

async function dailyJob(client, fs) {
  console.log("Daily task started:", new Date().toISOString());

  return new Promise(async (resolve, reject) => {

    // integrate google-trends-api to get output for:
    // https://trends.google.com/trends/explore?cat=18&date=2025-01-10%202025-03-10&geo=IN-KA&gprop=froogle&hl=en-US

    //logic for current date -2 to -4 days to generate start and end dates

  const response = await axios.get('https://serpapi.com/search?engine=google_trends&cat=18&date=2025-01-10 2025-03-10&geo=IN-KA&gprop=froogle&data_type=RELATED_QUERIES&api_key='+process.env.SERP_API_KEY);

    let searches = []
    for(var o in response.data.related_queries.rising) {
      searches.push(response.data.related_queries.rising[o].query);
    }

    console.log('--Trending searches--', searches);

    client.connect(async (err) => {
      if (err) {
        console.error('error connecting', err.stack);
        client.end();
        return reject(err);
      }

      
    });
  }).then(() => {
    console.log("Weekly task finished:", new Date().toISOString());
  });
}

function runDailyTaskRoute(app, client, fs, taskKey) {
  app.post("/run-daily-task", async (req, res) => {
    try {
      /*const SECRET_KEY = taskKey;
      if (req.query.key !== SECRET_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }*/

      const now = Date.now();
      if (lastRun && now - lastRun < 60 * 1000) {
        return res.status(429).json({ message: "Task already ran recently" });
      }
      lastRun = now;

      await dailyJob(client, fs);
      res.json({ status: "ok", ranAt: new Date().toISOString() });
    } catch (err) {
      console.error("Weekly task failed:", err);
      res.status(500).json({ error: "Task execution failed" });
    }
  });
}

module.exports = runDailyTaskRoute;
