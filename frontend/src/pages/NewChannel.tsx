import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { baseURL } from "../App";
import { UserContext } from "../context/UserContext";

const NewChannel = () => {
  //const [loginuser, setLoginuser] = useContext(UserContext)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const { id, channel } = useContext(UserContext);
  const [values, setValues] = useState(
    {
      message: "",
      isSubmitted: false
    }
  );

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
    if (!name) {
      alert("Please enter a Channelname");
      return;
    }
    if (name.length > 50) {
      alert("Please enter a Channelname shorter than 50 characters");
      return;
    }
    if (!description) {
      alert("Please enter description");
      return;
    }
    if (description.length > 100) {
      alert("Please enter description shorter than 100 characters");
      return;
    }

    try {
      const response = await axios.post(baseURL + '/channel/join', {
        name: name,
        description: description
      });
      navigation("/?channel_id=" + channel);
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
          <input
            name="name"
            type="name"
            placeholder="Channelname"
            onChange={(event) => setName(event.target.value)}
          />


          <label>チャンネルの説明</label>
          <input
            name="description"
            type="description"
            placeholder="Description"
            onChange={(event) => setDescription(event.target.value)}
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

