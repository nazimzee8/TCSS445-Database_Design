-- Start of tweetrumper SQL script.
/* ************************************************************************************************
   Project Phase III
   Group Tweetrumper (MariaDB)
   Authors: Adam Shandi
   			Daniel Looney
   			Nazim Zerrouki
   			Samuel Wainright
   Version: 1.0.5
   
   Tweetrumper is a database that stores simulated real-world
   tweet data on candidates.
   
   This SQL Script was tested on MySQL and MariaDB. To run, simply 
	load this script file and run. 
   ************************************************************************************************
*/


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS `tweetrumper`;
CREATE DATABASE IF NOT EXISTS `tweetrumper` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `tweetrumper`;


-- ************************************************************************************************
--	Part A
--	***********************************************************************************************


-- Table handles: Stores a reference to a candidate's internal ID,
--				  their unique Twitter ID and Twitter handle
--				  (ex. "@RealDonaldTrump") from twitter.com.
--
-- candidate_id: Candidate specifier unique to the database's domain.
-- twitter_id: Unique Twitter ID that reflects the candidate's real-world ID on Twitter.
-- twitter_handle: The accompanying handle or "username" reflected on Twitter.

CREATE TABLE IF NOT EXISTS `handles` (
  `twitter_id` varchar(128) NOT NULL,
  `twitter_handle` varchar(128) NOT NULL,
  PRIMARY KEY (`twitter_id`),
  CONSTRAINT `max_length_constraint_handles_id` CHECK (CHAR_LENGTH(`twitter_id`) < 129),
  CONSTRAINT `max_length_constraint_handles` CHECK (CHAR_LENGTH(`twitter_handle`) < 129)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table candidates: Stores data about a candidate, their Twitter
--					 ID and the Party they reptweetrumpertweet_contenthandlesresent.
--
-- candidate_id: Candidate specifier unique to the database's domain.
-- candidate_name: The candidate's name.
-- twitter_id: Unique Twitter ID that reflects the candidate's real-world ID.
-- party: The candidate's party.

CREATE TABLE IF NOT EXISTS `candidates` (
  `candidate_id` varchar(128) NOT NULL,
  `candidate_name` varchar(128) NOT NULL,
  `party` varchar(32) NOT NULL,
  `twitter_id` varchar(128) NOT NULL,
  PRIMARY KEY (`candidate_id`),
  UNIQUE KEY `twitter_id` (`twitter_id`),
  CONSTRAINT `candidates_handles_fk` FOREIGN KEY (`twitter_id`) REFERENCES `handles` (`twitter_id`) ON DELETE CASCADE,
  CONSTRAINT `check_valid_candidate_id` CHECK (`party` in ('Republican','Democratic','Independent'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table tweets: Stores data about individual tweets by the unique Twitter ID and 
--				their tweet identifier and of the candidate that posted the tweet.
--
--	twitter_id: The unique Twitter identifier of a candidate.
--	twitter_post_id: The unique Twitter identifier of a post on Twitter.

CREATE TABLE IF NOT EXISTS `tweets` (
  `twitter_id` varchar(128) NOT NULL,
  `twitter_post_id` varchar(128) NOT NULL,
  PRIMARY KEY (`twitter_id`,`twitter_post_id`),
  KEY `tweets_tweet_content_fk` (`twitter_post_id`),
  CONSTRAINT `max_length_constraint_tweets_id` CHECK (CHAR_LENGTH(`twitter_id`) < 129),
  CONSTRAINT `max_length_constraint_tweets_post_id` CHECK (CHAR_LENGTH(`twitter_post_id`) < 129),
  CONSTRAINT `tweets_handles_fk` FOREIGN KEY (`twitter_id`) REFERENCES `handles` (`twitter_id`) ON DELETE CASCADE,
  CONSTRAINT `tweets_tweet_content_fk` FOREIGN KEY (`twitter_post_id`) REFERENCES `tweet_content` (`twitter_post_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table tweet_content: Stores data about individual tweets by their unique
--					  tweet ID, the entire content of the tweet, a keyword
--					  parsed from the tweet's content, and the date the tweet
--					  was created.
--
-- twitter_post_id: The unique Twitter identifier of a post on Twitter.
-- tweet_string: The entire textual content of the tweet.
-- keyword: A keyword parsed from the Twitter post.
-- tweet_date: The date the tweet was posted.

CREATE TABLE IF NOT EXISTS `tweet_content` (
  `twitter_post_id` varchar(128) NOT NULL,
  `tweet_string` varchar(480) NOT NULL,
  `keyword` varchar(32) NOT NULL,
  `tweet_date` date NOT NULL,
  PRIMARY KEY (`twitter_post_id`),
  CONSTRAINT `check_tweet_date` CHECK (`tweet_date` > 20060321)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ************************************************************************************************
-- Part B
-- ************************************************************************************************


-- Inserting tuples into handles table.

INSERT INTO `handles` (`twitter_id`, `twitter_handle`) VALUES
	('16581604', 'MikeBloomberg'),
	('216776631', 'berniesanders'),
	('226222147', 'PeteButtigieg'),
	('25073877', 'RealDonaldTrump'),
	('26637348', 'TulsiGabbard'),
	('33537967', 'AmyKlobuchar'),
	('939091', 'JoeBiden'),
	('949934436', 'TomSteyer'),
	('970207298', 'SenWarren');

	
-- Inserting tuples into candidates table.

INSERT INTO `candidates` (`candidate_id`, `candidate_name`, `party`, `twitter_id`) VALUES
	('0001', 'Bernie Sanders', 'Democratic', '216776631'),
	('0002', 'Elizabeth Warren', 'Democratic', '970207298'),
	('0003', 'Donald J. Trump', 'Republican', '25073877'),
	('0004', 'Mike Bloomberg', 'Democratic', '16581604'),
	('0005', 'Pete Buttigieg', 'Democratic', '226222147'),
	('0006', 'Joe Biden (Text Join to 30330)', 'Democratic', '939091'),
	('0007', 'Amy Klobuchar', 'Democratic', '33537967'),
	('0008', 'Tulsi Gabbard 🌺', 'Democratic', '26637348'),
	('0009', 'Tom Steyer', 'Democratic', '949934436');


-- Inserting tuples into tweets table.

INSERT INTO `tweets` (`twitter_id`, `twitter_post_id`) VALUES
	('16581604', '1230585032818991104'),
	('16581604', '1230604931767447552'),
	('16581604', '1230633684904169472'),
	('16581604', '1230889288742711296'),
	('16581604', '1231048162804105217'),
	('16581604', '1231349285809205248'),
	('16581604', '1231686847136501760'),
	('16581604', '1232062291627167744'),
	('16581604', '1232343786212220928'),
	('16581604', '1232436436638433281'),
	('16581604', '1232463133555322884'),
	('16581604', '1232472832539602944'),
	('16581604', '1232482601950011394'),
	('16581604', '1232485326834237440'),
	('16581604', '1232710899456249858'),
	('16581604', '1232821366002290688'),
	('16581604', '1232827313471049729'),
	('16581604', '1233114972433022977'),
	('16581604', '1233125144090021888'),
	('16581604', '1233141422334914574'),
	('16581604', '1233165752447963137'),
	('16581604', '1233200752497221634'),
	('16581604', '1233433281598836736'),
	('16581604', '1233479419672563712'),
	('16581604', '1233497248589340673'),
	('16581604', '1233511136349298689'),
	('16581604', '1233808503912968194'),
	('16581604', '1233852852243750913'),
	('16581604', '1233895282099851270'),
	('16581604', '1234152454436139019'),
	('16581604', '1234291525061877764'),
	('16581604', '1234317901110358018'),
	('16581604', '1234496899891286018'),
	('16581604', '1234532172956078080'),
	('16581604', '1234534690238889991'),
	('16581604', '1234537462573211649'),
	('16581604', '1234576773943156737'),
	('16581604', '1234580487282151424'),
	('216776631', '1231662862856310786'),
	('216776631', '1231955724642799616'),
	('216776631', '1231984583333289985'),
	('216776631', '1232000454000816130'),
	('216776631', '1232014427937034240'),
	('216776631', '1232026195996368897'),
	('216776631', '1232036664199012353'),
	('216776631', '1232043772222926850'),
	('216776631', '1232049385879543808'),
	('216776631', '1232057200631320576'),
	('216776631', '1232087418137870337'),
	('216776631', '1232127501826129921'),
	('216776631', '1232142007084232704'),
	('216776631', '1232353870912770048'),
	('216776631', '1232413468030095361'),
	('216776631', '1232445619219755009'),
	('216776631', '1232472433719836672'),
	('216776631', '1232473251378536449'),
	('216776631', '1232474541596626944'),
	('216776631', '1232482218779533313'),
	('216776631', '1232496059194073088'),
	('216776631', '1232496655754240003'),
	('216776631', '1232710491060887552'),
	('216776631', '1232740760065323011'),
	('216776631', '1232758324631875584'),
	('216776631', '1232765103193214976'),
	('216776631', '1232826930916974597'),
	('216776631', '1232874260068290560'),
	('216776631', '1233073788050259969'),
	('216776631', '1233117460670373888'),
	('216776631', '1233132397891162112'),
	('216776631', '1233466191496327168'),
	('216776631', '1233491405869342724'),
	('216776631', '1233510551919251456'),
	('216776631', '1233549854258925573'),
	('216776631', '1233562237702414336'),
	('216776631', '1233565046938058757'),
	('216776631', '1233792665923268610'),
	('216776631', '1233949720697036800'),
	('216776631', '1234131222206521345'),
	('216776631', '1234132901010300932'),
	('216776631', '1234167516676665350'),
	('216776631', '1234184532527546369'),
	('216776631', '1234226974316474370'),
	('216776631', '1234281145598169088'),
	('216776631', '1234500784513044481'),
	('226222147', '1231043007601922050'),
	('226222147', '1231384320964726785'),
	('226222147', '1231384879776092160'),
	('226222147', '1231385069396336641'),
	('226222147', '1231385754904997888'),
	('226222147', '1231420352036823041'),
	('226222147', '1231435772554883074'),
	('226222147', '1231722158830817280'),
	('226222147', '1231747367977787393'),
	('226222147', '1231783667929878535'),
	('226222147', '1232067018637090822'),
	('226222147', '1232081056582467584'),
	('226222147', '1232101049525325824'),
	('226222147', '1232127515096952832'),
	('226222147', '1232147035081539584'),
	('226222147', '1232152601833152518'),
	('226222147', '1232482449776529408'),
	('226222147', '1232484820275515392'),
	('226222147', '1232488484163612672'),
	('226222147', '1232669592503377922'),
	('226222147', '1232724607997743111'),
	('226222147', '1232769604549795840'),
	('226222147', '1232815296232247297'),
	('226222147', '1232852910859603968'),
	('226222147', '1233152086369603585'),
	('226222147', '1233193127676125184'),
	('226222147', '1233209656400588806'),
	('226222147', '1233248318819573760'),
	('226222147', '1233397709836619776'),
	('226222147', '1233494360634908672'),
	('226222147', '1233511334907650051'),
	('226222147', '1233958992440963072'),
	('226222147', '1234155073279856641'),
	('25073877', '1232130587324014593'),
	('25073877', '1232292177692315651'),
	('25073877', '1232304804820467714'),
	('25073877', '1232395209125707776'),
	('25073877', '1232420003149824003'),
	('25073877', '1232558211103772672'),
	('25073877', '1232558272038572032'),
	('25073877', '1232559470980415488'),
	('25073877', '1232743236063678465'),
	('25073877', '1233220106324451328'),
	('25073877', '1233256774964273152'),
	('25073877', '1233273894032871424'),
	('25073877', '1234222094210211846'),
	('25073877', '1234462291652993032'),
	('25073877', '1234497829298679809'),
	('26637348', '1220089815930167296'),
	('26637348', '1220448367701979136'),
	('26637348', '1220462538959122432'),
	('26637348', '1220704969956962309'),
	('26637348', '1220705066853838848'),
	('26637348', '1221779890908758018'),
	('26637348', '1221961500698595328'),
	('26637348', '1223217866184388608'),
	('26637348', '1227621522233229314'),
	('26637348', '1227939477881942016'),
	('26637348', '1228032614549815303'),
	('26637348', '1228037216506712065'),
	('26637348', '1228039815570108417'),
	('26637348', '1228040226016198656'),
	('26637348', '1228041508642750464'),
	('26637348', '1228042731462832128'),
	('26637348', '1228046044472147969'),
	('26637348', '1228055397950513169'),
	('26637348', '1228380986813095938'),
	('26637348', '1229390037013450752'),
	('26637348', '1230116070389796864'),
	('26637348', '1230541135933771778'),
	('26637348', '1230890354519498755'),
	('26637348', '1230925592356360192'),
	('26637348', '1231040367224426496'),
	('26637348', '1231920963043749889'),
	('26637348', '1232798784104673281'),
	('26637348', '1233060447336771584'),
	('26637348', '1233183362858176513'),
	('26637348', '1233520666290401281'),
	('26637348', '1233740452182024193'),
	('26637348', '1234100826676908036'),
	('33537967', '1228876472934334464'),
	('33537967', '1229872343368945664'),
	('33537967', '1230260151132667905'),
	('33537967', '1230319377108488194'),
	('33537967', '1230319588568522752'),
	('33537967', '1230329893277224960'),
	('33537967', '1230337178409897985'),
	('33537967', '1230343732341248000'),
	('33537967', '1230588964752375809'),
	('33537967', '1230906394276065280'),
	('33537967', '1230942468662685696'),
	('33537967', '1231020978089709568'),
	('33537967', '1232478648365535232'),
	('33537967', '1232487354876780547'),
	('33537967', '1232489767981309954'),
	('33537967', '1232813868231069696'),
	('33537967', '1232853309146435585'),
	('33537967', '1232856782168641536'),
	('33537967', '1232859203938680832'),
	('33537967', '1232859259915948034'),
	('33537967', '1233215961999822849'),
	('33537967', '1233569584030081026'),
	('33537967', '1233861106701099008'),
	('33537967', '1233898903248015360'),
	('33537967', '1233951704149889024'),
	('33537967', '1234169049573134337'),
	('939091', '1228451350859501574'),
	('939091', '1228744533107671041'),
	('939091', '1229103397539704832'),
	('939091', '1229161027037777923'),
	('939091', '1229494474423836672'),
	('939091', '1229842517677441024'),
	('939091', '1229893855836659712'),
	('939091', '1229938651171155968'),
	('939091', '1230318507008589824'),
	('939091', '1230320164790513665'),
	('939091', '1230327966636421120'),
	('939091', '1230365966573293569'),
	('939091', '1230539861343506432'),
	('939091', '1230619943730896898'),
	('939091', '1230619946306211847'),
	('939091', '1230677552039186432'),
	('939091', '1230916479337598978'),
	('939091', '1230933959371976704'),
	('939091', '1231261869983199232'),
	('939091', '1231685159881203717'),
	('939091', '1232119269824942080'),
	('939091', '1232460769926602752'),
	('939091', '1232476125399355393'),
	('939091', '1232477397384982530'),
	('939091', '1232487335771570176'),
	('939091', '1232493680079933440'),
	('939091', '1232496083202269184'),
	('939091', '1232505640968478720'),
	('939091', '1232780170697859074'),
	('939091', '1232796201029906433'),
	('939091', '1232812588032876544'),
	('939091', '1232851279162073089'),
	('939091', '1232859648195063809'),
	('939091', '1233128772045561856'),
	('939091', '1233177492640260097'),
	('939091', '1233510939720175616'),
	('939091', '1233551471779700741'),
	('939091', '1233557748387729408'),
	('939091', '1233951593252311041'),
	('949934436', '1228042173330780160'),
	('949934436', '1228042174526185472'),
	('949934436', '1228042175306326016'),
	('949934436', '1228042176946307072'),
	('949934436', '1228042178443657216'),
	('949934436', '1228042179479650304'),
	('949934436', '1228042986249805824'),
	('949934436', '1228042987474604033'),
	('949934436', '1228042988795809792'),
	('949934436', '1228059821582086144'),
	('949934436', '1228079703069605888'),
	('949934436', '1228101849535746049'),
	('949934436', '1228153158406262785'),
	('949934436', '1228455338501795840'),
	('949934436', '1228470166847016960'),
	('949934436', '1228480613629300737'),
	('949934436', '1228834864608116737'),
	('949934436', '1229103186423631872'),
	('949934436', '1229135239894589440'),
	('949934436', '1229200892353605633'),
	('949934436', '1229456718196695040'),
	('949934436', '1229482372363481088'),
	('949934436', '1229511826662014976'),
	('949934436', '1229543359976370176'),
	('949934436', '1229556475153960962'),
	('949934436', '1229582986074476544'),
	('949934436', '1229831190955188224'),
	('949934436', '1229897329861259264'),
	('949934436', '1229924107476582400'),
	('949934436', '1229947020850262016'),
	('949934436', '1230185483583381504'),
	('949934436', '1230206739909230592'),
	('949934436', '1230209185930833920'),
	('949934436', '1230296495485665282'),
	('949934436', '1230328886036062208'),
	('949934436', '1230543720480509954'),
	('949934436', '1230556776791076864'),
	('949934436', '1230601523006017536'),
	('949934436', '1230637332786663424'),
	('949934436', '1230659549092175873'),
	('949934436', '1230694886007021568'),
	('949934436', '1230711923324280832'),
	('949934436', '1230970000371937285'),
	('949934436', '1231031604350509061'),
	('949934436', '1231072253737132032'),
	('949934436', '1231650433787219970'),
	('949934436', '1231995711400615936'),
	('949934436', '1232109961326612480'),
	('949934436', '1232138314976616449'),
	('949934436', '1232138315790372866'),
	('949934436', '1232158575230717952'),
	('949934436', '1232164461613465600'),
	('949934436', '1232166104509734912'),
	('949934436', '1232337466595651587'),
	('949934436', '1232379813979185152'),
	('949934436', '1232388045619519493'),
	('949934436', '1232398638892146693'),
	('949934436', '1232435626760294402'),
	('949934436', '1232473833010937856'),
	('949934436', '1232485026031230976'),
	('949934436', '1232488864012308480'),
	('949934436', '1232496471477350401'),
	('949934436', '1232498990656016384'),
	('949934436', '1232760616554680320'),
	('949934436', '1233176754035904513'),
	('949934436', '1233199767808663552'),
	('949934436', '1233207475051974656'),
	('949934436', '1233436751844315137'),
	('949934436', '1233504586956230656'),
	('949934436', '1233578004137164800'),
	('949934436', '1233841670099218433'),
	('949934436', '1233894099192692736'),
	('949934436', '1233958163218489344'),
	('970207298', '1222884145191407616'),
	('970207298', '1222884146646786048'),
	('970207298', '1222932037713133568'),
	('970207298', '1222933049979101184'),
	('970207298', '1222933828815204357'),
	('970207298', '1222935422562635776'),
	('970207298', '1222936474213068801'),
	('970207298', '1222938688046366723'),
	('970207298', '1222939686362066945'),
	('970207298', '1222942363087179776'),
	('970207298', '1222982617643069442'),
	('970207298', '1222984615511625730'),
	('970207298', '1222986009262141456'),
	('970207298', '1223021038788849670'),
	('970207298', '1223034629285928965'),
	('970207298', '1223034630854660098'),
	('970207298', '1223039838888374278'),
	('970207298', '1223268764701032449'),
	('970207298', '1223268766303297537'),
	('970207298', '1223400657778024450'),
	('970207298', '1223403940764692480'),
	('970207298', '1223404250602123270'),
	('970207298', '1223410507639676928'),
	('970207298', '1223759840624902149'),
	('970207298', '1223990365927231489'),
	('970207298', '1224358030801764352'),
	('970207298', '1224362626215530496'),
	('970207298', '1224382936692162560'),
	('970207298', '1224423565673619460'),
	('970207298', '1224423569112936449'),
	('970207298', '1224801420513333248'),
	('970207298', '1225079520983691265'),
	('970207298', '1225137120588812288'),
	('970207298', '1225217745513570304'),
	('970207298', '1225495290561605637'),
	('970207298', '1225513848259719170'),
	('970207298', '1225801550301409280'),
	('970207298', '1226299985555226625'),
	('970207298', '1226543474054443009'),
	('970207298', '1226938932794974208'),
	('970207298', '1226984633075666951'),
	('970207298', '1226984634346549250'),
	('970207298', '1227324414213185536'),
	('970207298', '1227324421913894914'),
	('970207298', '1227324429337792514'),
	('970207298', '1227324436858228737'),
	('970207298', '1227324443678081026'),
	('970207298', '1227324451919974400'),
	('970207298', '1227324460157603840'),
	('970207298', '1227324468621643777'),
	('970207298', '1227324478075678720'),
	('970207298', '1227324485684072455'),
	('970207298', '1227324488708050944'),
	('970207298', '1227346090342699009'),
	('970207298', '1227964090628366337'),
	('970207298', '1228034303851888640'),
	('970207298', '1228075363407888388'),
	('970207298', '1228099336099237890'),
	('970207298', '1228381307119570944'),
	('970207298', '1228395602104455169'),
	('970207298', '1228395630013374464'),
	('970207298', '1228726731906977792'),
	('970207298', '1229063978573320201'),
	('970207298', '1229095118323560450'),
	('970207298', '1229436157085278209'),
	('970207298', '1229436157970321409'),
	('970207298', '1229436158893010944'),
	('970207298', '1229436159677341696'),
	('970207298', '1229436160579194882'),
	('970207298', '1229436161342496769'),
	('970207298', '1229436162160386048'),
	('970207298', '1229918295379316737'),
	('970207298', '1230149010629021698'),
	('970207298', '1230154522175197189'),
	('970207298', '1230155426227986433'),
	('970207298', '1230155427683471361'),
	('970207298', '1230155429126250496'),
	('970207298', '1230155432049680386'),
	('970207298', '1230155433526091777'),
	('970207298', '1230212905515339776'),
	('970207298', '1230213351285936130'),
	('970207298', '1230213354117042178'),
	('970207298', '1230560554395193344'),
	('970207298', '1230578644160065537'),
	('970207298', '1230603701355765777'),
	('970207298', '1230646817286692865'),
	('970207298', '1230873281227567114'),
	('970207298', '1230978907719053312'),
	('970207298', '1231016632757182465'),
	('970207298', '1231016638461415425'),
	('970207298', '1232097506290524161'),
	('970207298', '1232097786545496065'),
	('970207298', '1232327346633486336'),
	('970207298', '1232327557363748864'),
	('970207298', '1232380483889238019'),
	('970207298', '1232425414632640516'),
	('970207298', '1232439528108908546'),
	('970207298', '1232460810972041217'),
	('970207298', '1232745435166584837'),
	('970207298', '1233051272992915461'),
	('970207298', '1233088146218287104'),
	('970207298', '1233109828421201925'),
	('970207298', '1233109830442868738'),
	('970207298', '1233109837694763009'),
	('970207298', '1233158947739242496'),
	('970207298', '1233468857739857921'),
	('970207298', '1233510001840394240'),
	('970207298', '1233542922584428544'),
	('970207298', '1233542925461704710'),
	('970207298', '1233754693421215744'),
	('970207298', '1233776187547308035'),
	('970207298', '1233844568757501952'),
	('970207298', '1234178141960245253'),
	('970207298', '1234231176849772545'),
	('970207298', '1234523138819526659'),
	('970207298', '1234575424010805248'),
	('970207298', '1234575431761829890'),
	('970207298', '1234575440011984901'),
	('970207298', '1234575441945645058'),
	('970207298', '1234575443413684230'),
	('970207298', '1234591960058486784'),
	('970207298', '1234591962025558016');

	
-- Inserting tuples into tweet_content table.

INSERT INTO `tweet_content` (`twitter_post_id`, `tweet_string`, `keyword`, `tweet_date`) VALUES
	('1220089815930167296', 'RT @StandwithTulsi: Do you support Tulsi Gabbard\'s decision to sue Hillary Clinton for defamation over her \'Russian asset\' comments? Please…', 'Russia', '2020-01-22'),
	('1220448367701979136', '#DoomsdayClock My personal commitment to you is that on the first day of my presidency, I will contact the leaders of China and Russia to set up a summit to end the new cold war and nuclear arms race, which will inevitably result in a nuclear holocaust. #StandWithTulsi https://t.co/Gf01YJ6E7z', 'nuclear', '2020-01-23'),
	('1220462538959122432', '#DoomsdayClock - It’s time to move back from the abyss. It’s time to end the new cold war and nuclear arms race before it’s too late. #StandWithTulsi https://t.co/eLGGObczT1', 'nuclear', '2020-01-23'),
	('1220704969956962309', '#DoomsdayClock: It\'s time to wake up! As president and commander-in-chief, my foremost responsibility will be to protect the lives, safety and freedom of the American people -- and that means preventing a nuclear holocaust. My personal commitment to you… https://t.co/spnWGefRvK', 'nuclear', '2020-01-24'),
	('1220705066853838848', '…is that on the first day of my presidency, I will contact the leaders of China and Russia to set up a summit to end the new cold war and nuclear arms race, which will inevitably result in a nuclear holocaust.', 'nuclear', '2020-01-24'),
	('1221779890908758018', 'Health care in America is expensive because it’s focused on disease treatment rather than prevention. That’s where the 💰💰 are for big pharma/insurance. There needs to be more focus on disease prevention, nutrition, and helping people be healthy #StandWithTulsi #Tulsi2020 https://t.co/kzxeUksX42', 'health care', '2020-01-27'),
	('1221961500698595328', 'RT @mtracey: Only in NH. Just met a lady who had never heard of Tulsi before today, when her coworkers at the local hospital mentioned her.…', 'workers', '2020-01-28'),
	('1222884145191407616', 'My big, bold Gun Violence Prevention and Community Safety Act with @RepHankJohnson combines &amp; builds upon Congress’s best common-sense gun safety legislation for one comprehensive bill to protect our kids &amp; keep our communities safer. #EndGunViolenceBill', 'gun violence', '2020-01-30'),
	('1222884146646786048', 'I’m grateful that our #EndGunViolenceBill has the support of the @NAACP, @GiffordsCourage, @AMarch4OurLives, @NewtownAction, @stophandguns, &amp; a number of gun violence prevention, civil rights, public health, &amp; community organizations in MA &amp; across the country.', 'gun violence', '2020-01-30'),
	('1222932037713133568', 'RT @RepHankJohnson: It’s long past time for Congress to treat gun violence in America like the public health crisis that it is. That’s why…', 'gun violence', '2020-01-30'),
	('1222933049979101184', 'RT @MassAGO: Thank you @SenWarren.\n\n100 Americans die from gun violence every day. It’s time for Congress to stand up to the gun lobby and…', 'gun violence', '2020-01-30'),
	('1222933828815204357', 'RT @stophandguns: We are proud of our proven success in gun violence prevention in Massachusetts. We applaud Senator Warren for her support…', 'gun violence', '2020-01-30'),
	('1222935422562635776', 'RT @GunsDownAmerica: ✅ Federal gun licensing\n✅ Universal background checks\n✅ Assault weapons ban\n✅ Community-based violence intervention fu…', 'weapons', '2020-01-30'),
	('1222936474213068801', 'RT @NewtownAction: It’s long past time for Congress to treat gun violence in America like the public health crisis that it is. That’s why w…', 'gun violence', '2020-01-30'),
	('1222938688046366723', 'RT @SUPGVNetwork: Senator Warren’s new Gun Violence Prevention and Community Safety Act is exactly the comprehensive national legislation w…', 'gun violence', '2020-01-30'),
	('1222939686362066945', 'RT @amnestyusa: ✅ Federal gun licensing\n✅ Universal background checks\n✅ Assault weapons ban\n✅ Funding for community-based violence interven…', 'weapons', '2020-01-30'),
	('1222942363087179776', 'One year ago today, @RepAdamSmith &amp; I introduced our No First Use Act, a bill that would commit the US to not using nuclear weapons first. As the Trump admin continues to pursue reckless nuclear weapons &amp; dangerous arms control policies, this bill is more important than ever. https://t.co/zyBmAQS8wt', 'nuclear', '2020-01-30'),
	('1222982617643069442', 'RT @bradybuzz: Today, @SenWarren &amp; @RepHankJohnson introduced a bill to reduce gun violence. It includes:\n\n✅universal background checks\n✅sa…', 'gun violence', '2020-01-30'),
	('1222984615511625730', 'RT @SenatorMenendez: Joining @SenWarren today to release the Gun Violence Prevention and Community Safety Act—sweeping, commonsense gun leg…', 'gun violence', '2020-01-30'),
	('1222986009262141456', 'RT @po_murray: Newtown was devastated by gun violence. The incremental approach has failed too many American families. That is why I am thr…', 'gun violence', '2020-01-30'),
	('1223021038788849670', 'I asked @RepAdamSchiff: At time when many have lost faith in govt, does the fact that the Chief Justice is presiding over an impeachment trial in which GOP senators refuse witnesses or evidence contribute to the loss of legitimacy of the Chief Justice, SCOTUS, &amp; Constitution? https://t.co/H4Txt68EdX', 'impeachment', '2020-01-30'),
	('1223034629285928965', 'This morning, the @FederalReserve, @USOCC, and @FDICgov agreed to let big banks invest grandma’s checking account in venture capital firms like the ones that backed WeWork and Theranos. What on earth could go wrong? https://t.co/BWf7YCLZJ5', 'banks', '2020-01-31'),
	('1223034630854660098', 'Giant banks received billions in taxpayer bailouts during the financial crisis. Now Trump-appointed regulators are slashing safeguards that prevent the same thing from happening all over again. Caving to Wall Street puts families – and our whole economy – at risk.', 'economy', '2020-01-31'),
	('1223039838888374278', 'RT @GlobePolitical: Senator Elizabeth Warren on Thursday introduced comprehensive and aggressive gun safety legislation, including a federa…', 'Fed', '2020-01-31'),
	('1223217866184388608', 'I cast my vote on two important bills yesterday. I voted to repeal the 2002 Authorization for the Use of Military Force in Iraq. And I voted for and co-sponsored the No War with Iran Act. #NoWarWithIran #StandWithTulsi https://t.co/ZB92l80bfZ', 'Iran', '2020-01-31'),
	('1223268764701032449', 'Faith in our American institutions is at an all-time low. The fact that GOP senators are covering up the President’s corruption with a sham impeachment trial without witnesses &amp; documents doesn’t help. History will judge us for what happens next.', 'impeachment', '2020-01-31'),
	('1223268766303297537', 'Americans deserve to know that the President is using the power of his/her office to work in the nation’s interest, not his own personal interest. And they deserve a Senate with the political courage to stand up to a President that has abused his power &amp; corrupted our government.', 'personal interest', '2020-01-31'),
	('1223400657778024450', 'Senator Schumer has called for an amendment vote tonight to subpoena Mulvaney, Bolton, Duffy, Blair, &amp; White House, OMB, DoD, and State Dept documents. These are the witnesses &amp; documents we need for this impeachment trial.', 'impeachment', '2020-02-01'),
	('1223403940764692480', 'Since the @SenateGOP won’t allow all the witnesses &amp; documents, Senator Schumer’s second vote tonight would subpoena just John Bolton. The former National Security Advisor’s story is going to come out one way or another. Let’s hear it the proper way: in trial.', 'Bolton', '2020-02-01'),
	('1223404250602123270', 'Senator Schumer’s third amendment is to ensure a speedy deposition of John Bolton that would not delay Senate business. We can get the facts &amp; keep working – if the @SenateGOP allow it.', 'Bolton', '2020-02-01'),
	('1223410507639676928', 'Senator Schumer’s final amendment once again would allow Chief Justice Roberts – a neutral party – to approve witnesses &amp; evidence that are relevant to the impeachment charges.', 'impeachment', '2020-02-01'),
	('1223759840624902149', 'The federal govt already contracts to develop drugs for national security emergencies. I’ve got a bill to let @HHSgov manufacture generic drugs like insulin to help address shortages, increase competition, &amp; lower prices. https://t.co/ZDU71cnHVT', 'national security', '2020-02-02'),
	('1223990365927231489', 'Washington works great for the rich &amp; the powerful – it’s just not working for everyone else. That’s why I introduced the most ambitious anti-corruption legislation since Watergate to make our government work for the people. #EndCorruptionNow https://t.co/6w2Ce2fAyV', 'corruption', '2020-02-02'),
	('1224358030801764352', 'Americans know that Washington isn’t working for them. But instead of giving up, more and more people are fighting back – and my bill to #EndCorruptionNow would do just that. https://t.co/AVm81yXblF', 'corruption', '2020-02-03'),
	('1224362626215530496', 'This National Gun Violence Survivors Week, I’m fighting to end the gun violence that destroys lives &amp; tears apart families &amp; communities. My new #EndGunViolenceBill with @RepHankJohnson is a big, bold way to confront this crisis. #MomentsThatSurvive https://t.co/5PdzrwfhOi', 'gun violence', '2020-02-03'),
	('1224382936692162560', 'Judy Shelton pushes fringe economic theories that will hurt working families and changes her positions to suck up to powerful politicians. @FederalReserve leaders must be independent and data-driven – she’s not qualified. https://t.co/ABAukRWHsE', 'economic', '2020-02-03'),
	('1224423565673619460', 'Senate Republicans can lock arms &amp; agree on a sham trial, but it doesn’t change the reality that the President of the United States threatened our national security &amp; democracy for his own personal benefit. That is the very definition of an impeachable offense.', 'sham trial', '2020-02-03'),
	('1224423569112936449', 'No one is above the law – not even the President of the United States. And the American people know that what\'s happening in this Senate impeachment trial is wrong.', 'impeachment', '2020-02-03'),
	('1224801420513333248', 'RT @OversightDems: Gun violence takes an immeasurable toll in the U.S.\n\nFor #NationalGunViolenceSurvivorsWeek, Chair @RepMaloney &amp; @senwarr…', 'gun violence', '2020-02-04'),
	('1225079520983691265', 'I’m voting to convict &amp; remove the President from office to stand up to the corruption that has permeated this administration &amp; that was on full display with his abuse of power &amp; obstruction of Congress. Read my full statement for the trial record here. https://t.co/YWkqQhk4QB https://t.co/bvJneh8LiN', 'corruption', '2020-02-05'),
	('1225137120588812288', 'RT @SenMarkey: Things that shouldn’t be torn up: the Paris Climate Agreement, the Iran deal, and the New START Treaty.\n\nAs of today, the Pr…', 'climate', '2020-02-05'),
	('1225217745513570304', 'Corruption has seeped into the fabric of our government &amp; eroded people’s faith in govt. But I believe that change is possible – and that’s why I put out a bill to #EndCorruptionNow. https://t.co/6RsenIfJN4', 'corruption', '2020-02-06'),
	('1225495290561605637', 'You’re right, Madam Ambassador. We will persist in fighting corruption &amp; working to make our government &amp; governments around the world work not just for the wealthy &amp; powerful, but for everyone. And we will stand by our diplomats in these fights. https://t.co/Kw7QMwp8LM', 'corruption', '2020-02-06'),
	('1225513848259719170', 'On this day in 1788, Massachusetts became the 6th state to ratify the US Constitution. 232 years later, we celebrate the Commonwealth’s birthday by fighting to protect &amp; defend our democracy from the corruption that our Framers feared. https://t.co/x6R7vNMrRH', 'corruption', '2020-02-06'),
	('1225801550301409280', 'Three years ago today, @SenateMajLdr McConnell tried to silence Coretta Scott King\'s words on the Senate floor, &amp; me for reading them. But instead of shutting us up, they made us louder. Nevertheless, we will persist. #ShePersisted https://t.co/XCDVM26A4t', 'McConnell', '2020-02-07'),
	('1226299985555226625', 'Our military leaders have told us – many times – that a strong State Department is critical to their work. America is safer when our State Department is fully funded, well-staffed, and focused on diplomacy. https://t.co/rfgOPKq2ML', 'Fed', '2020-02-09'),
	('1226543474054443009', 'Bank executives like former @WellsFargo CEO John Stumpf should face jail time when the banks they lead break the law. I’ve got a bill to hold Wall Street executives personally accountable. https://t.co/k0EYelvGut', 'banks', '2020-02-09'),
	('1226938932794974208', 'RT @RepPressley: #ICYMI - I asked @CFPBDirector if she would take action to stop educational redlining. She refused. \n\nNo one should pay mo…', 'education', '2020-02-10'),
	('1226984633075666951', 'The @Equifax data breach that compromised 145 million Americans’ personal info is a national security nightmare: a hostile foreign attack on a giant US corporation that, without consent, holds all of our personal data – &amp; lacks incentive to keep it safe. https://t.co/O1fCasWSWU', 'national security', '2020-02-10'),
	('1226984634346549250', 'I’ve fought hard to hold @Equifax accountable for failing to protect Americans’ data. China’s responsibility for this cyberattack underscores how serious this fight really is. The US govt must step up to ensure companies can &amp; will keep Americans safe. https://t.co/mhjoCMwH9w', 'data', '2020-02-10'),
	('1227324414213185536', 'Budgets are about more than dollars &amp; cents. Budgets are about values. And the new budget that President Trump released this week is another punch in the gut to working families across the country.', 'budget', '2020-02-11'),
	('1227324421913894914', 'See this right here? At a time when there is an affordable housing crisis in our country, this is where President Trump’s budget jacks up rent for families that receive assistance from @HUDgov, tripling it for the poorest families. https://t.co/rEfPDOmztU', 'budget', '2020-02-11'),
	('1227324429337792514', 'And right here is where President Trump’s budget eliminates LIHEAP – the critical program that helps seniors, people with disabilities, &amp; low-income families in New England &amp; across the country heat their homes &amp; stay safe during the cold winter months. https://t.co/EtQWGqdW73', 'disabilities', '2020-02-11'),
	('1227324436858228737', 'See this? This is where President Trump’s budget cuts $5.6 billion in federal education spending when we should be investing in our public schools, our teachers, our children, &amp; our future. https://t.co/YgD6brEKCF', 'education', '2020-02-11'),
	('1227324443678081026', 'And if you care about helping teachers, firefighters, or other public servants with their student loans? Right here is where President Trump’s budget would totally eliminate the Public Service Loan Forgiveness program. https://t.co/3uNVIMeOLY', 'teachers', '2020-02-11'),
	('1227324451919974400', 'And this is some really special budgeting. Even though the @CFPB gets its funding from the Fed, not Congress, President Trump is pushing the consumer agency to cut staff by 17%. That would mean hundreds of fewer cops on the beat to stop Wall St from cheating people. https://t.co/k0qJNOlmi2', 'budget', '2020-02-11'),
	('1227324460157603840', 'And in the middle of a global coronavirus outbreak, this is where President Trump’s budget cuts USAID’s global health funds by over $1 billion &amp; the CDC’s budget by almost $700 million, including a $35 million cut to a key infectious disease response fund. https://t.co/wsRjlzyNwY', 'budget', '2020-02-11'),
	('1227324468621643777', 'But President Trump’s new budget doesn’t cut spending everywhere. He’s called for $2 billion more in funding for the border wall – his monument to hate &amp; division. And he’s called for hundreds of millions more for agencies he’s using to lock kids in cages &amp; terrorize communities. https://t.co/yULDuHMBU2', 'budget', '2020-02-11'),
	('1227324478075678720', 'At a time when giant corporations &amp; their friends in Washington systematically undermine labor unions,  President Trump’s budget has proposed new funding to attack labor unions &amp; their leaders. https://t.co/eSPcOXDHO0', 'budget', '2020-02-11'),
	('1227324485684072455', 'And Trump wants to spend 20% more on nuclear weapons than he did last year while pursuing nuclear policies that are making Americans less safe. He also wants to slash funds for diplomacy by 22%. The President says he opposes stupid endless wars. His budget says otherwise. https://t.co/DDNiMaaKWI', 'budget', '2020-02-11'),
	('1227324488708050944', 'Budgets are about our values, &amp; President Trump’s budget is morally bankrupt. We believe in investing in a future – not just for billionaires and giant corporations, but for all of our kids.', 'budget', '2020-02-11'),
	('1227346090342699009', 'Giant corporations shouldn\'t get to pollute our streams &amp; poison the water we drink just because they only care about their bottom line. This is corruption, plain &amp; simple – &amp; we’ll use every tool in the toolbox to fight back in MA &amp; across the country. https://t.co/nbpZ18H9jx', 'corruption', '2020-02-11'),
	('1227621522233229314', 'To our many #YangGang friends, I hope that you will join our campaign to invest in the American people, instead of regime change wars, military adventurism and a new cold war and nuclear arms race. #StandwithTulsi (3/3)', 'nuclear', '2020-02-12'),
	('1227939477881942016', 'We’ll save trillions by ending our longstanding foreign policy of carrying out regime change wars &amp; escalating new cold war &amp; nuclear arms race. These $ should be kept in our pockets/invested in needs of our people—like healthcare, environmental protection, infrastructure &amp; more. https://t.co/Npr19e1HNZ', 'environment', '2020-02-13'),
	('1227964090628366337', '109 US servicemembers suffered traumatic brain injuries after the Iranian missile strike. @SenJoniErnst, @BillPascrell, @RepDonBacon &amp; I sent a bipartisan letter to the Pentagon requesting an update on their work to monitor TBIs &amp; protect servicemembers. https://t.co/aq8N8bSwn6 https://t.co/XHOIzgi6ry', 'Iranian', '2020-02-13'),
	('1228032614549815303', 'We’re joining the #AAPI2020 Twitter Town Hall TODAY in just a few minutes. Join the conversation using #AAPI2020. @APIAVote, @AAPIData, @aaja, @NCAPATweets @NBCAsianAmerica https://t.co/0m1B0bVca9', 'data', '2020-02-13'),
	('1228034303851888640', 'Americans don’t want another endless war. But the President brought us to the edge of one by killing an Iranian general without consulting Congress. I voted to pass a bipartisan resolution that prohibits military force against Iran without Congressional authorization. https://t.co/7Fgx39Dp8W', 'Iranian', '2020-02-13'),
	('1228037216506712065', '@NBCAsianAmerica I will continue my work in Congress where NHPI issues have been a major focus throughout my 7 years there, passing legislation like the Native Hawaiian Education Reauthorization Act &amp; others to address housing needs, support for Native Hawaiian owned businesses, and more. (1/2)', 'education', '2020-02-13'),
	('1228039815570108417', '@NBCAsianAmerica Asian Americans, Pacific Islanders, and Native Hawaiians have very different needs and concerns within their own communities. We need to change and improve the way that data is collected to represent their unique challenges.', 'data', '2020-02-13'),
	('1228040226016198656', '@NBCAsianAmerica We need to improve the data collected through the census to ensure it more accurately captures our population, and to better understand the challenges and needs of our people so we can enact reforms to ensure a bright future for ALL Americans. #AAPI2020', 'data', '2020-02-13'),
	('1228041508642750464', '@NBCAsianAmerica Government services must be available to all Americans, including those who may have a language barrier. As we do in my multicultural home state of Hawaii, accurate demographic data allows us to provide multi-lingual translations to serve the needs of our communities. #AAPI2020', 'data', '2020-02-13'),
	('1228042173330780160', 'It is time to tell the truth about guns in America. Gun violence is a public health epidemic that claims far too many lives each year. Our nation grieves the loss of fellow Americans on a regular basis. #AAPI2020 https://t.co/5eanZOeD99', 'gun violence', '2020-02-13'),
	('1228042174526185472', 'I stand with students, parents, educators, law enforcement, who recognize the urgent need to institute sensible gun safety. I support establishing universal background checks, banning large-capacity magazines and assault weapons, and enacting red flag laws. #AAPI2020', 'weapons', '2020-02-13'),
	('1228042175306326016', 'I would close loopholes and institute a gun licensing program. Gun manufacturers should not be immune from civil liability, and we have a federal database to track gun sales. #AAPI2020', 'Fed', '2020-02-13'),
	('1228042176946307072', 'Along with the implementation of extreme risk laws, we must be cognizant that AAPIs who wrongly end up on the terrorist watchlist and no-fly lists are not wrongly scapegoated for the scourge of gun violence epidemic. #AAPI2020', 'gun violence', '2020-02-13'),
	('1228042178443657216', 'But let’s be honest, this isn’t a conversation about the Second Amendment — it’s a conversation about corruption and cowardice. The NRA owns the Republican Party — they\'ve got blood on their hands. If Congress won’t act, I will through executive action. #AAPI2020', 'corruption', '2020-02-13'),
	('1228042179479650304', 'You can read more about my plan to end gun violence here:\nhttps://t.co/mGaTDqK0Cg', 'gun violence', '2020-02-13'),
	('1228042731462832128', '@NBCAsianAmerica AAPI families continue to struggle with family separation &amp; other challenges due to heavy backlogs in our broken legal immigration system. We need comprehensive immigration reform and a humane system that actually works to support families, our economy &amp; our country. #AAPI2020', 'economy', '2020-02-13'),
	('1228042986249805824', 'Young people can’t start a family, a business or buy a home with student debt crushing them. We must help lessen the burden of this debt by allowing these individuals to refinance their student loans at a lower and more affordable rate. #AAPI2020 https://t.co/lwbZBtvt0q', 'debt', '2020-02-13'),
	('1228042987474604033', 'Access to education should be a fundamental American right — and that includes access to affordable, high-quality college. #AAPI2020', 'education', '2020-02-13'),
	('1228042988795809792', 'I would also offer student loan forgiveness for those who choose to go into a public service profession, including teachers and emergency first responders. #AAPI2020', 'teachers', '2020-02-13'),
	('1228046044472147969', '@NBCAsianAmerica To name a few - we must address increasing tuition costs, protect students from predatory lenders, allow student debt to qualify for bankruptcy, expand access to community college/vocational training/apprenticeships &amp; maximize technology to reduce cost of education. #AAPI2020', 'education', '2020-02-13'),
	('1228055397950513169', '@RichardLui @NBCAsianAmerica @JoeBiden @Mike2020 @PeteButtigieg @amyklobuchar @BernieSanders @TomSteyer @ewarren @APIAVote @AAPIData @NCAPAtweets @aaja AAPI voters have consistently proven to be the swing vote in many key states, and yet are too often ignored, forgotten, or taken for granted as a monolithic voting demographic. Not true. AAPI are diverse &amp; have unique experiences that inform the issues we are concerned about.', 'data', '2020-02-13'),
	('1228059821582086144', 'Big banks have been turning immense profits at the expense of ordinary Americans for too long.\n\nMy wife and I started our own community bank so more people could get affordable housing, start a business, and pursue their dreams.', 'banks', '2020-02-13'),
	('1228075363407888388', 'At a time when the Too Big to Fail banks – and their profits – are bigger than ever, the Fed wants to weaken its oversight of banks. Vice Chair Quarles\' proposal to undermine the bank examination process is dangerous. Chairman Powell should abandon it. https://t.co/ICHD4ua2pk', 'banks', '2020-02-13'),
	('1228079703069605888', 'Amazon pays no federal taxes, is run by the richest man in the United States, but refuses to take care of its workers. Every employee is entitled to safe working conditions. @JeffBezos and @amazon — do better. \n\nhttps://t.co/MjzUW0Pkmh', 'workers', '2020-02-13'),
	('1228099336099237890', 'Let me be clear: William Barr never should have been confirmed as Attorney General in the first place. I voted no on his confirmation because Barr has always been more interested in serving President Trump than our country. https://t.co/oXoTkU0eQF', 'William Barr', '2020-02-13'),
	('1228101849535746049', '.@Culinary226 is an important advocate on behalf of working people. I will continue to stand by its efforts for better wages and benefits. All workers have the right to be treated with dignity on the job.', 'workers', '2020-02-13'),
	('1228153158406262785', 'It’s the economy, stupid — and Mr. Trump’s is terrible.\n\nhttps://t.co/OSUezCf1Cd', 'economy', '2020-02-14'),
	('1228380986813095938', 'Countless global problems can only be addressed when we work with other countries. This is another reason why our country &amp; our world cannot afford another cold war &amp; nuclear arms race, &amp; must instead seek win-win solutions. Otherwise we all lose.  #StandWithTulsi https://t.co/O9RvLyionk', 'nuclear', '2020-02-14'),
	('1228381307119570944', 'Two years ago today, 17 students, teachers, &amp; faculty members were killed at Marjory Stoneman Douglas High School in Parkland. Today we remember, we mourn, &amp; we honor their memory by fighting for gun safety policies to protect our children.', 'teachers', '2020-02-14'),
	('1228395602104455169', 'Attorney General William Barr’s unjust &amp; unethical interference in the Roger Stone case is a clear violation of his duty to defend fair, impartial, &amp; equal justice of all Americans. He should resign immediately. https://t.co/otbC7oIkFz https://t.co/3DfEELNgeG', 'William Barr', '2020-02-14'),
	('1228395630013374464', 'William Barr’s interference is corruption, plain &amp; simple. Congress should use its spending power to protect the rule of law &amp; prevent a corrupt AG from protecting the President’s buddies when they commit crimes to benefit the President.', 'corruption', '2020-02-14'),
	('1228451350859501574', 'Two years ago, 17 innocent people were gunned down and 17 more injured by a shooter with an AR-15 style weapon at a high school in Parkland, FL. As we honor the memory of those we lost, we must recommit to taking action to end our gun violence epidemic. https://t.co/JQz9ptTqaj', 'gun violence', '2020-02-14'),
	('1228455338501795840', 'Please do, so we can break the NRA\'s control over our government and end gun violence. https://t.co/CQMB2SNHl0', 'gun violence', '2020-02-14'),
	('1228470166847016960', 'Data doesn’t lie. If the climate isn\'t our number one priority, the climate crisis will not get addressed. https://t.co/8L0SOJNQb5', 'climate', '2020-02-15'),
	('1228480613629300737', 'Trump wants an 8% cut in federal spending on education. I want to DOUBLE the current level of federal spending on K-12. For far too long and continuing with Trump, we have underinvested in our children and legislated inequities in the system. No more.\n\nhttps://t.co/A0k9zqvUgt', 'education', '2020-02-15'),
	('1228726731906977792', 'The President’s new budget would end @TheJusticeDept’s policy not to interfere in states’ marijuana laws. Just more proof that federal marijuana policies are broken &amp; outdated. I support legalization – &amp; @SenCoryGardner &amp; I have a bipartisan bill to end the federal marijuana ban. https://t.co/5EP9zAtsHt', 'budget', '2020-02-15'),
	('1228744533107671041', 'No one needs an AR-15. Period. We have to get these weapons of war out of our communities.', 'weapons', '2020-02-15'),
	('1228834864608116737', 'I will ALWAYS stand on the side of workers and organized labor. We must take back the government from the corporations that bought it. https://t.co/fsr06ilZAk', 'workers', '2020-02-16'),
	('1228876472934334464', 'Unions help all workers fight for better wages and workplaces. America needs more unions—not fewer.\n\nI’m the granddaughter of a miner and the daughter of a union teacher and union newspaperman. I will always defend the right to organize.', 'workers', '2020-02-16'),
	('1229063978573320201', 'The Black/white homeownership gap is bigger now than when housing discrimination was legal, &amp; the person rewriting our bank anti-discrimination laws ran a bank that went out of its way not to serve Black &amp; Latino families. Housing discrimination still exists, &amp; I\'m fighting back. https://t.co/7aZD0mznnV', 'discrimination', '2020-02-16'),
	('1229095118323560450', 'RT @BostonDotCom: Elizabeth Warren unveils bill in response to the Justice Department’s intervention in the Roger Stone case https://t.co/Z…', 'Roger Stone', '2020-02-16'),
	('1229103186423631872', 'We can end gun violence. As president, I will implement long-overdue gun safety reforms. https://t.co/azaDTiIZBu', 'gun violence', '2020-02-16'),
	('1229103397539704832', 'Newtown\nParkland\nLas Vegas\n\nEnough is enough. We have to take on the @NRA and end our gun violence epidemic. https://t.co/2f9h6AMSeZ', 'gun violence', '2020-02-16'),
	('1229135239894589440', 'Mr. Trump is running on a Mar-a-Lago economy — giveaways to corporations and rich people at the top. \n \nProviding workers a living wage and investing in education and health care is how we build real and lasting prosperity for all. https://t.co/H1yy5EpqaF', 'economy', '2020-02-16'),
	('1229161027037777923', 'You know better than anybody else what works best for your family. That’s why my health care plan starts with a choice: you can stick with private coverage, including quality plans that unions have negotiated, or you can go with a new public option. https://t.co/ERnMuoqJBX', 'health care', '2020-02-16'),
	('1229200892353605633', 'The climate crisis is not an American problem — it’s a global problem. And if we are going to solve it, we have to go back to being the moral leader in the world. We have to undo basically everything Mr. Trump has done. https://t.co/f9TECS1mme', 'climate', '2020-02-17'),
	('1229390037013450752', 'While politicians insist we waste billions propping up a corrupt govt in Afghanistan, they say we don’t have the money for education, clean water, or health care here at home. As president I’ll end these wasteful regime change wars &amp; new cold war and invest in the American people https://t.co/PhSbtvWRuR', 'health care', '2020-02-17'),
	('1229436157085278209', 'Donald Trump is the most corrupt President in modern US history. But Trump didn’t cause the rot in Washington – he’s just the biggest, stinkiest example of a system that no longer works for the people. That’s why this #PresidentsDay, I’m fighting for my bill to #EndCorruptionNow.', 'corruption', '2020-02-17'),
	('1229436157970321409', 'Presidents shouldn’t be able to own companies or hotels on the side &amp; use their office to make a fortune. My bill to #EndCorruptionNow would require the President to place his/her assets, including businesses &amp; commercial real estate, into a blind trust to be sold off.', 'corruption', '2020-02-17'),
	('1229436158893010944', 'My #EndCorruptionNow bill would make sure all govt employees – including unpaid White House staff, even family-member advisors to the President – are forced to comply with govt ethics &amp; conflict of interest rules.', 'corruption', '2020-02-17'),
	('1229436159677341696', 'The President also shouldn’t be able to put his or her lobbyist friends in charge of running federal agencies. My bill to #EndCorruptionNow slams shut the revolving door so no more coal &amp; gas lobbyists can be put in charge of protecting our clean air &amp; water.', 'corruption', '2020-02-17'),
	('1229436160579194882', 'Former Presidents &amp; other Washington bigwigs shouldn’t be able to cash in on their connections with high-powered lobbying jobs. My bill to #EndCorruptionNow would place a lifetime ban on lobbying by fmr Presidents (&amp; VPs, members of Congress, federal judges, &amp; cabinet members).', 'corruption', '2020-02-17'),
	('1229436161342496769', 'And we shouldn’t have to beg presidential candidates to see their financial interests. That’s why my bill to #EndCorruptionNow would require the IRS to release tax returns for Presidential candidates from the previous 8 years &amp; during each year in federal office.', 'corruption', '2020-02-17'),
	('1229436162160386048', 'Outside of Washington, my bill to #EndCorruptionNow seems like a no-brainer. Most people are probably shocked these rules aren’t already the law. But if we want to restore integrity to the Office of the President, we need to fight for real change to make it happen.', 'corruption', '2020-02-17'),
	('1229456718196695040', 'Corporations and government policies have concentrated air and water pollution in black and brown communities. We have to start there to make sure we address injustice. https://t.co/Z6MOgXdbRB', 'corporations', '2020-02-17'),
	('1229482372363481088', 'RT @AaronTBurgess: Hey #Reno! Come talk climate tonight with @SSteyer41 and @daveregrets from the @TomSteyer campaign. Hear why Tom has the…', 'climate', '2020-02-17'),
	('1229494474423836672', 'Americans should decide American elections. Period. House Democrats took action to protect our elections from foreign interference — it’s time Mitch McConnell and Senate Republicans do the same. https://t.co/ZjKZyL4KvX', 'McConnell', '2020-02-17'),
	('1229511826662014976', 'Education is the cornerstone of a just, democratic, and prosperous society. The fact that Mr. Trump wants to cut it by 8% is shameful.\n\nhttps://t.co/5ZGs5Ku9yC', 'education', '2020-02-17'),
	('1229543359976370176', '"The Trump administration has offered oil companies a chunk of the American west and the Gulf of Mexico that’s four times the size of California – an expansive drilling plan that threatens to...undermine global climate policy."\n\nhttps://t.co/aFm3XV25SH', 'climate', '2020-02-17'),
	('1229556475153960962', 'Great to be in Greenville, SC talking to voters about issues like health care, racial justice, and the climate crisis. https://t.co/KsV8J6OGeV', 'health care', '2020-02-18'),
	('1229582986074476544', 'This was designed to intimidate and suppress the vote. The Confederate flag is a symbol of treason and racism.\n\nhttps://t.co/vPogoazO1U', 'Fed', '2020-02-18'),
	('1229831190955188224', 'Proof that you can fight climate change and still run a profitable business. \n\nhttps://t.co/w3aAKJtnsL', 'climate', '2020-02-18'),
	('1229842517677441024', 'President Obama asked me to oversee the Recovery Act, which saved our economy from a depression. I secured the 3 Republicans we needed to vote for it—and ran the program with almost no waste. We didn’t inherit a growing economy—we worked for it. That\'s what I\'ll do as President. https://t.co/U8eDUZKywk', 'economy', '2020-02-18'),
	('1229872343368945664', 'Nevada:\n\nIf you’re ready to make childcare and long-term care more affordable,\n\nIf you’re ready to take on Big Pharma and stand up for workers\' rights, join our campaign.\n\nWe can do this. https://t.co/4q3egItSgn https://t.co/1zNFI27Oyx', 'workers', '2020-02-18'),
	('1229893855836659712', 'The abuse of power is the defining characteristic of Donald Trump’s presidency — and Attorney General William Barr has helped facilitate it. He should resign immediately. https://t.co/FEaNfL3ZIB', 'William Barr', '2020-02-18'),
	('1229897329861259264', 'This is why I want to DOUBLE funding for pre-K through 12th grade. Education is the best investment we can make as a country.\n\nhttps://t.co/E3c9lH8yrg', 'education', '2020-02-18'),
	('1229918295379316737', 'RT @RepMcGovern: Radon is toxic &amp; causes cancer, but @HUDgov doesn’t enforce testing in federally-subsidized units or provide resources to…', 'Fed', '2020-02-18'),
	('1229924107476582400', 'Let’s be clear about what this is - waiving federal procurement laws is a way for our crooked President to steer work to his cronies under the cover of darkness. \n\nhttps://t.co/3M1BkOGN4v', 'Fed', '2020-02-19'),
	('1229938651171155968', 'Let\'s be clear: Weapons of war have no place in our communities.\n\nThat\'s why I took on the @NRA and passed a 10-year ban on assault weapons and high-capacity magazines — and I\'ll do it again as president. https://t.co/hMQvuuXtNv', 'weapons', '2020-02-19'),
	('1229947020850262016', 'A budget is always a statement of a person\'s values. Mr. Trump proposes to cut $1 trillion from health care and hollow out other programs that benefit American workers. It tells you everything you need to know about Trump\'s economy.\n\nhttps://t.co/XFNGYs2BHi', 'economy', '2020-02-19'),
	('1230116070389796864', 'Politicians say there’s no money for health care or education or clean water, yet spend trillions on regime change wars &amp; new cold war—making our families not more safe but less safe! As president, my first responsibility will always be protecting &amp; serving the American people. https://t.co/dRkOfcMaYk', 'health care', '2020-02-19'),
	('1230149010629021698', 'RT @ChrisVanHollen: It’s pretty simple: Congress should not be funding corruption. I’ve introduced a bill with @SenWarren, @MazieHirono, an…', 'corruption', '2020-02-19'),
	('1230154522175197189', '7 years ago, I walked into my first-ever Senate Banking Committee hearing &amp; asked some of the top federal banking regulators: when was the last time you took the biggest Wall Street banks to trial? (Spoiler alert: they were stumped.) https://t.co/pooATamc1I', 'banks', '2020-02-19'),
	('1230155426227986433', 'In the last 7 years, our bank regulators\' track records got worse, not better. Enforcement actions against giant banks &amp; companies have nosedived while regulators work around the clock to gut important rules that keep working families, &amp; our economy, safe. https://t.co/7dy0vpPkKA', 'economy', '2020-02-19'),
	('1230155427683471361', 'Under the Trump administration, federal bank regulators like @CFPBDirector Kraninger have stopped filing lawsuits when companies cheat consumers. The cops on the beat are only looking out for Wall Street crooks who are cheating hard-working families. https://t.co/u1jG41ocPf', 'Fed', '2020-02-19'),
	('1230155429126250496', 'We need real accountability for big Wall Street banks – and the people who run them. So on the 10th anniversary of the financial crisis, I introduced the Ending Too Big to Jail Act to put big bank executives in handcuffs when their banks break the law.', 'banks', '2020-02-19'),
	('1230155432049680386', 'I also introduced the most ambitious anti-corruption bill since Watergate to lock the revolving door between Wall St &amp; Washington. Banks shouldn\'t be able to pre-bribe employees to work for the govt &amp; regulators shouldn\'t spend their time in office auditioning for their next gig.', 'corruption', '2020-02-19'),
	('1230155433526091777', 'I didn’t come to Washington to kiss up to giant Wall Street banks &amp; their armies of lawyers &amp; lobbyists. I’m going to keep asking the tough questions &amp; fighting for accountability to make this government work for the people.', 'banks', '2020-02-19'),
	('1230185483583381504', 'We must stop prioritizing the needs of oil and coal companies over our own citizens who are being devastated by the effects of climate change. \n\nhttps://t.co/05MmZJfEQZ', 'climate', '2020-02-19'),
	('1230206739909230592', '.@GavinNewsom is right: CA is in a housing crisis. It wasn’t created overnight and won’t be solved overnight, but under my administration, the federal government will step up with resources and urgency to ensure that every American has access to affordable housing #SOTS', 'Fed', '2020-02-19'),
	('1230209185930833920', 'I will always fight for workers. Proud of the work @Culinary226 is doing to demand fair wages and contracts in Las Vegas. https://t.co/Nju9jSdD7b', 'workers', '2020-02-19'),
	('1230212905515339776', 'More than half of hourly workers get their schedules with less than a week’s notice &amp; hours can fluctuate 40-70% each month. That makes it nearly impossible to go to school, get child care, &amp; pay the bills. That’s why @RosaDeLauro &amp; I have the #SchedulesThatWork Act. https://t.co/cwFiWHzv8Z', 'workers', '2020-02-19'),
	('1230213351285936130', 'My #SchedulesThatWork Act would set some ground rules for retail, fast food, &amp; other hourly workers’ schedules:\n❌ Workers should get their schedule 2 weeks in advance\n❌ No retaliation for requesting schedule changes\n❌ Workers have a right to rest between shifts', 'workers', '2020-02-19'),
	('1230213354117042178', 'America’s workers have always had to fight for economic fairness &amp; basic human dignity on the job. A minimum wage. Workplace safety protections. A 40-hour workweek. Now it’s time to fight for #SchedulesThatWork.', 'economic', '2020-02-19'),
	('1230260151132667905', 'I stand in solidarity with the Station Casinos workers fighting for a fair contract in Las Vegas at The Palms. When unions are strong, America is strong. I will continue to fight for workers’ rights alongside @culinary226, @teamsters, and everyone united in this effort. https://t.co/0E8SKo2kKW', 'workers', '2020-02-19'),
	('1230296495485665282', 'Better for the environment and cost-competitive. Green technology can spark our economy.\n\nhttps://t.co/b16AodhIKg', 'economy', '2020-02-20'),
	('1230318507008589824', 'Lots of people on stage talked about health care tonight. I’m the only one who’s gotten anything done. #DemDebate', 'health care', '2020-02-20'),
	('1230319377108488194', 'RT @timjhogan: Well, this is the longest two paragraphs I\'ve ever read. \n\nHere\'s a link to Amy\'s comprehensive health care plan we can actu…', 'health care', '2020-02-20'),
	('1230319588568522752', 'RT @factcheckdotorg: Elizabeth Warren claimed that Amy Klobuchar\'s health care plan is two paragraphs long. Warren is wrong. https://t.co/h…', 'health care', '2020-02-20'),
	('1230320164790513665', 'RT @TeamJoe: Let’s not forget — @JoeBiden has helped pass major, history-making health care legislation. Obamacare was, and still is, a B.F…', 'health care', '2020-02-20'),
	('1230327966636421120', 'I visited the Techren solar facility. Let me tell you: Nevada gets it. Solar facilities like this one are powering our transition to clean energy and creating jobs in the process. We\'ve got to transition to a clean energy economy. #DemDebate https://t.co/Go3jYCqz1f', 'economy', '2020-02-20'),
	('1230328886036062208', 'I was proud to have passed a constitutional ballot measure in Nevada that raised the state’s energy portfolio to 50 percent renewables by 2030.\n\nI\'m the ONLY candidate who will make tackling the climate crisis my top priority. #DemDebate', 'climate', '2020-02-20'),
	('1230329893277224960', 'The hard-working people of @culinary226 have health care plans that have been negotiated over time. The same is true for so many Americans right now. There are 149 million Americans that would lose their current health insurance under Medicare for All. #DemDebate https://t.co/5ZVpshVHsu', 'health care', '2020-02-20'),
	('1230337178409897985', 'RT @StopBigMoney: #DemDebates: @amyklobuchar points out Mitch McConnell has 400 bills on his desk — including #HR1, the biggest anti-corrup…', 'McConnell', '2020-02-20'),
	('1230343732341248000', 'We need to send Mitch McConnell packing. #DemDebate https://t.co/fdwez9CP1z', 'McConnell', '2020-02-20'),
	('1230365966573293569', 'Action can’t wait when it comes to gun safety reform, health care, and immigration. We need a leader with the proven ability to unite the country and get big things done. https://t.co/j2tm7WXw42', 'health care', '2020-02-20'),
	('1230539861343506432', 'We are in a climate emergency — and every day that Donald Trump remains in the White House further threatens the future of our planet. https://t.co/TAcciLRhrD', 'climate', '2020-02-20'),
	('1230541135933771778', 'I’ve been a soldier for 17 years &amp; deployed twice to the Middle East. As president, I will focus our military on national security threats we face &amp; work to end the new cold war &amp; regime change wars which have not made us any safer &amp; waste precious resources. #StandWithTulsi https://t.co/rBQnAg0VuP', 'national security', '2020-02-20'),
	('1230543720480509954', 'Massive student loan debt is preventing young people (and even their parents) from living the life that they want. When I\'m president, borrowers will have protections against abusive practices—a borrower\'s bill of rights.\n\nhttps://t.co/9HpUWGKn6O', 'debt', '2020-02-20'),
	('1230556776791076864', 'Poll taxes are wrong. I am happy to see a federal court struck down Republican efforts to disenfranchise voters.\n\nhttps://t.co/dM4lQhCP3L', 'Fed', '2020-02-20'),
	('1230560554395193344', 'MA has some of the country’s strongest gun safety laws, but the federal govt must step up to help keep our communities safe. I’m glad to fight alongside @stophandguns for my comprehensive #EndGunViolenceBill to tackle the gun violence crisis head-on. https://t.co/wiqQami0fJ', 'gun violence', '2020-02-20'),
	('1230578644160065537', 'The Trump admin is selling out our public lands &amp; coasts because they work for their former &amp; future Big Oil clients. We should protect our nation’s natural treasures, invest in a clean energy future, &amp; tackle the climate crisis head-on. That’s why we need a #GreenNewDeal. https://t.co/0FUokcIISV', 'climate', '2020-02-20'),
	('1230585032818991104', 'Last night, we didn’t talk about gun violence. We’re not going to solve this crisis by ignoring it — or by nominating a candidate with a history of caving to the NRA.\n\nBernie Sanders has voted against the Brady Bill FIVE times.', 'gun violence', '2020-02-20'),
	('1230588964752375809', 'We need to send Mitch McConnell packing. https://t.co/FR7haQsX5w', 'McConnell', '2020-02-20'),
	('1230601523006017536', 'Health care is a right. I support @Culinary226 workers having the ability to keep their hard-won benefits. \n\nhttps://t.co/NT55xv5otb', 'health care', '2020-02-20'),
	('1230603701355765777', '2/3 of part-time retail workers want full-time work, but corporations keep them part-time to skimp on wages &amp; benefits. My Part-Time Worker Bill of Rights would make big companies offer available hrs to their part-time workers before hiring new employees. https://t.co/CAzXuZMST7', 'workers', '2020-02-20'),
	('1230604931767447552', 'Rep. Pete Aguilar has built a reputation as someone who can reach across the aisle to solve problems. He has helped lead the fight on climate change, gun violence and fixing our immigration system. \n\nI’m proud to have his support. @AguilarCampaign https://t.co/hxkkijcU3K', 'gun violence', '2020-02-20'),
	('1230619943730896898', 'Last night’s debate took place blocks away from the site of the deadliest mass shooting in American history — where a lone gunman took 58 precious lives and injured hundreds of others. Yet there were zero questions about how we end our gun violence epidemic. It was unacceptable.', 'gun violence', '2020-02-20'),
	('1230619946306211847', 'We have to take on the @NRA and pass real reform to end our gun violence epidemic. That starts with universal background checks, a ban on assault weapons, and holding gun manufacturers accountable.\n\nI\'ve beaten the gun lobby twice — and I\'ll do it again as president.', 'gun violence', '2020-02-20'),
	('1230633684904169472', 'In 2005, Bernie voted for an NRA-backed law that gave gun makers sweeping immunity from legal action, killed several pending state and local lawsuits and led, according to the Brady Campaign to Prevent Gun Violence, to a “deadly decade of unchecked gun industry negligence.”', 'gun violence', '2020-02-20'),
	('1230637332786663424', 'Donald Trump is WILLING to cover up the truth that Russia is attempting to secure his reelection — because Donald Trump WANTS to win at any cost, even if it means working with our enemies.\n\nhttps://t.co/OLKmBDQgkK', 'Russia', '2020-02-20'),
	('1230646817286692865', 'I’ve led the fight to hold corporate executives accountable – just ask the last 2 CEOs of @WellsFargo. Wall St won’t change until execs know that they may face jail time when their big banks scam customers &amp; break the law. That’s what my Ending Too Big to Jail Act is all about. https://t.co/jIETdssGrs', 'banks', '2020-02-21'),
	('1230659549092175873', 'Roger Stone tried to establish a backchannel with Wikileaks because the Trump campaign wanted him to. He lied about it to protect the president, got caught, and sentenced to jail. Pardoning Stone would be straightforward corruption.\n\nhttps://t.co/SypcW0sCVf', 'corruption', '2020-02-21'),
	('1230677552039186432', 'I’ve sat there and looked in the eyes of parents who lost their kids to gun violence. They want to be able to sue these gun manufacturers. We should let them. https://t.co/thL9G6IPvy', 'gun violence', '2020-02-21'),
	('1230694886007021568', 'Climate change is not a future problem. It is a problem right now.\n\nhttps://t.co/sbkjvvdx4d', 'climate', '2020-02-21'),
	('1230711923324280832', 'The gross neglect of #PuertoRico has to stop. That’s why I’m proud to endorse the @Pwr4PuertoRico proposal to restore PR’s economy, address its debt crisis, eliminate poverty, and advocate for an exemption to the #JonesAct. https://t.co/38oQaBrxWV', 'economy', '2020-02-21'),
	('1230873281227567114', 'The US should work with our allies to peacefully prevent Iran from developing a nuclear weapon. Instead, the President withdrew from a successful nuclear deal &amp; risked starting a war. I’m cosponsoring @SenMarkey’s bill to reject another Middle East war. https://t.co/wHzGOAkf2A', 'nuclear', '2020-02-21'),
	('1230889288742711296', 'Trump said he was protecting our farmers. So let’s see what’s he’s done:\n\n-Average farm income at near 15-year low\n\n-Farm bankruptcies at 8-year high\n\n-US Farm debt at all-time high\n\n-Lost 10% of Wisconsin dairy farms \n\n-Tariffs cost pig farmers $1.5B a year \n\nNice work, Donald. https://t.co/3MYqzljJiK https://t.co/RR1wh9BA0A', 'debt', '2020-02-21'),
	('1230890354519498755', 'If I’d been on the debate, I’d have brought up 2 extremely important issues which @DNC/@MSNBC &amp; other candidates failed to address. #1) Coronavirus: a huge health &amp; economic threat to our country/world. #2) Critical time-sensitive foreign policy crises on the verge of erupting.', 'economic', '2020-02-21'),
	('1230906394276065280', 'Russia is attacking our democracy again and instead of doing everything he can to stop it, Donald Trump is retaliating against our intelligence officials for doing their jobs. This must stop.\n\nhttps://t.co/mSKiq3LHgn', 'Russia', '2020-02-21'),
	('1230916479337598978', 'America\'s teachers and school personnel have been forced to make ends meet with too little pay and too few resources to educate our kids. That\'ll change in my administration.\n\nThank you @AFTunion and @rweingarten!', 'teachers', '2020-02-21'),
	('1230925592356360192', 'Leaders need foresight. As I warned, those who demanded impeachment to advance their own political interests have put the country at risk by carelessly helping Trump, whose approval rating is the highest since he took office. https://t.co/i5tfSP6tqQ', 'impeachment', '2020-02-21'),
	('1230933959371976704', 'Experience matters. I’m the only one in this race who has gotten anything big done when it comes to health care. As president, I’ll build on Obamacare to ensure every American receives the quality, affordable care they deserve. https://t.co/hIPeFEpFKW', 'health care', '2020-02-21'),
	('1230942468662685696', 'Americans deserve a President who is focused on a health care plan to lower premiums. As President, I’ll get it done. https://t.co/6uVujkoCsg', 'health care', '2020-02-21'),
	('1230970000371937285', 'Even Trump’s top economist knows that the president’s trade war hurt the economy. \n\nhttps://t.co/l16MbztA2B', 'economy', '2020-02-21'),
	('1230978907719053312', 'I agree with @EricLesser &amp; the @BostonGlobe: East-West rail is an important investment to grow our economy &amp; help working families in Western MA &amp; across the Commonwealth. Let’s get this done. https://t.co/TyVGVdRLAQ', 'economy', '2020-02-21'),
	('1231016632757182465', 'The Justice Dept &amp; SEC’s settlement with @WellsFargo barely puts a dent in the bank’s $12 billion profits from the fake accounts scam. When big banks can break the law, pay a fine, consider it the cost of doing business, &amp; go back to life as normal, nothing changes. Nothing.', 'banks', '2020-02-22'),
	('1231016638461415425', 'Giant banks won’t stop cheating until execs fear jail time &amp; regulators show some backbone – &amp; I have a bill for that. My Ending Too Big to Jail Act will hold executives personally accountable for their banks’ fraud &amp; helps regulators enforce the law. Congress should pass it now.', 'banks', '2020-02-22'),
	('1231020978089709568', 'Visited with @Culinary226 workers at Mandalay Bay here in Las Vegas this morning! Culinary has helped over 18,000 immigrants become American citizens. Their work is remarkable and what the American Dream is all about. https://t.co/At25iTzwyB', 'workers', '2020-02-22'),
	('1231031604350509061', 'We need to build a people-powered economy, fueled by strong unions, fair wages, and worker benefits. Stand up with me to fight for that tomorrow by standing in my corner. Doors open tomorrow at 10:00 a.m. You must be in line by noon to participate.', 'economy', '2020-02-22'),
	('1231040367224426496', 'Anyone who is serious about protecting our elections from foreign interference should help me pass my Securing America\'s Elections Act: https://t.co/8yHvTv1qm6\n#RussianInterference #StandWithTulsi', 'Russia', '2020-02-22'),
	('1231043007601922050', 'A hurtful move, but not surprising from this administration which continues to erode collective bargaining rights. Government should lead by example, and that starts with treating workers fairly—especially those dutifully serving our country. https://t.co/iHg6jyDfl3', 'workers', '2020-02-22'),
	('1231048162804105217', 'RT @Mike2020: Mike has a proven climate action track record:\n🌎Pioneered the most comprehensive sustainability plan in the country as NYC ma…', 'climate', '2020-02-22'),
	('1231072253737132032', 'For too long, workers have suffered under Republican policies designed to confine the majority of this country’s wealth to only the richest pockets. Workers need a seat at the table as we reimagine a prosperous, healthy America together. https://t.co/W0SQwa8zjF', 'workers', '2020-02-22'),
	('1231261869983199232', 'For too many people across the country, the daily scourge of gun violence has turned normal into a living nightmare. It has to end. I’ve taken on the @NRA and won — twice. And I’ll do it again as president to end our gun violence epidemic. https://t.co/wznJj1HfLD', 'gun violence', '2020-02-22'),
	('1231349285809205248', 'Justice Sotomayor is right to sound the alarm. If Trump wins in November, the Supreme Court essentially will become a rubber stamp for his assault on immigrants, health care and equality.\n\nThe stakes couldn\'t be higher. https://t.co/UrGNyjXAa2', 'health care', '2020-02-22'),
	('1231384320964726785', 'It belongs to students and entrepreneurs, to veterans and Culinary workers. To people of every religion and no religion who agree that God does not belong to a political party in the United States.', 'workers', '2020-02-23'),
	('1231384879776092160', 'I believe we can defeat Trump and deliver for the American people by empowering the American people to make their own health care choices with Medicare for All Who Want It.', 'health care', '2020-02-23'),
	('1231385069396336641', 'I believe that we can bring an end to corporate recklessness and rebalance our economy by empowering workers, raising wages, and insisting that those who gain the most must contribute the most in order to keep the American dream going forward.', 'economy', '2020-02-23'),
	('1231385754904997888', 'Senator Sanders is ignoring, dismissing, or even attacking the very Democrats we absolutely must send to Capitol Hill in order to keep Nancy Pelosi as Speaker, in order to support judges who respect privacy and democracy, and in order to send Mitch McConnell into retirement.', 'McConnell', '2020-02-23'),
	('1231420352036823041', 'Russia may not have a political party in our country, but they’ve picked their candidate: Trump. As voters, we can send the most powerful message of all by winning by a big enough margin to send Trumpism and its Russian backing to the dustbin of history. https://t.co/UaV6umgHRE', 'Russia', '2020-02-23'),
	('1231435772554883074', 'To the students, veterans, culinary workers, DREAMers, and those\nwondering whether this country will ever be their own: this is your\ncampaign. \n\nWe\'ve built a movement around a new kind of politics with nearly 1 million supporters, and this is just the start. https://t.co/GIHp45Xi85', 'workers', '2020-02-23'),
	('1231650433787219970', 'As usual, Trump\'s plan to make America great helps corporations and targets workers. \n\nhttps://t.co/4ML39SxuzD', 'workers', '2020-02-23'),
	('1231662862856310786', 'The American people are sick and tired of a corrupt administration that is undermining American democracy.\n\nThey are sick and tired of a government based on greed and lies.\n\nIt is time for an administration based on racial, social, economic and environmental justice.', 'economic', '2020-02-23'),
	('1231685159881203717', 'Over 100 million Americans with pre-existing conditions live in fear that their health care will be taken away from them. \n\nI promise you I will not let that happen — we will protect and build on Obamacare. https://t.co/vyx4BaiRs7', 'health care', '2020-02-23'),
	('1231686847136501760', 'To end generations of systematic discrimination, we must build Black wealth in our country. Here\'s how we’ll do it: https://t.co/Qc65g93o8M https://t.co/kvAcXAJRv3', 'discrimination', '2020-02-23'),
	('1231722158830817280', 'RT @PeteForAmerica: Teachers like Misael know how much a zip code shapes a student’s educational opportunities. @PeteButtigieg will work to…', 'education', '2020-02-23'),
	('1231747367977787393', 'Our movement is working to build an America where there is no such thing as an uninsured family. An America where one job is enough. An America where future generations aren’t ravaged by a climate crisis. \n\nBut we need your help to keep building.\nhttps://t.co/NGyFBgneQf', 'climate', '2020-02-24'),
	('1231783667929878535', 'This president likes to talk about a booming economy, but American workers know that he’s wrong. Our economy must work for everyone—and as president, I will guarantee your right to a living wage and strong union rights. https://t.co/jlUVFoYzMI', 'economy', '2020-02-24'),
	('1231920963043749889', 'As president, I’ll make sure government is able to negotiate lower drug prices for Medicare, refocus our nation’s health care on prevention and wellness, and end the pay to play culture in Washington that allows Big Pharma to corrupt politicians and rip off the American people. https://t.co/nm267Q255s', 'health care', '2020-02-24'),
	('1231955724642799616', 'Trump and his Republican friends gave over a trillion dollars in tax breaks to the top 1% and large corporations.\n\nI don\'t think the top 1% and corporations like Amazon need any more breaks.\n\nI think we should cancel all student debt and invest in the needs of working people.', 'debt', '2020-02-24'),
	('1231984583333289985', 'I’ve been criticized for being an "alarmist" on climate change.\n\nYou’re damn right I’m alarmed.\n\nClimate change is a major national security threat and a global emergency.\n\nThat is why we have the boldest plan to address it of any campaign in history. https://t.co/WD4sO5tCSB', 'national security', '2020-02-24'),
	('1231995711400615936', 'The budget for this newspaper is a pittance in the scheme of things. This President\'s war on the free press continues.  \n\nhttps://t.co/fXc8cHzzvk', 'budget', '2020-02-24'),
	('1232000454000816130', 'Katherine Johnson was a true American hero and pioneer in math and science. Her legacy and incredible achievements in the face of racial and gender discrimination will never be forgotten. https://t.co/Pl8uoBwCO5', 'discrimination', '2020-02-24'),
	('1232014427937034240', 'Other countries around the world understand the importance of child care, early education, and family leave.\n\nIt is long past time for the United States to join them.\n\nRead our plan for free child care and pre-K for all:\nhttps://t.co/zELo98fzEY', 'education', '2020-02-24'),
	('1232026195996368897', 'Mental health care is health care. No one should be barred from accessing it because of their income. That\'s why it\'s covered under Medicare for All.', 'health care', '2020-02-24'),
	('1232036664199012353', 'This thread shows why we cannot maintain the status quo of our profit-driven health care system.\n\nEven "good" insurance doesn\'t protect Americans from the endless greed of private health insurance companies.\n\nWe must end this inhumanity and pass Medicare for All. https://t.co/WWzG28K13a', 'health care', '2020-02-24'),
	('1232043772222926850', 'I am proud to have the support of leaders like @JillianDURM who are fighting for economic justice in their communities. Together we are going to guarantee decent, affordable housing and a living wage for all our people. https://t.co/u1rk8gaWEu', 'economic', '2020-02-24'),
	('1232049385879543808', 'I stand with Denver airport workers who organized with @SEIU. Workers stood together, won raises, and voted to join @SEIU105. I hope to see @United honor their choice. https://t.co/5tAvEixrJo', 'workers', '2020-02-24'),
	('1232057200631320576', 'We do not need a nominee who profits from private equity vultures and the destruction of the planet.\n\nWe need someone who is willing to stand up for workers and will stop the greed of the fossil fuel industry.\n\nUnlike Mr. Bloomberg, as president, that\'s exactly what I will do. https://t.co/Qsz8gRAxZ8', 'workers', '2020-02-24'),
	('1232062291627167744', 'We can’t have a nominee who has voted to:\n- Block the Brady Bill 5 times\n- Allow guns on trains and planes \n- Protect gun manufacturers from lawsuits\n- Prohibit funding for research into stopping gun violence\n\nUnlike Bernie Sanders, I will always take the fight to the gun lobby.', 'gun violence', '2020-02-24'),
	('1232067018637090822', 'With such a high risk of an oil spill under the Great Lakes, Michigan can’t afford to keep the Line 5 pipeline in operation. In every community, we need new clean energy solutions to meet our climate crisis. https://t.co/NWZRwA30BO', 'climate', '2020-02-24'),
	('1232081056582467584', 'As president, I will rebalance our economy so it works for all Americans, hold Wall Street and corporations accountable, and bring fairness to our tax system so we can lift millions out of poverty and into greater opportunity. https://t.co/uT86SGoaIV', 'economy', '2020-02-24'),
	('1232087418137870337', 'Trump believes in tax breaks for billionaires.\n\nI believe in investing in the working people of America.\n\nWe will tax the extreme wealth of the top 0.1% so we can invest $1.5 trillion to guarantee free, quality child care and early education for all.', 'education', '2020-02-24'),
	('1232097506290524161', 'Our students did everything we told them to: they worked hard &amp; went to college. Now they’re getting crushed with student debt. This system is badly broken – especially for students of color – that’s why @WhipClyburn &amp; I introduced our #CancelMyDebt bill. https://t.co/gWXjE5cTcH', 'debt', '2020-02-25'),
	('1232097786545496065', '@WhipClyburn Our #CancelMyDebt bill would cancel student debt for 42 million Americans &amp; take meaningful steps to close the racial wealth gap. I’m grateful to work with @WhipClyburn to finally end this crisis. https://t.co/gp6cJfAtxq', 'debt', '2020-02-25'),
	('1232101049525325824', 'Some of our economy’s problems are pretty simple. Workers need to be paid more for their hard work. I’m proud to continue standing alongside McDonald’s workers in South Carolina in the #Fightfor15 and a union to protect them. https://t.co/ux0k5ULhgn', 'economy', '2020-02-25'),
	('1232109961326612480', 'The future of our planet is at stake in this election. If we don’t take immediate action, the national security threat will be “catastrophic, and likely irreversible.” Let’s save the world, and do it together.\n\nhttps://t.co/YXGAqtFk3h', 'national security', '2020-02-25'),
	('1232119269824942080', 'This election is about more than just beating Donald Trump. It’s about:\n\n- Replacing Betsy DeVos with an actual educator\n- Having an Attorney General who defends the Constitution, not the president\n- Ensuring our EPA Administrator believes climate change is an existential threat', 'climate', '2020-02-25'),
	('1232127501826129921', 'Is raising the minimum wage to $15/hour radical?\nIs making sure kids can get a higher education radical?\nIs making health care a right like every other major country radical?\nIs addressing the existential threat of climate change radical?\n\nThe American people don\'t think so. https://t.co/svwkJQ8JhM', 'health care', '2020-02-25'),
	('1232127515096952832', 'Hair discrimination is racial discrimination. I salute the Virginia legislature for passing this law to prohibit discrimination based on hair style. It’s time for Washington to show such courage and finally pass the CROWN Act.  https://t.co/PWuqZa9Ojs', 'discrimination', '2020-02-25'),
	('1232130587324014593', '“U.S. Intelligence official overstated assessment of Russian efforts to help Trump.” @FoxNews @GreggJarrett They supposedly told Crazy Bernie that Russia was looking at him, not me. This is all a big scam between Intel and the Democrats. They want Bernie OUT, &amp; hate “Trump”.', 'Russia', '2020-02-25'),
	('1232138314976616449', 'Senator Sanders has identified the problem with our economy, but his solutions are wrong. Unchecked capitalism has failed, but the answer is not a forced government takeover of a large section of the American economy. (1/2)', 'economy', '2020-02-25'),
	('1232138315790372866', 'Instead, we need to end the corporate takeover of our government, make sure the people write the rules and not the wealthy and big corporations, and unlock the innovation and competition of the American economy. (2/2)', 'economy', '2020-02-25'),
	('1232142007084232704', 'People should not have to go tens or hundreds of thousands of dollars into debt to get an education. That is why I will fight to cancel student debt with a modest tax on Wall Street speculation. #CNNTownHall https://t.co/Iri1PRW6R0', 'education', '2020-02-25'),
	('1232147035081539584', 'It’s hard enough to be in high school without having to worry about whether you’re safe from gun violence. #CNNTownHall https://t.co/QIBiCdaGzn', 'gun violence', '2020-02-25'),
	('1232152601833152518', 'Federal funding should never be used to discriminate. Ever. #CNNTownHall https://t.co/69PPEKIywv', 'Fed', '2020-02-25'),
	('1232158575230717952', 'Where’s the Commander-in-Chief when the country’s under attack by Russia? https://t.co/nsnM6PMsoo', 'Russia', '2020-02-25'),
	('1232164461613465600', 'To get climate right, let’s start with listening to communities of color. Climate is a science issue. Climate is a human issue. Climate is a racial issue. Where people can’t breathe, can\'t drink the water, are Black and brown communities. https://t.co/sWq0SuMZAT', 'climate', '2020-02-25'),
	('1232166104509734912', 'The reason we have gun violence in this country is because gun manufacturers don\'t want us to solve gun violence. https://t.co/gU8XBiN3rl', 'gun violence', '2020-02-25'),
	('1232292177692315651', 'RT @Judgenap: Roger Stone judge\'s bias may have jeopardized entire trial...\nhttps://t.co/KBUjgjHHZw', 'Roger Stone', '2020-02-25'),
	('1232304804820467714', 'Cryin’ Chuck Schumer is complaining, for publicity purposes only, that I should be asking for more money than $2.5 Billion to prepare for Coronavirus. If I asked for more he would say it is too much. He didn’t like my early travel closings. I was right. He is incompetent!', 'Schumer', '2020-02-25'),
	('1232327346633486336', 'We’ve got some serious problems that the Senate should be tackling. Student debt. Opioids. Gun violence. Climate change. Instead, the @SenateGOP has decided to vote once again on a radical &amp; restrictive 20-week abortion ban bill. https://t.co/rDR8VmYkuF', 'gun violence', '2020-02-25'),
	('1232327557363748864', 'The year is 2020, not 1920. We\'ve lived in a world of back-alley butchers &amp; wrecked lives – where backward-looking ideologues tried to interfere with personal &amp; basic health care decisions. We are not going back – not now, not ever. https://t.co/cNlOHGZQxW', 'health care', '2020-02-25'),
	('1232337466595651587', 'California is having its driest February in 150 years. For those who argue that climate change is not a kitchen table issue, ask Californians who have had  their homes and businesses destroyed by wildfires, if they care.\n\nhttps://t.co/hvyjlvdS0k', 'climate', '2020-02-25'),
	('1232343786212220928', 'Bernie has been weak on gun safety his entire career. He’s voted against background checks. He voted to give gunmakers immunity. He’s received help from the NRA. \n\nThis is not the record of someone who will save our country from gun violence. https://t.co/FGncp9Fk1Z', 'gun violence', '2020-02-25'),
	('1232353870912770048', 'Educators in North Carolina are part of a nationwide struggle for the survival of public schools and for the children and families who rely on it.\n\nI\'m proud to fight with them to make high-quality public education a right, not a privilege. https://t.co/a7pn9feOIs', 'education', '2020-02-25'),
	('1232379813979185152', 'When Antarctica is melting at the clip of an inch a day during its heat wave, do you still think you have room to say this isn’t a climate emergency?\n\nhttps://t.co/K5SQGHuWQc', 'climate', '2020-02-25'),
	('1232380483889238019', 'Outdated federal marijuana laws prevent vets who work in a state’s legal cannabis industry from getting VA-backed home loans &amp; immigrants who work in a state’s legal cannabis industry from getting citizenship. I have bipartisan bills to fix both problems. https://t.co/DPFce9klOK', 'Fed', '2020-02-25'),
	('1232388045619519493', 'The average male breadwinner needs 53 weeks of wages to cover his family\'s basic expenses. The average female  needs 66 weeks. Republicans who think this economy is strong — and fair to women — must have forgotten how many weeks there are in a year. \n\nhttps://t.co/hBdQAwxRbJ', 'economy', '2020-02-25'),
	('1232395209125707776', 'There has rarely been a juror so tainted as the forewoman in the Roger Stone case. Look at her background. She never revealed her hatred of “Trump” and Stone. She was totally biased, as is the judge. Roger wasn’t even working on my campaign. Miscarriage of justice. Sad to watch!', 'Roger Stone', '2020-02-25'),
	('1232398638892146693', 'Now that China is not objecting to the G20 describing climate change as a financial risk, it\'s finally a global consensus. Oh wait, except for us. \n\nhttps://t.co/7kELO7g9rG', 'climate', '2020-02-25'),
	('1232413468030095361', 'I am proud to have the endorsement of @OsopePatrisse. Together, we will pass Measure R, end the criminalization of poverty in California, and stop corporations from profiting off the suffering of incarcerated people and their families.', 'corporations', '2020-02-25'),
	('1232420003149824003', 'RT @jaketapper: CNN: US intelligence briefer appears to have overstated assessment of 2020 Russian interference, from ⁦@JDiamond1⁩ ⁦@Zcohen…', 'Russia', '2020-02-25'),
	('1232425414632640516', 'We must confront the history of government-led housing discrimination in this country. My affordable housing bill will help Black families buy homes &amp; build wealth, so we can take the first step to closing the racial wealth gap. https://t.co/A9c3xciD7r', 'discrimination', '2020-02-25'),
	('1232435626760294402', 'For a full year, Mitch McConnell has refused to take up #HR8, which would help curb gun violence. Tens of thousands were killed and wounded while he did nothing. @senatemajldr — the blood is on your hands. Stop sitting on them and #EndGunViolence', 'McConnell', '2020-02-25'),
	('1232436436638433281', 'On the debate stage tonight, I hope we get a chance to talk about something I\'ve dedicated my life to: ending gun violence. https://t.co/HjFb5nA2vw', 'gun violence', '2020-02-25'),
	('1232439528108908546', 'RT @SenSherrodBrown: President Trump promised to fight for workers, but he keeps helping his corporate buddies get away with mistreating wo…', 'workers', '2020-02-25'),
	('1232445619219755009', 'The @michigandaily Editorial Board understands this election will impact nearly every aspect of our nation\'s future, especially for young people who are facing the existential threat of climate change and outrageous student debt. Thank you for your support! https://t.co/jsmxN76fgi', 'climate', '2020-02-25'),
	('1232460769926602752', 'Ban assault weapons.\n\nEnact universal background checks.\n\nHold gun manufacturers accountable.\n\nEnd our gun violence epidemic.', 'gun violence', '2020-02-26'),
	('1232460810972041217', 'RT @SenTinaSmith: 1) Before Trump, the President’s national security team had a point person to coordinate on outbreaks like Coronavirus. T…', 'national security', '2020-02-26'),
	('1232463133555322884', 'Tonight is about who can beat Trump and who can do the job. \n\nI’ve shown I can beat Trump -- on guns and climate, and in the 2018 midterms. And I’m the only one with a proven record of successfully governing one of the most complex cities in the world. \n\n#DemDebate', 'climate', '2020-02-26'),
	('1232472433719836672', 'The economy is doing great for Mr. Bloomberg and other billionaires. But for ordinary Americans things are not good:\n\n45 million people have student debt.\n34 million are uninsured.\n500,000 people are sleeping on the street.\n\nWe are going to create an economy for all. #DemDebate', 'economy', '2020-02-26'),
	('1232472832539602944', 'Russia is trying to help Bernie become the Democratic nominee because they know it will help Trump win again in 2020. It’s that simple. https://t.co/gtme6gjrBY', 'Russia', '2020-02-26'),
	('1232473251378536449', 'Our economy should work for more than Mr. Bloomberg and other billionaires. It should work for all our people. #DemDebate https://t.co/oU8NjidcCG', 'economy', '2020-02-26'),
	('1232473833010937856', 'I don’t believe that a government takeover of large parts of the economy makes any sense for working families. We need to present an alternative to Donald Trump that includes a vibrant, competitive private sector. #DemDebate https://t.co/4j1TQGOBuB', 'economy', '2020-02-26'),
	('1232474541596626944', 'Unlike Mr. Bloomberg, I’m not a good friend of President Xi, the authoritarian leader of China. #DemDebate', 'China', '2020-02-26'),
	('1232476125399355393', 'RT @IBEW: “The #IBEW will keep pressing for the day when no working person has to fight for decent health care, but our members won’t give…', 'health care', '2020-02-26'),
	('1232477397384982530', 'RT @fred_guttenberg: Thank you @JoeBiden for opening the debate on the issue of gun violence.  We need to force this conversation.  That wa…', 'gun violence', '2020-02-26'),
	('1232478648365535232', 'RT @nowthisnews: Klobuchar: Sanders\' spending plans would amount to \'three times the American economy. Not the federal government. The Amer…', 'economy', '2020-02-26'),
	('1232482218779533313', '30 years ago I likely lost a race for Congress because I supported a ban on assault weapons. We need to do what the American people want, not what the NRA wants. #DemDebate https://t.co/4ioZWJdVrQ', 'weapons', '2020-02-26'),
	('1232482449776529408', 'Senator Sanders at one point said his health care plan was going to cost $40 trillion, then it was $30 trillion, then it was $17 trillion. \n\nI’ll tell you what it adds up to: 4 more years of Donald Trump. #DemDebate\n\nhttps://t.co/RwDvSEr3oj https://t.co/YR0gj24vcW', 'health care', '2020-02-26'),
	('1232482601950011394', 'When it comes to the crisis of gun violence, there’s no debate: No one has done more to confront the NRA than I have. \n\nI built a grassroots movement to pass common sense gun safety laws. I’ve taken on the gun lobby — and won.\n\n#DemDebate', 'gun violence', '2020-02-26'),
	('1232484820275515392', 'The best thing we can do to support public education is to support public educators. #DemDebate', 'education', '2020-02-26'),
	('1232485026031230976', 'Everyone in America knows we have too much gun violence. And it’s because the gun manufacturers own the Senate. That’s why I support term limits—to keep Congress out of the pockets of corporations. #DemDebate https://t.co/NQhbcoVPkC', 'gun violence', '2020-02-26'),
	('1232485326834237440', 'Improving education is the only way to fix poverty and change children\'s’ lives. \n\nIn New York, rather than just talk about it, we did it. \n\nI raised raised teacher salaries by 43% and graduation rates by 42%.\n\n#DemDebate https://t.co/Tn5BP0fdyB', 'education', '2020-02-26'),
	('1232487335771570176', 'My first effort as a county council member was doing away with redlining — and I didn’t stop there. I\'ve fought against housing discrimination my entire career. #DemDebate', 'discrimination', '2020-02-26'),
	('1232487354876780547', 'I have long supported the assault weapons ban and I have won every race in a proud hunting state.\n\nHaving someone who can lead the ticket, win in the middle of the country and bring people with her is the way we will get gun safety legislation done. #DemDebate https://t.co/qA1QG8wZiY', 'weapons', '2020-02-26'),
	('1232488484163612672', 'Weapons that are anything remotely like what I trained on have no business being sold anywhere near an American school, church, or neighborhood. #DemDebate https://t.co/NTftfG6plW', 'weapons', '2020-02-26'),
	('1232488864012308480', 'Every policy area touches on race. I started a bank to correct injustice in financial services, and help to make loans to Black-owned, Latino-owned and women-owned businesses. But if we are going to correct historic economic injustice, we must support reparations for slavery. https://t.co/7WBa6Ci1XU', 'economic', '2020-02-26'),
	('1232489767981309954', 'I don’t agree with putting hard-earned taxpayer money into rich kids going to college.\n\nWe need to look where the needs are in our economy. We’re going to have a million openings for home health care workers—particularly in rural areas—that we don’t know how to fill. #DemDebate', 'economy', '2020-02-26'),
	('1232493680079933440', 'We gotta make it clear: China must play by the rules. #DemDebate', 'China', '2020-02-26'),
	('1232496059194073088', 'RT @sunrisemvmt: .@BernieSanders is right:\n\nThe climate crisis is our greatest national security threat.\n\nLet’s treat it like one, and mobi…', 'national security', '2020-02-26'),
	('1232496083202269184', 'Let’s be clear: Russia is engaging in interference in this election right now, as we speak. #DemDebate', 'Russia', '2020-02-26'),
	('1232496471477350401', 'The biggest threat to America right now in terms of the safety of our citizens is the climate crisis and it’s time for us to deal with it. #DemDebate https://t.co/7WTEJmxpxM', 'climate', '2020-02-26'),
	('1232496655754240003', '"I said this to President Castro in Cuba. Look you\'ve made great progress in educating young people...Medical care. The life expectancy of Cubans is equivalent to the United States despite it being a very poor country because they have access to health care." – President Obama https://t.co/pKDzvo3YpO', 'health care', '2020-02-26'),
	('1232498990656016384', 'RT @greenpeaceusa: .@TomSteyer has pledged to end giveaways to the fossil fuel industry and put people on the frontlines of environmental i…', 'environment', '2020-02-26'),
	('1232505640968478720', 'When everyone around you is shouting about health care reform but you\'re the only one who has gotten anything big done. https://t.co/e8T3kN5Mhb', 'health care', '2020-02-26'),
	('1232558211103772672', 'Russia wants him to win! https://t.co/bNUeIsqmQX', 'Russia', '2020-02-26'),
	('1232558272038572032', 'RT @LouDobbs: Controlling the Pandemic: Dr. Anthony Fauci says travel restrictions from China puts America a step ahead of Coronavirus outb…', 'China', '2020-02-26'),
	('1232559470980415488', 'RT @NextRevFNC: .@KayleighMcEnany: "You can\'t beat President Trump who\'s breaking records  in polling, breaking records in economic satisfa…', 'economic', '2020-02-26'),
	('1232669592503377922', 'For generations, Asian Americans and Pacific Islanders have been integral to our nation’s progress—often in spite of mistreatment and discrimination. Today, I\'m proud to release my comprehensive policy to address barriers and empower the AAPI community. https://t.co/awi1UkRdCq', 'discrimination', '2020-02-26'),
	('1232710491060887552', 'Criminal justice reform. Health care as a right. A living wage. Free, universal child care. Tuition-free higher education. These are not radical ideas. They\'re what the American people want. Live in North Charleston: https://t.co/0miII7S8wi', 'health care', '2020-02-26'),
	('1232710899456249858', 'When I say I\'ll fight climate change, I mean it. \n\nAs mayor, I cut NYC’s carbon footprint and achieved the city’s cleanest air in 50 years. \n\nWhen Trump pulled out of the Paris Agreement, I mobilized a coalition to uphold America’s obligations. \n\nI don’t just talk. I #GetItDone.', 'climate', '2020-02-26'),
	('1232724607997743111', 'There is never an excuse for racism, bullying, or ignorance. I stand with the AAPI community in condemning these vile attacks. That’s why I’ve called for vigorously enforcing federal laws against hate crimes and working with schools to stop bullying. https://t.co/zphWrpB0Oi', 'Fed', '2020-02-26'),
	('1232740760065323011', 'I don\'t think it\'s radical to say schoolchildren should not have "lunch debt." If we can give tax breaks to billionaires we can guarantee free, universal school meals to all our kids.', 'debt', '2020-02-26'),
	('1232743236063678465', 'RT @SaraCarterDC: Court Rules Trump Admin Can Withhold Federal Grants From Sanctuary Cities https://t.co/QJnYQv8jYX via @SaraCarterDC', 'Fed', '2020-02-26'),
	('1232745435166584837', 'Trump’s new acting intelligence director is an unqualified hack willing to risk our national security to sell out to foreign powers. My bill to #EndCorruptionNow  would ban Americans like Richard Grenell from getting paid to lobby for foreign govts. https://t.co/pePETpK1cN', 'corruption', '2020-02-26'),
	('1232758324631875584', 'The fights for climate justice and workers\' rights are linked, and I\'m proud to support the janitors of @SEIU26 and the leaders of @MNclimatestrike as they strike together this Thursday. https://t.co/UO9zfIuf9O', 'climate', '2020-02-26'),
	('1232760616554680320', 'Trump is running budget deficits like a drunken casino owner, but he cut money to protect against global pandemics. \n \nI wonder how well the wall will keep out coronavirus? #budgetpriorities\n\nhttps://t.co/ocb63PoSE2', 'budget', '2020-02-26'),
	('1232765103193214976', 'The billionaire class has never had it so good. It\'s time for an economy and a government that work for working people so that all Americans can live in dignity. Join us live in Myrtle Beach: https://t.co/Z2JUrSMtqI', 'economy', '2020-02-26'),
	('1232769604549795840', 'These are the kind of bipartisan solutions we need to bring broadband access to all rural Americans—and bringing local perspective to the White House will help make this a federal priority. https://t.co/Snrk8lm8w9', 'Fed', '2020-02-26'),
	('1232780170697859074', 'The evidence is clear: we can’t wait to take action on climate change. We have to get Donald Trump out of the White House and tackle this crisis head-on. The survival of our planet depends on it. https://t.co/dGrNxYizHG', 'climate', '2020-02-26'),
	('1232796201029906433', 'I’m a union guy and always have been. I stand with @UFCW — and as president, I’ll invest in American workers.\n\nWe need to protect good American jobs and make sure our economy works for all Americans. https://t.co/1U8mj9DYTQ', 'economy', '2020-02-26'),
	('1232798784104673281', 'Finally, over 100 years since the first anti-lynching bill was introduced in Congress, we stood together, Democrats and Republicans, to pass the Emmett Till Anti-lynching Act, designating lynching as a federal hate crime. https://t.co/RQmEbTNLgs', 'Fed', '2020-02-26'),
	('1232812588032876544', 'In 1994, I took on the @NRA to pass a 10-year ban on assault weapons and high-capacity magazines. The ban saved lives — and Republicans should have never let it expire.\n\nAs president, I’ll ban them once again. We will get these weapons of war out of our communities. https://t.co/4ciJQTNxvR', 'weapons', '2020-02-26'),
	('1232813868231069696', 'Thinking of of the families of the victims and co-workers at Molson Coors tonight. Yet another tragic case of gun violence. Enough.  https://t.co/4jEVrpQUPq', 'gun violence', '2020-02-26'),
	('1232815296232247297', 'While details are still emerging in Milwaukee, this much is clear: We mourn another devastating tragedy. My heart goes out to all who lost loved ones. May we find the strength and will to act against gun violence, and never accept the unacceptable.', 'gun violence', '2020-02-26'),
	('1232821366002290688', 'My plan for gun safety:\n- Ban assault weapons\n- Background checks for all gun sales\n- Pass a strong Red Flag law\n\nThis will make an enormous difference in keeping American’s safe.', 'weapons', '2020-02-27'),
	('1232826930916974597', 'We need a vaccine that is available to all, not just those who can afford it.\n\nLet me be clear: it has never been more important to finally guarantee health care as a human right by passing Medicare for All. 3/3', 'health care', '2020-02-27'),
	('1232827313471049729', 'We all agree climate change is killing our planet. I have a record of actually doing something about it. \n\nI cut NYC’s carbon footprint, closed more than half our country’s coal plants and mobilized cities and states to uphold the Paris Agreement. \n\n#CNNTownHall', 'climate', '2020-02-27'),
	('1232851279162073089', 'I taught constitutional law for a long time and here\'s the deal: No amendment is absolute. There are limits.\n\nCommon-sense reforms like background checks and a ban on assault weapons are not a violation of the Second Amendment. Period.', 'weapons', '2020-02-27'),
	('1232852910859603968', 'Scientists say we have 11 years to avoid climate catastrophe. But for Puerto Rico, the time to act was yesterday.\n\nI am committed to meeting our climate crisis head-on while also building resiliency in communities already experiencing the effects of climate change. https://t.co/uzHG0MJQIG', 'climate', '2020-02-27'),
	('1232853309146435585', 'As President to take on coronavirus I would make sure we have adequate medical help and research, ensure we have invested in education (because the next vaccine or cure is with a college student at your college), and keep the CDC strong. https://t.co/rtttw2A7XL #CNNTownHall', 'education', '2020-02-27'),
	('1232856782168641536', 'Donald Trump\'s economy works well for his friends at Mar-a-Lago, but making things more affordable should be the focus of a President.\n\nHe failed to bring pharma prices down.\n\nHe failed to make college more affordable.\n\nHe failed to invest in our infrastructure. #CNNTownHall', 'economy', '2020-02-27'),
	('1232859203938680832', 'Domestic violence affects an individual victim, but it also affects a whole community.\n\nWhen we look at gun violence laws, we have to respond to the mass shootings and hate crimes, but we also have to make sure we’re looking at solutions for everyday gun violence. #CNNTownHall https://t.co/AmuE67kOIi', 'gun violence', '2020-02-27'),
	('1232859259915948034', 'RT @CNNPolitics: Undecided voter: “Why should we vote a president, who is so successful on the economy, out of office?”\n\nAmy Klobuchar: “Be…', 'economy', '2020-02-27'),
	('1232859648195063809', 'If I were president today, I would not be taking China\'s word when it comes to the coronavirus. American scientists and health experts should be allowed in the country to determine how the virus started and to help contain its spread. https://t.co/uSgkV7WUG8', 'China', '2020-02-27'),
	('1232874260068290560', 'What does the future look like if we do not get our act together?\n\nLook at Australia burning before our eyes.\n\nLook at the unprecedented wildfires in California.\n\nLook at the increasing number of climate refugees around the world.\n\nA Green New Deal is our moral responsibility.', 'climate', '2020-02-27'),
	('1233051272992915461', 'Coronavirus poses a serious health, diplomatic, &amp; economic threat, &amp; we must be prepared to confront it head-on. So I’m introducing a bill to transfer all funding for @realDonaldTrump\'s racist border wall to @HHSGov &amp; @USAID to combat coronavirus. https://t.co/8IEhBWRjeL https://t.co/9oAF0A2lGT', 'economic', '2020-02-27'),
	('1233060447336771584', 'The first responsibility of our leaders should be to protect the health, safety, &amp; security of the American people. This is why we’ve temporarily suspended flights from China, and must now do the same for Japan and S. Korea to prevent the spread of coronavirus https://t.co/XOWurzE9Wt', 'China', '2020-02-27'),
	('1233073788050259969', 'We\'re here in North Carolina to send a powerful message to the billionaire class: You cannot have it all. We will defeat Donald Trump and create an economy that works for all of us. Live in Winston-Salem: https://t.co/CnvIueudzA', 'economy', '2020-02-27'),
	('1233088146218287104', '40% of part-time workers want more hours, but big companies cut hours to save money. I’m proud to work with @janschakowsky on a bill to empower part-time workers to take care of their families. Watch the House announcement of the Part-Time Worker Bill of Rights. https://t.co/hifScYr3CJ', 'workers', '2020-02-27'),
	('1233109828421201925', 'It\'s been a whole year since the House passed the Bipartisan Background Checks Act. Day after day, week after week, people are dying of gun violence – including yesterday in Milwaukee – &amp; still @SenateMajLdr won’t hold a vote on a bill 90% of Americans support. It\'s shameful.', 'gun violence', '2020-02-27'),
	('1233109830442868738', 'Why won’t @SenateMajLdr hold a vote on universal background checks? Corruption, plain &amp; simple. Senator McConnell is too scared of the @NRA &amp; their army of lobbyists &amp; lawyers to act. The @SenateGOP needs to show some political courage &amp; stop blocking a vote on this bill.', 'McConnell', '2020-02-27'),
	('1233109837694763009', 'Let\'s get real: background checks are the very least we can do to keep our kids &amp; communities safe from gun violence. We should be doing a lot more. That’s why I’ve got an #EndGunViolenceBill that combines &amp; builds upon Congress’s best gun safety proposals in 1 big, bold bill. https://t.co/dxI7rV0OGq', 'gun violence', '2020-02-27'),
	('1233114972433022977', 'I believe in protecting Texans’ 2nd Amendment rights.\n\nI also believe 40,000 people dying from gun violence in this country every year is unacceptable.\n\nWe must take steps to save lives. We can do that without sacrificing #2A freedoms.\n\nHere’s how: https://t.co/QohWD0Pu1F', 'gun violence', '2020-02-27'),
	('1233117460670373888', 'I stand with the 2,000 nurses at @MissionHealthNC fighting to form a union with @NationalNurses. I say to @HCAhealthcare, one of the most profitable hospital corporations in the country: treat your nurses with respect and dignity, and refrain from union busting. https://t.co/zv2k1KqDbD', 'corporations', '2020-02-27'),
	('1233125144090021888', 'Texas is a place where a man is measured by his word, so here’s mine:\n\nIf you vote for me, \n\nI will defeat Donald Trump.\n\nI will fight to bring affordable health care to every American.\n\nI will continue to fight to protect our planet and address the crisis of climate change. https://t.co/fPUArGL2rl', 'health care', '2020-02-27'),
	('1233128772045561856', 'One year later, @senatemajldr is still stonewalling the bipartisan universal background check bill. It’s unbelievable. It’s time for Mitch McConnell to stand up to the @NRA, do his job, and bring the bill up for a vote. Lives depend on it. https://t.co/rFzGmuMUMf', 'McConnell', '2020-02-27'),
	('1233132397891162112', 'This is our time to build a nation based on racial, social, economic and environmental justice. If we stand together, there is nothing we cannot accomplish. Join us live in Richmond, Virginia: https://t.co/luTo5Jm2qJ', 'economic', '2020-02-27'),
	('1233141422334914574', 'A woman’s decisions about her health care should be her own to make.\n\nThat’s why I’m proud to stand with Planned Parenthood — in Texas and across the nation.\n\nIt’s what I’ve done for decades, and it’s what I’ll do as president. https://t.co/zjPAdhcNg0', 'health care', '2020-02-27'),
	('1233152086369603585', 'I salute Virginia\'s lawmakers for ensuring women\'s access to safe and legal abortion. Politicians should never be the ones dictating what health care decisions women can make over their own bodies. https://t.co/JI7YNdMn2W', 'health care', '2020-02-27'),
	('1233158947739242496', 'I’m glad that @BlackRock\'s CEO is concerned about economic risks of the #ClimateCrisis. @SenWhitehouse, @SenBooker, @ChrisVanHollen &amp; I want him to commit to take the steps in my bill to require public companies to disclose their climate-related risks. https://t.co/fylbtXikcw', 'economic', '2020-02-27'),
	('1233165752447963137', 'Trump’s wall won’t solve the real challenges Texans face:\n- Making health care more affordable\n- Ending senseless gun violence\n- Fighting climate change\n- Improving public schools\n- Creating jobs\n\nI’m running to defeat Donald Trump and #GetItDone for Texas. @TXforMike', 'gun violence', '2020-02-27'),
	('1233176754035904513', 'Happy Dominican Independence Day! The Dominican community here in the United States has made lasting contributions to our economy, culture, and our country. I proudly celebrate today with my Dominican neighbors and friends! Arriba la democracia!', 'economy', '2020-02-27'),
	('1233177492640260097', 'Donald Trump is determined to sabotage Obamacare and roll back the progress we’ve made. We can’t let him get away with it. We have to protect and build on the law to ensure every American has access to the health care they deserve. https://t.co/TxlvXDVjRs', 'health care', '2020-02-27'),
	('1233183362858176513', '#CoronavirusUSA is a tragic legacy of John Bolton\'s reckless agenda. In 2018 he closed NSC\'s Global Health Security and forced out Rear Adm. Ziemer. Leaving the White House without a pandemic response team to act in a timely manner to protect our people.\nhttps://t.co/QMbG23ze41', 'Bolton', '2020-02-28'),
	('1233193127676125184', 'It’s not enough to make health care available to all. We must make it accessible to communities who have been shut out or exploited due to systemic racism for decades. → https://t.co/E3XFZg5h9z https://t.co/K2Um9O5rS5', 'health care', '2020-02-28'),
	('1233199767808663552', 'I stand with the 4000 commercial janitors of @SEIU26. They deserve fair wages, paid sick days, and training programs that will help us address the climate crisis. We can save the world, do it together — and ensure that workers can earn a living wage. #BetterTomorrow #UnionsForAll https://t.co/VMl7ZCATI8', 'climate', '2020-02-28'),
	('1233200752497221634', 'California is on the frontlines of the climate change fight. Its iconic beauty is in jeopardy - from the Redlands to the inland deserts &amp; the beaches that carve out its coastline. \n\nWe need a president who has fought to ensure its beauty for our children. https://t.co/Udd9nChzCj', 'climate', '2020-02-28'),
	('1233207475051974656', 'The lack of affordable health care in this country can worsen a coronavirus pandemic. People avoid getting diagnosed and treated because of costs. \n\nThe President\'s health care "plan" can make this situation even worse.\n\nhttps://t.co/qM3xIPSXbq', 'health care', '2020-02-28'),
	('1233209656400588806', 'RT @PeteForAmerica: As an 8th grade Special Education teacher, Vanessa knows that we owe it to our children to give them the specialized ca…', 'education', '2020-02-28'),
	('1233215961999822849', 'Today marks the first anniversary of the passage of HR 8 -- legislation putting in place universal background checks for gun sales. But Mitch McConnell once again failed to act.\n\nIt\'s time we take action to keep Americans safe. #EndGunViolence', 'McConnell', '2020-02-28'),
	('1233220106324451328', 'Congratulations and thank you to our great Vice President &amp; all of the many professionals doing such a fine job at CDC &amp; all other agencies on the Coronavirus situation. Only a very small number in U.S., &amp; China numbers look to be going down. All countries working well together!', 'China', '2020-02-28'),
	('1233248318819573760', 'Colorado lawmakers are leading the way on climate action with HB 1261. This law will help save our planet for future generations, but only if Colorado\'s Air Quality Change Commission adopts bold climate rules—as the federal government will do when I’m president. https://t.co/Qmt8YEyoQD', 'climate', '2020-02-28'),
	('1233256774964273152', 'So, the Coronavirus, which started in China and spread to various countries throughout the world, but very slowly in the U.S. because President Trump closed our border, and ended flights, VERY EARLY, is now being blamed, by the Do Nothing Democrats, to be the fault of “Trump”.', 'China', '2020-02-28'),
	('1233273894032871424', '“Federal Court Deals Major Blow To Sanctuary Cities.” @FoxNews  In other words, there will be no more Federal Tax Dollars to States &amp; Cities that will not cooperate with Federal Law Enforcement (ICE). This is BIG NEWS! Funds will be cut off immediately. MAKE AMERICA GREAT AGAIN!', 'Fed', '2020-02-28'),
	('1233397709836619776', 'I proudly stand with the thousands of @SEIU26 janitors on strike for basic rights like fair pay, paid sick leave, and protections so their jobs don’t harm them or the environment. https://t.co/haSbyaQwsE', 'environment', '2020-02-28'),
	('1233433281598836736', 'From taking on the gun lobby to moving America forward in the fight against climate change, there’s a lot they said we couldn’t do. \n \nBut we got it done.\n \nAnd we’ll keep getting it done for the American people. https://t.co/EqzYelPUqS', 'climate', '2020-02-28'),
	('1233436751844315137', 'We should fund real coronavirus protection without harming our most vulnerable. Take it out of the wall budget, not substance abuse programs.\n\nhttps://t.co/7I1vZBDR90', 'budget', '2020-02-28'),
	('1233466191496327168', 'It’s pathetic and unacceptable that, while reports of coronavirus infection continue to grow and economic concerns rise, Donald Trump is flying around playing his own political game, traveling to South Carolina in an attempt to disrupt the Democratic primary.', 'economic', '2020-02-28'),
	('1233468857739857921', 'The data are clear: there are massive racial disparities in our federal student loan system for Black, Latino, &amp; Native students. @SenKamalaHarris, @SenBooker &amp; I want @usedgov to do its job &amp; protect students of color by enforcing our civil rights laws. https://t.co/z3725XU6k2', 'Fed', '2020-02-28'),
	('1233479419672563712', 'Trump is attacking the health care of Oklahomans. I am running to stop him.\n \nDefeating Donald Trump will be a victory for the well-being of Americans across the nation.\n \nTogether, we can get it done.\n \n@OKForMike https://t.co/64N2HQouHE', 'health care', '2020-02-28'),
	('1233491405869342724', 'No patient should be sued, go into debt or go bankrupt for the "crime" of getting sick. We must remove the greed from our corporate health care system, pass Medicare for All and eliminate outstanding medical debt. https://t.co/Bi4YXOoNGR', 'health care', '2020-02-28'),
	('1233494360634908672', 'Issues like Coronavirus are different from traditional national security threats. The virus doesn\'t care what country it\'s in—it can\'t be stopped by a wall. Today’s security challenges, whether in global health, cyber security, or election security, require a focus on the future. https://t.co/eWOMGnM785', 'national security', '2020-02-28'),
	('1233497248589340673', 'Alexandria is a @NCforMike field organizer in Raleigh. Her story is what our campaign is fighting for: equality &amp; justice.\n\nAs president, I promise to protect the Transgender community from discrimination and hatred.\n\nJoin our coalition #ProudforMike: https://t.co/pXp6cBQfhR https://t.co/LLqtIhdmnU', 'discrimination', '2020-02-28'),
	('1233504586956230656', 'We need to have a frank conversation about race in this country. Every single policy area — education, criminal justice, housing — has a gigantic subtext of race. \n \nI’m running to fight for economic justice, racial justice, and to save our climate.', 'economic', '2020-02-28'),
	('1233510001840394240', 'Iran has the most coronavirus deaths outside China. Although US sanctions exempt humanitarian items, I’m concerned that in practice sanctions may be limiting access to basic medical supplies to help the Iranian people. I want info from @USTreasury &amp; @StateDept. https://t.co/TEDSL1PMKV', 'Iranian', '2020-02-28'),
	('1233510551919251456', 'I\'m honored to receive the support of the members of @704afge who are under attack from a climate change-denying president. \n\nTogether, we will lead the fight against the global emergency of climate change and protect the future of our planet for our children and grandchildren. https://t.co/gDdD8cb0GS', 'climate', '2020-02-28'),
	('1233510939720175616', 'Monica\'s story is the story of far too many in our country — and a solemn reminder of the cost of our inaction. No parent should lose their child to an act of gun violence. We have to end this epidemic. https://t.co/MBQ5iPQoHE', 'gun violence', '2020-02-28'),
	('1233511136349298689', 'Donald Trump says he loves Maine.\nI doubt he could find it on a map.\nBut he\'s found ways to attack their health care and increase their drug prices.\nMy plan will cover everyone and protect the 150M people who want to keep their private insurance.\nLet’s #GetItDone. \n@MaineforMike https://t.co/eG0p3uxSBf', 'health care', '2020-02-28'),
	('1233511334907650051', 'RT @PeteForAmerica: .@PeteButtigieg’s Douglass Plan will fight racial injustice in health care by funding and empowering local communities…', 'health care', '2020-02-28'),
	('1233520666290401281', '"Reckless claims by anonymous officials that Russia is \'helping\' @BernieSanders are deeply irresponsible. I am calling on all presidential candidates to condemn any interference in our elections by out-of-control intelligence agencies." Read more: https://t.co/Qkvp61O463', 'Russia', '2020-02-28'),
	('1233542922584428544', 'Coronavirus not only threatens our global health – it also threatens the global economy. I’ve requested information from 5 Too Big to Fail banks about how they’re monitoring &amp; managing this financial risk. https://t.co/C56nZOofgL', 'economy', '2020-02-29'),
	('1233542925461704710', 'Coronavirus may close businesses &amp; hurt supply chains, tourism, travel, &amp; many economic factors. Closed businesses have problems repaying loans. Working families have a right to know what big banks are doing to keep our economy safe.', 'economy', '2020-02-29'),
	('1233549854258925573', 'This is disgraceful. All workers deserve the right to bargain and strike for better wages and benefits. To Janet Napolitano and @UCSC: stop this outrageous union busting and negotiate in good faith. https://t.co/oaQGTovOdW', 'workers', '2020-02-29'),
	('1233551471779700741', 'RT @JenniferWexton: .@JoeBiden knows that rebuilding &amp; investing in our federal agencies must be a top priority.\n\nWhether it\'s getting soci…', 'Fed', '2020-02-29'),
	('1233557748387729408', 'For too many people across the country, normal has become a living nightmare. We can’t go on like this any longer. We have to end our gun violence epidemic. https://t.co/kyZlysST0a', 'gun violence', '2020-02-29'),
	('1233562237702414336', 'When only 1 in 3 African Americans who need mental health care receives it, it’s critical that we have the leadership of advocates like @Chirlane. I’m proud to receive her support and look forward to working with her to bring mental health care to all. https://t.co/7RyrhgxNit', 'health care', '2020-02-29'),
	('1233565046938058757', 'When we say we are going to make higher education accessible to all, that means substantially investing in HBCUs and making them tuition-free. https://t.co/lCixjpFAgh', 'education', '2020-02-29'),
	('1233569584030081026', 'Just finished up a great rally in Nashville!\n\nWe can bring this country together and ignite voters in this fight against Donald Trump by focusing on an optimistic economic and justice agenda. https://t.co/tlFcB3QQu8', 'economic', '2020-02-29'),
	('1233578004137164800', 'Slavery and institutional racism have robbed generations of African-American families the ability to acquire economic wealth. We need to answer for the harm it has done. Reparations are overdue.\n\nhttps://t.co/LarORYZtLm', 'economic', '2020-02-29'),
	('1233740452182024193', '.@realDonaldTrump needs to make it clear to NATO and Erdogan that the United States will not be dragged into a war with Russia by the aggressive, Islamist, expansionist dictator of Turkey, a so-called “NATO” ally. #StandWithTulsi https://t.co/Fbjv7m3jcm', 'Russia', '2020-02-29'),
	('1233754693421215744', 'So-called “right-to-work” laws have 1 goal: to gut unions &amp; stop workers from fighting for better wages &amp; benefits. I’m glad to work with @BradSherman on a bill to ban state “right-to-work” laws &amp; protect workers’ right to join a union. https://t.co/G34xbQpiOM', 'workers', '2020-02-29'),
	('1233776187547308035', 'President Trump &amp; his Big Oil buddies want to allow offshore drilling in more than 90% of our coastal waters. We can’t put coastal communities at risk of another devastating oil spill. We need to build a clean energy future, protect families, &amp; tackle the #ClimateCrisis head-on. https://t.co/dCINIWlUsA', 'climate', '2020-02-29'),
	('1233792665923268610', 'RT @briebriejoy: Touring HBCUs with this campaign has been one of the highlights of this experience. \n\nStudent debt shouldn’t be the bigges…', 'debt', '2020-02-29'),
	('1233808503912968194', 'Thank you, Marie.\n\nClimate change is an existential threat to America and the world. I’ve been fighting for our environment for decades. I’m running because I know how to solve the problem. https://t.co/WjTQAkdzgZ', 'climate', '2020-02-29'),
	('1233841670099218433', 'We license car owners. We should license gun owners. We need to end gun violence NOW.', 'gun violence', '2020-02-29'),
	('1233844568757501952', 'I’m proud to lead the fight in the Senate to protect &amp; expand Social Security. This isn’t just about economics – this is about our values. And we believe that after a lifetime of hard work, Americans are entitled to retire with dignity. https://t.co/RPy2xUT316', 'economic', '2020-02-29'),
	('1233852852243750913', 'I trust and value the scientists who dedicate their lives to making our country and world a healthier place.\n\nAs president, I\'ll invite back former scientists who were pressured to resign or let go from the federal government during Trump’s administration. https://t.co/rBzeFr7iG2 https://t.co/F9kPlgfIzd', 'Fed', '2020-02-29'),
	('1233861106701099008', 'This is wrong. \n\nWe need to make sure we are investing in K-12 education – especially in our rural communities.\n\n\n\nhttps://t.co/O5xwp9Jek9', 'education', '2020-02-29'),
	('1233894099192692736', 'It’s a great day to vote for the leader who will take immediate action on climate change, and beat Donald Trump in November.\n \nIf you haven’t done it yet, go vote South Carolina! https://t.co/Ngd2zmYRjF', 'climate', '2020-02-29'),
	('1233895282099851270', 'Trump was briefed on coronavirus two months ago.\n\nNow, he calls it a hoax.\n\nIt’s not just that he’s bad at leading - he is incapable of leading. https://t.co/shxGN5ue3d', 'Fed', '2020-02-29'),
	('1233898903248015360', 'Housing is a central issue in our campaign.\n\nIf people have a stable place to live and don\'t need to move around because of economic issues, we can solve a lot of problems.\n\nThank you to @rolandsmartin for having me on your show. https://t.co/uUdA1QByns', 'economic', '2020-02-29'),
	('1233949720697036800', 'Thank you @TomSteyer for running a campaign to bring the crisis of climate change to the forefront of our national conversation. I look forward to working together to defeat Donald Trump in November.', 'climate', '2020-03-01'),
	('1233951593252311041', 'From climate change to racial justice — @TomSteyer has dedicated his life to making progress on some of the most pressing issues of our time. His presence will continue to be felt in the race, and I look forward to working alongside him to get Donald Trump out of the White House.', 'climate', '2020-03-01'),
	('1233951704149889024', 'Thanks @TomSteyer for what you brought to this campaign. Your crusade to make climate change the #1 issue changed minds &amp;will change policy. Your ideas will endure &amp; I loved standing next to you at the debate (&amp; thanks for letting me borrow your pen when mine exploded on stage).', 'climate', '2020-03-01'),
	('1233958163218489344', 'I got into this race to fight for racial, climate, and economic justice. I will continue that fight, and do everything I can to support the eventual nominee. I thank all of you for your support and love throughout the campaign. Join me in doing whatever it takes to beat Mr. Trump https://t.co/8loWV87cS3', 'economic', '2020-03-01'),
	('1233958992440963072', '.@TomSteyer, thank you for your passion and your advocacy. This election has been made better by your voice on climate change and strengthening our democracy. I look forward to working with you to defeat Donald Trump and chart a new path for our country.', 'climate', '2020-03-01'),
	('1234100826676908036', '.@realDonaldTrump instead of going to war with Russia and Syria in order to protect the al-Qaeda-Turkish alliance, you should focus on the war against the Coronavirus. #StandWithTulsi https://t.co/Uk7TGeF1km', 'Russia', '2020-03-01'),
	('1234131222206521345', 'I\'m honored to receive the endorsement of Black scholars and educators who are fighting for justice and freedom for Black Americans. Together, we will work to end racism in all its forms and achieve racial and economic justice for all. https://t.co/QC2ZsI2OWu', 'economic', '2020-03-01'),
	('1234132901010300932', 'You know why the billionaire class and political establishment are getting nervous?\n\nWe just raised $46.5 million in February.\n\nOur average donation: just $21.\n\nOur top donor occupation: teachers.\n\nWhen working people stand together there is nothing we cannot accomplish.', 'teachers', '2020-03-01'),
	('1234152454436139019', '“In God we trust. Everyone else bring data.”\n\nThis has been the guiding principle of my life’s work.\n\nUnlike Trump, I believe in science. I respect facts. I honor the truth. And I’m proud to have the support of dozens of America’s most esteemed scientists. https://t.co/fJrsYfuS24', 'data', '2020-03-01'),
	('1234155073279856641', 'I stand with all the leaders and advocates in Michigan working to protect LGBTQ+ people from discrimination. As President, I will help pass the Equality Act, and with your courage and activism we can create a community where we all belong. https://t.co/zWojV4C8i1', 'discrimination', '2020-03-01'),
	('1234167516676665350', 'Our message to young people:\n\nIf you can\'t afford to go to college or are deeply in debt, join us.\n\nIf you\'re worried about climate change, join us.\n\nIf you\'re earning less money than the previous generation and think you deserve a decent standard of living, join us. https://t.co/JMNh0omp3z', 'climate', '2020-03-01'),
	('1234169049573134337', '13 newspapers, from coast to coast and north to south, have endorsed me and our campaign’s optimistic economic agenda. As we travel across the country, we are meeting people where they are, bringing them with us, and building a big coalition to defeat Trump in 2020. https://t.co/fDKJr5dn6T', 'economic', '2020-03-01'),
	('1234178141960245253', 'Private equity firms gutted retail chains like Shopko, Toys “R” Us, &amp; Fairway, killing jobs &amp; hurting workers. My #StopWallStreetLooting bill would protect workers’ jobs, pensions, &amp; severance &amp; hold private equity responsible for the companies they buy. https://t.co/E3Sui4ODLH', 'workers', '2020-03-01'),
	('1234184532527546369', 'When we have 500,000+ people in America sleeping out on the street and our people can\'t afford health care, we\'ve got to invest in this country, not in endless wars.', 'health care', '2020-03-01'),
	('1234222094210211846', '“Who better than @RepRatcliffe, who got to the bottom of the FISAGATE &amp; RUSSIAGATE HOAX. It makes a lot of sense to put John Ratcliffe in there (DNI).The Senate should quickly approve him. @DevinNunes @MariaBartiromo  John will do a great job for the American people!', 'Russia', '2020-03-01'),
	('1234226974316474370', 'We are a multigenerational movement.\n\nWe are a multiracial movement.\n\nWe are a movement of millions of people who are sick and tired of grotesque income and wealth inequality.\n\nWe are a movement of millions of people demanding social, racial, economic and environmental justice.', 'economic', '2020-03-01'),
	('1234231176849772545', 'RT @thehill: JUST IN: Warren presses big banks on preparation for coronavirus fallout https://t.co/2ynXckpKCx https://t.co/bnve2yuCJ3', 'banks', '2020-03-01'),
	('1234281145598169088', 'If your state votes Tuesday, show up to vote for a Green New Deal. Vote to make health care a right. Vote to abolish cash bail. Vote to cancel all student debt. Vote for universal free child care. Vote for disability rights.\n\nTogether, that\'s what we will accomplish.', 'health care', '2020-03-02'),
	('1234291525061877764', 'The coronavirus is spreading. Concern is growing. The economy has taken a hit. \n\nTonight, I’m addressing the nation because Donald Trump has yet again failed to lead. \n\nI’ve led in crises before. As president, I’ll trust the science and let the experts do their jobs. https://t.co/NHzT3fY3UK', 'economy', '2020-03-02'),
	('1234317901110358018', 'I’ve met with thousands of Texans who care about our country and our future. \n\nThey want affordable health care, a healthy planet, and an immigration system that works.\n\nWe can get that done. But to do it, we need your help.\n\nJoin @TXforMike here: https://t.co/xKbFS03gNu https://t.co/mMbR745nZ1', 'health care', '2020-03-02'),
	('1234462291652993032', 'I was criticized by the Democrats when I closed the Country down to China many weeks ahead of what almost everyone recommended. Saved many lives. Dems were working the Impeachment Hoax. They didn’t have a clue! Now they are fear mongering. Be calm &amp; vigilant!', 'impeachment', '2020-03-02'),
	('1234496899891286018', 'No other Democrat has created more than 450,000 jobs.\n\nNo other Democrat has my record of standing up to the gun lobby.\n\nNo other Democrat has my record of fighting climate change. \n\nNo other Democrat will defeat Donald Trump. https://t.co/9hjNpOcPWb', 'climate', '2020-03-02'),
	('1234497829298679809', 'As usual, Jay Powell and the Federal Reserve are slow to act. Germany and others are pumping money into their economies. Other Central Banks are much more aggressive. The U.S. should have, for all of the right reasons, the lowest Rate. We don’t, putting us at a.....', 'banks', '2020-03-02'),
	('1234500784513044481', 'RT @HeatherGautney: Teachers in Utah and the @ParkCityEA are fighting for decent wages, adequate classroom supplies—and as the state ranks…', 'teachers', '2020-03-02'),
	('1234523138819526659', 'One of my very first Senate hearings was on raising the minimum wage. Seven years later, housing, child care, health care, &amp; college costs have all gone up, but we still haven’t raised the federal minimum wage since 2009. It\'s way past time for the Senate to give workers a raise. https://t.co/HADzC1uHHB', 'health care', '2020-03-02'),
	('1234532172956078080', 'Our country owes a debt to those who protect our freedom.\n\nFor too long, that debt has gone unpaid.\n\nOur veterans should be able to come home and find good jobs and quality health services. \n\nWe can get that done. Here’s how: https://t.co/limzb1K4Bi https://t.co/E3Dp6EHSSc', 'debt', '2020-03-02'),
	('1234534690238889991', 'Like me, @BenMcAdams knows that we\'ll need to work together to fix Washington. We\'ve learned the hard way that no president can do it alone.\n\nIf we want to pass things like affordable health care, we are going to have to work across the aisle and a real leader in the White House. https://t.co/q0IwT3UVIt', 'health care', '2020-03-02'),
	('1234537462573211649', 'Donald Trump has halted American progress. We need a leader with real solutions to issues like health care, climate change, and gun safety. I’ve been training for this job for 20 years. \n\nI’m honored to have earned the @BostonHerald’s endorsement. https://t.co/UDYGecZTLI', 'health care', '2020-03-02'),
	('1234575424010805248', 'In December, I joined @SenTomCotton, @SenatorRomney, &amp; Senator Kaine in asking the @DeptofDefense about the national security risks posed by America’s reliance on China for pharmaceutical products – a problem that coronavirus has magnified in recent weeks. https://t.co/Wnmp0i42d5', 'national security', '2020-03-02'),
	('1234575431761829890', 'I also joined @SenFeinstein on a bipartisan letter calling on @HHSGov to establish clear guidelines for how state &amp; local governments will be reimbursed for costs related to assisting the federal coronavirus response. https://t.co/AKaAL2piKP', 'Fed', '2020-03-02'),
	('1234575440011984901', 'I wrote to @Citi, @JPMorgan, @GoldmanSachs, @BankofAmerica, &amp; @MorganStanley – 5 Too Big to Fail banks – &amp; requested info on how they’re monitoring &amp; managing the coronavirus threat to the global economy. https://t.co/C56nZOofgL', 'economy', '2020-03-02'),
	('1234575441945645058', 'I asked the @StateDept &amp; @USTreasury for assurances that US sanctions are not preventing basic medical supplies from reaching the people of Iran, who are suffering one of the worst coronavirus outbreaks outside of China. https://t.co/gxSiZeQAYa', 'Iran', '2020-03-02'),
	('1234575443413684230', 'The time for the Trump admin to prepare for the coronavirus outbreak should\'ve been months ago &amp; we can’t afford to waste more time. I’ll keep using every tool in my toolbox as a US Senator to make sure our federal govt has an effective response to this public health crisis.', 'Fed', '2020-03-02'),
	('1234576773943156737', 'Government can work for the people if the right leaders are in place. \n\nWhen I was mayor, we improved health care, fixed a broken school system, and cut crime by 32%.\n\nI know that government can improve people’s lives - because when I ran NYC, that’s exactly what we did. https://t.co/SvxTzSeruL', 'health care', '2020-03-02'),
	('1234580487282151424', 'My commitment to reducing gun violence is not about guns. It’s about the lives that gun violence destroys and cuts short. It’s about our children, and their futures. https://t.co/5h5ZDzV0RG', 'gun violence', '2020-03-02'),
	('1234591960058486784', 'The US financial market just had its worst week since the 2008 crisis, &amp; the @FederalReserve must be ready to respond. But the President’s Fed nominee told me she’s “not yet familiar” with the post-crisis rules that keep our banks safe. What could possibly go wrong? https://t.co/Ppzxbmri3d', 'banks', '2020-03-02'),
	('1234591962025558016', 'The Fed is the world’s most important bank &amp; board members must be prepared for the job on Day 1. Judy Shelton’s statements raise serious questions about her understanding of the Fed &amp; commitment to its mission. The Senate must protect the US economy &amp; reject her nomination.', 'economy', '2020-03-02');


-- ************************************************************************************************
-- Part C
-- ************************************************************************************************


-- #1 JOIN OF AT LEAST 3 TABLES
-- Purpose: Retrieves the candidate name of all candidates who have made a tweet,
--			their party name, their unique Twitter ID, the unique tweet ID associated 
--			with each post and the tweet content string.
--
-- Expected: A results table with all candidate who have made a tweet with
--			columns "Candidate Name", "Party", "Twitter ID", "Twitter Post ID",
--			and "Content".
SELECT C.candidate_name AS "Candidate Name", C.party AS "Party", C. twitter_id AS "Twitter ID", T.twitter_post_id AS "Twitter Post ID", TC.tweet_string AS "Content"
FROM candidates As C 
JOIN tweets AS T 
ON  C.twitter_id = T.twitter_id
JOIN tweet_content AS TC
ON T.twitter_post_id = TC.twitter_post_id
ORDER BY C.candidate_name ASC;

-- #2 NESTED QUERY USING ANY OR ALL
-- Purpose: Retrieves any data associated to keywords whose strength (count) is greater than 20.
-- Expected: A results table of all data that points to keywords who pass 20 > condition.
SELECT keyword AS "Keyword", COUNT(keyword) AS "Count"
FROM tweet_content
WHERE keyword = ANY (SELECT keyword
							FROM tweet_content
							GROUP BY keyword
							HAVING COUNT(keyword) > 20)
GROUP BY keyword
ORDER BY COUNT(keyword) ASC;

-- #3 CORRELATED NESTED QUERY 
-- Purpose: Returns the most popular hashtag that has been used recently. 
-- Expected: A table that shows current (recent) tweets, the date each 
--			 tweet was made, the associated keyword, and the tweet content.
--			 Columns should be "Date Created", "Keyword", and "Content".
SELECT tweet_date  AS "Date Created", keyword AS "Keyword", tweet_string AS "Content"
FROM tweet_content 
WHERE tweet_date IN (SELECT tweet_date
FROM tweet_content
WHERE tweet_date > 20200215
ORDER BY  tweet_date DESC);


--  #4 FULL JOIN 
-- Purpose: Retrieve all candidates' names with their unique tweet post IDs. 
-- Expected: A results table with all candidates' names and their associated
--			individual tweet IDs. Columns should be "Candidate Name", "Twitter Post ID".
SELECT C.candidate_name AS "Candidate Name", T.twitter_post_id AS "Twitter Post ID"
FROM candidates AS C 
LEFT JOIN  tweets AS T 
ON  C.twitter_id=T.twitter_id
UNION
SELECT C.candidate_name, T.twitter_post_id AS "Twitter Post ID"
FROM tweets AS T
RIGHT JOIN candidates AS C
ON T.twitter_id=C.twitter_id;


-- #5 NESTED QUERY WITH UNION, EXCEPT OR INTERSECT
-- Purpose: Identifies who has made posts within the Twitter search
--			depth about any topic.
-- Expected: A results table of candidates whom at least made a post
--			that had been correlated with any keywords.
SELECT candidates.candidate_name AS "Candidates with Posts"
FROM tweets, candidates
WHERE EXISTS (SELECT twitter_id 
FROM candidates
UNION
SELECT twitter_id
FROM tweets)
GROUP BY candidate_name;


-- #6 NON-TRIVIAL QUERY 
-- Purpose: Basic required functionality for the program where all tweet data
--			shall be retrieved associated with a supplied keyword and a current
--			(recent) date range.
-- Expected: A results table with all data from tweet_content associated with
--			the supplied keyword.
SELECT *
FROM tweet_content
WHERE keyword = 'economy' AND tweet_date > 20200225;


-- #7 NON-TRIVIAL QUERY 
-- Purpose: Retrieve the count of tweets with the given term a candidate has made
--			to determine their popularity of the term category (ranking by keywords).
-- Expected: A results table that includes the count of every keyword in a post
--			made by a given candidate.
SELECT COUNT(keyword) AS "hoax, Klobuchar Popularity"
FROM candidates AS C
JOIN tweets AS T
ON C.twitter_id=T.twitter_id
JOIN tweet_content AS TC
ON T.twitter_post_id=TC.twitter_post_id
WHERE keyword LIKE 'economy'
AND C.candidate_name LIKE 'Amy Klobuchar';


-- #8 NON-TRIVIAL QUERY --
-- Purpose: Retrieve candidate names and tweets with the given keyword and content.
-- Expected: A results table with candidates with who has a post with the given keyword,
--			with columns "Candidate Name", "Keyword", and "Content".
SELECT C.candidate_name AS "Candidate Name", TC.keyword AS "Keyword", TC.tweet_string AS "Content"
FROM candidates AS C
JOIN tweets AS T
ON C.twitter_id = T.twitter_id
JOIN tweet_content AS TC
ON T.twitter_post_id = TC.twitter_post_id
WHERE TC.keyword = "workers";


-- #9 NON-TRIVIAL QUERY --
-- Purpose: Indentifies the number of posts made by each candidated with
--			the supplied keyword and expressed a "strength of concern"
--			count with each candidate to show how more involved they are
--			with the topic at hand.
-- Expected: A results table with each candidates' name with the keyword
--			tested and their associated "strength of concern" value which
--			is the total count of all posted made by the candidate with the
--			keyword. Columns should be "Candidate Name", "Keyword" and
--			"Strength of Concern".
SELECT C.candidate_name AS "Candidate Name", TC.Keyword AS "Keyword", COUNT(TC.keyword) AS "Strength of Concern"
FROM candidates AS C
JOIN tweets AS T
ON C.twitter_id = T.twitter_id
JOIN tweet_content AS TC
ON T.twitter_post_id = TC.twitter_post_id
WHERE TC.keyword = "economy"
GROUP BY C.candidate_name;


-- #10 NON-TRIVIAL QUERY --
-- Purpose: Indentifies candidates whom at least made a tweet with
--			the supplied keyword to show expression of minimum concern.
-- Expected: A results table with each candidates' name with columns
--			"Candidate Name".
SELECT C.candidate_name AS "Candidate Name"
FROM candidates AS C
JOIN tweets AS T
ON C.twitter_id = T.twitter_id
JOIN tweet_content AS TC
ON T.twitter_post_id = TC.twitter_post_id
WHERE C.twitter_id=T.twitter_id
AND TC.keyword LIKE 'workers'
GROUP BY C.candidate_name;


/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;


-- End of tweetrumper SQL script.