import SidebarIcon from "./SidebarIcon";
import SidebarList from "./SidebarList";
import SimpleAccordion from "./Accordion";
import { Drawer } from '@mui/material'
import Accordions from "./nAccordion";


function Sidebar() {
  return (
    <div className="Sidebar">
      <Drawer
            sx={{
                '& ::-webkit-scrollbar': {
                    display: "none"
                },
                '& :hover': {
                    '::-webkit-scrollbar': {
                        display: "inline"
                    }
                }
            }}
            ></Drawer>
      <SidebarIcon />
      <SimpleAccordion />
      <Accordions/>
      <SidebarList/>
      

      
    </div>
  );
}

export default Sidebar;