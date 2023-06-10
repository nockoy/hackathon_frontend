import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { baseURL } from '../App';
import { UserContext } from "../context/UserContext";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import axios from "axios";


const SendBox = () => {
  const [flag, setFlag] = useState(false);
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const { id, name, icon, channel, setUser } = useContext(UserContext);

  const OnFileUploadToFirebase = async (e: any) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, "image/" + new Date().toISOString() + file.name)
    const pathReference = ref(storage, "images/" +  new Date().toISOString() + file.name);
    const uploadImage = uploadBytesResumable(storageRef, file);
    let IconURL = "";

    try {
      setLoading(true);

      uploadImage.on(
        "state_changed",
        (snapshot) => { },
        (err) => {
          console.log(err);
          setLoading(false);
        },
        async () => {
          setLoading(false);
          setUploaded(true);

          console.log("file.name: " +  new Date().toISOString() + file.name)

          const gsReference = ref(storage, "gs://term3-shun-kondo.appspot.com/image/" + new Date().toISOString() + file.name);
          getDownloadURL(gsReference)
            .then(async (url) => {
              IconURL = url;
              console.log("IconURL: " + IconURL);

              try {
                const response = await axios.put(baseURL + '/user', {
                  id: id,
                  icon: IconURL,
                });
                console.log(IconURL);
                console.log("icon" + icon);
              } catch (error) {
                console.log(error);
              }
            })
            .catch((error) => {
              console.log("画像の取得に失敗しました:", error);
            });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  
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
        channel_id: searchParams.get("channel_id"),
        user_id: id,
        text: values.message
      });
      setValues({ message: "", isSubmitted: true });
      setFlag(true);
      window.location.reload()
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
          width: "70vw", /*テキストボックスの横幅*/
          display: "flex"
        }}>

        {/* 画像挿入 */}
        {/* <Button
          // variant="contained"
          size="large"
          endIcon={<InsertPhotoIcon />}
          sx={{ float: "left" }}
        >
          <input
            className="imageUploadInput"
            type="file"
            accept=".png, .jpeg, .jpg"
          onChange={OnFileUploadToFirebase}
          />
        </Button> */}

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
          <div className="LengthCount">({values.message.length}/500)</div>

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
