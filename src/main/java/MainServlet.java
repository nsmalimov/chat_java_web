import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MainServlet extends HttpServlet {

    public static boolean userExist(String keyUser) {
        return true;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Cookie cookie = null;
        Cookie[] cookies = null;
        cookies = request.getCookies();

        if (cookies != null) {
            response.setContentType("text/html");
            RequestDispatcher dispatcherChat = request.getRequestDispatcher("chat.html");
            if (dispatcherChat != null) {
                dispatcherChat.forward(request, response);
            }
        }
        //куки небыли присланы
        else {
            response.setContentType("text/html");
            RequestDispatcher dispatcherAuto = request.getRequestDispatcher("autorization.html");
            if (dispatcherAuto != null) {
                dispatcherAuto.forward(request, response);
            }
        }
    }
}
