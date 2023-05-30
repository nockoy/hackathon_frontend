import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigation = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    
    try {
      await createUserWithEmailAndPassword(fireAuth, email.value, password.value);
      navigation('/');
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>新規登録</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={(event) => setEmail(event.currentTarget.value) }
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={(event) => setPassword(event.currentTarget.value) }
          />
        </div>
        <button>登録する</button>
        <div>
          ログインは<Link to={'/login'}>こちら</Link>から
        </div>
      </form>
      
    </div>
  );
};

export default SignUp


  /*
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    createUserWithEmailAndPassword(fireAuth, email.value, password.value)
    .then(( userCredential) => {
      console.log('user created');
      console.log(userCredential)
    })
    .catch((error) => {
      alert(error.message)
      console.error(error)
    }); 
    console.log(email.value);
    navigation('/');
    */