import UserInfo from "./UserInfo";
import ChannelList from "./ChannelList";
import SidebarList from "./SidebarList";
import Logout from "./Logout";

function Sidebar() {
  return (
    <div className="Sidebar">
      <UserInfo />

      <ChannelList />
      <br />
      
      <SidebarList/>
      <br />
      
      <Logout />
      <br />
      
      <div id="overlay"></div>
    </div>
  );
}

export default Sidebar;