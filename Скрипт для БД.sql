Create table Users(
	UserName TEXT Primary key,
	UserPassword TEXT Not null,
	Email TEXT Not null unique
);
Create table SleepSession(
	SessionID INT PRIMARY KEY,
	UserName TEXT Not null,
	TimeSleep TIMESTAMP not null,
	TimeWakeup TIMESTAMP not null,
	CONSTRAINT fk_User
		Foreign key (UserName)
		References Users(UserName),
	CONSTRAINT check_time 
	CHECK (TimeWakeup > TimeSleep)
);
Create table SleepQuality(
	SessionId INT PRIMARY KEY,
	FeelingScore int not null
	Check (FeelingScore <= 5 and FeelingScore >= 0),
	SleepScore int not null
	Check (SleepScore <= 5 and SleepScore >= 0),
	WakeupCount int not null
	Check (WakeupCount >= 0),
	CONSTRAINT fk_session
		Foreign key (SessionID)
		References SleepSession(SessionID)	
);
Create table SleepFactors(
	SessionID INT PRIMARY KEY,
	Coffee bool not null,
	Alcohol bool not null,
	StressScore int not null
	Check (StressScore <= 5 and StressScore >= 0),
	PhysActiv int not null
	Check (PhysActiv <= 5 and PhysActiv >= 0),
	CONSTRAINT fk_User
		Foreign key (SessionID)
		References SleepSession(SessionID)
);
Insert Into Users(UserName, UserPassword, Email) VALUES
	('Admin1','1234','admin1@email.ru');
INSERT INTO SleepSession (SessionID, UserName, TimeSleep, TimeWakeup) VALUES
    (1, 'Admin1', '2023-11-01 22:30:00', '2023-11-02 06:15:00'),
    (2, 'Admin1', '2023-11-02 23:15:00', '2023-11-03 07:00:00'),
    (3, 'Admin1', '2023-11-01 21:45:00', '2023-11-02 05:30:00'),
    (4, 'Admin1', '2023-11-02 00:30:00', '2023-11-02 08:45:00');
INSERT INTO SleepQuality (SessionID, FeelingScore, SleepScore, WakeupCount) VALUES
    (1, 4, 4, 2),
    (2, 4, 5, 1),
    (3, 3, 4, 3),
    (4, 2, 2, 0);
INSERT INTO SleepFactors (SessionID, Coffee, Alcohol, StressScore, PhysActiv) VALUES
    (1, TRUE, FALSE, 5, 3),
    (2, FALSE, TRUE, 3, 2),
    (3, TRUE, FALSE, 4, 4),
    (4, FALSE, FALSE, 4, 3);
SELECT * FROM Users;
SELECT * FROM SleepSession;
SELECT * FROM SleepQuality;
SELECT * FROM SleepFactors;

SELECT s.SessionID, s.UserName, u.Email
FROM SleepSession s
JOIN Users u ON s.UserName = u.UserName;
