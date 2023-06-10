import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import defaultIcon from "../images/defaultIcon.jpeg";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import ReplyField from "../components/ReplyField";
import { baseURL } from '../App';
import axios from 'axios';

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

let reload = false;
let OriginalMSGID = "";

export default function Reply() {
  const [OriginalMSG, setOriginalMSG] = useState<channel[]>([]);
  const [replies, setReplies] = useState([{ reply: '', IconURL: defaultIcon, }]);
  const { user } = useAuthContext();
  const { id } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  let message_id = searchParams.get("message_id");

  if (message_id) {
    OriginalMSGID = message_id;
  }

  const [flag, setFlag] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showMSGID, setShowMSGID] = useState("");
  const [ChannelName, setChannelName] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
    fetchMessage();
    fetchReplies();
    setFlag(false);
    reload = false;
    setShowEdit(false);
    setShowReply(false);
  }, [channel_id, flag, reload])

  

  const fetchMessage = async () => {
    try {
      const res = await fetch(baseURL + '/message/id?message_id=' + message_id);
      if (!res.ok) {
        throw Error(`Failed to fetch message: ${res.status}`);
      }
      const message = await res.json();
      setOriginalMSG(message);
      try {
        const response = await axios.get(baseURL + '/channel?channel_id=' + message[0].channel_id);
        setChannelName(response.data[0].name);
      } catch (error) {
        console.log("channel_nameが取得できませんでした:" + error);
      }
    } catch (error) {
      console.log('データ取得の際にエラーが発生しました', error);
    };
  };


  const fetchReplies = async () => {
    try {
      const res = await fetch(baseURL + "/reply?reply_to_id=" + message_id);
      if (!res.ok) {
        throw Error(`Failed to fetch replies: ${res.status}`);
      }
      const replies = await res.json();
      setReplies(replies);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReply = (reply_id: string) => {
    axios.delete(baseURL + "/reply", {
      data: { id: reply_id }
    })
      .then(() => {
        // console.log("メッセージを削除しました。");
        setFlag(true);
      })
      .catch((err) => { throw Error(`Failed to delete the reply: ${err}`) });
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
    <div className="App">
      <div id="GridContainer2">
        <div id="Top">
          <Topbar />
        </div>
        <div id="itemA">
          <Sidebar />
        </div>
        <div id="itemB">
          <div className="Header">
            <div className="HeaderName">
              {ChannelName}
            </div>
          </div>
        </div>

        <div id="itemC">

        <div className="MessageField">


          <div>
            <div className="MessageContent" >

              <IconButton
                sx={{ float: "right" }}
                onClick={() => change1(OriginalMSG[0].id)}
              >
                <ReplyIcon />
              </ IconButton>

              {
                (() => {

                  ////ここから自分の画面////
                  if (OriginalMSG[0]?.user_id === id) {
                    return (
                      <div>

                        <div className="MessageBody">
                          <div className="SenderIcon">
                            {OriginalMSG[0].icon ? (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={OriginalMSG[0].icon} alt="UserIcon" />
                            ) : (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={defaultIcon} alt="UserIcon" />
                            )}
                          </div>
                          <div>
                            <div className="SenderInfo">
                              <div className="SenderName">{OriginalMSG[0]?.name}</div>
                              <div className="Time">{convertToJapanTime(OriginalMSG[0]?.created_at)}</div>
                              {(() => {
                                if (OriginalMSG[0]?.created_at !== OriginalMSG[0]?.updated_at) {
                                  return (
                                    <div>
                                      <div className="Time">({convertToJapanTime(OriginalMSG[0]?.updated_at)} 編集済み)</div>
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                            <div>
                              {(() => {
                                if (!(showEdit === true && showMSGID === OriginalMSG[0]?.id)) {/////////////////////////////////////直す！！！！////////////////////////////////////////
                                  return (
                                    <div className="Message">
                                      <span>
                                        {OriginalMSG[0].text?.split('\n').map((t: any, key: number) => (
                                          <span key={key}>{t}<br /></span>
                                        ))}
                                      </span>
                                    </div>
                                  );
                                }
                              })()}


                            </div>
                          </div>
                        </div>

                        <div>
                          {(() => {
                            if (showMSGID === OriginalMSG[0]?.id && reload === false) {
                              return (
                                <div>

                                  {showEdit ? (<div>
                                    <br />
                                    <SendBox msg_id={OriginalMSG[0]?.id} original_text={OriginalMSG[0]?.text} type="Edit" />
                                  </div>)
                                    : (<></>)
                                  }

                                  {showReply ? (<div>
                                    <br />
                                    <SendBox reply_to_id={OriginalMSG[0]?.id} user_id={id} text={OriginalMSG[0]?.text} type="Reply" />
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
                            {OriginalMSG[0]?.icon ? (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={OriginalMSG[0]?.icon} alt="UserIcon" />
                            ) : (
                              <img style={{ width: 33, height: 33, borderRadius: 3 }} src={defaultIcon} alt="UserIcon" />
                            )}
                          </div>
                          <div>
                            <div className="SenderInfo">
                              <div className="SenderName">{OriginalMSG[0]?.name}</div>
                              <div className="Time">{convertToJapanTime(OriginalMSG[0]?.created_at)}</div>
                              {(() => {
                                if (OriginalMSG[0]?.created_at !== OriginalMSG[0]?.updated_at) {
                                  return (
                                    <div>
                                      <div className="Time">({convertToJapanTime(OriginalMSG[0]?.updated_at)} 編集済み)</div>
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                            <div>
                              <div className="Message">
                                <span>
                                  {OriginalMSG[0]?.text?.split('\n').map((t: any, key: number) => (
                                    <span key={key}>{t}<br /></span>
                                  ))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>


                          {(() => {
                            if (showMSGID === OriginalMSG[0]?.id) {
                              return (
                                <div>
                                  <br />
                                  <SendBox reply_to_id={OriginalMSG[0]?.id} user_id={id} text={OriginalMSG[0]?.text} type="Reply" />
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





          {/* ここからリプライ */}

          <div className="ReplyField">

            {replies.map((value: any, key) => {
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
                                onClick={() => deleteReply(value.id)}
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
                        </Modal> */}


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

        </div>

        </div>


      </div>
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
      const response = await axios.put(baseURL + '/reply', {
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
        reply_to_id: OriginalMSGID,
        user_id: props.user_id,
        text: values.message
      });
      // console.log("text: " + values.message);
      setValues({ message: "", isSubmitted: true });
      setFlag(true);
      reload = true;
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