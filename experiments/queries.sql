
SELECT *
FROM wrapcache_oct4.sourceschema s, wrapcache_oct4.sourceid i
where s.tablename = i.tablename
order by s.tablename, argumentno;

SELECT *
FROM wrapcache_oct4_no.sourceschema s, wrapcache_oct4_no.sourceid i
where s.tablename = i.tablename
order by s.tablename, argumentno;

SELECT *
FROM wrapcache_oct4_no.sourceschema s, wrapcache_oct4_no.sourceid i
where s.tablename = i.tablename and url = 'http://weather.unisys.com/'
order by s.tablename, argumentno;


select tablename, count(semantictype)
from (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as a
group by tablename
order by tablename;

select tablename as at, count(semantictype)
from (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as a
group by at
order by at;


select b.tablename as tname, num_in, num_out
from
(select a.tablename, count(a.semantictype) as num_in
from (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as a
group by a.tablename) as b,
(select c.tablename , count(c.semantictype)  as num_out
from (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as c
group by c.tablename) as d
where b.tablename = d.tablename;

select tin.tablename, tin.semantictype as typein, tout.semantictype as typeout
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype;

select tout.tablename, tout.semantictype as typeout, tin.semantictype as typein
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype;

-- shows output attributes not in the input
select tout.tablename, tout.semantictype as typeout
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype
WHERE tin.semantictype IS NULL;

select distinct tout.tablename
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype
WHERE tin.semantictype IS NULL;

select distinct tout.tablename
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype
WHERE tin.semantictype IS NULL and tout.tablename like 'dir%' and tout.semantictype like '%Name%';

select distinct tout.tablename, tout.semantictype as typeout
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype
WHERE tin.semantictype IS NULL and tout.tablename like 'dir%' and tout.semantictype not like '%Name%';

-- shows output attributes not in the input, excluding FullName in the directory tables
select distinct tout.tablename
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4_no.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype
WHERE tin.semantictype IS NULL and tout.tablename like 'dir%' and tout.semantictype not like '%Name%';

select tout.tablename, tout.semantictype as typeout
FROM (SELECT distinct tablename, semantictype FROM wrapcache_oct4.sourceschema where direction = 'OUT') as tout
LEFT JOIN (SELECT distinct tablename, semantictype FROM wrapcache_oct4.sourceschema where direction = 'IN') as  tin
ON tin.tablename = tout.tablename  and tin.semantictype = tout.semantictype
WHERE tin.semantictype IS NULL;

-- 

select tno.formurl as tnou, tsi.formurl as tsiu
FROM (SELECT distinct formurl FROM wrapcache_oct4_no.sourceid) as tno
LEFT JOIN (SELECT distinct formurl FROM wrapcache_oct4.sourceid) as tsi
ON tno.formurl = tsi.formurl;

select tno.formurl as tnou
FROM (SELECT distinct formurl FROM wrapcache_oct4_no.sourceid) as tno
LEFT JOIN (SELECT distinct formurl FROM wrapcache_oct4.sourceid) as tsi
ON tno.formurl = tsi.formurl
WHERE tsi.formurl IS NULL;

select tsi.formurl as tsiu
FROM (SELECT distinct formurl FROM wrapcache_oct4.sourceid) as tsi
LEFT JOIN (SELECT distinct formurl FROM wrapcache_oct4_no.sourceid) as tno
ON tno.formurl = tsi.formurl
WHERE tno.formurl IS NULL;


-- 
DROP TABLE IF EXISTS `agentrunner`.`wundergrounddb_wrapper2`;
CREATE TABLE  `agentrunner`.`wundergrounddb_wrapper2` (
  `combinedId` varchar(50) default NULL,
  `agentExecutionId` int(11) default NULL,
  `connectorExecutionId` int(11) default NULL,
  `flattenedRowId` int(11) default NULL,
  `place` longtext,
  `time` longtext,
  `tempf` longtext,
  `sky` longtext,
  `humidity` longtext,
  `windspeed` longtext,
  `winddirection` longtext,
  `pressurein` longtext,
  `visibilitymi` longtext,
  `lowtempf1` longtext,
  `hightempf1` longtext,
  `sky1` longtext,
  `lowtempf2` longtext,
  `hightempf2` longtext,
  `sky2` longtext,
  `lowtempf3` longtext,
  `hightempf3` longtext,
  `sky3` longtext,
  `lowtempf4` longtext,
  `hightempf4` longtext,
  `sky4` longtext,
  `lowtempf5` longtext,
  `hightempf5` longtext,
  `sky5` longtext,
  `zip` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table wrapcache_oct6.wunderground (
  PR_CityState longtext,
  PR_TimeWZone longtext,
  PR_TempF_current longtext,
  PR_Sky longtext,
  PR_Humidity longtext,
  PR_Windspeed longtext,
  PR_Winddir longtext,
  PR_Pressure longtext,
  PR_Visibility longtext,
  PR_TempF_low1 longtext,
  PR_TempF_high1 longtext,
  PR_Sky_n1 longtext,
  PR_TempF_low2 longtext,
  PR_TempF_high2 longtext,
  PR_Sky_n2 longtext,
  PR_TempF_low3 longtext,
  PR_TempF_high3 longtext,
  PR_Sky_n3 longtext,
  PR_TempF_low4 longtext,
  PR_TempF_high4 longtext,
  PR_Sky_n4 longtext,
  PR_TempF_low5 longtext,
  PR_TempF_high5 longtext,
  PR_Sky_n5 longtext,
  PR_ZIP longtext
)
SELECT place, time, tempf, sky, humidity, windspeed, winddirection,
  pressurein, visibilitymi, lowtempf1, hightempf1, sky1, lowtempf2,
  hightempf2, sky2, lowtempf3, hightempf3, sky3, lowtempf4,
  hightempf4, sky4, lowtempf5, hightempf5, sky5, zip
FROM agentrunner.wundergrounddb_wrapper2

CREATE TABLE wrapcache_oct5.wunderground 
SELECT zip, place, time, tempf, sky, humidity, windspeed, winddirection,
  pressurein, visibilitymi, lowtempf1, hightempf1, sky1, lowtempf2,
  hightempf2, sky2, lowtempf3, hightempf3, sky3, lowtempf4,
  hightempf4, sky4, lowtempf5, hightempf5, sky5
FROM agentrunner.wundergrounddb_wrapper2 
WHERE agentexecutionid >= 2000001617 AND agentexecutionid <= 2000001626;

CREATE TABLE wrapcache_oct6.wunderground 
SELECT zip, place, time, tempf, sky, humidity, windspeed, winddirection,
  pressurein, visibilitymi, lowtempf1, hightempf1, sky1, lowtempf2,
  hightempf2, sky2, lowtempf3, hightempf3, sky3, lowtempf4,
  hightempf4, sky4, lowtempf5, hightempf5, sky5
FROM agentrunner.wundergrounddb_wrapper2 
WHERE agentexecutionid >= 2000001637 AND agentexecutionid <= 2000001646;

INSERT INTO wrapcache_oct6.sourceschema VALUES
('wunderground', 0, 'zip', 'PR-ZIP', -1, 'IN'),
('wunderground', 1, 'place', 'PR-CityState', 1, 'OUT'),
('wunderground', 2, 'time', 'PR-TimeWZone', 1, 'OUT'),
('wunderground', 3, 'tempf', 'PR-TempF', 1, 'OUT'),
('wunderground', 4, 'sky', 'PR-Sky', 1, 'OUT'),
('wunderground', 5, 'humidity', 'PR-Humidity', 1, 'OUT'),
('wunderground', 6, 'windspeed', 'PR-WindspeedInMPH', 1, 'OUT'),
('wunderground', 7, 'winddirection', 'PR-Winddir', 1, 'OUT'),
('wunderground', 8, 'pressurein', 'PR-Pressure', 1, 'OUT'),
('wunderground', 9, 'visibilitymi', 'PR-VisibilityInMi', 1, 'OUT'),
('wunderground', 10, 'lowtempf1', 'PR-TempF', 1, 'OUT'),
('wunderground', 11, 'hightempf1', 'PR-TempF', 1, 'OUT'),
('wunderground', 12, 'sky1', 'PR-Sky', 1, 'OUT'),
('wunderground', 13, 'lowtempf2', 'PR-TempF', 1, 'OUT'),
('wunderground', 14, 'hightempf2', 'PR-TempF', 1, 'OUT'),
('wunderground', 15, 'sky2', 'PR-Sky', 1, 'OUT'),
('wunderground', 16, 'lowtempf3', 'PR-TempF', 1, 'OUT'),
('wunderground', 17, 'hightempf3', 'PR-TempF', 1, 'OUT'),
('wunderground', 18, 'sky3', 'PR-Sky', 1, 'OUT'),
('wunderground', 19, 'lowtempf4', 'PR-TempF', 1, 'OUT'),
('wunderground', 20, 'hightempf4', 'PR-TempF', 1, 'OUT'),
('wunderground', 21, 'sky4', 'PR-Sky', 1, 'OUT'),
('wunderground', 22, 'lowtempf5', 'PR-TempF', 1, 'OUT'),
('wunderground', 23, 'hightempf5', 'PR-TempF', 1, 'OUT'),
('wunderground', 24, 'sky5', 'PR-Sky', 1, 'OUT');

DELETE FROM wrapcache_oct6.sourceschema WHERE tablename = 'wunderground';

SELECT * FROM agentrunner.wundergrounddb_wrapper2 w order by combinedid;

select a.place, a.time, a.tempf, b.time, b.tempf
FROM
(SELECT * FROM agentrunner.wundergrounddb_wrapper2 w
WHERE agentexecutionid >= 2000001627 AND agentexecutionid <= 2000001636) a,
(SELECT * FROM agentrunner.wundergrounddb_wrapper2 w
WHERE agentexecutionid >= 2000001637 AND agentexecutionid <= 2000001646) b
WHERE a.place = b.place;

INSERT INTO wrapcache_oct6.sourceid VALUES
(12, 'weather', 'http://www.wunderground.com/', 'JLA', 'METHOD_GET', 'http://www.wunderground.com/', 'wunderground', '2008-10-31 15:15:00');

SELECT id, url, formname, lastupdate, date(lastupdate), time(lastupdate)  FROM wrapcache_oct6.sourceid s;

SELECT a.id, time(a.lastupdate), b.id, time(b.lastupdate), 
       timediff(a.lastupdate, b.lastupdate)
FROM wrapcache_oct6.sourceid a, wrapcache_oct6.sourceid b
where a.id = (b.id + 1);

CREATE TABLE  `wrapcache_oct4`.`whitepages` (
  `FIRST_NAME` varchar(255) default NULL,
  `LAST_NAME` varchar(255) default NULL,
  `ZIP` varchar(255) default NULL,
  `STREET_ADDR` varchar(255) default NULL,
  `CITY` varchar(255) default NULL,
  `STATE` varchar(255) default NULL,
  `PHONE` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `wrapcache_oct4`.`whitepages`
SELECT FIRST_NAME, LAST_NAME, ZIPCODE, STREET_ADDR, CITY, STATE, 'foo'
FROM datasamples.directory_samples d limit 10;


INSERT INTO wrapcache_oct4.sourceschema VALUES
('whitepages', 0, 'FIRST_NAME', 'PR-FirstName', -1, 'IN'),
('whitepages', 1, 'LAST_NAME', 'PR-LastName', -1, 'IN'),
('whitepages', 2, 'ZIP', 'PR-Zip', -1, 'IN'),
('whitepages', 3, 'STREET_ADDR', 'PR-Street', 1, 'OUT'),
('whitepages', 4, 'CITY', 'PR-City', 1, 'OUT'),
('whitepages', 5, 'STATE', 'PR-StateAbbr', 1, 'OUT'),
('whitepages', 6, 'PHONE', 'PR-Phone', 1, 'OUT');

INSERT INTO wrapcache_oct4.sourceid VALUES
(28, 'whitepages', 'http://www.whitepages.com/', 'JLA', 'METHOD_GET', 'http://www.whitepages.com/', 'whitepages', '2008-11-03 11:00:00');

SELECT * FROM wrapcache_oct4.whitepages;

ALTER TABLE `wrapcache_oct4`.`whitepages` 
ADD PRIMARY KEY (`FIRST_NAME`, `LAST_NAME`, `ZIP`);

----------------------------------------------------------------------

-- 2008-12-11 18:54:17


-- Input vlaues 
-- ('06106', '20502', '32399', '33040', '36130', '46208', '50319', '66612', '85007', '90292')


SELECT w.agentExecutionId, a.timestarted
FROM agentrunner.wundergrounddb_wrapper2 w, 
     agentrunner.ar_agentexecution_info a
WHERE w.agentExecutionId = a.agentExecutionId;

SELECT a.timestarted, w.*
FROM agentrunner.wundergrounddb_wrapper2 w, 
     agentrunner.ar_agentexecution_info a
WHERE w.agentExecutionId = a.agentExecutionId and
      w.zip in ('06106', '20502', '32399', '33040', '36130', '46208', '50319', '66612', '85007', '90292');

select a.timestarted, STR_TO_DATE(a.timestarted, '%m/%d/%Y')
FROM agentrunner.ar_agentexecution_info a;

select date('2008-11-25 13:36:08'),  time('2008-11-25 13:36:08');
--> '2008-11-25', 13:36:08


select STR_TO_DATE('05/07/2007 11:33:32 PDT', '%m/%d/%Y %H:%i:%s');
--> '2007-05-07 11:33:32'

select DATEDIFF(date('2008-11-25 13:36:08'),
                date(STR_TO_DATE('05/07/2007 11:33:32 PDT', 
                                 '%m/%d/%Y %H:%i:%s')));
--> 568

select time('2008-11-25 13:36:08'), 
       time(STR_TO_DATE('05/07/2007 11:33:32 PDT', '%m/%d/%Y %H:%i:%s'));
--> 13:36:08, 11:33:32

select timediff(
       time('2008-11-25 13:36:08'), 
       time(STR_TO_DATE('05/07/2007 11:33:32 PDT', '%m/%d/%Y %H:%i:%s')));
--> 02:02:36

select timediff('2008-11-25 13:36:08', '2007-05-07 11:33:32');
--> 13634:02:36

select timediff('2007-05-07 11:33:32','2008-11-25 13:36:08');
--> -13634:02:36

select timediff('2008-11-25 13:36:08', 
       STR_TO_DATE('05/07/2007 11:33:32 PDT', '%m/%d/%Y %H:%i:%s'));
--> 13634:02:36


select STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')
from agentrunner.ar_agentexecution_info a;

select timediff('2008-11-25 13:36:08', 
         STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'))
from agentrunner.ar_agentexecution_info a;


select 
min(timediff('2008-11-25 13:36:08', 
    STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')))
from agentrunner.ar_agentexecution_info a;
--> '-00:00:20' !!

select 
a.agentExecutionId,
'2008-11-25 13:36:08',
STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'),
timediff('2008-11-25 13:36:08', 
         STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')),
UNIX_TIMESTAMP('2008-11-25 13:36:08'),
UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')),
UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')),
abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')))
from agentrunner.ar_agentexecution_info a;

select 
a.agentExecutionId,
'2008-11-25 13:36:08',
STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'),
abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')))
from agentrunner.ar_agentexecution_info a;

select 
a.agentExecutionId,
'2008-11-25 13:36:08',
STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'),
abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s')))
from agentrunner.ar_agentexecution_info a;

select 
min(abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'))))
from agentrunner.ar_agentexecution_info a;
--> 20

select 
min(abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'))))
from agentrunner.ar_agentexecution_info a;

select * 
FROM agentrunner.wundergrounddb_wrapper2 w, 
     agentrunner.ar_agentexecution_info a
WHERE w.agentExecutionId = a.agentExecutionId and
      abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - 
          UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'))) = 
(select 
min(abs(UNIX_TIMESTAMP('2008-11-25 13:36:08') - UNIX_TIMESTAMP(STR_TO_DATE(a.timestarted, '%m/%d/%Y %H:%i:%s'))))
from agentrunner.ar_agentexecution_info a);
--> 2000001927 

-- pretty much impossible to extract wrapcache_nov1_no.wunderground_weather179
-- from agentrunner.wundergrounddb_wrapper2
 
-- Input values 
-- ('06106', '20502', '32399', '33040', '36130', '46208', '50319', '66612', '85007', '90292')

-- 179, 'weather', 'http://weather.unisys.com/', 'Forecast', 'PR-Zip', 'METHOD_GET', 'http://weather.unisys.com/forecast.pl', 'weather179', 2008-11-25 13:36:08

CREATE TABLE wrapcache_nov1_no.wunderground_weather179 
SELECT zip, place, time, tempf, sky, humidity, windspeed, winddirection,
  pressurein, visibilitymi, lowtempf1, hightempf1, sky1, lowtempf2,
  hightempf2, sky2, lowtempf3, hightempf3, sky3, lowtempf4,
  hightempf4, sky4, lowtempf5, hightempf5, sky5
FROM agentrunner.wundergrounddb_wrapper2 
WHERE agentexecutionid >= 2000001927 AND agentexecutionid <= 2000001936
order by zip;

INSERT INTO wrapcache_nov1_no.sourceschema VALUES
('wunderground_weather179', 0, 'zip', 'PR-Zip', -1, 'IN'),
('wunderground_weather179', 1, 'place', 'PR-CityState', 1, 'OUT'),
('wunderground_weather179', 2, 'time', 'PR-TimeWZone', 1, 'OUT'),
('wunderground_weather179', 3, 'tempf', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 4, 'sky', 'PR-Sky', 1, 'OUT'),
('wunderground_weather179', 5, 'humidity', 'PR-Humidity', 1, 'OUT'),
('wunderground_weather179', 6, 'windspeed', 'PR-WindSpeedInMPH', 1, 'OUT'),
('wunderground_weather179', 7, 'winddirection', 'PR-Winddir', 1, 'OUT'),
('wunderground_weather179', 8, 'pressurein', 'PR-Pressure', 1, 'OUT'),
('wunderground_weather179', 9, 'visibilitymi', 'PR-VisibilityInMi', 1, 'OUT'),
('wunderground_weather179', 10, 'lowtempf1', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 11, 'hightempf1', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 12, 'sky1', 'PR-Sky', 1, 'OUT'),
('wunderground_weather179', 13, 'lowtempf2', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 14, 'hightempf2', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 15, 'sky2', 'PR-Sky', 1, 'OUT'),
('wunderground_weather179', 16, 'lowtempf3', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 17, 'hightempf3', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 18, 'sky3', 'PR-Sky', 1, 'OUT'),
('wunderground_weather179', 19, 'lowtempf4', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 20, 'hightempf4', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 21, 'sky4', 'PR-Sky', 1, 'OUT'),
('wunderground_weather179', 22, 'lowtempf5', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 23, 'hightempf5', 'PR-TempF', 1, 'OUT'),
('wunderground_weather179', 24, 'sky5', 'PR-Sky', 1, 'OUT');

INSERT INTO wrapcache_nov1_no.sourceid VALUES
(382, 'weather', 'http://www.wunderground.com/', 'JLA:weather179', 'PR-Zip', 'METHOD_GET', 'http://www.wunderground.com/', 'wunderground_weather179', '2008-11-25 13:36:08');

select argumentno, argumentname, semantictype
from wrapcache_nov1_no.sourceschema
where tablename = 'weather179'
order by argumentno;

select distinct semantictype 
from wrapcache_nov1_no.sourceschema  
order by semantictype;


select distinct semantictype 
from wrapcache_nov1_no.sourceschema  
where tablename like 'weather%'
order by semantictype;

-- 2008-12-22

SELECT * FROM wrapcache_081218_no.sourceschema
where tablename like 'geo%'
order by tablename, argumentno;

SELECT distinct semantictype 
FROM wrapcache_081218_no.sourceschema
WHERE tablename like 'geo%'
order by semantictype;

'PR-Address'
'PR-Latitude'
'PR-LonDMS'
'PR-Longitude'
'PR-StateAbbr'
'PR-Street'
'PR-UTM'
'PR-Zip'

SELECT * FROM wrapcache_081218_no.sourceid 
where domain = 'geospatial';

SELECT tablename, url, formurl 
FROM wrapcache_081218_no.sourceid
where domain = 'geospatial' 
order by tablename;

'geospatial101', 'http://www.hostip.info/index.html', 'http://www.jrank.org/jrankweb/servlet/jrankweb/template/Index.vm', 'PR-Address'
'geospatial46', 'http://geocoder.us/', 'http://geocoder.us/demo.cgi', 'PR-Address'
'geospatial49', 'http://geocoder.ca/', 'http://geocoder.ca', 'PR-Address'
'geospatial56', 'http://world.maporama.com', 'http://maporama.eurekster.com/search.php', 'PR-Address'
'geospatial76', 'http://www.51ditu.com/', 'http://www.51ditu.com/maps', 'PR-Address'
'geospatial84', 'http://www.hostip.info/use.html', 'http://www.jrank.org/jrankweb/servlet/jrankweb/template/Index.vm', 'PR-Address'
'geospatial92', 'http://www.hostip.info/', 'http://www.jrank.org/jrankweb/servlet/jrankweb/template/Index.vm', 'PR-Address'
'geospatial99', 'http://en.wikipedia.org/wiki/Geocoding', 'http://en.wikipedia.org/wiki/Special:Search', 'PR-Address'


-- flight status  domain


SELECT * FROM wrapcache_081222_no.sourceschema
where tablename like 'fli%' order by tablename, argumentno;

SELECT distinct semantictype 
FROM wrapcache_081222_no.sourceschema
where tablename like 'fli%' 
order by semantictype;

CREATE TABLE  `agentrunner`.`flightstatusdb_detail1` (
  `combinedId` varchar(50) default NULL,
  `agentExecutionId` int(11) default NULL,
  `connectorExecutionId` int(11) default NULL,
  `flattenedRowId` int(11) default NULL,
  `airline` longtext,
  `flightnumber` longtext,
  `departurecity` longtext,
  `departureairport` longtext,
  `departuredate` longtext,
  `departuretime` longtext,
  `arrivalcity` longtext,
  `arrivalairport` longtext,
  `arrivaldate` longtext,
  `arrivaltime` longtext,
  `remainingflighttime` longtext,
  `aircrafttype` longtext,
  `altitude` longtext,
  `groundspeed` longtext,
  `flightstatus` longtext,
  `fnum` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

'PR-Airline'
'PR-AirportCode'
'PR-BaggageClaim'
'PR-FlightNumber'
'PR-FlightStatus'
'PR-RemainingTime'

-- PR-Date  12/23/2008
-- PR-Time  03:01 PM
-- PR-City  'Puerto Vallarta, Mexico' or 'San Francisco, CA'
-- remainingflighttime: 01:51 PR-RemainingTime
-- aircrafttype: PR-AircraftType?? anyway wrapper fails (empty values)
-- PR-Altitude '0 feet'  '37,000 feet'
-- groundspeed  PR-SpeedMPH '598 mph' '0 mph'
-- flightstatus 'In Flight', 'Scheduled'


CREATE TABLE wrapcache_081223_no.flytecomm_flight_102
SELECT airline, flightnumber, departurecity, departureairport,
       departuredate, departuretime, arrivalcity, arrivalairport,
       arrivaldate, arrivaltime, remainingflighttime, aircrafttype,
       altitude, groundspeed, flightstatus
FROM  agentrunner.flightstatusdb_detail1

INSERT INTO wrapcache_nov1_no.sourceschema VALUES
('flytecomm_flight_102', 0, 'airline', 'PR-Airline', -1, 'IN'),
('flytecomm_flight_102', 1, 'flightnumber', 'PR-FlightNumber', -1, 'IN'),
('flytecomm_flight_102', 2, 'departurecity', 'PR-City', 1, 'OUT'),
('flytecomm_flight_102', 3, 'departureairport', 'PR-AirportCode', 1, 'OUT'),
('flytecomm_flight_102', 4, 'departuredate', 'PR-Date', 1, 'OUT'), 
('flytecomm_flight_102', 5, 'departuretime', 'PR-Time', 1, 'OUT'), 
('flytecomm_flight_102', 6, 'arrivalcity', 'PR-City', 1, 'OUT'),
('flytecomm_flight_102', 7, 'arrivalairport', 'PR-AirportCode', 1, 'OUT'),
('flytecomm_flight_102', 8, 'arrivaldate', 'PR-Date', 1, 'OUT'),
('flytecomm_flight_102', 9, 'arrivaltime', 'PR-Time', 1, 'OUT'),
('flytecomm_flight_102', 10, 'remainingflighttime', 'PR-RemainingTime', 1, 'OUT'),
('flytecomm_flight_102', 11, 'aircrafttype', 'PR-AircraftType', 1, 'OUT'),
('flytecomm_flight_102', 12, 'altitude', 'PR-Altitude', 1, 'OUT'),
('flytecomm_flight_102', 13, 'groundspeed', 'PR-SpeedMPH', 1, 'OUT'),
('flytecomm_flight_102', 14, 'flightstatus', 'PR-FlightStatus', 1, 'OUT');

INSERT INTO wrapcache_nov1_no.sourceid VALUES
(102, 'flight', 'http://www.flytecomm.com/', 'JLA:flight_102', 'PR-Airline;PR-FlightNumber', 'METHOD_GET', 'http://www.flytecomm.com/', 'flytecomm_flight_102', '2008-12-23 13:36:08');

-- 2009-01-10 18:59:49


INSERT INTO wrapcache_nov1_no.sourceschema VALUES
('flytecomm_flight_102', 0, 'airline', 'PR-Airline', -1, 'IN'),
('flytecomm_flight_102', 1, 'flightnumber', 'PR-FlightNumber', -1, 'IN'),
('flytecomm_flight_102', 2, 'departurecity', 'PR-City', 1, 'OUT'),
('flytecomm_flight_102', 3, 'departureairport', 'PR-AirportCode', 1, 'OUT'),
('flytecomm_flight_102', 4, 'departuredate', 'PR-Date', 1, 'OUT'), 

SELECT distinct(semantictype) FROM wrapcache_20090109_no.sourceschema
where tablename like 'fli%'
order by semantictype;

SELECT tablename, semantictype FROM wrapcache_20090109_no.sourceschema
where direction = 'IN' and tablename like 'fl%'
order by tablename, argumentno;

SELECT distinct(tablename) FROM wrapcache_20090109_no.sourceschema
where tablename like 'fly%'
order by tablename;

'flytecomm_flight1'
'flytecomm_flight11'
'flytecomm_flight13'
'flytecomm_flight14'
'flytecomm_flight15'
'flytecomm_flight16'
'flytecomm_flight17'
'flytecomm_flight2'
'flytecomm_flight23'
'flytecomm_flight24'
'flytecomm_flight27'
'flytecomm_flight29'
'flytecomm_flight3'
'flytecomm_flight30'
'flytecomm_flight7'
'flytecomm_flight9'

ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight1` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight1_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight11` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight11_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight13` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight13_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight14` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight14_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight15` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight15_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight16` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight16_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight17` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight17_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight2` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight2_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight23` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight23_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight24` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight24_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight27` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight27_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight29` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight29_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight3` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight3_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight30` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight30_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight7` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight7_tom`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight9` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight9_tom`;

create TABLE `wrapcache_20090109_no`.`flytecomm_flight1` select * from  `wrapcache_20090109_no`.`flytecomm_flight1_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight11` select * from  `wrapcache_20090109_no`.`flytecomm_flight11_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight13` select * from  `wrapcache_20090109_no`.`flytecomm_flight13_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight14` select * from  `wrapcache_20090109_no`.`flytecomm_flight14_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight15` select * from  `wrapcache_20090109_no`.`flytecomm_flight15_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight16` select * from  `wrapcache_20090109_no`.`flytecomm_flight16_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight17` select * from  `wrapcache_20090109_no`.`flytecomm_flight17_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight2` select * from  `wrapcache_20090109_no`.`flytecomm_flight2_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight23` select * from  `wrapcache_20090109_no`.`flytecomm_flight23_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight24` select * from  `wrapcache_20090109_no`.`flytecomm_flight24_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight27` select * from  `wrapcache_20090109_no`.`flytecomm_flight27_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight29` select * from  `wrapcache_20090109_no`.`flytecomm_flight29_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight3` select * from  `wrapcache_20090109_no`.`flytecomm_flight3_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight30` select * from  `wrapcache_20090109_no`.`flytecomm_flight30_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight7` select * from  `wrapcache_20090109_no`.`flytecomm_flight7_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight9` select * from  `wrapcache_20090109_no`.`flytecomm_flight9_tom`;


'flytecomm_flight1'
'flytecomm_flight11'
'flytecomm_flight13'
'flytecomm_flight14'
'flytecomm_flight15'
'flytecomm_flight16'
'flytecomm_flight17'
'flytecomm_flight2'
'flytecomm_flight23'
'flytecomm_flight24'
'flytecomm_flight27'
'flytecomm_flight29'
'flytecomm_flight3'
'flytecomm_flight30'
'flytecomm_flight7'
'flytecomm_flight9'



SELECT distinct(airline) FROM wrapcache_20090109_no.flytecomm_flight1 f;

'Airtran Airways' TRS
'Alaska'  ASA
'American'  AAL
'Delta Air Lines' DAL
'Southwest' SWA
'United' UAL

select * from source_model.airlines
where name in (SELECT distinct(airline) FROM wrapcache_20090109_no.flytecomm_flight1);

select * from source_model.airlines where name like 'United%';


update wrapcache_20090109_no`.`flytecomm_flight1 set airline='TRS' where snp='Airtran Airways';

(dolist (f '(flytecomm_flight1 flytecomm_flight11 flytecomm_flight13 flytecomm_flight14 flytecomm_flight15 flytecomm_flight16 flytecomm_flight17 flytecomm_flight2 flytecomm_flight23  flytecomm_flight24 flytecomm_flight27 flytecomm_flight29 flytecomm_flight3 flytecomm_flight30 flytecomm_flight7 flytecomm_flight9))
	(dolist (p '(("Airtran Airways" TRS) ("Alaska"  ASA) ("American"  AAL) ("Delta Air Lines" DAL) ("Southwest" SWA) ("United" UAL)))
	 (format t "~A ~A ~A" f (fisrt p) (seoncd p)))
	
(dolist (f '(flytecomm_flight1 flytecomm_flight11 flytecomm_flight13 flytecomm_flight14 flytecomm_flight15 flytecomm_flight16 flytecomm_flight17 flytecomm_flight2 flytecomm_flight23  flytecomm_flight24 flytecomm_flight27 flytecomm_flight29 flytecomm_flight3 flytecomm_flight30 flytecomm_flight7 flytecomm_flight9)) 	 (dolist (p '(("Airtran Airways" TRS) ("Alaska"  ASA) ("American"  AAL) ("Delta Air Lines" DAL) ("Southwest" SWA) ("United" UAL))) 	 
	(format t "~%update wrapcache_20090109_no.~A set airline='~A' where airline='~A';" 
	 	f (second p)  (first p) )))

'Airtran Airways' TRS
'Alaska'  ASA
'American'  AAL
'Delta Air Lines' DAL
'Southwest' SWA
'United' UAL


update wrapcache_20090109_no.FLYTECOMM_FLIGHT1 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT1 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT1 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT1 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT1 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT1 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT11 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT11 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT11 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT11 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT11 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT11 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT13 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT13 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT13 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT13 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT13 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT13 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT14 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT14 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT14 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT14 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT14 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT14 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT15 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT15 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT15 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT15 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT15 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT15 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT16 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT16 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT16 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT16 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT16 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT16 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT17 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT17 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT17 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT17 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT17 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT17 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT2 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT2 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT2 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT2 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT2 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT2 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT23 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT23 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT23 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT23 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT23 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT23 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT24 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT24 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT24 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT24 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT24 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT24 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT27 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT27 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT27 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT27 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT27 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT27 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT29 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT29 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT29 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT29 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT29 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT29 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT3 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT3 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT3 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT3 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT3 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT3 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT30 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT30 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT30 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT30 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT30 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT30 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT7 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT7 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT7 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT7 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT7 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT7 set airline='UAL' where airline='United';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT9 set airline='TRS' where airline='Airtran Airways';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT9 set airline='ASA' where airline='Alaska';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT9 set airline='AAL' where airline='American';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT9 set airline='DAL' where airline='Delta Air Lines';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT9 set airline='SWA' where airline='Southwest';
update wrapcache_20090109_no.FLYTECOMM_FLIGHT9 set airline='UAL' where airline='United';


SELECT * FROM wrapcache_081223b_no.sourceid
where id in (14, 45, 25, 49, 56, 6, 76, 83, 86, 88, 9, 96, 30, 59, 61);


ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight1` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight1_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight11` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight11_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight13` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight13_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight14` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight14_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight15` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight15_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight16` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight16_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight17` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight17_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight2` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight2_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight23` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight23_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight24` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight24_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight27` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight27_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight29` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight29_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight3` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight3_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight30` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight30_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight7` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight7_jl`;
ALTER TABLE `wrapcache_20090109_no`.`flytecomm_flight9` RENAME TO `wrapcache_20090109_no`.`flytecomm_flight9_jl`;

create TABLE `wrapcache_20090109_no`.`flytecomm_flight1` select * from  `wrapcache_20090109_no`.`flytecomm_flight1_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight11` select * from  `wrapcache_20090109_no`.`flytecomm_flight11_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight13` select * from  `wrapcache_20090109_no`.`flytecomm_flight13_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight14` select * from  `wrapcache_20090109_no`.`flytecomm_flight14_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight15` select * from  `wrapcache_20090109_no`.`flytecomm_flight15_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight16` select * from  `wrapcache_20090109_no`.`flytecomm_flight16_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight17` select * from  `wrapcache_20090109_no`.`flytecomm_flight17_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight2` select * from  `wrapcache_20090109_no`.`flytecomm_flight2_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight23` select * from  `wrapcache_20090109_no`.`flytecomm_flight23_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight24` select * from  `wrapcache_20090109_no`.`flytecomm_flight24_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight27` select * from  `wrapcache_20090109_no`.`flytecomm_flight27_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight29` select * from  `wrapcache_20090109_no`.`flytecomm_flight29_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight3` select * from  `wrapcache_20090109_no`.`flytecomm_flight3_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight30` select * from  `wrapcache_20090109_no`.`flytecomm_flight30_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight7` select * from  `wrapcache_20090109_no`.`flytecomm_flight7_tom`;
create TABLE `wrapcache_20090109_no`.`flytecomm_flight9` select * from  `wrapcache_20090109_no`.`flytecomm_flight9_tom`;



SELECT distinct(airline) FROM wrapcache_20090109_no.flytecomm_flight1 f;

'Airtran Airways' TRS
'Alaska'  ASA
'American'  AAL
'Delta Air Lines' DAL
'Southwest' SWA
'United' UAL

SELECT name,code2,code3 FROM source_model.airlines 
WHERE code3 in ('TRS', 'ASA', 'AAL', 'DAL', 'SWA', 'UAL');

'Airtran Airways', 'FL', 'TRS', 'Airtran Airways'
'Alaska Airlines', 'AS', 'ASA', 'Alaska'
'American Airlines', 'AA', 'AAL', 'American'
'Delta Air Lines', 'DL', 'DAL', 'Delta Air Lines'
'Southwest Airlines', 'WN', 'SWA', 'Southwest'
'United Airlines', 'UA', 'UAL', 'United'


CREATE TABLE  wrapcache_20090109_no.airline_codes (
  name varchar(100) default NULL,
  code2 varchar(100) default NULL,
  code3 varchar(100) default NULL,
  shortname varchar(100) default NULL
);

insert into wrapcache_20090109_no.airline_codes values
('Airtran Airways', 'FL', 'TRS', 'Airtran Airways'),
('Alaska Airlines', 'AS', 'ASA', 'Alaska'),
('American Airlines', 'AA', 'AAL', 'American'),
('Delta Air Lines', 'DL', 'DAL', 'Delta Air Lines'),
('Southwest Airlines', 'WN', 'SWA', 'Southwest'),
('United Airlines', 'UA', 'UAL', 'Southwest');



CREATE TABLE  `wrapcache_20090109_no`.`flytecomm_flight1` (
  `SourceTime` timestamp NOT NULL default '0000-00-00 00:00:00',
  `SourcePage` varchar(100) default NULL,
  `airline` longtext,
  `flightnumber` longtext,
  `departurecity` longtext,
  `departureairport` longtext,
  `departuredate` longtext,
  `departuretime` longtext,
  `arrivalcity` longtext,
  `arrivalairport` longtext,
  `arrivaldate` longtext,
  `arrivaltime` longtext,
  `remainingflighttime` longtext,
  `aircrafttype` longtext,
  `altitude` longtext,
  `groundspeed` longtext,
  `flightstatus` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



create table wrapcache_20090109_no.flytecomm_flight1
select 
  a.code3 as airlinecode,
  tom.airline as airlinename,
  tom.flightnumber,
  tom.departurecity,
  tom.departureairport,
  tom.departuredate,
  tom.departuretime,
  tom.arrivalcity,
  tom.arrivalairport,
  tom.arrivaldate,
  tom.arrivaltime,
  tom.remainingflighttime,
  tom.aircrafttype,
  tom.altitude,
  tom.groundspeed,
  tom.flightstatus,
  tom.SourceTime,
  tom.SourcePage
from wrapcache_20090109_no.flytecomm_flight1_tom tom, 
     wrapcache_20090109_no.airline_codes a;
where tom.airline = a.shortname;

(dolist (f '(flytecomm_flight1 flytecomm_flight11 flytecomm_flight13 flytecomm_flight14 flytecomm_flight15 flytecomm_flight16 flytecomm_flight17 flytecomm_flight2 flytecomm_flight23  flytecomm_flight24 flytecomm_flight27 flytecomm_flight29 flytecomm_flight3 flytecomm_flight30 flytecomm_flight7 flytecomm_flight9))
	(format t "~%drop table ~A;" f))

drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT1;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT11;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT13;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT14;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT15;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT16;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT17;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT2;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT23;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT24;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT27;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT29;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT3;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT30;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT7;
drop table wrapcache_20090109_no.FLYTECOMM_FLIGHT9;

(dolist (f '(flytecomm_flight1 flytecomm_flight11 flytecomm_flight13 flytecomm_flight14 flytecomm_flight15 flytecomm_flight16 flytecomm_flight17 flytecomm_flight2 flytecomm_flight23  flytecomm_flight24 flytecomm_flight27 flytecomm_flight29 flytecomm_flight3 flytecomm_flight30 flytecomm_flight7 flytecomm_flight9))
	(format t "~%create table wrapcache_20090109_no.~A 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.~A_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;" f f))

create table wrapcache_20090109_no.FLYTECOMM_FLIGHT1 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT1_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT11 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT11_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT13 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT13_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT14 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT14_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT15 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT15_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT16 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT16_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT17 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT17_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT2 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT2_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT23 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT23_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT24 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT24_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT27 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT27_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT29 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT29_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT3 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT3_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT30 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT30_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT7 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT7_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;
create table wrapcache_20090109_no.FLYTECOMM_FLIGHT9 
select tom.airline as airlinename,  tom.flightnumber,  tom.departurecity,  tom.departureairport,  tom.departuredate,  tom.departuretime,  tom.arrivalcity,  tom.arrivalairport,  tom.arrivaldate,  tom.arrivaltime,  tom.remainingflighttime,  tom.aircrafttype,  tom.altitude,  tom.groundspeed,  tom.flightstatus, a.code3 as airlinecode,  tom.SourceTime,  tom.SourcePage
from wrapcache_20090109_no.FLYTECOMM_FLIGHT9_tom tom, 
     wrapcache_20090109_no.airline_codes a
where tom.airline = a.shortname;


(dolist (f '(flytecomm_flight1 flytecomm_flight11 flytecomm_flight13 flytecomm_flight14 flytecomm_flight15 flytecomm_flight16 flytecomm_flight17 flytecomm_flight2 flytecomm_flight23  flytecomm_flight24 flytecomm_flight27 flytecomm_flight29 flytecomm_flight3 flytecomm_flight30 flytecomm_flight7 flytecomm_flight9))
	(format t "~%('~(~a~)', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN')," f))
'

insert into wrapcache_20090109_no.sourceschema values
('flytecomm_flight1', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight11', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight13', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight14', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight15', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight16', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight17', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight2', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight23', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight24', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight27', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight29', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight3', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight30', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight7', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight9', 15, 'airlinecode', 'PR-AirlineCode3', -1, 'IN');


select * 
from wrapcache_20090109_no.sourceschema
where tablename like 'flyte%' and
      argumentno = 0;

update wrapcache_20090109_no.sourceschema 
set argumentname='airlinename', score = 0.9, direction = 'OUT'
where tablename like 'flyte%' and
      argumentno = 0;


create table wrapcache_20090109_no.airline_codes2
select * from wrapcache_20090109_no.airline_codes;

create table wrapcache_20090109_no.airline_codes3
select * from wrapcache_20090109_no.airline_codes;


-- source airline_codes2(PR_Airline,$PR_AirlineCode2,PR_AirlineCode3)	:- airline(PR_Airline,PR_AirlineCode2,PR_AirlineCode3). {wrappers.DBService; http://jla.airline_codes.com/; JLA; PR-AirlineCode2}

-- source airline_codes3(PR_Airline,PR_AirlineCode2,$PR_AirlineCode3)	:- airline(PR_Airline,PR_AirlineCode2,PR_AirlineCode3). {wrappers.DBService; http://jla.airline_codes.com/; JLA; PR-AirlineCode3}


insert into wrapcache_20090109_no.sourceschema values
('airline_codes2', 0, 'name', 'PR-Airline', 1, 'OUT'),
('airline_codes2', 1, 'code2', 'PR-AirlineCode2', 1, 'IN'),
('airline_codes2', 2, 'code3', 'PR-AirlineCode3', -1, 'OUT');

insert into wrapcache_20090109_no.sourceschema values
('airline_codes3', 0, 'name', 'PR-Airline', 1, 'OUT'),
('airline_codes3', 1, 'code2', 'PR-AirlineCode2', 1, 'OUT'),
('airline_codes3', 2, 'code3', 'PR-AirlineCode3', -1, 'IN');


-- {wrappers.DBService; http://jla.airline_codes.com/; JLA; PR-AirlineCode3}

insert into wrapcache_20090109_no.sourceid values
(68, 'flight', 'http://jla.airline_codes.com/', 'JLA', 'PR-AirlineCode2', 'METHOD_POST', 'http://jla.airline_codes.com/', 'airline_codes2', '2009-01-10 22:43:00');

insert into wrapcache_20090109_no.sourceid values
(69, 'flight', 'http://jla.airline_codes.com/', 'JLA', 'PR-AirlineCode3', 'METHOD_POST', 'http://jla.airline_codes.com/', 'airline_codes3', '2009-01-10 22:43:00');


SELECT * FROM wrapcache_20090109_no.sourceschema
where semantictype like '%City%';

SELECT * FROM wrapcache_20090109_no.sourceschema
where semantictype='PR-City' and tablename like 'fly%';

update wrapcache_20090109_no.sourceschema
set semantictype='PR-CityState' where semantictype='PR-City' and tablename like 'fly%';

SELECT * FROM wrapcache_20090109_no.sourceschema
where semantictype like '%Aircraft%' and tablename like 'fl%';

update wrapcache_20090109_no.sourceschema
set semantictype='PR-Aircraft' where semantictype='PR-AircraftType' and tablename like 'fl%';


SELECT formtypes, REPLACE(formtypes, ';', ',') 
FROM wrapcache_20090109_no.sourceid;

update wrapcache_20090109_no.sourceid
set formtypes=REPLACE(formtypes, ';', ',');

select distinct airlinecode,flightnumber from wrapcache_20090109_no.flytecomm_flight1;

create table source_model.flights
select flightnumber, a.name as airlinename, a.code2 as airlinecode2,
       a.code3 as airlinecode3, a.shortname as airlineshortname
from (select distinct airlinecode,flightnumber from wrapcache_20090109_no.flytecomm_flight1) f, wrapcache_20090109_no.airline_codes a
where a.code3=f.airlinecode;



SELECT a.name, a.code2, a.code3, f.flightnumber, f.`PR-FlightStatus_14`, y.flightstatus
FROM wrapcache_20090109_no.flytecomm_flight14 y,
     wrapcache_20090109_no.flight14 f,
     wrapcache_20090109_no.airline_codes a
WHERE a.code3 = y.airlinecode and 
      a.code2 = f.airline and
      f.flightnumber = y.flightnumber;


SELECT y.airlinename, f.flightnumber, f.`PR-FlightStatus_14`, y.flightstatus
FROM wrapcache_20090109_no.flytecomm_flight13 y,
     wrapcache_20090109_no.flight13 f
WHERE f.airline = y.airlinecode and
      f.flightnumber = y.flightnumber;


SELECT f.`PR-FlightStatus_14`, y.flightstatus
FROM wrapcache_20090109_no.flytecomm_flight14 y,
     wrapcache_20090109_no.flight14 f,
     wrapcache_20090109_no.airline_codes a
WHERE a.code3 = y.airlinecode and 
      a.code2 = f.airline and
      f.flightnumber = y.flightnumber;


SELECT f.`PR-FlightStatus_14`, y.flightstatus
FROM wrapcache_20090109_no.flytecomm_flight13 y,
     wrapcache_20090109_no.flight13 f
WHERE f.airline = y.airlinecode and
      f.flightnumber = y.flightnumber;


insert into wrapcache_20090109_no.sourceschema values
('flightstatus_synonym', 0, 'fs1', 'PR-FlightStatus', 1, 'IN'),
('flightstatus_synonym', 1, 'fs2', 'PR-FlightStatus', 1, 'OUT');


-- {wrappers.DBService; http://jla.airline_codes.com/; JLA; PR-AirlineCode3}

insert into wrapcache_20090109_no.sourceid values
(70, 'flight', 'http://jla.flightstatus_synonym.com/', 'JLA', 'PR-FlightStatus', 'METHOD_POST', 'http://jla.flightstatus_synonym.com/', 'flightstatus_synonym', '2009-01-11 02:00:00');


CREATE TABLE  `wrapcache_20090109_no`.`flightstatus_synonym` (
  `fs1` varchar(100) default NULL,
  `fs2` varchar(100) default NULL
);

insert into `wrapcache_20090109_no`.`flightstatus_synonym` values
('Landed', 'Arrived'),
('Arrived', 'Landed');


SELECT f.`PR-FlightStatus_14` as flightstatus
FROM wrapcache_20090109_no.flytecomm_flight13 y,
     wrapcache_20090109_no.flight13 f
WHERE f.airline = y.airlinecode and
      f.flightnumber = y.flightnumber
UNION
SELECT y.flightstatus  as flightstatus
FROM wrapcache_20090109_no.flytecomm_flight13 y,
     wrapcache_20090109_no.flight13 f
WHERE f.airline = y.airlinecode and
      f.flightnumber = y.flightnumber
UNION
SELECT f.`PR-FlightStatus_14` as flightstatus
FROM wrapcache_20090109_no.flytecomm_flight14 y,
     wrapcache_20090109_no.flight14 f,
     wrapcache_20090109_no.airline_codes a
WHERE a.code3 = y.airlinecode and 
      a.code2 = f.airline and
      f.flightnumber = y.flightnumber
UNION
SELECT y.flightstatus  as flightstatus
FROM wrapcache_20090109_no.flytecomm_flight14 y,
     wrapcache_20090109_no.flight14 f,
     wrapcache_20090109_no.airline_codes a
WHERE a.code3 = y.airlinecode and 
      a.code2 = f.airline and
      f.flightnumber = y.flightnumber;



'Scheduled'
'Landed'
'Flight is Currently En Route'
'Arrived'
'In Flight'
'Delayed'


SELECT f.`PR-FlightStatus_14` as fs1, y.flightstatus as fs2
FROM wrapcache_20090109_no.flytecomm_flight14 y,
     wrapcache_20090109_no.flight14 f,
     wrapcache_20090109_no.airline_codes a
WHERE a.code3 = y.airlinecode and 
      a.code2 = f.airline and
      f.flightnumber = y.flightnumber
UNION
SELECT f.`PR-FlightStatus_14` as fs1, y.flightstatus as fs2
FROM wrapcache_20090109_no.flytecomm_flight13 y,
     wrapcache_20090109_no.flight13 f
WHERE f.airline = y.airlinecode and
      f.flightnumber = y.flightnumber;

'Scheduled', 'Scheduled'
'Landed', 'Scheduled'
'Landed', 'Arrived'
'Flight is Currently En Route', 'Scheduled'
'Flight is Currently En Route', 'In Flight'
'Scheduled', 'Delayed'

delete from wrapcache_20090109_no.flightstatus_synonym;

insert into wrapcache_20090109_no.flightstatus_synonym values
('Scheduled','Scheduled'),
('Landed','Landed'),
('Flight is Currently En Route','Flight is Currently En Route'),
('Arrived','Arrived'),
('In Flight','In Flight'),
('Delayed','Delayed'),
('Landed', 'Arrived'),
('Arrived', 'Landed'),
('Flight is Currently En Route', 'In Flight'),
('In Flight','Flight is Currently En Route');


SELECT f.`PR-FlightStatus_14`, y.flightstatus, a.*, f.*, y.*
FROM wrapcache_20090109_no.flytecomm_flight14 y,
     wrapcache_20090109_no.flight14 f,
     wrapcache_20090109_no.airline_codes a
WHERE a.code3 = y.airlinecode and 
      a.code2 = f.airline and
      f.flightnumber = y.flightnumber;

'American Airlines', 'American'
'Alaska Airlines', 'Alaska'
'Delta Air Lines', 'Delta Air Lines'
'Airtran Airways', 'Airtran Airways'
'United Airlines', 'United'
'Southwest Airlines', 'Southwest'

SELECT * FROM wrapcache_20090109_no.flight14 f;

SELECT airline,flightnumber,f.`PR-FlightStatus_14` 
FROM wrapcache_20090109_no.flight14 f;

SELECT f.`airlinename`, f.`flightnumber`, f.`flightstatus` 
FROM wrapcache_20090109_no.flytecomm_flight14 f;


-- target flight14s($PR_AirlineCode2,$PR_FlightNumber,PR_FlightStatus) {wrappers.DBService; http://www.flightstats.com/go/Home/home.do; JLA:flight14s; PR-AirlineCode2,PR-FlightNumber}

insert into wrapcache_20090109_no.sourceid values
(71, 'flight', 'http://www.flightstats.com/go/Home/home.do', 'JLA:flight14s', 'PR-AirlineCode2,PR-FlightNumber', 'METHOD_POST', 'http://www.flightstats.com/go/Home/home.do', 'flight14s', '2009-01-11 20:22:00');

insert into wrapcache_20090109_no.sourceschema values
('flight14s', 0, 'airline', 'PR-AirlineCode2', 1, 'IN'),
('flight14s', 1, 'flightnumber', 'PR-FlightNumber', 1, 'OUT'),
('flight14s', 2, 'PR-FlightStatus_14', 'PR-FlightStatus', 1, 'OUT');

CREATE TABLE  `wrapcache_20090109_no`.`flight14s`
SELECT airline,flightnumber,f.`PR-FlightStatus_14` 
FROM wrapcache_20090109_no.flight14 f;


flight14s($PR_AirlineCode20,$PR_FlightNumber1,PR_FlightStatus2)	:- 
   airline_codes2(_,PR_AirlineCode20,PR_AirlineCode32), 
   flytecomm_flight14( _,PR_FlightNumber1,_,_,_,_,_,_,_,_,_,_,_,_,
   		       PR_FlightStatus2,PR_AirlineCode32).

select  a.code2, f.flightnumber, f.flightstatus, a.code3
from wrapcache_20090109_no.airline_codes2 a, 
     wrapcache_20090109_no.flytecomm_flight14 f
where a.code3 = f.airlinecode;

'FL', '379', 'Scheduled', 'TRS'
'AS', '665', 'Scheduled', 'ASA'
'AS', '665', 'Arrived', 'ASA'
'AA', '2', 'Scheduled', 'AAL'
'AA', '2', 'In Flight', 'AAL'
'AA', '463', 'Scheduled', 'AAL'
'AA', '621', 'Scheduled', 'AAL'
'AA', '621', 'Arrived', 'AAL'
'DL', '1013', 'Scheduled', 'DAL'
'DL', '1013', 'Arrived', 'DAL'
'WN', '452', 'Arrived', 'SWA'
'UA', '1152', 'Scheduled', 'UAL'
'UA', '1152', 'Arrived', 'UAL'
'UA', '1174', 'Scheduled', 'UAL'
'UA', '1174', 'Delayed', 'UAL'
'UA', '1247', 'Scheduled', 'UAL'
'UA', '1247', 'Arrived', 'UAL'

SELECT * FROM wrapcache_20090109_no.flight14s f;
'FL', '379', 'Scheduled'
'AS', '665', 'Landed'
'AA', '2', 'Flight is Currently En Route'
'AA', '463', 'Scheduled'
'AA', '621', 'Landed'
'DL', '1013', 'Landed'
'WN', '452', 'Landed'
'UA', '1152', 'Landed'
'UA', '1174', 'Scheduled'
'UA', '1247', 'Landed'

ALTER TABLE `wrapcache_20090109_no`.`flight14s` 
RENAME TO `wrapcache_20090109_no`.`flight14s_orig`;

create table `wrapcache_20090109_no`.`flight14s`
select * from `wrapcache_20090109_no`.`flight14s_orig`;

-- edited to match seed

update `wrapcache_20090109_no`.`flight14s`
set `PR-FlightStatus_14` = 'Arrived' where `PR-FlightStatus_14` =  'Landed';

'AA', '2', 'In Flight'
'AA', '463', 'Scheduled'
'AA', '621', 'Arrived'
'AS', '665', 'Arrived'
'DL', '1013', 'Arrived'
'FL', '379', 'Scheduled'
'UA', '1152', 'Arrived'
'UA', '1174', 'Scheduled'
'UA', '1247', 'Arrived'
'WN', '452', 'Arrived'

-- flytecomm_flight14s
flytecomm_flight14s($PR_AirlineCode3,$PR_FlightNumber,PR_FlightStatus)
   flight_status(PR_Airline,PR_FlightNumber,PR_FlightStatus),
   airline(PR_Airline,PR_AirlineCode2,PR_AirlineCode3). 
{wrappers.DBService; http://www.flytecomm.com/; JLA:flight14s; PR-Airline,PR-FlightNumber}

insert into wrapcache_20090109_no.sourceid values
(72, 'flight', 'http://www.flytecomm.com/', 'JLA:flight14s', 'PR-Airline,PR-FlightNumber', 'METHOD_POST', 'http://www.flytecomm.com/', 'flytecomm_flight14s', '2009-01-11 22:09:00');

insert into wrapcache_20090109_no.sourceschema values
('flytecomm_flight14s', 0, 'airlinecode', 'PR-AirlineCode3', -1, 'IN'),
('flytecomm_flight14s', 1, 'flightnumber', 'PR-FlightNumber', -1, 'IN'),
('flytecomm_flight14s', 2, 'flightstatus', 'PR-FlightStatus', 1, 'OUT');

CREATE TABLE  `wrapcache_20090109_no`.`flytecomm_flight14s`
SELECT airlinecode,flightnumber,flightstatus
FROM wrapcache_20090109_no.flytecomm_flight14;

'TRS', '379', 'Scheduled'
'ASA', '665', 'Scheduled'
'ASA', '665', 'Arrived'
'AAL', '2', 'Scheduled'
'AAL', '2', 'In Flight'
'AAL', '463', 'Scheduled'
'AAL', '621', 'Scheduled'
'AAL', '621', 'Arrived'
'DAL', '1013', 'Scheduled'
'DAL', '1013', 'Arrived'
'SWA', '452', 'Arrived'
'UAL', '1152', 'Scheduled'
'UAL', '1152', 'Arrived'
'UAL', '1174', 'Scheduled'
'UAL', '1174', 'Delayed'
'UAL', '1247', 'Scheduled'
'UAL', '1247', 'Arrived'

SELECT * FROM wrapcache_20090109_no.flight14s ;

'AA', '2', 'In Flight'
'AA', '463', 'Scheduled'
'AA', '621', 'Arrived'
'AS', '665', 'Arrived'
'DL', '1013', 'Arrived'
'FL', '379', 'Scheduled'
'UA', '1152', 'Arrived'
'UA', '1174', 'Scheduled'
'UA', '1247', 'Arrived'
'WN', '452', 'Arrived'

-- Still doesn't work make them identical

SELECT * FROM wrapcache_20090109_no.flytecomm_flight14s f;

'AAL', '2', 'In Flight'
'AAL', '463', 'Scheduled'
'AAL', '621', 'Arrived'
'ASA', '665', 'Arrived'
'DAL', '1013', 'Arrived'
'SWA', '452', 'Arrived'
'TRS', '379', 'Scheduled'
'UAL', '1152', 'Arrived'
'UAL', '1174', 'Scheduled'
'UAL', '1247', 'Arrived'


DL  1013   1        
AA  621    1
UA  1174   1
AA  463    1
AA  2      1
UA  1247   1
WN  452    1
FL  379    0
AS  665    1
UA  1152   1
WN  463    0
FL  665    0
DL  1152   0
AS  1013   1
AA  1247   0
FL  621    0
AS  2      0
WN  1013   0
DL  665    0
DL  452    0   



SELECT * FROM wrapcache_20090109_no.flytecomm_flight14s f;
'AAL', '2', 'In Flight'
'AAL', '463', 'Scheduled'
'AAL', '621', 'Arrived'
'ASA', '665', 'Arrived'
'DAL', '1013', 'Arrived'
'SWA', '452', 'Arrived'
'TRS', '379', 'Scheduled'
'UAL', '1152', 'Arrived'
'UAL', '1174', 'Scheduled'
'UAL', '1247', 'Arrived'

SELECT * FROM wrapcache_20090109_no.flight14s f;
'AA', '2', 'In Flight'
'AA', '463', 'Scheduled'
'AA', '621', 'Arrived'
'AS', '665', 'Arrived'
'DL', '1013', 'Arrived'
'FL', '379', 'Scheduled'
'UA', '1152', 'Arrived'
'UA', '1174', 'Scheduled'
'UA', '1247', 'Arrived'
'WN', '452', 'Arrived'

SELECT * FROM wrapcache_20090109_no.airline_codes2 a;
'American Airlines', 'AA', 'AAL', 'American'
'Alaska Airlines', 'AS', 'ASA', 'Alaska'
'Delta Air Lines', 'DL', 'DAL', 'Delta Air Lines'
'Airtran Airways', 'FL', 'TRS', 'Airtran Airways'
'United Airlines', 'UA', 'UAL', 'United'
'Southwest Airlines', 'WN', 'SWA', 'Southwest'

SELECT * 
FROM wrapcache_20090109_no.airline_codes2 a,
     wrapcache_20090109_no.flytecomm_flight14s f
where a.code3=f.airlinecode;
'American Airlines', 'AA', 'AAL', 'American', 'AAL', '2', 'In Flight'
'American Airlines', 'AA', 'AAL', 'American', 'AAL', '463', 'Scheduled'
'American Airlines', 'AA', 'AAL', 'American', 'AAL', '621', 'Arrived'
'Alaska Airlines', 'AS', 'ASA', 'Alaska', 'ASA', '665', 'Arrived'
'Delta Air Lines', 'DL', 'DAL', 'Delta Air Lines', 'DAL', '1013', 'Arrived'
'Airtran Airways', 'FL', 'TRS', 'Airtran Airways', 'TRS', '379', 'Scheduled'
'United Airlines', 'UA', 'UAL', 'United', 'UAL', '1152', 'Arrived'
'United Airlines', 'UA', 'UAL', 'United', 'UAL', '1174', 'Scheduled'
'United Airlines', 'UA', 'UAL', 'United', 'UAL', '1247', 'Arrived'
'Southwest Airlines', 'WN', 'SWA', 'Southwest', 'SWA', '452', 'Arrived'

-- source airline_flights($PR_AirlineCode2,PR_FlightNumber) :- flight_status(PR_Airline,PR_FlightNumber,PR_FlightStatus),airline(PR_Airline,PR_AirlineCode2,PR_AirlineCode3). {wrappers.DBService; http://jla.airline_flights.com/; JLA; PR-AirlineCode2}

airline_flights($PR_AirlineCode2,PR_FlightNumber) :- 
  flight_status(PR_Airline,PR_FlightNumber,PR_FlightStatus),
  airline(PR_Airline,PR_AirlineCode2,PR_AirlineCode3). 
{wrappers.DBService; http://jla.airline_flights.com/; JLA; PR-AirlineCode2}

insert into wrapcache_20090109_no.sourceid values
(73, 'flight', 'http://jla.airline_flights.com/', 'JLA', 'PR-AirlineCode2', 'METHOD_POST', 'http://jla.airline_flights.com/', 'airline_flights', '2009-01-11 23:39:00');

insert into wrapcache_20090109_no.sourceschema values
('airline_flights', 0, 'airlinecode2', 'PR-AirlineCode2', -1, 'IN'),
('airline_flights', 1, 'flightnumber', 'PR-FlightNumber', 1, 'OUT');

CREATE TABLE  wrapcache_20090109_no.airline_flights
SELECT airline as airlinecode2,flightnumber
FROM wrapcache_20090109_no.flight14s;

SELECT * FROM wrapcache_20090109_no.sourceschema 
where tablename in ('airline_flights', 'airline_codes2', 'flytecomm_flight14s', 'flight14s')
order by tablename,argumentno;

SELECT * FROM wrapcache_20090109_no.sourceid 
where tablename in ('airline_flights', 'airline_codes2', 'flytecomm_flight14s', 'flight14s');

SELECT * FROM wrapcache_20090109_no.sourceid 
where tablename like 'fly%' and formmethod = 'METHOD_GET';

update `wrapcache_20090109_no`.`sourceid`
set formtypes = 'PR-FlightNumber,PR-AirlineCode3' 
where tablename like 'fly%' and formmethod = 'METHOD_GET';

-- true positives

SELECT * FROM wrapcache_081223b_no.sourceid 
where tablename in ('weather14', 'weather45', 'weather25', 'weather49', 'weather56', 'weather6', 'weather76', 'weather83', 'weather86', 'weather88', 'weather9', 'weather96', 'weather30', 'weather59', 'weather61')
order by url;

