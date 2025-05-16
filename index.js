require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();
const dns = require('dns');


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

// 1: add new entries to [] 
// 2: increment index as adding new entries

const urlManager = (() => {
  let index = 1
  let urlStore = [] 

  const hasUrl = (url) => {
    return urlStore.find( existingURl =>{
      return existingURl.original_url === url
    } )
  }

  const addUrl = (url) => {
    const existingURl = hasUrl(url)
    if (existingURl) return existingURl 

    else {
      const newEntry = { original_url: url, short_url: index++ }
      urlStore.push(newEntry)
      return newEntry 
    }
  }

  const shortUrlLookUp = (index) => {
    const pi = parseInt(index, 10)
    return urlStore.find( storedUrl => storedUrl.short_url === pi )
  }

  return { hasUrl, addUrl, shortUrlLookUp }
})()


app.get('/api/shorturl/:short_url', (req, res) => {
  try {
    const idx = req.params.short_url
    const url =  urlManager.shortUrlLookUp(idx)
    res.redirect(url.original_url)
  } catch(err) {
    if ( err ) {
       return res.json({error: "invalid url"})
    }
  }
})

app.post('/api/shorturl', (req, res) => {
  try {
    const inputUrl = req.body.url
    const parsedUrl = new URL(inputUrl)

    dns.lookup(parsedUrl.hostname, (err) => {
      if ( err ) {
        return res.json({error: "invalid url"})
      }
      const response = urlManager.addUrl(parsedUrl.origin)
      return res.json(response)
    })
  } catch(err) {
    if ( err ) {
       return res.json({error: "invalid url"})
    }
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

