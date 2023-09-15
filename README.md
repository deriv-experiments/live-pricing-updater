# Live Pricing WebSocket Listener

This script is designed to subscribe to the BinaryWS WebSocket service, particularly focusing on the asset listing for trading platforms. It captures live asset price updates and pushes these changes to a Firebase Realtime Database.

## Prerequisites

- You need to have Node.js installed.
- Required npm packages: `fs`, `ws`, and `axios`.
- A `live-pricing.json` configuration file structured with the required Firebase and Deriv settings.

## Configuration File (`live-pricing.json`)

The script expects the configuration file to be structured as:

```json
{
    "firebase": {
        "project": "your-firebase-project-id",
        "token": "your-firebase-secret-token"
    },
    "deriv": {
        "app_id": "your-deriv-app-id"
    }
}
```

Replace placeholders (`your-firebase-project-id`, `your-firebase-secret-token`, and `your-deriv-app-id`) with appropriate values.

## How It Works

1. It initializes the WebSocket connection to the BinaryWS service with the Deriv app_id.
2. Once the connection is established, it subscribes to the asset listings for two regions: `row` and `eu`.
3. To maintain the connection, it sends a ping to the WebSocket every 14 seconds.
4. Upon receiving an asset listing message, it compares the received data with the latest known data for changes.
5. If there are any changes or if it's the first value received for an asset, it updates the Firebase Realtime Database with the new asset data.

## Usage

Run the script:

```bash
npm run start
```

Ensure you replace `your-script-name.js` with the appropriate name of your file.

## Logging

This script provides detailed logs on:

- Every frame received from the WebSocket.
- Asset changes detected, specifying the region, asset shortcode, fields that have changed, and their bid/ask values.
- Successful updates to Firebase.
- Errors encountered during Firebase updates.

## Note

Ensure your Firebase database rules allow the necessary write operations for this script to function correctly. Always keep your secret token confidential and avoid committing it directly in your source code.

## Future Work

- Implement more robust error handling.
- Provide configuration flexibility for regions and other settings.
- Expand logging options for production use.
