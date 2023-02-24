const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const conDB = mysql.createConnection({
  multipleStatements: true,
  host: '192.168.1.42',
  user: 'emailsync',
  password: 'zu5FnvFUeJpgKePjZSFfaJqRJZa63n7z',
  database: 'emailsync',
  charset: 'utf8mb4',
})

conDB.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  main().catch((err) => console.error(err))
  console.log(`Connected to database as id ${conDB.threadId}`)
})

async function main() {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  app.get('/accounts', async (req, res) => {
    conDB.query(
      'SELECT `id`,`login` FROM `accounts` WHERE ?', {
        active: 1
      },
      (err, accounts) => {
        if (err) {
          res.json({success: false, code: "query error"});
        } else {
          res.json({success: true, data: accounts});
        }
      }
    )
  })

  app.get('/emails', async (req, res) => {
    conDB.query(
      'SELECT * FROM `emails`', 
      (err, emails) => {
        if (err) {
          res.json({success: false, code: err});
        } else {
          res.json({success: true, data: emails});
        }
      }
    )
  })
  
}
