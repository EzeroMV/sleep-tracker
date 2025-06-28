package practica.sleepTracker.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import practica.sleepTracker.Entity.User;
import practica.sleepTracker.service.UserService;
import practica.sleepTracker.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Разрешаем запросы с Angular
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    private UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
    this.userService = userService;
    this.userRepository = userRepository;
}
    
    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
    Optional<User> foundUser = userRepository.findByUserName(user.getUserName());
    
    if (foundUser.isPresent()) {
        
        boolean matches = userService.checkPassword(user.getUserPassword(), foundUser.get().getUserPassword());
        
        if (matches) {
            return ResponseEntity.ok("OK");
        }
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверное имя пользователя или пароль");
}
    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.noContent().build();
    }
}