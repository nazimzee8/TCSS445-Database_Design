const db = require('../../../lib/db')
const escape = require('sql-template-strings')

//API for requesting list of candidates
module.exports = async (req, res) => {
    const tweets = await db.query(escape`
      SELECT *
      FROM candidates
      ORDER BY candidate_id
    `);
    res.status(200).json({ tweets })

}
