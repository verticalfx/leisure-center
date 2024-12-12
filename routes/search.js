const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  res.render('search', { title: 'Search Classes', results: [] });
});

router.get('/results', async (req, res) => {
  const q = req.query.q || '';
  const [rows] = await db.query(`
    SELECT * 
    FROM class_schedules 
    WHERE class_name LIKE ? OR instructor_name LIKE ?`, 
    [`%${q}%`, `%${q}%`]
  );
  res.render('search', { title: 'Search Classes', results: rows, query: q });
});

module.exports = router;