require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let id = 1
let store = []

const hasUrl = (input) => {
  for ( let s of store ) {
    if (s.original_url === input) {
      return true
    }
  }
  return false 
}

const dupeUrl = (input) => {
  for ( let s of store ) {
    if (s.original_url === input ) {
      return s
    }
  }
}

const getURl = ( id ) =>  {
  const validId = parseInt( id, 10)
  for ( let s of store ) {
    if (s.short_url === validId ) {
      return s.original_url
    }
  }
  throw new Error('URL not found')
}

app.get('/api/shorturl/:short_url', function(req, res) {
  try {
    const shortUrl = req.params.short_url;
    const url = getURl(shortUrl)
 
    res.redirect(url)
  } catch (err ) {
    res.json( {error: 'invalid url'})
  }
  
});


app.post('/api/shorturl', function(req, res) {
  const userUrl = req.body.url;
  const short_url = id++;
  try {
    const parsedUrl = new URL( userUrl )

    const url = parsedUrl.hostname
    if (!hasUrl(url)) {
      store.push({original_url: userUrl, short_url})
      res.json({
        original_url: userUrl, 
        short_url
        })
      } else {
        res.json(
          dupeUrl(userUrl)
        )
      }
    } catch(err) {
    console.error(`Error: ${err}`)
    res.json({ error: 'invalid url' })
  }
  console.log(store)
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
