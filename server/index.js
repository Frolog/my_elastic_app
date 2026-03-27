const express = require('express');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');

const app = express();

// הגדרת הלקוח עם מצב תאימות לגרסה 8
const client = new Client({ 
  node: 'http://localhost:9200',
  apiVersion: '8.12'
});



app.use(cors());
app.use(express.json());

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Searching for:", q); // הדפסה לטרמינל

    const result = await client.search({
      index: 'my_index',
query: {
  match: {
    name: {
      query: q,
      fuzziness: "AUTO" // מאפשר למצוא תוצאות גם עם טעויות כתיב
    }
  }
}

    });

    console.log("Found results:", result.hits.hits.length);
    res.json(result.hits.hits);
  } catch (error) {
    console.error("ELASTIC ERROR:", error); // זה יגיד לנו בדיוק למה הוא נכשל
    res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));
