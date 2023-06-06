import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { baseURL } from "../App";
import { UserContext } from "../context/UserContext";
import TextField from '@mui/material/TextField';

const NewChannel = () => {
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const { id, channel } = useContext(UserContext);
  const [values, setValues] = useState({ name: "", description: "", isSubmitted: false });


  const textfieldStyles = {
    backgroundColor: "#ffffff",
    fontFamily: "inherit"
  };
  const textlabelStyles = {
    fontFamily: "inherit"
  };

  const handleChange = (e: any) => {
    const target = e.target;
    // console.log(target);
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //setDisable(true);
    if (!values.name) {
      alert("Please enter a Channelname");
      return;
    }
    if (values.name.length > 50) {
      alert("Please enter a Channelname shorter than 50 characters");
      return;
    }
    if (!values.description) {
      alert("Please enter description");
      return;
    }
    if (values.description.length > 100) {
      alert("Please enter description shorter than 100 characters");
      return;
    }

    try {
      const res1 = await axios.post(baseURL + '/channel/join', {
        name: values.name,
        description: values.description
      });
      const res2 = await axios.post(baseURL + '/members', {
        user_id: id,
        channel_id: res1.data.id
      });
      // navigation("/?channel_id=" + channel);
      navigation("/?channel_id=" + res1.data.id);
    } catch (error: any) {
      setError(`Failed to create new channel: ${error.message}`);
    }
  }

  return (
    <div className="auth">
      <div className='auth2'>
        <h1>チャンネル作成</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="form" onSubmit={handleSubmit}>

          <label>チャンネル名</label>
          <TextField
            name="name"
            id="outlined-textarea"
            label="チャンネル名"
            fullWidth
            placeholder="Channel名を入力してください"
            // variant="filled"
            size="small"
            margin="dense"
            InputProps={{ style: textfieldStyles }}
            InputLabelProps={{ style: textlabelStyles }}
            value={values.name}
            onChange={handleChange}
          />


          <label>チャンネルの説明</label>
          <TextField
            name="description"
            id="outlined-textarea"
            label="Description"
            fullWidth
            multiline
            rows={3}
            placeholder="どのようなChannelですか？"
            // variant="filled"
            size="small"
            margin="dense"
            InputProps={{ style: textfieldStyles }}
            InputLabelProps={{ style: textlabelStyles }}
            value={values.description}
            onChange={handleChange}
          />

          <button onClick={handleSubmit}/*disabled={disable}*/>登録する</button>
          <div>
            <Link to={"/?channel_id=" + channel}>ホームに戻る</Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default NewChannel

