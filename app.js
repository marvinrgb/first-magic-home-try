import express from 'express';
import { Control } from 'magic-home';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const app = express();
const port = 3001;

app.use(express.static('public'))


const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);


let lights = [];

let ips = JSON.parse(fs.readFileSync('ips.json'));

ips.forEach((value) => {
  let light = new Control(`${value.address}`)
  lights.push(light)
})

let color = {
  r : 20,
  g : 3,
  b : 12
}

function setColorAll(color) {
  lights.forEach((light) => {
    light.setColor(color.r, color.g, color.b, () => {})
  })
  console.log('YEAAA')
  return true
}

app.get('/music', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
})

function delay(n) {  
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}

let beat4 = 85
let beat2 = 170

app.post('/startAnimation', async (req, res) => {
  let color = {
    r : 100,
    g : 100,
    b : 100
  }

  for (let i = 0; i < 32; i++) {
    setColorAll(color);
    await delay(beat4);
    setColorAll(0, 0, 0);
    await delay(beat4);
  }
})


app.post('/setColorAll/:r/:g/:b', (req, res) => {

  if (isNaN(req.params.r) || isNaN(req.params.g) || isNaN(req.params.b)) {
    res.sendStatus(400);
    return;
  }


  let color = {
    r : req.params.r,
    g : req.params.g,
    b : req.params.b
  }

  if (setColorAll(color)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }

})


app.listen(port, () => {
  console.log('running')
})