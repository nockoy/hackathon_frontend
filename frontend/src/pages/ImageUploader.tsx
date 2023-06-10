import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { baseURL } from "../App";
import ImageLogo from "../images/image.svg";
import { UserContext } from "../context/UserContext";
import { Button } from "@mui/material";
import axios from "axios";


const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const { id, name, icon, channel, setUser } = useContext(UserContext);

  const OnFileUploadToFirebase = async (e: any) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, "image/" + file.name)
    const pathReference = ref(storage, "images/" + file.name);
    const uploadImage = uploadBytesResumable(storageRef, file);
    let IconURL = "";

    try {
      setLoading(true);

      uploadImage.on(
        "state_changed",
        (snapshot) => { },
        (err) => {
          console.log(err);
          setLoading(false);
        },
        async () => {
          setLoading(false);
          setUploaded(true);

          console.log("file.name: " + file.name)

          const gsReference = ref(storage, "gs://term3-shun-kondo.appspot.com/image/" + file.name);
          getDownloadURL(gsReference)
            .then(async (url) => {
              IconURL = url;
              console.log("IconURL: " + IconURL);

              try {
                const response = await axios.put(baseURL + '/user', {
                  id: id,
                  icon: IconURL,
                });
                console.log(IconURL);
                setUser(id, name, IconURL, channel);
                console.log("icon" + icon);
              } catch (error) {
                console.log(error);
              }
            })
            .catch((error) => {
              console.log("アイコンの取得に失敗しました:", error);
            });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  if (loading === false && isUploaded === true) {


    setTimeout(() => {
      window.location.href = "/?channel_id=" + channel;
    }, 1 * 1000);

  }

  return (

    <>
      {loading ? (
        <h2>アップロード中・・・</h2>
      ) : (
        <>
          {isUploaded ? (
            <div className="auth">
              <h2>アップロード完了しました！</h2>
            </div>
          ) : (
            <div className="outerBox">
              <div className="title">
                <h1>画像アップロード</h1>
                <br />
                <p>JpegかPngの画像ファイルを添付してください</p>
                <br />
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
              <br />
              <Button variant="contained">
                ファイルを選択
                <input
                  className="imageUploadInput"
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={OnFileUploadToFirebase}
                />
              </Button>
              <br />
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