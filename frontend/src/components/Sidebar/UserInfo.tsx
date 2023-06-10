import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useAuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import defaultIcon from "../../images/defaultIcon.jpeg";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EmailIcon from '@mui/icons-material/Email';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { createTheme } from '@mui/material/styles';
import axios from "axios";
import { baseURL } from "../../App";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '30px',
  boxShadow: 24,
  p: 4,
};

function UserInfo() {
  const { user } = useAuthContext();
  const { id, name, icon, channel, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [flag, setFlag] = useState(false);
  const [searchParams] = useSearchParams();
  let channel_id = searchParams.get("channel_id");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [values, setValues] = useState({ name: "", isSubmitted: false });

  const textfieldStyles = {
    backgroundColor: "#ffffff",
    fontFamily: "inherit"
  };
  const textlabelStyles = {
    fontFamily: "inherit"
  };

  useEffect(() => {
  }, [icon, channel_id, flag]);

  const handleChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async () => {
    setFlag(true);
    try {
      await axios.put(baseURL + '/user2', {
        id: id,
        name: values.name
      });
      setValues({ name: "", isSubmitted: true });
      setFlag(true);
      setUser(id, values.name, icon, channel);
    } catch (error: any) {
      console.error("Failed to update username:" + error);
    }
  }

  return (
    <div>
      <div className="SidebarIcon" onClick={handleOpen}>
        {icon ? (
          <img style={{ width: 100, height: 100, borderRadius: 9 }} src={icon} alt="UserIcon" />
        ) : (
          <img style={{ width: 100, height: 100, borderRadius: 9 }} src={defaultIcon} alt="UserIcon" />
        )}

        <p>{name}</p>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" >
            <div>
              <div className='Channelcontainer'>

                <div className="profile">
                  <AccountBoxIcon />
                  <div className="profileCntent">
                    <div className="profileHeadline">名前</div>
                    <div className="profileItem">
                      {name}
                      <Button
                        // variant="contained"
                        size="large"
                        endIcon={<EditIcon />}
                        onClick={() => setShow(!show)}
                      >
                      </Button>
                      {show ? (
                        <Box
                          component="form"
                          sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <div>
                            <TextField
                              name="name"
                              id="name"
                              label="新しい名前"
                              variant="standard"
                              placeholder="50文字以内で入力"
                              InputProps={{ style: textfieldStyles }}
                              InputLabelProps={{ style: textlabelStyles }}
                              value={values.name}
                              onChange={handleChange}
                              error={values.name.length > 50}
                              helperText={values.name.length > 50 && ("50字以内で入力してください")}
                            />
                            <Button
                              // variant="contained"
                              size="large"
                              endIcon={<SendIcon />}
                              disabled={(values.name) ? false : true}
                              onClick={handleSubmit}
                            >
                            </Button>
                          </div>
                        </Box>
                      ) : (<></>)}
                    </div>
                  </div>
                </div>

                <br />

                <div className="profile">
                  <EmailIcon />
                  <div className="profileCntent">
                    <div className="profileHeadline">Email</div>
                    <div className="profileItem">{user?.email}</div>
                  </div>
                </div>

                <br />

                <div className="profile">
                  <ImageIcon />
                  <div className="profileCntent">
                    <div className="profileHeadline">アイコン</div>
                    <div className="profileItem">
                      {/* {icon} */}
                    </div>
                    <Link to={"/image"}>
                      アイコンを変更する
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </Typography>
        </Box>
      </Modal>

    </div>

  );
}

export default UserInfo;