import express, { json } from 'express'
import IotApi from '@arduino/arduino-iot-client';
import rp from 'request-promise';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 5000;
const app = express();

app.use(json())
app.use(cors())

async function getToken(c_id, c_sec) {
  var options = {
    method: 'POST',
    url: 'https://api2.arduino.cc/iot/v1/clients/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    json: true,
    form: {
      grant_type: 'client_credentials',
      client_id: c_id,
      client_secret: c_sec,
      audience: 'https://api2.arduino.cc/iot'
    }
  };

  try {
    const response = await rp(options);
    return response['access_token'];
  }
  catch (error) {
    console.error("Failed getting an access token: " + error)
  }
}

let result = [];

async function run() {
  var client = IotApi.ApiClient.instance;
  var oauth2 = client.authentications['oauth2'];
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  oauth2.accessToken = await getToken(client_id, client_secret);

  // variables API
  var api = new IotApi.PropertiesV2Api(client);

  // thing id -> test
  api.propertiesV2List('9e25f54c-2c6e-404e-9081-6585edab3230').then(properties => {
    result = properties.map(prop => {
      return { name: prop.name, value: prop.last_value }
    })
    console.log(properties);
  }, error => {
    console.log(error)
  });
}

app.post('/auth', async (req, res) => {
  const { client_id, client_secret } = req.body;
  const token = await getToken(client_id, client_secret);
  if (!token) {
    res.status(401).end();
  } else {
    res.status(200).end()
  }
})

app.get('/get-data', (req, res) => {
  try {
    run();
    res.send(result).end();
  } catch (error) {
    res.status(500).send("Server Error").end()
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});