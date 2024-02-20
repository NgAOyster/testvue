const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// XML Section

const dataFolderPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath);
}

// Save XML data received from Vue to a file
app.post('/saveToXml/fixed', (req, res) => {
  const { LiquidOption, TempOption } = req.body; 

  const xmlData = xmlbuilder.create('root');

  
  const liquidOptionNode = xmlData.ele('LiquidOption');
  liquidOptionNode.text(LiquidOption); 

  const tempOptionNode = xmlData.ele('TempOption');
  tempOptionNode.text(TempOption); 

  const xmlString = xmlData.end({ pretty: true });

  const filePath = path.join(dataFolderPath, `fixData.xml`);

  fs.writeFile(filePath, xmlString, err => {
    if (err) {
      console.error('Error writing XML file:', err);
      res.status(500).send('Error writing XML file');
    } else {
      console.log('Data saved to XML file');
      res.send('Data saved to XML file');
    }
  });
});

app.post('/saveToXml/realtime', (req, res) => {
  const { LiquidOption, TempOption } = req.body; 

  const xmlData = xmlbuilder.create('root');

  
  const liquidOptionNode = xmlData.ele('LiquidOption');
  liquidOptionNode.text(LiquidOption); 

  const tempOptionNode = xmlData.ele('TempOption');
  tempOptionNode.text(TempOption); 

  const xmlString = xmlData.end({ pretty: true });

  const filePath = path.join(dataFolderPath, `realtimeData.xml`);

  fs.writeFile(filePath, xmlString, err => {
    if (err) {
      console.error('Error writing XML file:', err);
      res.status(500).send('Error writing XML file');
    } else {
      console.log('Data saved to XML file');
      res.send('Data saved to XML file');
    }
  });
});

// Retrieve XML data and send it to the Vue app
app.get('/getDataFromXml/fixed', (req, res) => {
  const filePath = path.join(dataFolderPath, `fixData.xml`);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      res.status(500).send('Error reading XML file');
    } else {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
  });
});

app.get('/getDataFromXml/realtime', (req, res) => {
  const filePath = path.join(dataFolderPath, `realtimeData.xml`);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      res.status(500).send('Error reading XML file');
    } else {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
  });
});

app.get('/getDataFromXml/linechart', (req, res) => {
  const filePath = path.join(dataFolderPath, `LineChart.xml`);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      res.status(500).send('Error reading XML file');
    } else {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
  });
});

const userFolderPath = path.join(__dirname, 'user');
if (!fs.existsSync(userFolderPath)) {
  fs.mkdirSync(userFolderPath);
}

app.post('/saveToXml/user', (req, res) => {
  const { ChartOption, username } = req.body; 
  
  const xmlData = xmlbuilder.create('root');
  const tempOptionNode = xmlData.ele('ChartOption');
  tempOptionNode.text(ChartOption); 
  const xmlString = xmlData.end({ pretty: true });
  
  const filePath = path.join(userFolderPath, `${username}_LineChart.xml`);

  fs.writeFile(filePath, xmlString, err => {
    if (err) {
      console.error('Error writing XML file:', err);
      res.status(500).send('Error writing XML file');
    } else {
      console.log('Data saved to XML file');
      res.send('Data saved to XML file');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));