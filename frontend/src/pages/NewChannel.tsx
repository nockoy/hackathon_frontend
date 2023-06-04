import { useContext, useState } from "react";
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


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //setDisable(true);
    if (!name) {
      alert("Please enter name");
      return;
    }
    if (name.length > 50) {
      alert("Please enter a name shorter than 50 characters");
      return;
    }

    try {
      const response = await axios.post(baseURL + '/channel/join', {
        name: name,
        description: description
      });

      navigation('/');
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

          <button /*disabled={disable}*/>登録する</button>
          <div>
            <Link to={'/'}>ホームに戻る</Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default NewChannel

