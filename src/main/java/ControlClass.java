import java.io.*;
import javax.naming.NamingException;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.http.HttpServlet;
import javax.websocket.server.ServerEndpoint;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Iterator;

import Databases.SQLiteClass;
import org.json.JSONObject;
import org.json.JSONException;

public class ControlClass extends HttpServlet {
    public static boolean checkKeyGen(String name, String key) throws ClassNotFoundException, SQLException, NamingException {
        SQLiteClass.Conn();
        boolean answer = SQLiteClass.checkKeyGenDb(key);

        //запись в базу данных
        SQLiteClass.addUserDatabase(name, key);

        SQLiteClass.CloseDB();
        return answer;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        try {
            response.setContentType("text/html;charset=UTF-8");


            JSONObject jsonToReturn = new JSONObject();
            jsonToReturn.put("answer", "ok");
            out.println(jsonToReturn.toString());


        } catch (Exception e) {
            JSONObject jsonToReturn = new JSONObject();
            jsonToReturn.put("answer", e.toString());
            out.println(jsonToReturn.toString());
            //System.out.println(e);
        }
    }
}
