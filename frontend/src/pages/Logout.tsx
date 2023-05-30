import { fireAuth } from '../firebase';
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";

const Logout = () => {
    const navigation = useNavigate()
    const handleLogout = () => {
      fireAuth.signOut();
      navigation('/login');
    };
    return (
      <div className="App">
      <div id="GridContainer">
        <div id="Top">
          <Topbar />
        </div>
        <div id="itemA">
          <Sidebar />
        </div>
        <div id="itemB">
          B
        </div>
        <div id="itemC">
          C
          <h1>ログアウトしますか？</h1>
          <div>
            <button className='logout' onClick={handleLogout}>はい</button>
            <button className='logout' onClick={() => navigation('/')}>いいえ</button>
          </div>
        </div>
        <div id="itemD">
          D
        </div>
      </div>
    </div>
    );
  };
  
  export default Logout;

        