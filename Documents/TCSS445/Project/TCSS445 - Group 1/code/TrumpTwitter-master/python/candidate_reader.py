from tweepy import OAuthHandler
from tweepy import API
from datetime import datetime
import config
import mysql.connector as mariadb
import re

#========================================================================================
# Author: Sam Wainright, Daniel Looney
# Date: 6 MAR 2020
# Version: 1.0.6
# Description: A Twitter scrapper program that reads from the top of the user timeline
#              of each potential 2020 Presidential Candidate and commits tweets to
#              a database with an associated keyword of concern (i.e. "economy").
#========================================================================================

class Tweetfinder():
    
    def __init__(self):
        
        # Authorizations from config
        self.auth = OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
        self.auth.set_access_token(config.ACCESS_TOKEN, config.ACCESS_TOKEN_SECRET)
        self.api = API(self.auth)
        
        # Connection to database
        self.connection = mariadb.connect(host=config.HOST,
                                          user=config.USER,
                                          passwd=config.PASSWD,
                                          database="tweetrumper")
       
        # Database command pointer
        self.cursor = self.connection.cursor()
        
    def __exit__(self):
        
        # Close pointer and connection
        self.cursor.close()
        self.connection.close()
        
    def keyword_in_text(self, keyword, text):
        keyword = keyword.lower()
        text = text.lower()
        matched = re.search(keyword, text)
        if matched:
            return True
        return False
    
    def get_tweets(self,username):
        
        count = 0
        number_of_tweets = 5000 # number of tweets from the top of page
        tweet_bundle = []
        tweets = self.api.user_timeline(screen_name=username, tweet_mode='extended', count=number_of_tweets)
        keywords = ['McConnell', 'impeachment', 'sham trial', 'gun violence', 'personal interest',
                    'Bolton', 'Schumer', 'corruption', 'national security', 'economy', 'health care',
                    'climate', 'environment', 'education', 'teachers', 'workers', 'disabilities', 
                    'discrimination', 'banks', 'budget', 'nuclear', 'debt', 'William Barr', 'Roger Stone',
                    'Justice Department', 'Iranian', 'Iran', 'weapons', 'corporations', 'Fed',
                    'data', 'China', 'Russia']
        
        # Packages tweets in a list of dictionaries with their keyword
        for tweet in tweets:
    
            if not tweet.retweeted:
                
                for keyword in keywords:
                    
                        if (self.keyword_in_text(keyword.lower(), tweet.full_text.lower())):
                            date_str = datetime.strftime(tweet.created_at, "%Y-%m-%d")
                            tweet_dict = {
                                            "twitter_id": tweet.user.id_str,
                                            "twitter_post_id": tweet.id_str,
                                            "tweet_string": tweet.full_text,
                                            "keyword": keyword,
                                            "tweet_date": date_str
                                          }
                            tweet_bundle.append(tweet_dict)
                            break;
        
        return tweet_bundle
     
    # Build Tweetrumper App's SQL tables    
    def build_table(self):
        self.cursor.execute("DROP DATABASE IF EXISTS `tweetrumper`")
        self.cursor.execute("CREATE DATABASE `tweetrumper`")
        self.cursor.execute("USE `tweetrumper`")
        self.cursor.execute("ALTER DATABASE `tweetrumper` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci")
        self.cursor.execute("""CREATE TABLE handles (twitter_id VARCHAR(128) NOT NULL,
                                                    twitter_handle VARCHAR(128) NOT NULL,
                                                    CONSTRAINT max_length_constraint_handles_id CHECK (CHAR_LENGTH(twitter_id) < 129),
                                                    CONSTRAINT max_length_constraint_handles CHECK (CHAR_LENGTH(twitter_handle) < 129),
                                                    CONSTRAINT handles_pk PRIMARY KEY (twitter_id))""")
        
        self.cursor.execute("""CREATE TABLE candidates (candidate_id VARCHAR(128) NOT NULL,
                                                        candidate_name VARCHAR(128) NOT NULL,
                                                        party VARCHAR(32) NOT NULL, 
                                                        twitter_id VARCHAR(128) NOT NULL UNIQUE,
                                                        CONSTRAINT check_valid_candidate_id CHECK (party IN ('Republican', 'Democratic', 'Independent')),
                                                        CONSTRAINT candidates_pk PRIMARY KEY (candidate_id),
                                                        CONSTRAINT candidates_handles_fk FOREIGN KEY (twitter_id)
                                                        REFERENCES handles (twitter_id)
                                                        ON DELETE CASCADE)""")
        
        self.cursor.execute("""CREATE TABLE tweet_content (twitter_post_id VARCHAR(128) NOT NULL,
                                                            tweet_string VARCHAR(480) NOT NULL,
                                                            keyword VARCHAR(32) NOT NULL,
                                                            tweet_date DATE NOT NULL,
                                                            CONSTRAINT check_tweet_date CHECK (tweet_date > '2006-03-21 00:00:00'),
                                                            CONSTRAINT tweet_content_pk PRIMARY KEY (twitter_post_id))""")
        
        self.cursor.execute("""CREATE TABLE tweets (twitter_id VARCHAR(128) NOT NULL,
                                                    twitter_post_id VARCHAR(128) NOT NULL,
                                                    CONSTRAINT max_length_constraint_tweets_id CHECK (CHAR_LENGTH(twitter_id) < 129),
                                                    CONSTRAINT max_length_constraint_tweets_post_id CHECK (CHAR_LENGTH(twitter_post_id) < 129),
                                                    CONSTRAINT tweets_pk PRIMARY KEY (twitter_id, twitter_post_id),
                                                    CONSTRAINT tweets_handles_fk FOREIGN KEY (twitter_id)
                                                    REFERENCES handles (twitter_id)
                                                    ON DELETE CASCADE,
                                                    CONSTRAINT tweets_tweet_content_fk FOREIGN KEY (twitter_post_id)
                                                    REFERENCES tweet_content (twitter_post_id)
                                                    ON DELETE CASCADE)""")
        
        
    # Populates data in to tables using candidate_id, 
    # twitter username, candidate party, and tweets dictionary list    
    def insert(self, id, username, party, tweets):
        user_obj = self.api.get_user(screen_name=username)
        
        handle_sql = "INSERT INTO handles (twitter_id, twitter_handle) VALUES (%s, %s)"
        handle = (user_obj.id_str, username)
        self.cursor.execute(handle_sql, handle)
        
        candidate_sql = "INSERT INTO candidates (candidate_id, candidate_name, party, twitter_id) VALUES (%s, %s, %s, %s)"
        candidate = (id, user_obj.name, party, user_obj.id_str)
        self.cursor.execute(candidate_sql, candidate)
        
        tweet_sql = "INSERT INTO tweets (twitter_id, twitter_post_id) VALUES (%s, %s)"
        tweet_content_sql = "INSERT INTO tweet_content (twitter_post_id, tweet_string, keyword, tweet_date) VALUES (%s, %s, %s, %s)"
        
        for n in range(0, len(tweets)):
            tuple_content = (tweets[n]['twitter_post_id'], tweets[n]['tweet_string'], tweets[n]['keyword'], tweets[n]['tweet_date'])
            tuple_tweet = (tweets[n]['twitter_id'], tweets[n]['twitter_post_id'])
            self.cursor.execute(tweet_content_sql, tuple_content)
            self.cursor.execute(tweet_sql, tuple_tweet)
                
        self.connection.commit()
        
        
