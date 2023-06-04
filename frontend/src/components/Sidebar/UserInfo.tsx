import defaultIcon from "../../images/defaultIcon.jpeg";
import { useAuthContext } from '../../context/AuthContext';
import { ref } from "firebase/storage";
import { storage } from "../../firebase";
import { getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useParams } from "react-router-dom";


function UserInfo() {
  const { user } = useAuthContext();
  const { name, icon } = useContext(UserContext);
  const [image, setImage] = useState(defaultIcon);

  useEffect(() => {
    if (icon) {
      try {
        const gsReference = ref(storage, "gs://term3-shun-kondo.appspot.com/image/" + icon);
        getDownloadURL(gsReference)
          .then((url) => {
            setImage(url);
          })
          .catch((error) => {
            console.log("アイコンの取得に失敗しました", error);
            setImage(defaultIcon); // アイコンが存在しない場合はデフォルトのアイコンを表示
          });
      } catch (error) {
        console.log("アイコンの取得に失敗しました", error);
        setImage(defaultIcon); // アイコンが存在しない場合はデフォルトのアイコンを表示
      }
    } else {
      setImage(defaultIcon); // アイコンが指定されていない場合はデフォルトのアイコンを表示
    }
  }, [icon]);

  //.catch((err) => console.log(err));

  return (
    <div>
      <div className="SidebarIcon">
        <img style={{ width: 100, height: 100 }} src={image} alt="UserIcon" />
        <p>{name}</p>
        <p>{user?.email}</p>
      </div>
    </div>

  );
}

export default UserInfo;