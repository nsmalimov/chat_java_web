package Databases;

import org.json.JSONObject;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.logging.*;

public class SQLiteClass
{
    static String name = "";
    public static String getName() {
        try {
            Context ctx = new InitialContext();


            DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/ChatDatabase");

            //System.out.println(1);
            Connection conn = ds.getConnection();
            Statement stat = conn.createStatement();
            ResultSet rs = stat.executeQuery("select userKey from freeUsers");
            name = rs.getString(0);
        } catch (SQLException se) {
            return "exception 1";
        } catch (NamingException ne) {
            System.out.println(ne);
            return "exception 2";
        }
        return name;
    }

    public static void main( String args[] )
    {
//        Connection c = null;
//        try {
//            Class.forName("org.sqlite.JDBC");
//            c = DriverManager.getConnection("jdbc:sqlite:ChatDatabase");
//
//            Statement stat = c.createStatement();
//            ResultSet rs = stat.executeQuery("select userKey from freeUsers");
//            name = rs.getString(0);
//
//            System.out.println(name);
//
//        } catch ( Exception e ) {
//            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
//            System.exit(0);
//        }
//        System.out.println("Opened database successfully");
        //System.out.println(getName());

        ArrayList<String> freeUsersArray = new ArrayList<String>();
        freeUsersArray.add("111");

        freeUsersArray.remove("sgsklgjkslg");

        JSONObject jsonToReturn = new JSONObject();

        jsonToReturn.put("JSON", "Hello, World!").toString();
        System.out.println("Post successful");
    }

}