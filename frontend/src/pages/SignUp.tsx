import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from '../firebase';
import { baseURL } from "../App";
import { UserContext } from "../context/UserContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";

const SignUp = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const { setUser } = useContext(UserContext);
  let disabled = false;
  let channel_id = "";
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
      name: "",
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
      const response = await axios.post(baseURL + '/user', {
        name: values.name,
        email: values.email
      });
      const response2 = await axios.get(baseURL + '/channel/join?user_id=' + response.data.id);

      await createUserWithEmailAndPassword(fireAuth, values.email, values.password);

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
        <form className="form">

          <TextField
            name="name"
            id="name"
            label="Username"
            fullWidth
            variant="filled"
            size="small"
            margin="dense"
            InputProps={{ style: textfieldStyles }}
            InputLabelProps={{ style: textlabelStyles }}
            value={values.name}
            onChange={handleChange}
            error={values.name.length > 50}
            helperText={values.name.length > 50 && ("50字以内で入力してください")}
          />
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
            disabled={(values.name && regexpEmail.test(values.email) && values.password.length > 5 && disabled === false) ? false : true}
            onClick={handleSubmit}
          >
            <div>
              登録する
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

          {/* <button>登録する</button> */}
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
