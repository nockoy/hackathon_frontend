import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fireAuth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { baseURL } from '../App';
import { UserContext } from '../context/UserContext';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from 'axios';


const Login = () => {
  const navigation = useNavigate();
  const [error, setError] = useState('');
  const [passwordType, setPasswordType] = useState("password");
  const { channel, setUser } = useContext(UserContext);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    try {
      await signInWithEmailAndPassword(fireAuth, email.value, password.value);
      const response = await axios.get(baseURL + "/user?email=" + email.value);
      const response2 = await axios.get(baseURL + '/channel/join?user_id=' + response.data[0].id);
      let channel_id = "";
      try {
        setUser(response.data[0].id, response.data[0].name, response.data[0].icon, response2.data[0].id);
        channel_id = response2.data[0].id;
      } catch (e) {
        setUser(response.data[0].id, response.data[0].name, response.data[0].icon, "");//2の方は[0]をつけるとバグる 
      };
      //console.log("User:", response.data[0]);
      navigation('/?channel_id=' + channel_id);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <div className='auth'>
      <div className='auth2'>
        <h1>Slack-like App</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className='form' onSubmit={handleSubmit}>

          <label>メールアドレス</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
          />
          <label>パスワード</label>
          <input
            type={passwordType}
            name="password"
            placeholder="Password"
            required
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

          <button>ログイン</button>
          <div>
            アカウントをお持ちでないですか？
          </div>
          <div>
            新規登録は<Link to={'/signup'}>こちら</Link>から
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
