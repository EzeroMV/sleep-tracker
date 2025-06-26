Create table Users(
	UserName TEXT Primary key,
	UserPassword TEXT Not null,
	Email TEXT Not null unique
);
Create table Sleep_sessions(
	SessionID SERIAL PRIMARY KEY,
	UserName TEXT Not null,
	TimeSleep TIMESTAMP not null,
	TimeWakeup TIMESTAMP not null,
	CONSTRAINT fk_User
		Foreign key (UserName)
		References Users(UserName),
	CONSTRAINT check_time 
	CHECK (TimeWakeup > TimeSleep)
);
Create table Sleep_quality(
	SessionId INT PRIMARY KEY,
	FeelingScore int not null
	Check (FeelingScore <= 5 and FeelingScore >= 0),
	SleepScore int not null
	Check (SleepScore <= 5 and SleepScore >= 0),
	WakeupCount int not null
	Check (WakeupCount >= 0),
	CONSTRAINT fk_session
		Foreign key (SessionID)
		References Sleep_sessions(SessionID)	
);
Create table Sleep_factors(
	SessionID INT PRIMARY KEY,
	Coffee bool not null,
	Alcohol bool not null,
	StressScore int not null
	Check (StressScore <= 5 and StressScore >= 0),
	PhysActiv int not null
	Check (PhysActiv <= 5 and PhysActiv >= 0),
	CONSTRAINT fk_User
		Foreign key (SessionID)
		References Sleep_sessions(SessionID)
);
Insert Into Users(UserName, UserPassword, Email) VALUES
	('Admin1','1234','admin1@email.ru');
INSERT INTO Sleep_sessions (UserName, TimeSleep, TimeWakeup) VALUES
    ('Admin1', '2023-11-01 22:30:00', '2023-11-02 06:15:00'),
    ('Admin1', '2023-11-02 23:15:00', '2023-11-03 07:00:00'),
    ('Admin1', '2023-11-01 21:45:00', '2023-11-02 05:30:00'),
    ('Admin1', '2023-11-02 00:30:00', '2023-11-02 08:45:00');
INSERT INTO Sleep_quality (SessionID, FeelingScore, SleepScore, WakeupCount) VALUES
    (1, 4, 4, 2),
    (2, 4, 5, 1),
    (3, 3, 4, 3),
    (4, 2, 2, 0);
INSERT INTO Sleep_factors (SessionID, Coffee, Alcohol, StressScore, PhysActiv) VALUES
    (1, TRUE, FALSE, 5, 3),
    (2, FALSE, TRUE, 3, 2),
    (3, TRUE, FALSE, 4, 4),
    (4, FALSE, FALSE, 4, 3);
SELECT * FROM Users;
SELECT * FROM Sleep_sessions;
SELECT * FROM Sleep_quality;
SELECT * FROM Sleep_factors;

SELECT s.SessionID, s.UserName, u.Email
FROM Sleep_sessions s
JOIN Users u ON s.UserName = u.UserName;
