import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../App';
import { UserContext } from '../context/UserContext';

interface Channel {
  c_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function Channels() {
  const [userChannels, setUserChannels] = useState<Channel[]>([]);
  const [otherChannels, setOtherChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id, channel } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + '/channel/join?user_id=' + id);
      const response2 = await axios.get(baseURL + '/channel/notjoin?user_id=' + id);

      setUserChannels(response.data);
      setOtherChannels(response2.data);

    } catch (error) {
      console.log('データ取得の際にエラーが発生しました', error);
    } finally {
      setIsLoading(false); // データの取得が完了したのでisLoadingをfalseに設定
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h2>参加しているチャンネル:</h2>
        {userChannels.map(channel => (
          <div key={channel.c_id}>{channel.name}</div>
        ))}

        <h2>参加していないチャンネル:</h2>
        {otherChannels.map(channel => (
          <div key={channel.c_id}>{channel.name}</div>
        ))}
      </div>
      <div>
        <Link to={"/?channel_id=" + channel}>ホームに戻る</Link>
      </div>
    </div>
  );
}
