import express from 'express'
import { ArduinoIoTCloud } from 'arduino-iot-js';
const PORT = process.env.PORT || 5000;
const app = express();
    (async () => {
        const client = await ArduinoIoTCloud.connect({
            clientId: 'danSN2bJdS7v1ERWEtGr9oP76YVaJswsnjAAYAh1s6SWtjlEF8Zgr7oOq7p0KCzQ',
            clientSecret: 'danSN2bJdS7v1ERWEtGr9oP76YVaJswsnjAAYAh1s6SWtjlEF8Zgr7oOq7p0KCzQ',
            onDisconnect: (message) => console.error(message),
        });

        // Send a value to a thing property
        const value = 'some value';
        client.sendProperty('YOUR_THING_ID', 'YOUR_VARIABLE_NAME', value);

        // Listen to a thing property's changes
        client.onPropertyValue('YOUR_THING_ID', 'ANOTHER_VARIABLE_NAME', (value) => console.log(value));

    })();
    app.get('/', (req, res) => {
        res.send('Hello, World!');
      });
      
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });