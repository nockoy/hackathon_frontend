import axios from "axios";
import { baseURL } from "../App";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Header() {
  const [searchParams] = useSearchParams();
  let channel_id = searchParams.get("channel-id");
  const [ChannelName, setChannelName] = useState("");

  useEffect(() => {
    fetchData();
  }, [channel_id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL + '/channel?channel_id=' + channel_id);
      setChannelName(response.data[0].name);
    } catch (error) {
      console.log("channel_nameが取得できませんでした:" + error);
    }
  }

  return (
    <div className="Header">
      <div className="HeaderName">
        {ChannelName}
      </div>
    </div>
  );
}

export default Header;