import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.http.HttpServlet;
import javax.websocket.server.ServerEndpoint;
import java.text.ParseException;
import java.util.Iterator;
import org.json.JSONObject;
import org.json.JSONException;

public class ControlClass extends HttpServlet {
    public static boolean checkAutorization(String name, String key)
    {
        System.out.println("doCommandType");
        return true;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Cookie cookie = null;
        Cookie[] cookies = null;
        cookies = request.getCookies();

        if(cookies != null ){
            for (int i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                if ("userKey".equals(cookie.getName())){
                    System.out.println(cookie.getValue());
                }
            }
        }



        response.setContentType("text/html");
        RequestDispatcher dispatcher = request.getRequestDispatcher("chat.html");
        if (dispatcher != null) {
            dispatcher.forward(request, response);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

//        try {
//            //response.setContentType("application/json");
//            PrintWriter out = response.getWriter();
//            JSONObject jsonToReturn = new JSONObject();
//
//            jsonToReturn.put("JSON", "Hello, World!").toString();
//
//            out.println(jsonToReturn);
//
//        }
//        catch (JSONException jse)
//        {
//           System.out.println(jse);
//        }

        StringBuilder jb = new StringBuilder();
        String line = null;

        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            System.out.println(e);
        }

        try {
            JSONObject jsonObject = new JSONObject(jb.toString());
            Iterator it = jsonObject.keys();

            while(it.hasNext())
            {
                String key = it.next().toString();
                Object o = jsonObject.get(key);
                if (key.equals("command"))
                {
                    int command = 1;
                    switch (command) {
                        case 1:  //авторизация
                            String name = (String) jsonObject.get("name");
                            String keygen = (String) jsonObject.get("keygen");

                            Cookie acssesKeyCook = new Cookie("userKey", (String) jsonObject.get("randomKey"));

                            acssesKeyCook.setMaxAge(60*60*24*5);

                            response.addCookie(acssesKeyCook);

                            System.out.println("Post successful");

                            boolean checkUser = checkAutorization(name, keygen);
                            if (checkUser) {
                                PrintWriter out = response.getWriter();
                                JSONObject jsonToReturn = new JSONObject();
                                jsonToReturn.put("JSON", "Hello, World!").toString();
                                out.println(jsonToReturn);
                            }
                            break;
                        case 2:  //
                            break;
                        case 3: //
                            break;
                        default:
                            System.out.println("default switch");
                            break;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }






    }
}
