// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate()

  return (
    <div className="NotFound">
      <div className='modal'>
          <h1 >
            404 NotFound
          </h1>
        <h3>お探しのページは見つかりませんでした。</h3>
        <button onClick={() => navigate('/')}>ホームに戻る</button>
      </div>
    </div>
  );
};

export default Feedback



// const Feedback = () => {
//   //メールアドレスフォーマットチェック用正規表現定義
//   const regexpEmail = /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
//   //見た目の設定
//   const theme = createTheme({
//     typography: {
//       fontFamily: "inherit",
//       button: {
//         textTransform: "none",
//         fontFamily: "inherit"
//       }
//     }
//   });
//   const textfieldStyles = {
//     backgroundColor: "#ffffff",
//     fontFamily: "inherit"
//   };
//   const textlabelStyles = {
//     fontFamily: "inherit"
//   };
//   //state定義
//   const [values, setValues] = useState(
//     {
//       fbname: "",
//       fbemail: "",
//       fbmessage: "",
//       isSubmitted: false
//     }
//   );
//   //文字入力の度にstate更新
//   const handleChange = (e) => {
//     const target = e.target;
//     const value = target.type === "checkbox" ? target.checked : target.value;
//     const name = target.name;
//     setValues({ ...values, [name]: value });
//   };
//   //送信ボタンクリック後の処理
//   const handleSubmit = async () => {
//     await axios.post(
//       "https://xxxx.xxxx.xxxx", //メール送信APIのエンドポイントを記入
//       {
//         "subj": "Web からのフィードバック",
//         "name": values.fbname,
//         "email": values.fbemail,
//         "body": values.fbmessage
//       }
//     );
//     setValues({ isSubmitted: true });
//   };
//   //画面表示内容
//   return values.isSubmitted ? (
//     <section>
//       {/* 送信済みフラグが true であれば 送信しました画面 を表示 */}
//       <h2>フィードバック</h2>
//       <p>フィードバックを送信しました。<br />貴重なご意見、ありがとうございました。</p>
//     </section>
//   ) : (
//     <section>
//       {/* 送信済みフラグが false であれば 入力画面 を表示 */}
//       <h2>フィードバック</h2>
//       <Box component="form" noValidate autoComplete="off">
//         <ThemeProvider theme={theme}>
//           <FormControl fullWidth>
//             <TextField
//               name="fbname"
//               id="fbname"
//               label="お名前"
//               placeholder="お名前"
//               variant="filled"
//               margin="dense"
//               size="small"
//               InputProps={{ style: textfieldStyles }}
//               InputLabelProps={{ style: textlabelStyles }}
//               value={values.fbname}
//               onChange={handleChange}
//             />
//             <TextField
//               name="fbemail"
//               id="fbemail"
//               label="メールアドレス"
//               placeholder="メールアドレス"
//               variant="filled"
//               margin="dense"
//               size="small"
//               InputProps={{ style: textfieldStyles }}
//               InputLabelProps={{ style: textlabelStyles }}
//               value={values.fbemail}
//               onChange={handleChange}
//               error={((regexpEmail.test(values.email) && (values.email)) || !(values.email)) ? false : true}
//               helperText={((regexpEmail.test(values.fbemail) && (values.fbemail)) || !(values.fbemail)) ? null : "Incorrect Email address format."}
//             />
//             <TextField
//               name="fbmessage"
//               id="fbmessage"
//               label="メッセージ"
//               multiline
//               minRows={3}
//               placeholder="メッセージ"
//               variant="filled"
//               margin="dense"
//               size="small"
//               InputProps={{ style: textfieldStyles }}
//               InputLabelProps={{ style: textlabelStyles }}
//               value={values.fbmessage}
//               onChange={handleChange}
//             />
//           </FormControl>
//           <br />
//           <br />
//           <Button
//             variant="contained"
//             size="large"
//             endIcon={<SendIcon />}
//             disabled={(values.fbname && regexpEmail.test(values.fbemail) && values.fbmessage) ? false : true}
//             onClick={handleSubmit}
//           >
//             フィードバックを送る
//           </Button>
//         </ThemeProvider>
//       </Box>
//     </section>
//   );
// };

// export default Feedback;