const axios = require('axios');
const fs = require('fs');

const cfg = JSON.parse(fs.readFileSync('live-pricing.json', 'utf8'));

const FIREBASE_URL = `https://${cfg.firebase.project}.firebaseio.com`;
const FIREBASE_SECRET = cfg.firebase.token;

async function main () {
  const backup = JSON.parse(fs.readFileSync('./backup.json', 'utf8'));

  const url = `${FIREBASE_URL}/.json?auth=${FIREBASE_SECRET}`;
  const result = await axios.put(url, backup);

  console.log(result);

}

main();
