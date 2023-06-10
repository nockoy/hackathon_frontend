import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { baseURL } from "../App";
import { useSearchParams, useNavigate } from "react-router-dom";
import defaultIcon from "../images/defaultIcon.jpeg";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ForumIcon from '@mui/icons-material/Forum';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '30px',
  boxShadow: 24,
  p: 4,
};

let reload = false;

export default function MessageField() {
  const [messages, setMessages] = useState([{ message: '', IconURL: defaultIcon, }]);
  const [flag, setFlag] = useState(false);
  const { id } = useContext(UserContext);
  const [showEdit, setShowEdit] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showMSGID, setShowMSGID] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let channel_id = searchParams.get("channel_id");

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
    reload = false;
    setShowEdit(false);
    setShowReply(false);
  }, [channel_id, flag, reload])

  // if (reload === true) {
  //   setShowEdit(false);
  //   setShowReply(false);
  // }


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
                onClick={() => navigate("/reply/?message_id=" + value.id)}
              >
                <ForumIcon />
              </ IconButton>

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
                        // onClick={handleOpen}
                        >
                          <DeleteIcon />
                        </ IconButton>

                        {/* <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" >
                              <div>
                                <div className="MessageContent">
                                  <div className="MessageBody">
                                    <div className="Message">
                                      <span>
                                        {value.text?.split('\n').map((t: any, key: number) => (
                                          <span key={key}>{t}<br /></span>
                                        ))}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  本当に削除しますか？
                                </div>
                              </div>
                            </Typography>
                          </Box>
                        </Modal>
 */}


                        <div className="MessageBody">
                          <div className="SenderIcon">
                            {value.icon ? (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={value.icon} alt="UserIcon" />
                            ) : (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={defaultIcon} alt="UserIcon" />
                            )}
                          </div>
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
                            if (showMSGID === value.id && reload === false) {
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
                          <div className="SenderIcon">
                            {value.icon ? (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={value.icon} alt="UserIcon" />
                            ) : (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={defaultIcon} alt="UserIcon" />
                            )}
                          </div>
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
      reload = true;
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
                <TextField
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
                >
                </Button>
                <div>{values.message.length}/500</div>
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
                >
                </Button>
                <div>{values.message?.length}/500</div>

              </div>
            )
          }
        })()}

      </div>
    </div>
  );
}