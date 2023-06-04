import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { baseURL } from "../App";

function MessageField() {
  const [messages, setMessages] = useState([{message: '',}]);
  const { user } = useAuthContext();

  useEffect(() => {
    fetchMessages()
  }, [])
  
  const fetchMessages = async () => {
    try {
      const res = await fetch(baseURL + "/message?email=" + user?.email);
      if (!res.ok) {
        throw Error(`Failed to fetch messages: ${res.status}`);
      }

      const messages = await res.json();
      setMessages(messages);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="MessageField">
      <div className="MessageContent">
      <div>홍은채 {user?.email}</div>
      I'm fearless
      
      {messages.map((f) => (
        <div key={user?.email}>
          <div className="MessageUser">
            user名 時間
          </div>
          <div className="Message">
            {f.message}
            あああああああああああああああああ！！！！
          </div>
        </div>
      ))}
        
      </div>
    </div>
  );
}
  
  export default MessageField;