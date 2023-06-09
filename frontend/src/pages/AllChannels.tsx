import { useContext, useEffect, useState } from 'react';
import { baseURL } from '../App';
import { UserContext } from '../context/UserContext';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar';
import CheckIcon from '@mui/icons-material/Check';
import { Button } from '@mui/material';
import axios from 'axios';

interface Channel {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function Channels() {
  const [userChannels, setUserChannels] = useState<Channel[]>([]);
  const [otherChannels, setOtherChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useContext(UserContext);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    fetchData();
  }, [flag]);

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + '/channel/join?user_id=' + id);
      const response2 = await axios.get(baseURL + '/channel/other?user_id=' + id);

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

  const addChannel = async (channel_id: string) => {
    try {
      const response = await axios.post(baseURL + '/members', {
        user_id: id,
        channel_id: channel_id
      });
      setFlag(!flag);
    } catch (error: any) {
      console.error("Failed to join channel:" + error);
    }
  }

  const leaveChannel = async (channel_id: string) => {
    axios.delete(baseURL + '/members', {
      data: {
        user_id: id,
        channel_id: channel_id
      }
    })
      .then(() => {
        setFlag(!flag);
      })
      .catch((err) => { throw Error(`Failed to delete the member: ${err}`) });
  }


  return (
    <div>
      <Topbar />
      <div className='Allchannels'>
        <Sidebar />
        <div className='Channelcontainer'>

          {userChannels.map((channel, key) => (
            <div className='channel' key={key}>
              <Button
                variant="outlined"

                sx={{ float: "right" }}
                onClick={() => leaveChannel(channel.id)}>
                退出する
              </Button>
              <div className='channelname' key={channel.id}># {channel.name}</div>
              <div className='detail'>
                <CheckIcon sx={{ color: "green" }} />
                <div className='join'>参加中</div>
                <div>{channel.description}</div>
              </div>
            </div>
          ))}

          {otherChannels.map((channel, key) => (
            <div className='channel' key={key}>

              <Button
                variant="contained"
                color="success"
                sx={{ float: "right" }}
                onClick={() => addChannel(channel.id)}>
                参加する
              </Button>

              <div className='channelname' key={channel.id}># {channel.name}</div>
              <div>{channel.description}</div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
