import TagIcon from '@mui/icons-material/Tag';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../App';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface Channel {
  c_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function ChannelList() {
  const [userChannels, setUserChannels] = useState<Channel[]>([]);
  const { id } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);//いける？

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + '/channel/join?user_id=' + id);
      setUserChannels(response.data);
      // console.log(response.data[0]);
    } catch (error) {
      console.log('データ取得の際にエラーが発生しました', error);
    };
  };

  const onClickhandler = (value:any) => {
    navigate("/?channel_id=" + value.id);
  }

  return (
    <ul className="SidebarList">
      {userChannels.map((value, key) => {
        return (
          <li
            key={key}
            // id={window.location.pathname === value.link ? "active" : ""}
            className="row"
            onClick={() => onClickhandler(value)}
          >
            <div id="icon"><TagIcon /></div>
            <div id="title" >{value.name}</div>
            
          </li>
          
        );
      })}
    </ul>
  );
}

export default ChannelList;
