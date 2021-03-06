import Databases.SQLiteClass;
import org.json.JSONObject;

import javax.naming.NamingException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Iterator;

public class ControlClass extends HttpServlet {
    public static boolean checkKeyGen(String name, String key) throws ClassNotFoundException, SQLException, NamingException {
        SQLiteClass.Conn();
        boolean answer = SQLiteClass.checkKeyGenDb(key);

        //запись в базу данных
        SQLiteClass.addUserDatabase(name, key);

        SQLiteClass.CloseDB();
        return answer;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Cookie cookie = null;
        Cookie[] cookies = null;
        cookies = request.getCookies();

        if (cookies != null) {
            response.setContentType("text/html");
            RequestDispatcher dispatcher = request.getRequestDispatcher("chat.html");
            if (dispatcher != null) {
                dispatcher.forward(request, response);
            }
        } else {
            PrintWriter out = response.getWriter();
            out.println("Permission denied");
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //регистрация нового пользователя

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

            response.setContentType("text/html;charset=UTF-8");
            PrintWriter out = response.getWriter();

            while (it.hasNext()) {
                String key = it.next().toString();
                if (key.equals("command")) {

                    int command = Integer.parseInt(jsonObject.getString(key));

                    switch (command) {
                        case 1:  //авторизация

                            String name = (String) jsonObject.get("name");
                            String keyGen = (String) jsonObject.get("keyGen");

                            //проверка ключа и запись юзера в базу данных
                            boolean checkUser = checkKeyGen(name, keyGen);

                            //если всё нормально, то отправить куки
                            if (checkUser) {
                                JSONObject jsonToReturn = new JSONObject();
                                jsonToReturn.put("answer", "ok");
                                out.println(jsonToReturn.toString());

                                Cookie acssesKeyCook = new Cookie("userKey", keyGen);
                                acssesKeyCook.setMaxAge(60 * 60 * 24 * 5);
                                response.addCookie(acssesKeyCook);
                            } else {
                                //ошибка или не правильный ключ
                                JSONObject jsonToReturn = new JSONObject();
                                jsonToReturn.put("answer", "wrong");
                                out.println(jsonToReturn.toString());
                            }

                            break;
                        case 2:  //get name
                            JSONObject jsonToReturner = new JSONObject();
                            Cookie[] cookies = request.getCookies();
                            String keyGenGetUser = null;
                            for (Cookie cookie : cookies) {
                                if ("userKey".equals(cookie.getName())) {
                                    keyGenGetUser = cookie.getValue();
                                }
                            }

                            SQLiteClass.Conn();
                            String nickname = SQLiteClass.getNameDb(keyGenGetUser);
                            SQLiteClass.CloseDB();

                            jsonToReturner.put("answer", nickname);
                            out.println(jsonToReturner.toString());
                            break;
                        case 3: //who my connector
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
