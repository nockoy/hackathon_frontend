import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { baseURL } from "../App";
import { useSearchParams } from "react-router-dom";
import defaultIcon from "../images/defaultIcon.jpeg";
import { ref } from "firebase/storage";
import { storage } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton, dividerClasses } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import axios from "axios";


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


export default function Message() {
  const [messages, setMessages] = useState([{ message: '', }]);
  const [flag, setFlag] = useState(false);
  const [searchParams] = useSearchParams();
  const { id } = useContext(UserContext);
  const [showEdit, setShowEdit] = useState(false);
  const [showReply, setShowReply] = useState(false);
  let OriginalMessage = "";

  let channel_id = searchParams.get("channel_id");
  let message_id = searchParams.get("message_id");
  let IconURL = defaultIcon;

  const convertToJapanTime = (dateString: string) => {
    const receivedDate = new Date(dateString);
    const offset = receivedDate.getTimezoneOffset();
    const japanTime = new Date(receivedDate.getTime() - offset);
    const japanTimeFormatted = japanTime.toLocaleString();
    return (japanTimeFormatted)
  }

  useEffect(() => {
    fetchReplies();
    setFlag(false);
  }, [flag])

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

  const fetchOriginalMessage = async () => {
    try {
      const res = await fetch(baseURL + "/message?channel_id=" + channel_id);
      if (!res.ok) {
        throw Error(`Failed to fetch message: ${res.status}`);
      }
      const message = await res.json();
      console.log(message);
      OriginalMessage = message;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReplies = async () => {
    try {
      const res = await fetch(baseURL + "/reply?reply_id=" + message_id);
      if (!res.ok) {
        throw Error(`Failed to fetch messages: ${res.status}`);
      }
      const messages = await res.json();
      setMessages(messages);
    } catch (err) {
      console.error(err);
    }
  };


  const deleteMessage = (msg_id: string) => {
    // console.log("次のIDのメッセージを消去します: " + msg_id);
    // console.log(baseURL + "/message?id=" + msg_id);
    axios.delete(baseURL + "/message", {
      data: { id: msg_id }
    })
      .then(() => {
        console.log("メッセージを削除しました。");
        setFlag(true);
      })
      .catch((err) => { throw Error(`Failed to delete the message: ${err}`) });
  }


  return (
    <div className="MessageField">
      {messages.map((value: any, key) => {
        return (
          <div>
            <div className="MessageContent" key={key} >


              <IconButton
                sx={{ float: "right" }}
                onClick={() => (setShowReply(!showReply), setShowEdit(false))}
              >
                <ReplyIcon />
              </ IconButton>

              {
                (() => {

                  ////ここから自分の画面////
                  if (value.user_id === id) {
                    //ここにuseStateを書く。if文の中に全部要素を入れる
                    return (
                      <div>
                        <IconButton
                          sx={{ float: "right" }}
                          onClick={() => (setShowEdit(!showEdit), setShowReply(false))}
                        >
                          <EditIcon />
                        </ IconButton>

                        <IconButton
                          sx={{ float: "right" }}
                          onClick={() => deleteMessage(value.id)}
                        >
                          <DeleteIcon />
                        </ IconButton>

                        <div className="MessageBody">
                          <div className="SenderIcon">{IconHandler(value.icon)}</div>
                          <div>
                            <div className="SenderInfo">
                              <div className="SenderName">{value.name}</div>
                              <div className="Time">{convertToJapanTime(value.created_at)}</div>
                              {(() => {
                                if (value.created_at !== value.updated_at) {
                                  return (
                                    <div>
                                      <div className="Time">({convertToJapanTime(value.updated_at)} 編集済み)</div>
                                    </div>
                                  );
                                }
                              })()}
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

                        <div>
                          {showEdit ? (
                            <div>
                              <br />
                              <SendBox msg_id={value.id} text={value.text} type="Edit" />
                            </div>
                          ) : (
                            <div></div>
                          )}
                          {showReply ? (
                            <div>
                              <br /><SendBox reply_to_id={value.id} user_id={id} text={value.text} type="Reply" />
                            </div>
                          ) : (<></>)
                          }
                        </div>

                      </div>
                    );

                    ////ここから他人の画面////
                  } else {
                    return (
                      <div>
                        <div className="MessageBody">
                          <div className="SenderIcon">{IconHandler(value.icon)}</div>
                          <div>
                            <div className="SenderInfo">
                              <div className="SenderName">{value.name}</div>
                              <div className="Time">{convertToJapanTime(value.created_at)}</div>
                              {(() => {
                                if (value.created_at !== value.updated_at) {
                                  return (
                                    <div>
                                      <div className="Time">({convertToJapanTime(value.updated_at)} 編集済み)</div>
                                    </div>
                                  );
                                }
                              })()}
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
                        <div>{showReply ? (
                          <div>
                            <br />
                            <SendBox reply_to_id={value.id} user_id={id} text={value.text} type="Reply" />
                          </div>
                        ) : (<></>)}
                        </div>
                      </div>
                    )
                  }


                })()
              }
            </div>
          </div>
        )
      })}

      <div className="space"></div>
    </div>
  );
}

const SendBox = (props: any) => {
  const [flag, setFlag] = useState(false);
  const msg_id = props.msg_id;

  //見た目の設定
  const theme = createTheme({
    typography: {
      fontFamily: "inherit",
      button: {
        textTransform: "none",
        fontFamily: "inherit"
      }
    }
  });
  const textfieldStyles = {
    backgroundColor: "#ffffff",
    fontFamily: "inherit"
  };
  const textlabelStyles = {
    fontFamily: "inherit"
  };
  //state定義
  const [values, setValues] = useState(
    {
      message: "",
      isSubmitted: false
    }
  );
  //文字入力の度にstate更新
  const handleChange = (e: any) => {
    const target = e.target;
    // console.log(target);
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  };

  const handleEdit = async (event: any) => {
    try {
      const response = await axios.put(baseURL + '/message', {
        id: msg_id,
        text: values.message
      });
      // console.log("msg_id: " + msg_id);
      setValues({ message: "", isSubmitted: true });
      setFlag(true);
    } catch (error: any) {
      console.error("Failed to send message:" + error);
    }
  }

  const handleReply = async (event: any) => {
    try {
      const response = await axios.post(baseURL + '/reply', {
        reply_to_id: props.reply_to_id,
        user_id: props.user_id,
        text: values.message
      });
      // console.log("msg_id: " + msg_id);
      setValues({ message: "", isSubmitted: true });
      setFlag(true);
    } catch (error: any) {
      console.error("Failed to send message:" + error);
    }
  }

  useEffect(() => {

  }, [handleEdit, handleReply, flag])

  return (
    <div className="SendBox">
      <div className='TextBox'
        style={{
          width: "60vw" /*テキストボックスの横幅*/
        }}>

        {(() => {
          if (props.type === "Edit") {
            return (
              <div>
                <TextField
                  name="message"
                  id="outlined-textarea"
                  label="メッセージを編集する"
                  fullWidth
                  multiline
                  rows={3}
                  // placeholder=""
                  // variant="filled"
                  size="small"
                  margin="dense"
                  InputProps={{ style: textfieldStyles }}
                  InputLabelProps={{ style: textlabelStyles }}
                  value={values.message}
                  onChange={handleChange}
                />
                <Button
                  // variant="contained"
                  size="large"
                  endIcon={<EditIcon />}
                  disabled={(values.message) ? false : true}
                  onClick={handleEdit}
                >
                </Button>
              </div>
            );
          } else {
            return (
              <div>
                <TextField
                  name="message"
                  id="outlined-textarea"
                  label="返信する"
                  fullWidth
                  multiline
                  rows={3}
                  // placeholder=""
                  // variant="filled"
                  size="small"
                  margin="dense"
                  InputProps={{ style: textfieldStyles }}
                  InputLabelProps={{ style: textlabelStyles }}
                  value={values.message}
                  onChange={handleChange}
                />
                <Button
                  // variant="contained"
                  size="large"
                  endIcon={<ReplyIcon />}
                  disabled={(values.message) ? false : true}
                  onClick={handleReply}
                >
                </Button>
              </div>
            )
          }
        })()}



      </div>
    </div>
  );
}