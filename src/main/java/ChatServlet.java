import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/chat")
public class ChatServlet {
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());

    private static final ArrayList<String> freeUsersArray = new ArrayList<String>();

    private static final ArrayList<String []> connectedUsers = new ArrayList<String []>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        if (freeUsersArray.size() == 0)
        {
            freeUsersArray.add(session.getId());
        }
        else
        {
            String waitingUsersId = freeUsersArray.get(0);
            String [] someArray = {session.getId(), waitingUsersId};
            connectedUsers.add(someArray.clone());

            freeUsersArray.remove(freeUsersArray.get(0));
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        freeUsersArray.remove(session.getId());

        for (int i = 0; i < connectedUsers.size(); i++)
        {
            String fistUser = connectedUsers.get(i)[0];
            String secondUser = connectedUsers.get(i)[1];

            if (fistUser.equals(session.getId()) || secondUser.equals(session.getId()))
            {
                connectedUsers.remove(i);
                break;
            }
        }
    }

    @OnMessage
    public void onMessage(String message, Session client)
            throws IOException, EncodeException {
        String needSent = "";
        System.out.println(client.getId());

        for (int i = 0; i < connectedUsers.size(); i++)
        {
            String firstUser = connectedUsers.get(i)[0];
            String secondUser = connectedUsers.get(i)[1];

            if (firstUser.equals(client.getId()))
            {
                needSent = secondUser;
                break;
            }

            if (secondUser.equals(client.getId()))
            {
                needSent = firstUser;
                break;
            }

        }

        for (Session session : sessions) {
            if (session.getId().equals(needSent))
            {
                System.out.println(session.getId() + " " + needSent);
                session.getBasicRemote().sendText(message);
                break;
            }
        }
    }
}