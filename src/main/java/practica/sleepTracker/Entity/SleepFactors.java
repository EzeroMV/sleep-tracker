package practica.sleepTracker.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "sleep_factors")
public class SleepFactors {

    @Id
    @Column(name = "sessionid")
    private Integer sessionId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "sessionid")

    @JsonBackReference
    private SleepSession sleepSession;

    @Column(name = "coffee", nullable = false)
    private Boolean coffee;

    @Column(name = "alcohol", nullable = false)
    private Boolean alcohol;
    @Min(0)
    @Max(5)
    @Column(name = "stressscore", nullable = false)
    private Integer stressScore;
    @Min(0)
    @Max(5)
    @Column(name = "physactiv", nullable = false)
    private Integer physicalActivity;

    public Integer getSessionId() {
        return sessionId;
    }

    public Integer getPhysicalActivity() {
        return physicalActivity;
    }

    public boolean getCoffee() {
        return coffee;
    }

    public boolean getAlcohol() {
        return alcohol;
    }

    public Integer getStressScore() {
        return stressScore;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public void setPhysicalActivity(Integer physicalActivity) {
        this.physicalActivity = physicalActivity;
    }

    public void setCoffee(boolean coffee) {
        this.coffee = coffee;
    }

    public void setAlcohol(boolean alcohol) {
        this.alcohol = alcohol;
    }

    public void setStressScore(Integer stressScore) {
        this.stressScore = stressScore;
    }

    public SleepFactors() {
    }

    public SleepFactors(Integer sessionId, Integer physicalActivity, boolean coffee, boolean alcohol,
            Integer stressScore) {
        this.sessionId = sessionId;
        this.physicalActivity = physicalActivity;
        this.coffee = coffee;
        this.alcohol = alcohol;
        this.stressScore = stressScore;
    }

    public SleepSession getSleepSession() {
        return sleepSession;
    }

    public void setSleepSession(SleepSession sleepSession) {
        this.sleepSession = sleepSession;
    }
}