if __name__ == "__main__":
    
    # Build the program class and run
    myApp = Tweetfinder()
    myApp.build_table()
    print("Tables built.")
    print("Wait for candidate data.")
    myApp.insert('0001', 'berniesanders', 'Democratic', myApp.get_tweets("berniesanders"))
    myApp.insert('0002', 'SenWarren', 'Democratic', myApp.get_tweets("SenWarren"))
    myApp.insert('0003', 'RealDonaldTrump', 'Republican', myApp.get_tweets("RealDonaldTrump"))
    myApp.insert('0004', 'MikeBloomberg', 'Democratic', myApp.get_tweets("MikeBloomberg"))
    myApp.insert('0005', 'PeteButtigieg', 'Democratic', myApp.get_tweets("PeteButtigieg"))
    myApp.insert('0006', 'JoeBiden', 'Democratic', myApp.get_tweets("JoeBiden"))
    myApp.insert('0007', 'AmyKlobuchar', 'Democratic', myApp.get_tweets("AmyKlobuchar"))
    myApp.insert('0008', 'TulsiGabbard', 'Democratic', myApp.get_tweets("TulsiGabbard"))
    myApp.insert('0009', 'TomSteyer', 'Democratic', myApp.get_tweets("TomSteyer"))
    myApp.insert('0010', 'andrewyang', 'Democratic', myApp.get_tweets("andrewyang"))
    print("Done.")
    
    
    