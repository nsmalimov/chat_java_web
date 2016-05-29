import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class MyServlet extends HttpServlet {

    private ServletConfig config;

    String page = "/index.jsp";

    public void init(ServletConfig config)
            throws ServletException {
        this.config = config;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)

            throws ServletException, IOException {

        PrintWriter out = response.getWriter();

        response.setContentType("text/html");

        String data = "Hello World!";

        request.setAttribute("textA", "111");

        RequestDispatcher dispatcher = request.getRequestDispatcher(page);

        if (dispatcher != null) {

            dispatcher.forward(request, response);

        }
    }

    String name = "";

    public String getName() {
        Connection conn = null;
        try {
            Context ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup("java:/comp/env/jdbc/myapp");

            conn = ds.getConnection();
            Statement stat = conn.createStatement();

            ResultSet rs = stat.executeQuery("select userKey from freeUsers");
            this.name = rs.getString(1);
        } catch (SQLException se) {
            return se.toString();
        } catch (NamingException ne) {
            return ne.toString();
        } finally {
            try {
                if (conn != null) conn.close();
            } catch (SQLException e) {
                return e.toString();
            }
        }
        return this.name;
    }
}
