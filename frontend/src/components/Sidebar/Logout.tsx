import { fireAuth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '30px',
  boxShadow: 24,
  p: 4,
};

export default function Logout() {
  const navigation = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const handleLogout = () => {
    fireAuth.signOut();
    localStorage.clear(); // ローカルストレージの内容を消去する
    navigation('/login');
  };

  return (
    <div>

      <ul className='SidebarList'>
        <li className='row' onClick={handleOpen}>
          <div id='icon'>
            <LogoutIcon />
          </div>
          <div id='title'>ログアウト</div>
        </li>
      </ul>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" >
            <div>
              <h1>ログアウトしますか？</h1>

              <button className='logoutyes' onClick={handleLogout}>
                はい
              </button>

            </div>
          </Typography>
          <Typography id="modal-modal-description" >
            <button className='logoutyes' onClick={handleClose}>
              いいえ
            </button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
