const db = require('../../../lib/db');
const escape = require('sql-template-strings');

// Potential options for request (req):
// - WHERE DATE > {req.dates}
// - AND DATE < {req.dates}
// - AND primary_term  = {req.primary_terms}
// - AND secondary_term = {req.secondary_terms}
// - ORDER BY {req.order}
// - Need default values for all
module.exports = async (req, res) => {
    if (!(req.query.keyword === 'None' || req.query.keyword === '')) {
        if (parseInt(req.query.id) === 0) {
            const allTweets = await db.query(escape`
                SELECT C.candidate_name AS "name",
                       TC.keyword       AS "keyword",
                       TC.tweet_date    AS "tweet_date",
                       TC.tweet_string  AS "content"
                FROM candidates AS C
                         JOIN tweets AS T
                              ON C.twitter_id = T.twitter_id
                         JOIN tweet_content AS TC
                              ON T.twitter_post_id = TC.twitter_post_id
                WHERE keyword = ${req.query.keyword}
                ORDER BY C.candidate_name

            `);
            res.status(200).json({allTweets});
        } else {
            const candidates_info = await db.query(escape`
                    SELECT *
                    FROM tweet_content 
                        JOIN tweets 
                            ON tweet_content.twitter_post_id = tweets.twitter_post_id
                WHERE tweets.twitter_id = ${req.query.id} AND
                      keyword = ${req.query.keyword}
                ORDER BY tweet_date
                `);
            res.status(200).json({candidates_info});
        }
    } else {
        if (parseInt(req.query.id) === 0) {
            const allTweets = await db.query(escape`
                SELECT C.candidate_name AS "name",
                       TC.keyword       AS "keyword",
                       TC.tweet_date    AS "tweet_date",
                       TC.tweet_string  AS "content"
                FROM candidates AS C
                         JOIN tweets AS T
                              ON C.twitter_id = T.twitter_id
                         JOIN tweet_content AS TC
                              ON T.twitter_post_id = TC.twitter_post_id
                ORDER BY C.candidate_name
            `);
            res.status(200).json({allTweets});
        } else {
            const candidates_info = await db.query(escape`
                SELECT *
                FROM tweet_content JOIN tweets 
                    ON tweet_content.twitter_post_id = tweets.twitter_post_id
                WHERE tweets.twitter_id = ${req.query.id}
                ORDER BY tweet_date
            `);
            res.status(200).json({candidates_info})
        }
    }

};