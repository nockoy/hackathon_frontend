import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import { UserContext } from "../context/UserContext";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from '../App';


const SendBox = () => {
  const { id } = useContext(UserContext);
  const [searchParams] = useSearchParams();

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

  const handleSubmit = async (event: any) => {

    try {
      const response = await axios.post(baseURL + '/message', {
        channel_id: searchParams.get("channel_id"),
        user_id: id,
        text: values.message
      });
      // console.log("searchParams.get(channelid): " + searchParams.get("channelid"));
      // console.log("channel_id: " + searchParams.get("channelid"));
      // console.log("送信成功");
      setValues({ message: "", isSubmitted: true });
    } catch (error: any) {
      console.error("Failed to send message:" + error);
    }
  }

  useEffect(() => {

  }, [handleSubmit])

  return (
    <div className="SendBox">
      <div className='TextBox'
        style={{
          width: "60vw" /*テキストボックスの横幅*/
        }}>
        <TextField
          name="message"
          id="outlined-textarea"
          label="メッセージを送る"
          fullWidth
          multiline
          rows={3}
          placeholder="メッセージを送信してみよう"
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
          endIcon={<SendIcon />}
          disabled={(values.message) ? false : true}
          onClick={handleSubmit}
        >
        </Button>
      </div>
    </div>
  );
}

export default SendBox;
