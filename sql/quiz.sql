

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` tinyint(4) NOT NULL,
  `question` varchar(200) NOT NULL,
  `choice1` varchar(50) NOT NULL,
  `choice2` varchar(50) NOT NULL,
  `choice3` varchar(50) NOT NULL,
  `choice4` varchar(50) NOT NULL,
  `answer` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `score` tinyint(4) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `questions` (`id`, `question`, `choice1`, `choice2`, `choice3`, `choice4`, `answer`) VALUES
(1, 'What keyword is used to declare a variable in JavaScript?',  'var',  'const',  'let',  'assign', 'var'),
(2, 'What keyword is used to declare a constant in JavaScript?',  'var',  'const',  'let',  'assign', 'const'),
(3, 'In what year was JavaScript created?', '1990', '1995', '1998', '2000', '1995');