const express = require('express');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');

const app = express();

const client = new Client({ 
  node: 'http://localhost:9200',
  enableCompatibilityMode: true 
});

app.use(cors());
app.use(express.json());

// --- search dirctory (GET) ---
app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const result = await client.search({
      index: 'sensors_data', 
      query: {
        match: {
          sensor_name: {
            query: q,
            fuzziness: "AUTO"
          }
        }
      }
    });
    res.json(result.hits.hits);
  } catch (error) {
    console.error("SEARCH ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- add (POST) ---
app.post('/add', async (req, res) => {
  try {
    const { name, value } = req.body;
    console.log(`Incoming data from sensor: ${name} = ${value}`);

    const result = await client.index({
      index: 'sensors_data', // kibana index name
      document: {
        sensor_name: name,
        sensor_value: parseFloat(value),
        timestamp: new Date() // graph auto timestamp
      },
      refresh: true
    });

    res.json({ status: "success", id: result._id });
  } catch (error) {
    console.error("ADD ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000 - Add route is active!'));
