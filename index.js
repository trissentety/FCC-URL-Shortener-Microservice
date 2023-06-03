require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const defaultUrl = []
const urlShort = []

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url
  const foundIndex = defaultUrl.indexOf(url)


  if(!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: 'invalid url' })
  }
  if(foundIndex < 0) {
    defaultUrl.push(url)
    urlShort.push(urlShort.length)
    return res.json({
      original_url: url,
      short_url: urlShort.length - 1

    })
  }
  return res.json({
    original_url: url,
    short_url: urlShort[foundIndex]
  })
})

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl)
  const foundIndex = urlShort.indexOf(shorturl)
  if(foundIndex < 0) {
    return res.json({
      "error": "No short URL found for the given input"
    })
  }
  res.redirect(defaultUrl[foundIndex])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});