import UserInfo from "./UserInfo";
import ChannelList from "./ChannelList";
import SidebarList from "./SidebarList";
//import Accordions from "./Accordion";
import Logout from "./Logout";

function Sidebar() {
  return (
    <div className="Sidebar">

      <UserInfo />

      {/* <Accordions /> */}

      <ChannelList />

      <SidebarList/>

      <Logout />

      <div id="overlay"></div>
    </div>
  );
}

export default Sidebar;