package practica.sleepTracker.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class Auth {

    public static String getAuthenticatedUsername(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }

        Object username = session.getAttribute("username");
        return (username instanceof String) ? (String) username : null;
    }

    public static void unauthorizedIfNotLoggedIn(HttpServletRequest request) {
        if (getAuthenticatedUsername(request) == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Пользователь не авторизован");
        }
    }
}
