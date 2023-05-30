import { fireAuth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import MessageField from "../components/MessageField";
import SendBox from "../components/Sendbox";

export default function Mypage() {
  const navigation = useNavigate();
  const { user } = useAuthContext();
  const handleLogout = () => {
    fireAuth.signOut();
    navigation('/login');
  };

  if (!user) {
    return <Navigate to="/login" />;
  } else {
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
            {user.email}でログインしています
            <Header />
          </div>
          <div id="itemC">
            
            <MessageField />
          </div>
          <div id="itemD">
            <SendBox/>
          </div>
        </div>
      </div>
    );
  }
}