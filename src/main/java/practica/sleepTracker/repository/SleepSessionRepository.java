package practica.sleepTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import practica.sleepTracker.Entity.SleepSession;
import practica.sleepTracker.Entity.User;
import practica.sleepTracker.dto.SleepDurationWithScore;

import java.util.List;

public interface SleepSessionRepository extends JpaRepository<SleepSession, Integer> {

    List<SleepSession> findByUser(User user);

    @Query(value = """
    SELECT 
        s.sessionid AS sessionId, 
        EXTRACT(EPOCH FROM (s.timewakeup - s.timesleep)) / 3600 AS sleepTime,
        q.sleepscore AS sleepScore
    FROM 
        sleep_sessions s
    JOIN 
        sleep_quality q ON s.sessionid = q.sessionid
    WHERE 
        s.username = :userName
    """, nativeQuery = true)
    List<SleepDurationWithScore> findDurationsWithScore(@Param("userName") String userName);

}
