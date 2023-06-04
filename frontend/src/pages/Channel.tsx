import { Routes, Route, useParams } from "react-router-dom";

import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import MessageField from "../components/MessageField";
import SendBox from "../components/Sendbox";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { baseURL } from '../App';
import axios from 'axios';

interface Channel {
  c_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function Channel() {
  const { user } = useAuthContext();
  const [userChannels, setUserChannels] = useState<Channel[]>([]);
  const { id } = useContext(UserContext);

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
            <MessageField />
          </div>
          <div id="itemD">
            <SendBox />
          </div>
        </div>
      </div>
    );
  }
}