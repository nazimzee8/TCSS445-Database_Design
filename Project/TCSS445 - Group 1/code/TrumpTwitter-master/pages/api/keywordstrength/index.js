const db = require('../../../lib/db');
const escape = require('sql-template-strings');

//API for requesting keyword strength
module.exports = async (req, res) => {
    const keyword = await db.query(escape`
        SELECT C.candidate_name AS "name", TC.Keyword AS "Keyword", COUNT(TC.keyword) AS "strength"
        FROM candidates AS C
        JOIN tweets AS T
        ON C.twitter_id = T.twitter_id
        JOIN tweet_content AS TC
        ON T.twitter_post_id = TC.twitter_post_id
        WHERE TC.keyword = ${req.query.keyword}
        GROUP BY C.candidate_name;
    `);
    const keywordList = await db.query(escape` SELECT DISTINCT keyword FROM tweet_content`);
    res.status(200).json({keywordStrength:keyword, keywordList: keywordList});
};