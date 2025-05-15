require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//

const urls = [
  {
    original_url : 'https://freeCodeCamp.org', short_url : 1
  }
]

const findUrl = (input) => {
  const index = parseInt( input, 10 )
  for ( const url of urls ) {
    if (url.short_url === index ) {
      return { url: url.original_url, short_url: url.short_url}
    }
  }
  return { error: 'invalid url'}
}

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const foundUrl = findUrl(shortUrl)
  if ( foundUrl.url )  {
    res.json(foundUrl)
  } 
  res.json(foundUrl)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
