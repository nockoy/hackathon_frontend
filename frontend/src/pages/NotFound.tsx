import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";


const NotFound = () => {
  const navigate = useNavigate();
  const { channel } = useContext(UserContext);


  return (
    <div className="NotFound">
      <div className='modal'>
          <h1 >
            404 NotFound
          </h1>
        <h3>お探しのページは見つかりませんでした。</h3>
        <button onClick={() => navigate("/?channel_id=" + channel)}>ホームに戻る</button>
      </div>
    </div>
  );
};

export default NotFound

