import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import axios from "axios";
import { baseURL } from "../App";
import { useEffect } from "react";

function Header() {
  let { channelid } = useParams();
  let channel_name = "";
  const { id } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);//いける？

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + '/channel/join?user_id=' + id);
      console.log(response.data);
      try {
        channel_name = response.data[0].name;
      } catch (err) {
        console.log("channel_nameが取得できませんでした:" + err);
      };
    } catch (error: any) {
      console.error(error);
    }
  }


  return (
    <div className="Header">
      チャンネル名
      {channelid}
      {channel_name}
    </div>
  );
}

export default Header;