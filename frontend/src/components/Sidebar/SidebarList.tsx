import ImageIcon from '@mui/icons-material/Image';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const SidebarData = [
  
  {
    title: "チャンネル一覧",
    icon: <FormatListBulletedIcon />,
    link: "/channels", //モーダルにすると良いかも
  },
  {
    title: "チャンネル作成",
    icon: <AddBoxIcon />,
    link: "/channels/new", //モーダルにすると良いかも
  },
  // {
  //   title: "アイコン変更",
  //   icon: <ImageIcon />,
  //   link: "/image",
  // },
  // {
  //   title: "プロフィール",
  //   icon: <AccountBoxIcon />,
  //   link: "/profile",
  // },
];

function SidebarList() {
  return (
    <ul className="SidebarList">
        {SidebarData.map((value, key) => {
          return (
            <li
              key={key}
              id={window.location.pathname === value.link ? "active" : ""}
              className="row"
              onClick={() => {
                window.location.pathname = value.link;
              }}
            >
              <div id="icon">{value.icon}</div>
              <div id="title">{value.title}</div>
            </li>
            
          );
        })}
      </ul>
  );
}

export default SidebarList;