const express = require('express');
const mysql = require('mysql2');
const { Pool } = require('pg');
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

//MySQL section
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

//Get All Record
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

//Add Record
app.post('/api/users/add', (req, res) => {
  const { cpid, username, password } = req.body;

  const sql = 'INSERT INTO user (cpid, username, password, created) VALUES (?, ?, ?, NOW())';
  db.query(sql, [cpid, username, password], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: 'User added successfully!' });
  });
});

//Update Record
app.put('/api/users/update/password', (req, res) => {
  const { cpid, username, oldPassword, newPassword } = req.body;

  // Check if the old password matches before updating the password
  const checkPasswordQuery = 'SELECT * FROM user WHERE cpid = ? AND username = ? AND password = ?';
  db.query(checkPasswordQuery, [cpid, username, oldPassword], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length === 0) {
      // Old password doesn't match or user not found
      res.status(401).json({ error: 'Incorrect old password or user not found' });
      return;
    }

    // Update the password if old password matches
    const updatePasswordQuery = 'UPDATE user SET password = ? WHERE cpid = ? AND username = ?';
    db.query(updatePasswordQuery, [newPassword, cpid, username], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json({ message: 'Password updated successfully!' });
    });
  });
});

// Delete Record
app.delete('/api/users/delete', (req, res) => {
  const { cpid, username } = req.body;

  const deleteQuery = 'DELETE FROM user WHERE cpid = ? AND username = ?';
  db.query(deleteQuery, [cpid, username], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'No user found with the provided cpid and username' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  });
});

// PostgreSQL section
const pool = new Pool({
  user: process.env.PGDB_USER,
  host: process.env.PGDB_HOST,
  database: process.env.PGDB_DATABASE,
  password: process.env.PGDB_PASSWORD,
  port: process.env.PGDB_PORT || 5432,
});

pool.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to PostgreSQL');
});

// Get All Records
app.get('/api2/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM "users"';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Records by CPID
app.get('/api2/users/get/cpid', async (req, res) => {
  const { cpid } = req.query;
  try {
    const query = 'SELECT * FROM "users" WHERE cpid = $1';
    const result = await pool.query(query, [cpid]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'No records found for the provided CPID' });
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Records by username
app.get('/api2/users/get/username', async (req, res) => {
  const { username } = req.query;
  try {
    const query = 'SELECT * FROM "users" WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'No records found for the provided username' });
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Record
app.post('/api2/users/add', async (req, res) => {
  const { cpid, username, password } = req.body;

  try {
    const query = 'INSERT INTO "users" (cpid, username, password) VALUES ($1, $2, $3)';
    await pool.query(query, [cpid, username, password]);
    res.status(200).json({ message: 'User added successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Record
app.put('/api2/users/update/password', async (req, res) => {
  const { cpid, username, oldPassword, newPassword } = req.body;

  try {
    const checkPasswordQuery = 'SELECT * FROM "users" WHERE cpid = $1 AND username = $2 AND password = $3';
    const checkResult = await pool.query(checkPasswordQuery, [cpid, username, oldPassword]);

    if (checkResult.rows.length === 0) {
      res.status(401).json({ error: 'Incorrect old password or user not found' });
      return;
    }

    const updatePasswordQuery = 'UPDATE "users" SET password = $1 WHERE cpid = $2 AND username = $3';
    await pool.query(updatePasswordQuery, [newPassword, cpid, username]);

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Record
app.delete('/api2/users/delete', async (req, res) => {
  const { cpid, username } = req.body;

  try {
    const deleteQuery = 'DELETE FROM "users" WHERE cpid = $1 AND username = $2';
    const result = await pool.query(deleteQuery, [cpid, username]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'No user found with the provided cpid and username' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
