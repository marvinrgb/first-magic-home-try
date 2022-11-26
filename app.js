import express from 'express';
import { Control } from 'magic-home';
import fs from 'fs';
const app = express();
const port = 3001;

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
  return true
}


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