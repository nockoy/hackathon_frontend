import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { baseURL } from '../App';
import { UserContext } from "../context/UserContext";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import axios from "axios";

const SendBox = () => {
  const [flag, setFlag] = useState(false);
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

  const handleSubmit = async () => {

    try {
      const response = await axios.post(baseURL + '/message', {
        channel_id: searchParams.get("channel-id"),
        user_id: id,
        text: values.message
      });
      setValues({ message: "", isSubmitted: true });
      setFlag(true);
    } catch (error: any) {
      console.error("Failed to send message:" + error);
    }
  }

  const checkTextArea = (e: any) => {
    if (e.type === undefined) {
      return
    } else {
      const newText = e.replace(/\n/g, "")
      return newText.length > 500;
    }
  }

  const disable = (e: any) => {
    if (e) {
      if (e.length > 500) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  useEffect(() => {

  }, [handleSubmit, flag])

  return (
    <div className="SendBox">
      <div className='TextBox'
        style={{
          width: "60vw", /*テキストボックスの横幅*/
          display: "flex"
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
          error={values.message.length > 500}
          helperText={values.message.length > 500 && ("500字以内で入力してください")}
        />
        <div className="SendSide">
          <div className="LengthCount">{values.message.length}/500</div>
          <Button
            // variant="contained"
            size="large"
            endIcon={<SendIcon />}
            disabled={disable(values.message)}
            onClick={handleSubmit}
          >
          </Button>

        </div>
      </div>

    </div>
  );
}

export default SendBox;
