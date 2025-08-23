var axios = require('axios');
let lastRun = null; // track last execution time

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function weeklyJob(client, fs) {
  console.log("Weekly task started:", new Date().toISOString());

  return new Promise((resolve, reject) => {
    client.connect(async (err) => {
      if (err) {
        console.error('error connecting', err.stack);
        client.end();
        return reject(err);
      }

      client.query("select push_key, app_url, business_type from am_store", [], async (err, response) => {
        if (err) {
          console.error(err);
          client.end();
          return reject(err);
        }

        try {
          let month = new Date().getMonth() + 1;
          let day = new Date().getDate();

          // Use for...of so async/await works properly
          for (const row of response.rows) {
            const pushKey = row['push_key'];
            const appUrl = row['app_url'];
            const businessType = row['business_type'];

            if (businessType != null && businessType !== 'null') {
              console.log('--file--', `./ssr-client/src/store/mainview/notifications/${businessType}/festive.json`);
              let rawdata = fs.readFileSync(`./ssr-client/src/store/mainview/notifications/${businessType}/festive.json`);
              rawdata = JSON.parse(rawdata);

              // 🎯 make festiveArr local per row
              let festiveArr = [];
              rawdata.forEach(item => {
                let d = item.date;
                let notifMonth = parseInt(d.split('-')[0], 10);
                let notifDay = parseInt(d.split('-')[1], 10);

                if (month <= notifMonth && day <= notifDay && notifDay - day <= 4) {
                  festiveArr.push(item);
                }
              });

              if (festiveArr.length > 0 && pushKey) {
                const { title, description } = festiveArr[0]; // stable values

                try {
                  await axios.post(
                    'https://api.pushalert.co/rest/v1/send',
                    `url=${appUrl}&title=${title}&message=${description}`,
                    { headers: { 'Authorization': `api_key=${pushKey}` } }
                  );
                  console.log(`Pushalert sent: ${title}`);
                } catch (error) {
                  console.error('Pushalert error:', error);
                }

                // wait 3s before next push
                await sleep(3000);
              }
            }
          }

          client.end();
          resolve();
        } catch (ex) {
          client.end();
          reject(ex);
        }
      });
    });
  }).then(() => {
    console.log("Weekly task finished:", new Date().toISOString());
  });
}

function runTaskRoute(app, client, fs, taskKey) {
  app.post("/run-task", async (req, res) => {
    try {
      const SECRET_KEY = taskKey;
      if (req.query.key !== SECRET_KEY) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const now = Date.now();
      if (lastRun && now - lastRun < 60 * 1000) {
        return res.status(429).json({ message: "Task already ran recently" });
      }
      lastRun = now;

      await weeklyJob(client, fs);
      res.json({ status: "ok", ranAt: new Date().toISOString() });
    } catch (err) {
      console.error("Weekly task failed:", err);
      res.status(500).json({ error: "Task execution failed" });
    }
  });
}

module.exports = runTaskRoute;
