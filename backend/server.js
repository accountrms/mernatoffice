const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const ldapjs = require("ldapjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//DATABASE CONNECTION
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

connection.connect(err => {
  if (err) return err;
  console.log("Connection Established...");
});

//VERIFYING THE TOKEN
function verifyToken(req, res, next) {
  const { token } = req.body.data;
  if (typeof token !== "undefined") {
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
}

//
app.post("/login", (req, res) => {
  var { username, password } = req.body.data;

  if (username === "admin" || username === "operator") {
    var FIND_USER_QUERY = `SELECT * FROM credentials WHERE username="${username}" AND password="${password}"`;
    connection.query(FIND_USER_QUERY, (err, result) => {
      if (err) res.sendStatus(403);
      else {
        if (result.length === 1) {
          const data = {
            user: result[0].username,
            id: result[0].username
          };
          jwt.sign({ data }, "on!the@underwear#scene$", (err, token) => {
            if (err) {
              res.json({ success: false });
            } else {
              res.json({
                success: true,
                token,
                data
              });
            }
          });
        }
      }
    });
  } else {
    const ldapOptions = {
      url: "ldap://ldap.forumsys.com:389",
      connectTimeout: 30000,
      reconnect: true
    };

    const params = {
      user: "cn=read-only-admin,dc=example,dc=com",
      password: password,
      baseDN: "dc=example,dc=com"
    };

    const ldapClient = ldapjs.createClient(ldapOptions);

    ldapClient.bind(params.user, params.password, err => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log("Bind Successful!");
        let options = {
          scope: "sub",
          filter: `(uid=${username})`
        };

        ldapClient.search(params.baseDN, options, (err, response) => {
          if (err) {
            return res.json({ success: false });
          } else {
            console.log("Search completed, Here are the results:");
            response.on("searchEntry", entry => {
              if (entry.object.objectClass.length > 0) {
                console.log("User authorized!");
                const data = {
                  user: entry.object.cn,
                  id: entry.object.uid
                };
                jwt.sign({ data }, "on!the@underwear#scene$", (err, token) => {
                  if (err) {
                    res.json({ success: false });
                  } else {
                    res.json({
                      success: true,
                      token,
                      data
                    });
                  }
                });
              } else {
                return res.json({ error: "Invalid credentials" });
              }
            });
            response.on("error", err => {
              return res.json({ error: "Invalid credentials" });
            });
          }
        });
      }
    });
  }
});

app.post("/authenticateUser", (req, res) => {
  jwt.verify(
    req.body.data.token,
    "on!the@underwear#scene$",
    (err, authData) => {
      if (err) {
        return res.json({ status: false });
      } else {
        return res.json({ status: true });
      }
    }
  );
});

app.post("/getposts", verifyToken, (req, res) => {
  jwt.verify(req.token, "on!the@underwear#scene$", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var { id } = req.body.data;
      if (authData.data.user === "admin" || authData.data.user === "operator")
        var SELECT_ALL_QUERY = `SELECT * FROM table1 WHERE 1 ORDER BY table1.processed ASC`;
      else
        var SELECT_ALL_QUERY = `SELECT * FROM table1 WHERE user="${id}" ORDER BY table1.processed ASC`;
      connection.query(SELECT_ALL_QUERY, (err, results) => {
        if (err) {
          res.json({ data: false });
        } else {
          return res.json({ results, authData });
        }
      });
    }
  });
});

app.post("/getposts/:id", (req, res) => {
  var id = req.params.id;
  var SELECT_ALL_QUERY = `SELECT * FROM table1 WHERE id=${id}`;
  connection.query(SELECT_ALL_QUERY, (err, results) => {
    if (err) throw err;
    else return res.json({ data: results });
  });
});

app.post("/addpost", verifyToken, (req, res) => {
  jwt.verify(req.token, "on!the@underwear#scene$", (err, authData) => {
    if (err) res.sendStatus(403);
    else {
      var { vendor, order, invoice, date, amount } = req.body.data;
      var user = authData.data.id;
      var VALUES = [vendor, order, invoice, date, amount, "absent", 0, user];
      var INSERT_QUERY = `INSERT INTO table1 (vendor, orderno, invoice, date, amount, tracking, processed,user) VALUES (?)`;
      connection.query(INSERT_QUERY, [VALUES], err => {
        if (err) return res.json({ data: false });
        else return res.json({ data: true });
      });
    }
  });
});

app.put("/updatepost", (req, res) => {
  var { id, trackingNo } = req.body.ims;
  var UPDATE_QUERY = `UPDATE table1 SET processed = "1", tracking = "${trackingNo}" WHERE table1.id = ${id}`;
  connection.query(UPDATE_QUERY, (err, result) => {
    if (err) return res.json({ data: false });
    else res.send("Updated successfully");
  });
});

app.listen(3001, () => {
  console.log(".....Server running.....");
});
