import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import ReplyField from "../components/ReplyField";
import SendBox from "../components/Sendbox";
import { baseURL } from '../App';
import axios from 'axios';

interface Channel {
  c_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function Reply() {
  const { user } = useAuthContext();
  const [userChannels, setUserChannels] = useState<Channel[]>([]);
  const { id } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  let message_id = searchParams.get("message_id");


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + '/channel/join?user_id=' + id);
      setUserChannels(response.data);
    } catch (error) {
      console.log('データ取得の際にエラーが発生しました', error);
    };
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
            <Header />
          </div>
          <div id="itemC">
            <ReplyField />
          </div>
        </div>
      </div>
    );
  }
}
