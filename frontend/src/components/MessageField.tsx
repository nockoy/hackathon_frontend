import { useState, useEffect } from "react";
import { baseURL } from "../App";
import { useSearchParams } from "react-router-dom";
import defaultIcon from "../images/defaultIcon.jpeg";
import { ref } from "firebase/storage";
import { storage } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton } from "@mui/material";

interface channel {
  id: string,
  channel_id: string,
  user_id: string,
  name: string,
  email: string,
  icon: string,
  text: string,
  created_at: string,
  updated_at: string
}

function MessageField() {
  const [messages, setMessages] = useState([{ message: '', }]);
  const [searchParams] = useSearchParams();
  let channel_id = searchParams.get("channel_id");
  let IconURL = defaultIcon;

  const convertToJapanTime = (dateString: string) => {
    const receivedDate = new Date(dateString);
    const offset = receivedDate.getTimezoneOffset();
    const japanTime = new Date(receivedDate.getTime() - offset);
    // console.log(japanTime)
    const japanTimeFormatted = japanTime.toLocaleString();
    return (
      <div>{japanTimeFormatted}</div>
    )
  }

  useEffect(() => {
    fetchMessages()
  }, [channel_id])

  const IconHandler = (icon: string) => {
    if (icon) {
      try {
        const gsReference = ref(storage, "gs://term3-shun-kondo.appspot.com/image/" + icon);
        getDownloadURL(gsReference)
          .then((url) => {
            IconURL = url;
          })
          .catch((error) => {
            console.log("アイコンの取得に失敗しました", error);
          });
      } catch (error) {
        console.log("アイコンの取得に失敗しました", error);
      }
    } else {
    }
    return (
      <img style={{ width: 36, height: 36 }} src={IconURL} alt="UserIcon" />
    )
  };

  // console.log("searchParams.get(channelid): " + searchParams.get("channel_id"));

  const fetchMessages = async () => {
    try {
      const res = await fetch(baseURL + "/message?channel_id=" + channel_id);
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
      {messages.map((value: any, key) => {
        return (
          <div className="MessageContent" key={key} >


            <IconButton sx={{ float: "right" }}>
              <MoreVertIcon />
            </ IconButton>
            <IconButton sx={{ float: "right" }}>
              <ReplyIcon />
            </ IconButton>

            <div className="MessageBody">

              <div className="SenderIcon">{IconHandler(value.icon)}</div>

              <div>
                <div className="SenderInfo">
                  <div className="SenderName">{value.name}</div>
                  <div className="Time">{convertToJapanTime(value.created_at)}</div>
                </div>
                <div>
                  <div className="Message">
                    <span>
                      {value.text?.split('\n').map((t: any, key: number) => (
                        <span key={key}>{t}<br /></span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        )
      })}

      <div className="space"></div>

    </div>
  );
}

export default MessageField;