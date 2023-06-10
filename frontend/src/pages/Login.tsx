import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fireAuth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { baseURL } from '../App';
import { UserContext } from '../context/UserContext';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const Login = () => {
  const navigation = useNavigate();
  const [error, setError] = useState('');
  const [passwordType, setPasswordType] = useState("password");
  const { channel, setUser } = useContext(UserContext);
  let disabled = false;
  const regexpEmail = /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

  const textfieldStyles = {
    backgroundColor: "#ffffff",
    fontFamily: "inherit"
  };

  const textlabelStyles = {
    fontFamily: "inherit"
  };

  const [values, setValues] = useState(
    {
      email: "",
      password: ""
    }
  );
  
  const handleChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async () => {
    disabled = true;
    try {
      await signInWithEmailAndPassword(fireAuth, values.email, values.password);
      const response = await axios.get(baseURL + "/user2?email=" + values.email);
      const response2 = await axios.get(baseURL + '/channel/join?user_id=' + response.data[0].id);
      let channel_id = "";
      try {
        setUser(response.data[0].id, response.data[0].name, response.data[0].icon, response2.data[0].id);
        channel_id = response2.data[0].id;
      } catch (e) {
        setUser(response.data[0].id, response.data[0].name, response.data[0].icon, "");
      };
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

          <TextField
            name="email"
            id="email"
            label="Email"
            fullWidth
            variant="filled"
            size="small"
            margin="dense"
            InputProps={{ style: textfieldStyles }}
            InputLabelProps={{ style: textlabelStyles }}
            value={values.email}
            onChange={handleChange}
            error={((regexpEmail.test(values.email) && (values.email)) || !(values.email)) ? false : true}
            helperText={values.email.length > 50 && ("50字以内で入力してください")}
          />
          <TextField
            name="password"
            id="password"
            label="Password"
            type={passwordType}
            autoComplete="new-password"
            fullWidth
            variant="filled"
            size="small"
            margin="dense"
            InputProps={{ style: textfieldStyles }}
            InputLabelProps={{ style: textlabelStyles }}
            value={values.password}
            onChange={handleChange}
            error={values.password.length > 0 && values.password.length < 6}
            helperText={values.password.length > 0 && values.password.length < 6 && ("6字以上で入力してください")}
          />

          <Button
            // variant="contained"
            size="large"
            disabled={(regexpEmail.test(values.email) && values.password.length > 5 && disabled===false) ? false : true}
            onClick={handleSubmit}
          >
            <div>
              ログイン
            </div>
          </Button>

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
