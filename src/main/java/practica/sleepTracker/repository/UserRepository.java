package practica.sleepTracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import practica.sleepTracker.Entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
    Optional<User> findByUserName(String userName);
}