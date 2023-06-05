import { Button } from "@mui/material";
import ImageLogo from "./images/image.svg";
import "./ImageUpload.css";
import { storage } from "./firebase"
import { ref, uploadBytesResumable } from "firebase/storage";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import axios from "axios";
import { baseURL } from "./App";

const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const {id, channel} = useContext(UserContext);
  
  const OnFileUploadToFirebase = async (e: any) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, "image/" + file.name)
    const pathReference = ref(storage, "images/" + file.name);
    console.log(pathReference);
    const uploadImage = uploadBytesResumable(storageRef, file);

    try {
      setLoading(true);
  
      uploadImage.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          console.log(err);
          setLoading(false);
        },
        async () => {
          setLoading(false);
          setUploaded(true);

          try {
            await axios.put(baseURL + '/user/' + id, {
              icon: file.name,
            });
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  if (loading === false && isUploaded === true) {
    setTimeout(() => {
      window.location.href = "/?channel_id=" + channel;
    }, 3 * 1000);
  }

  return (

    <>
      {loading ? (
        <h2>アップロード中・・・</h2>
      ) : (
        <>
          {isUploaded ? (
            <div>
              <h2>アップロード完了しました！</h2>
              <h2>3秒後にホームに戻ります!</h2>
            </div>
          ) : (
            <div className="outerBox">
              <div className="title">
                <h1>バックエンドでIconの更新機能を追加する!!</h1>
                <h2>画像をアップロード</h2>
                <p>JpegかPngの画像ファイル</p>
              </div>
              <div className="imageUplodeBox">
                <div className="imageLogoAndText">
                  <img src={ImageLogo} alt="imagelogo" />
                  <p>ドラッグ＆ドロップ</p>
                </div>
                <input
                  className="imageUploadInput"
                  multiple
                  name="imageURL"
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={OnFileUploadToFirebase}
                />
              </div>
              <p>または</p>
              <Button variant="contained">
                ファイルを選択
                <input
                  className="imageUploadInput"
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={OnFileUploadToFirebase}
                />
              </Button>
              <Link to={"/?channel_id=" + channel}>
                ホームに戻る
              </Link>
            </div>
          )}

        </>
      )}

    </>

  );
};

export default ImageUploader;

// import { Button } from "@mui/material";
// import ImageLogo from "./images/image.svg";
// import "./ImageUpload.css";
// import { storage } from "./firebase"
// import { ref, uploadBytesResumable } from "firebase/storage";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useContext } from "react";
// import { UserContext } from "./context/UserContext";

// const ImageUploader = () => {
//   const [loading, setLoading] = useState(false);
//   const [isUploaded, setUploaded] = useState(false);
//   const {name} = useContext(UserContext);
  
//   const OnFileUploadToFirebase = (e: any) => {
//     const file = e.target.files[0];
//     const storageRef = ref(storage, "image/" + file.name)
//     const pathReference = ref(storage, "images/" + file.name);
//     console.log(pathReference);
//     const uploadImage = uploadBytesResumable(storageRef, file);

//     uploadImage.on(
//       "state_changed",
//       (snapshot) => {
//         setLoading(true);
//       },
//       (err) => {
//         console.log(err);
//       },
//       () => {
//         setLoading(false);
//         setUploaded(true);
//       }
//     )
//   }


//   if (loading === false && isUploaded === true) {
//     setTimeout(() => {
//       window.location.href = "/";
//     }, 3 * 1000);
//   }

//   return (

//     <>
//       {loading ? (
//         <h2>アップロード中・・・</h2>
//       ) : (
//         <>
//           {isUploaded ? (
//             <div>
//               <h2>アップロード完了しました！</h2>
//               <h2>3秒後にホームに戻ります!</h2>
//             </div>
//           ) : (
//             <div className="outerBox">
//               <div className="title">
//                 <h2>画像をアップロード</h2>
//                 <p>JpegかPngの画像ファイル</p>
//               </div>
//               <div className="imageUplodeBox">
//                 <div className="imageLogoAndText">
//                   <img src={ImageLogo} alt="imagelogo" />
//                   <p>ドラッグ＆ドロップ</p>
//                 </div>
//                 <input
//                   className="imageUploadInput"
//                   multiple
//                   name="imageURL"
//                   type="file"
//                   accept=".png, .jpeg, .jpg"
//                   onChange={OnFileUploadToFirebase}
//                 />
//               </div>
//               <p>または</p>
//               <Button variant="contained">
//                 ファイルを選択
//                 <input
//                   className="imageUploadInput"
//                   type="file"
//                   accept=".png, .jpeg, .jpg"
//                   onChange={OnFileUploadToFirebase}
//                 />
//               </Button>
//               <Link to={'/'}>
//                 ホームに戻る
//               </Link>
//             </div>



//           )}

//         </>
//       )}

//     </>

//   );
// };

// export default ImageUploader;