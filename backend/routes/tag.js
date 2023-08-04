const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const moment = require("moment");
const _ = require("lodash");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proj1",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

//-----------------------------------------------edit tag----------------------
router.get('/admin/tag-details', function (req, res, next) {
  // const tagId = _.get(req, 'body.tagId'); 
  const tagId = _.get(req, 'query.tagId');
  
  con.query(
    'SELECT * FROM tags WHERE id = ?', [tagId],
    function (error, results) {
      if (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: 'Failed to fetch tag' });
      }
      if (results.length === 0) {
        return res.status(404).json({ status: false, error: 'Tag not found' });
      }
      const tagData = results[0];
      return res.status(200).json({ status: true, tagData });
    }
  );
});





  module.exports = router;