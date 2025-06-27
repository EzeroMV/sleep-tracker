package practica.sleepTracker.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "sleep_quality")
public class SleepQuality {
    @Id
    @Column(name = "sessionid")
    private Integer sessionId;

    @OneToOne
    @MapsId 
    @JoinColumn(name = "sessionid")
    @JsonBackReference
    private SleepSession sleepSession;
    
    @Min(0) @Max(5)
    @Column(name = "feelingscore", nullable = false)
    private Integer feelingScore;
    @Min(0) @Max(5)
    @Column(name = "sleepscore", nullable = false)
    private Integer sleepScore;
    @Min(0)
    @Column(name = "wakeupcount", nullable = false)
    private Integer wakeupCount;

    public Integer getWakeupCount() {
        return wakeupCount;
    }

    public Integer getSessionId() {
        return sessionId;
    }
    public Integer getFeelingScore()
    {
        return feelingScore;
    }
    public Integer getSleepScore()
    {
        return sleepScore;
    }   

    public void setWakeupCount(Integer wakeupCount) {
        this.wakeupCount = wakeupCount;
    }
    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }
    public void setFeelingScore(Integer feelingScore)
    {
        this.feelingScore = feelingScore;
    }
    public void setSleepScore(Integer sleepScore)
    {
        this.sleepScore = sleepScore;
    }

    public SleepQuality(){
    }

    public SleepQuality(Integer sessionId, Integer feelingScore, Integer sleepScore, Integer wakeupCount) {
        this.sessionId = sessionId;
        this.feelingScore = feelingScore;
        this.sleepScore = sleepScore;
        this.wakeupCount = wakeupCount;
    }

    public SleepSession getSleepSession() {
        return sleepSession;
    }

    public void setSleepSession(SleepSession sleepSession) {
        this.sleepSession = sleepSession;
    }
}
