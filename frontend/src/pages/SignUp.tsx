import { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from '../firebase';
import { baseURL } from "../App";
import { UserContext } from "../context/UserContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";


interface Channel {
  c_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SignUp = () => {
  //const [loginuser, setLoginuser] = useContext(UserContext)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  //const [disable, setDisable] = useState(!name || !email || !password);
  const navigation = useNavigate();
  const { setUser } = useContext(UserContext);
  let channel_id = "";


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
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      const response = await axios.post(baseURL + '/user', {
        name: name,
        email: email
      });
      const response2 = await axios.get(baseURL + '/channel/join?user_id=' + response.data.id);

      await createUserWithEmailAndPassword(fireAuth, email, password);

      channel_id = response2.data[0].id;

      setUser(response.data.id, response.data.name, response.data.icon, channel_id);

      navigation('/?channel_id=' + channel_id);
    } catch (error: any) {
      setError(`Failed to sign up: ${error.message} \n登録できているかもしれません`);
    }
  }

  return (
    <div className="auth">
      <div className='auth2'>
        <h1>Slack-like App</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="form" onSubmit={handleSubmit}>

          <label>ユーザーネーム</label>
          <input
            name="name"
            type="name"
            placeholder="Username"
            onChange={(event) => setName(event.target.value)}
          />


          <label>メールアドレス</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>パスワード</label>
          <input
            type={passwordType}
            placeholder={"Password"}
            autoComplete="new-password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          {passwordType === "password" && (
            <VisibilityOffIcon
              onClick={() => setPasswordType("text")}
              className="Password__visual"
            />
          )}
          {passwordType === "text" && (
            <VisibilityIcon
              onClick={() => setPasswordType("password")}
              className="Password__visual"
            />
          )}

          <button /*disabled={disable}*/>登録する</button>
          <div>
            アカウントをお持ちですか？
          </div>
          <div>
            ログインは<Link to={'/login'}>こちら</Link>から
          </div>
        </form>
      </div>

    </div>
  );
};

export default SignUp
