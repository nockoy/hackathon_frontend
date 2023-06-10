import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { baseURL } from "../App";
import { useSearchParams } from "react-router-dom";
import defaultIcon from "../images/defaultIcon.jpeg";
import { ref } from "firebase/storage";
import { storage } from "../firebase";
import { getDownloadURL } from "firebase/storage";
import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton } from "@mui/material";
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


export default function ReplyField() {
  const [messages, setMessages] = useState([{ message: '', }]);
  const [flag, setFlag] = useState(false);
  const [searchParams] = useSearchParams();
  const { id } = useContext(UserContext);
  const [showEdit, setShowEdit] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showMSGID, setShowMSGID] = useState("");

  let channel_id = searchParams.get("channel_id");
  let IconURL = defaultIcon;

  const convertToJapanTime = (dateString: string) => {
    const receivedDate = new Date(dateString);
    const offset = receivedDate.getTimezoneOffset();
    const japanTime = new Date(receivedDate.getTime() - offset);
    const japanTimeFormatted = japanTime.toLocaleString();
    return (japanTimeFormatted)
  }

  useEffect(() => {
    fetchMessages();
    setFlag(false);
  }, [channel_id, flag])

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

  const deleteMessage = (msg_id: string) => {
    axios.delete(baseURL + "/message", {
      data: { id: msg_id }
    })
      .then(() => {
        // console.log("メッセージを削除しました。");
        setFlag(true);
      })
      .catch((err) => { throw Error(`Failed to delete the message: ${err}`) });
  }

  const change1 = (id: string) => {
    if (showMSGID === id) {
      if (showEdit === true) {
        setShowMSGID(id);
        setShowEdit(false);
        setShowReply(true);
      } else {
        setShowMSGID("");
        setShowEdit(false);
        setShowReply(false);
      }

    } else {
      setShowMSGID(id);
      setShowEdit(false);
      setShowReply(true);
    }
  }

  const change2 = (id: string) => {
    if (showMSGID === id) {
      if (showReply === true) {
        setShowMSGID(id);
        setShowEdit(true);
        setShowReply(false);
      } else {
        setShowMSGID("");
        setShowEdit(false);
        setShowReply(false);
      }
    } else {
      setShowMSGID(id);
      setShowEdit(true);
      setShowReply(false);
    }
  }

  return (
    <div className="MessageField">
      {messages.map((value: any, key) => {
        return (
          <div>
            <div className="MessageContent" key={key} >


              <IconButton
                sx={{ float: "right" }}
                onClick={() => change1(value.id)}
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
                          onClick={() => change2(value.id)}
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
                              {(() => {
                                if (!(showEdit === true && showMSGID === value.id)) {/////////////////////////////////////直す！！！！////////////////////////////////////////
                                  return (
                                    <div className="Message">
                                      <span>
                                        {value.text?.split('\n').map((t: any, key: number) => (
                                          <span key={key}>{t}<br /></span>
                                        ))}
                                      </span>
                                    </div>
                                  );
                                }
                              })()}

                              {/* {showEdit ? (<></>) : 
                              
                              (
                                <div className="Message">
                                  <span>
                                    {value.text?.split('\n').map((t: any, key: number) => (
                                      <span key={key}>{t}<br /></span>
                                    ))}
                                  </span>
                                </div>
                              )} */}

                            </div>
                          </div>
                        </div>

                        <div>
                          {(() => {
                            if (showMSGID === value.id) {
                              return (
                                <div>

                                  {showEdit ? (<div>
                                    <br />
                                    <SendBox msg_id={value.id} original_text={value.text} type="Edit" />
                                  </div>)
                                    : (<></>)
                                  }

                                  {showReply ? (<div>
                                    <br />
                                    <SendBox reply_to_id={value.id} user_id={id} text={value.text} type="Reply" />
                                  </div>)
                                    : (<></>)
                                  }

                                </div>
                              );
                            }
                          })()}
                        </div>

                      </div>
                    );

                    ////ここまで自分の画面////

                  } else {

                    ////ここから他人の画面////
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
                        <div>


                          {(() => {
                            if (showMSGID === value.id) {
                              return (
                                <div>
                                  <br />
                                  <SendBox reply_to_id={value.id} user_id={id} text={value.text} type="Reply" />
                                </div>
                              );
                            }
                          })()}

                        </div>
                      </div>
                    )
                  }
                  ////ここまで他人の画面////

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
      message: props.original_text,
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
    // console.log("text: " + values.message);
    try {
      const response = await axios.post(baseURL + '/reply', {
        reply_to_id: props.reply_to_id,
        user_id: props.user_id,
        text: values.message
      });
      console.log("text: " + values.message);
      setValues({ message: "", isSubmitted: true });
      setFlag(true);
    } catch (error: any) {
      console.error("Failed to send message:" + error);
    }
  }

  const checkTextArea = (e: any) => { //改行を含めない場合
    if (e.type === undefined) {
      return
    } else {
      const newText = e.replace(/\n/g, "")
      return newText.length > 500;
    }
  }

  const disable = (e: any) => {
    if (e) {
      if (e?.length > 500) {
        return true
      } else {
        return false
      }
    } else {
      return true
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
                {/* <TextField
                  name="message"
                  id="outlined-textarea"
                  label="メッセージを編集する"
                  fullWidth
                  multiline
                  minRows={2}
                  // variant="filled"
                  size="small"
                  margin="dense"
                  InputProps={{ style: textfieldStyles }}
                  InputLabelProps={{ style: textlabelStyles }}
                  value={values.message}
                  onChange={handleChange}
                  error={values.message.length > 500}
                  helperText={values.message.length > 500 && ("500字以内で入力してください")}
                />
                <Button
                  // variant="contained"
                  size="large"
                  endIcon={<EditIcon />}
                  disabled={disable(values.message)}
                  onClick={handleEdit}
                  sx={{float:"right"}}
                >
                  ({values.message.length}/500)
                </Button> */}
              </div>
            );
          } else if (props.type === "Reply") {
            return (
              <div>
                <TextField
                  name="message"
                  id="outlined-textarea"
                  label="返信する"
                  fullWidth
                  multiline
                  minRows={2}
                  // variant="filled"
                  size="small"
                  margin="dense"
                  InputProps={{ style: textfieldStyles }}
                  InputLabelProps={{ style: textlabelStyles }}
                  value={values.message}
                  onChange={handleChange}
                  error={values.message?.length > 500}
                  helperText={values.message?.length > 500 && ("500字以内で入力してください")}
                />
                <Button
                  // variant="contained"
                  size="large"
                  endIcon={<ReplyIcon />}
                  disabled={disable(values.message)}
                  onClick={handleReply}
                  sx={{float:"right"}}
                >
                  ({values.message?.length}/500)
                </Button>


              </div>
            )
          }
        })()}

      </div>
    </div>
  );
}