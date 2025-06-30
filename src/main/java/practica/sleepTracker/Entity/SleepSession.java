package practica.sleepTracker.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
//import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonManagedReference;
//import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "sleep_sessions")
public class SleepSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sessionid")
    private Integer sessionId;

    @Column(name = "username", nullable = false, insertable = true, updatable = false)
    private String userName; // Основное поле для хранения

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "username", referencedColumnName = "username", insertable = false, updatable = false, nullable = false)
    private User user;

    @Column(name = "timesleep", nullable = false)
    private LocalDateTime timeSleep;

    @Column(name = "timewakeup", nullable = false)
    private LocalDateTime timeWakeup;

    @OneToOne(mappedBy = "sleepSession", cascade = CascadeType.ALL)
    @JsonManagedReference
    private SleepQuality sleepQuality;

    @OneToOne(mappedBy = "sleepSession", cascade = CascadeType.ALL)
    @JsonManagedReference
    private SleepFactors sleepFactors;

    public Integer getSessionId() {
        return sessionId;
    }

    public User getUser() {
        return user;
    }

    public String getUserName() {
        return userName;
    }

    public LocalDateTime getTimeSleep() {
        return timeSleep;
    }

    public LocalDateTime getTimeWakeup() {
        return timeWakeup;
    }

    public void setUser(User user) {
        this.user = user;
        this.userName = user != null ? user.getUserName() : null;
    }

    public void setUserName(String username) {
        this.userName = username;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public void setTimeSleep(LocalDateTime timeSleep) {
        this.timeSleep = timeSleep;
    }

    public void setTimeWakeup(LocalDateTime timeWakeup) {
        if (timeWakeup.isBefore(getTimeSleep())) {
            throw new IllegalArgumentException("Время пробуждения должно быть позже времени сна");
        } else {
            this.timeWakeup = timeWakeup;
        }
    }

    public SleepSession() {
    }

    public SleepSession(User user, LocalDateTime timeSleep, LocalDateTime timeWakeup) {
        this.user = user;
        this.timeSleep = timeSleep;
        this.timeWakeup = timeWakeup;
    }

    public SleepQuality getSleepQuality() {
        return sleepQuality;
    }

    public void setSleepQuality(SleepQuality quality) {
        if (quality == null) {
            if (this.sleepQuality != null) {
                this.sleepQuality.setSleepSession(null);
            }
        } else {
            quality.setSleepSession(this);
        }
        this.sleepQuality = quality;
    }

    public SleepFactors getSleepFactors() {
        return sleepFactors;
    }

    public void setSleepFactors(SleepFactors factors) {
        if (factors == null) {
            if (this.sleepFactors != null) {
                this.sleepFactors.setSleepSession(null);
            }
        } else {
            factors.setSleepSession(this);
        }
        this.sleepFactors = factors;
    }

}
