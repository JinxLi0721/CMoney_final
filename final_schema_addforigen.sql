CREATE DATABASE  IF NOT EXISTS `test1_schema` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `test1_schema`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: test1_schema
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `distractions`
--

DROP TABLE IF EXISTS `distractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distractions` (
  `id_distraction` int NOT NULL AUTO_INCREMENT,
  `id_pomodoro` int NOT NULL,
  `distraction_round` int DEFAULT NULL,
  `distraction_time` time DEFAULT NULL,
  PRIMARY KEY (`id_distraction`),
  KEY `id_pomodoro_idx` (`id_pomodoro`),
  CONSTRAINT `id_pomodoro` FOREIGN KEY (`id_pomodoro`) REFERENCES `pomodoros` (`id_pomodoro`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11101186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distractions`
--

LOCK TABLES `distractions` WRITE;
/*!40000 ALTER TABLE `distractions` DISABLE KEYS */;
/*!40000 ALTER TABLE `distractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `id_friend_list` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_friend_user` int NOT NULL,
  `request` enum('refuse','send','accept') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id_friend_list`),
  KEY `fuser_idx` (`id_user`),
  KEY `fuser_friend_idx` (`id_friend_user`),
  CONSTRAINT `fuser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fuser_friend` FOREIGN KEY (`id_friend_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,1,57,'accept'),(2,56,53,'accept'),(3,57,58,'refuse'),(4,57,60,'accept'),(6,56,57,'accept'),(17,57,56,'refuse'),(18,1,62,'send');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `letters`
--

DROP TABLE IF EXISTS `letters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `letters` (
  `id_letter` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_send_user` int DEFAULT NULL,
  `letter_title` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `content` varchar(600) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_letter`,`read`),
  KEY `id_user_letter_idx` (`id_user`),
  KEY `luser_send_idx` (`id_send_user`),
  CONSTRAINT `luser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `luser_send` FOREIGN KEY (`id_send_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `letters`
--

LOCK TABLES `letters` WRITE;
/*!40000 ALTER TABLE `letters` DISABLE KEYS */;
INSERT INTO `letters` VALUES (9,53,1,'你好嗎','一起念書啊',0),(10,56,57,'你好嗎','一起念書啊',0),(12,58,57,'你好嗎','我又來了',0),(13,57,56,'你好嗎','好冷喔',0),(14,57,56,'你好嗎','好冷喔',0),(15,57,56,'真難過','好冷喔',1),(16,57,60,'真難過','好冷喔',0);
/*!40000 ALTER TABLE `letters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id_message` int NOT NULL AUTO_INCREMENT,
  `id_room` int NOT NULL,
  `id_user` int DEFAULT NULL,
  `message` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id_message`),
  KEY `muser_idx` (`id_user`),
  KEY `mroom_idx` (`id_room`),
  CONSTRAINT `mroom` FOREIGN KEY (`id_room`) REFERENCES `study_rooms` (`id_room`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `muser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pomodoros`
--

DROP TABLE IF EXISTS `pomodoros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pomodoros` (
  `id_pomodoro` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `start_date_time` datetime NOT NULL,
  `end_date_time` datetime NOT NULL,
  `focus_min` int NOT NULL,
  `round` int NOT NULL,
  `distractions_count` int NOT NULL,
  PRIMARY KEY (`id_pomodoro`),
  KEY `id_user_pomotoro_idx` (`id_user`),
  CONSTRAINT `id_user_pomotoro` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11101185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pomodoros`
--

LOCK TABLES `pomodoros` WRITE;
/*!40000 ALTER TABLE `pomodoros` DISABLE KEYS */;
/*!40000 ALTER TABLE `pomodoros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id_question` int NOT NULL AUTO_INCREMENT,
  `id_question_user` int DEFAULT NULL,
  `id_room` int DEFAULT NULL,
  `question` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_like` int NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  PRIMARY KEY (`id_question`),
  KEY `quser_idx` (`id_question_user`),
  KEY `qroom_idx` (`id_room`),
  CONSTRAINT `qroom` FOREIGN KEY (`id_room`) REFERENCES `study_rooms` (`id_room`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quser` FOREIGN KEY (`id_question_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (5,52,2020002,'不想努力怎麼辦',10,'2020-12-31'),(6,60,2020003,'想睡怎麼辦',3,'2020-12-31'),(7,60,2020003,'念不完怎麼辦',1,'2020-12-31'),(8,60,2020003,'想放棄了啦',0,'2021-01-06'),(10,60,2020004,'你說說要怎麼辦',0,'2021-01-09'),(29,53,2020002,'cghfgh',1,'2021-01-11'),(30,53,2020002,'酷噢哈哈哈',0,'2021-01-11'),(31,60,2020004,'你說說要怎麼辦',0,'2021-01-12'),(32,62,2020002,'你說說要怎麼辦',0,'2021-01-12'),(33,62,2020002,'aaa',0,'2021-01-12'),(34,62,2020002,'aaa',0,'2021-01-12'),(35,62,2020002,'問問題真有趣',0,'2021-01-12'),(36,62,2020002,'甚麼是怎麼半?',0,'2021-01-12'),(37,62,2020002,'aaaa',0,'2021-01-12'),(38,62,2020002,'aaa',0,'2021-01-12'),(39,62,2020002,'aaa',0,'2021-01-12'),(40,62,2020002,'bbb',0,'2021-01-12'),(41,62,2020002,'bbb',0,'2021-01-12'),(42,62,2020002,'沒問題?',0,'2021-01-12'),(43,62,2020002,'有空多寫一些code',0,'2021-01-12'),(44,62,2020002,'有沒有人在?',0,'2021-01-13'),(47,137,2020004,'有甚麼夢想嗎?',0,'2021-01-13'),(50,62,2020004,'真討厭',0,'2021-01-14'),(53,62,2020003,'1111',0,'2021-01-14'),(54,1,2020004,'?',0,'2021-01-14');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `replies` (
  `id_reply` int NOT NULL AUTO_INCREMENT,
  `id_reply_user` int DEFAULT NULL,
  `id_question` int DEFAULT NULL,
  `reply` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `reply_like` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_reply`),
  KEY `ruser_idx` (`id_reply_user`),
  KEY `rquestion_idx` (`id_question`),
  CONSTRAINT `rquestion` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id_question`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ruser` FOREIGN KEY (`id_reply_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `replies`
--

LOCK TABLES `replies` WRITE;
/*!40000 ALTER TABLE `replies` DISABLE KEYS */;
INSERT INTO `replies` VALUES (2,60,5,'不想努力',2),(3,60,6,'別難過',0),(5,58,6,'現在努力還來得及',1),(6,1,10,'去睡覺',5),(8,1,10,'好冷喔',1),(9,1,10,'好冷喔',0),(10,1,10,'好冷喔',0),(11,53,NULL,'okok',0),(12,53,NULL,'NO~~~',0),(13,53,NULL,'LaLaLa',0),(14,53,10,'123',0),(15,53,29,'sf',0),(16,53,30,'幹嘛',0),(17,124,8,'ok',0),(18,62,5,'不行啦!加油',0),(19,62,29,'說話啊!',0),(20,62,30,'怎麼自己回?',0),(21,62,32,'在嘛?',0),(22,62,43,'好啊',0),(23,62,33,'好開心',0),(24,62,7,'自問自答好玩嘛',0),(25,62,8,'好狠',0),(26,137,10,'我怎麼知道',0),(27,62,NULL,'aaaa',0),(28,124,30,'明天会更好的人们的人们的人们的人员工程部队友人',0),(29,62,NULL,'真好',0),(30,62,NULL,'有想過',0),(31,151,NULL,'shelly is here',0),(32,53,NULL,'hi',0),(33,62,NULL,'ear',0),(34,62,NULL,'wew',0),(35,62,NULL,'llllkkkk0099;;;;',0),(36,62,NULL,'llllkkkk0099;;;;',0),(37,62,NULL,'llllkkkk0099;;;;',0),(38,62,NULL,'llllkkkk0099;;;;',0),(39,62,NULL,'llllkkkk0099',0),(40,62,NULL,'llllkkkk0099;;;;',0),(41,62,NULL,'llllkkkk0099;;;;',0),(42,62,NULL,'llllkkkk0099;;;;',0),(43,62,NULL,'llllkkkk0099;;;;',0),(44,62,NULL,'llllkkkk0099;;;;',0),(45,62,NULL,'llllkkkk0099;;;;',0),(46,62,NULL,'llllkkkk0099;;;;',0),(47,62,NULL,'llllkkkk0099;;;;',0),(48,124,NULL,'嗚嗚嗚嗚',0),(49,124,43,'鶯鶯燕燕',0);
/*!40000 ALTER TABLE `replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_rooms`
--

DROP TABLE IF EXISTS `study_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_rooms` (
  `id_room` int NOT NULL AUTO_INCREMENT,
  `room_name` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `id_user` int NOT NULL,
  `room_description` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `room_focus_min` int NOT NULL DEFAULT '25',
  `room_rest_min` int NOT NULL DEFAULT '5',
  `establish_time` bigint NOT NULL,
  PRIMARY KEY (`id_room`),
  KEY `sruser_idx` (`id_user`),
  CONSTRAINT `sruser` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2020089 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_rooms`
--

LOCK TABLES `study_rooms` WRITE;
/*!40000 ALTER TABLE `study_rooms` DISABLE KEYS */;
INSERT INTO `study_rooms` VALUES (2020002,'基測自習室',1,'大家一起來努力！',20,10,1611904203652),(2020003,'wordpress自學',1,'好難啊~一起加油!',25,10,1611904203652),(2020004,'護理師國考',1,'一起過N2啊~',20,5,1611904203652),(2020088,'職能治療師國考',1,'解剖好難喔QQ',30,10,1611904203652);
/*!40000 ALTER TABLE `study_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registerDate` date NOT NULL,
  `introduction` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '寫下你的自我介紹，讓大家認識你吧',
  `total_focus_time` time NOT NULL,
  `day_focus_time` int DEFAULT NULL,
  `week_focus_time` int DEFAULT NULL,
  `img` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `id_UNIQUE` (`id_user`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `account_UNIQUE` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'JO-STUDY','JO-STUDY','cmoney','JoStudy','2020-12-28','歡迎大家來JoStudy，找到和你一起努力的夥伴吧！你能夠做到你想做到的事！','106:46:13',NULL,NULL,'1610687672617_393232a6f31fc0883a33f92fc0d8209d.jpg'),(52,'ppp','app','oo','我最棒','2020-12-28','000','18:47:06',NULL,NULL,NULL),(53,'123@123','123','123','123','2020-12-27','hi','43:27:49',NULL,NULL,'1610680637468_image-1610680637470.jpg'),(55,'111','qqq','oo','阿呆','2020-12-28','哈囉','21:04:35',NULL,NULL,NULL),(56,'pop','pp','pop','阿呆','2020-12-28',NULL,'00:09:03',NULL,NULL,NULL),(57,'qw','qw','oo','學生','2020-12-28',NULL,'00:09:07',NULL,NULL,NULL),(58,'gavie0710@gmail.com','gavie0710@gmail.com','1111','陳立洋','2020-12-28',NULL,'00:06:35',NULL,NULL,NULL),(60,'admin@admin.com','Leon0710','1111','陳立洋','2020-12-28',NULL,'00:29:44',NULL,NULL,NULL),(62,'ctp258@msa.hinet.net','123456','1111','立洋','2020-12-28','好想學會dot net ','41:20:49',NULL,NULL,'1610615801093_man_05.jpg'),(63,'qpp','ppp','oo','有趣','2020-12-30',NULL,'00:12:12',NULL,NULL,NULL),(64,'qwqw','qwqw','zzz','ttt','2021-01-06',NULL,'00:00:00',0,0,NULL),(85,'nnn','nnnn','nnn','nnn','2021-01-08','000','00:25:09',0,0,'1610204453904_2020-06-04.png'),(88,'1121','1111','123',NULL,'2021-01-09',NULL,'00:00:00',0,0,NULL),(112,'12121','12112','nnnn','1211','2021-01-09',NULL,'00:00:00',0,0,'1610214079515_07d61707edad0789b6d07368470f2b62.jpg'),(116,'122','12','nnnn','1211','2021-01-11',NULL,'00:00:00',0,0,'1610344971727_001.jpg'),(124,'000@yahoo.com','000','000','000000000','2021-01-11','hi everyone','05:02:07',0,0,'image-1610358011478.jpg'),(125,'2020002','2020002','2020002','Jane','2021-01-11',NULL,'00:00:00',0,0,'1610360363748_unnamed.jpg'),(126,'2020003','2020003','2020003','Rax','2021-01-11',NULL,'00:00:00',0,0,'1610360410658_bc14ccfcd26e98b868ada19f0307e99b.jpg'),(127,'2020004','2020004','2020004','Tom','2021-01-11',NULL,'00:00:00',0,0,'1610360458801_3d57d287275006fa390c67aae99d9c28.jpg'),(128,'2020005','2020005','2020005','Bob','2021-01-11',NULL,'00:00:00',0,0,'1610360574982_671ecbbc95a75f9c3effc6264e8f9a75.jpg'),(129,'2020009','2020009','2020009','Ann','2021-01-11',NULL,'00:00:00',0,0,'2a6451f8b8734dc5dfd33679933db00a.jpg'),(130,'2020013','2020013','2020013','Peter','2021-01-11',NULL,'00:00:00',0,0,'ae9857d761890020ef37eb171b217a0b.png'),(131,'2020014','2020014','2020014','Fred','2021-01-11',NULL,'00:00:00',0,0,'ecbddbddd7bc0c1ecf849d22681c32d3.jpg'),(132,'2020015','2020015','2020015','Gina','2021-01-11',NULL,'00:00:00',0,0,'unnamed (1).jpg'),(134,'k@k.k','abc','abc','不想努力了','2021-01-11',NULL,'00:03:20',0,0,'image-1610390574749.jpg'),(136,'w@w.嗨','www','www','AWAY','2021-01-11','我不想努力了阿姨','00:01:03',0,0,'image-1610391785207.jpg'),(137,'aabbcc@gmail.com','aabbcc','123456','張三','2021-01-13',NULL,'00:01:14',0,0,NULL),(138,'flyKnife@gmail.com','flyKnife','1111','小李飛刀','2021-01-14',NULL,'00:00:00',0,0,NULL),(139,'999@gmail.com','9999','1111','9999','2021-01-14',NULL,'00:00:00',0,0,NULL),(141,'tryseesee@gmail.com','tryseesee','1111','再看看','2021-01-14',NULL,'00:00:00',0,0,NULL),(142,'5555@gmail.com','5555','1111','5555','2021-01-14',NULL,'01:23:52',0,0,'1610626901217_man_04.jpg'),(143,'55555@gmail.com','55555','1111','55555','2021-01-14',NULL,'00:00:00',0,0,NULL),(144,'leonchen@gmail.com','leonchen','1111','leonchen','2021-01-15',NULL,'00:02:28',0,0,'image-1610683787475.jpg'),(145,'an2021@2021.com','an2021','an2021','An','2021-01-15',NULL,'00:00:00',0,0,'image-1610687718976.jpg'),(149,'k@y.m','hhh','hhh','萊納你坐阿','2021-01-15','對不起艾倫','00:07:23',0,0,'image-1610688296894.jpg'),(150,'','','','','2021-01-15',NULL,'00:00:00',0,0,NULL),(151,'shelly_chou@cmoney.net.tw','shelly','1234','shelly','2021-01-15','null','00:08:47',0,0,'1610693563953_393232a6f31fc0883a33f92fc0d8209d.jpg'),(153,'aaaaa','12345','11111','1111','2021-01-15',NULL,'00:00:00',0,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-29 15:14:33
