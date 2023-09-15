const fs = require('fs');
const WebSocket = require('ws');
const axios = require('axios');

const cfg = JSON.parse(fs.readFileSync('live-pricing.json', 'utf8'));
let latest = {};

const FIREBASE_URL = `https://${cfg.firebase.project}.firebaseio.com`;
const FIREBASE_SECRET = cfg.firebase.token;

const ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${cfg.deriv.app_id}`);

ws.on('open', function open() {
    ['row', 'eu'].forEach(region => {
        ws.send(JSON.stringify({
            trading_platform_asset_listing: 1,
            subscribe: "1",
            platform: 'mt5',
            type: 'brief',
            region: region
        }));
    });

    setInterval(() => {
        ws.send(JSON.stringify({
            ping: 1
        }));
    }, 14 * 1000);  // 14 seconds interval for sending pings
});

ws.on('message', function incoming(frame) {
    console.log('frame', frame);
    let data = JSON.parse(frame);
    let assets = data.trading_platform_asset_listing?.mt5?.assets;

    if (assets) {
        let region = data.echo_req.region;
        assets.forEach(asset => {
            asset.region = region;
            let previous = latest[region]?.[asset.shortcode];
            if (previous) {
                let changedKeys = Object.keys(asset).filter(key => previous[key] !== asset[key]);
                if (changedKeys.length > 0) {
                    console.log(`${region}/${asset.shortcode} changed ${changedKeys.join(',')}, bid/ask ${asset.bid}/${asset.ask}`);
                    updateFirebase(asset);
                }
            } else {
                console.log(`${region}/${asset.shortcode} first value received, bid/ask ${asset.bid}/${asset.ask}`);
                updateFirebase(asset);
            }
            if (!latest[region]) latest[region] = {};
            latest[region][asset.shortcode] = asset;
        });
    }
});

function updateFirebase(asset) {
    const assetPath = `${asset.region}/market/${asset.market}/${asset.shortcode}.json?auth=${FIREBASE_SECRET}`;
    const fullUrl = `${FIREBASE_URL}/${assetPath}`;

    axios.put(fullUrl, asset)
        .then(response => {
            console.log(`Updated ${asset.shortcode} in Firebase:`, response.data);
        })
        .catch(error => {
            console.error(`Error updating ${asset.shortcode} in Firebase:`, error);
        });
}
