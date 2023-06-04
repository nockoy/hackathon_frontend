import { fireAuth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

function Modal({ show, setShow, children }:{ show: any, setShow: any, children: any }) {
  const closeModal = () => {
    setShow(false);
  };

  return show ? (
    <div className='logoutModal'>
      <div id='overlay2' onClick={closeModal}>
        <div id='content' onClick={(e) => e.stopPropagation()}>
          {children}
          <button className='logoutno' onClick={closeModal}>
            いいえ
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default function Logout() {
  const [show, setShow] = useState(false);
  const navigation = useNavigate();

  const handleLogout = () => {
    fireAuth.signOut();
    localStorage.clear(); // ローカルストレージの内容を消去する
    navigation('/login');
  };

  return (
    <div>
      <ul className='SidebarList'>
        <li className='row' onClick={() => setShow(true)}>
          <div id='icon'>
            <LogoutIcon />
          </div>
          <div id='title'>ログアウト</div>
        </li>
      </ul>

      <Modal show={show} setShow={setShow}>
        <div>
          <h1>ログアウトしますか？</h1>
          <div>
            <button className='logoutyes' onClick={handleLogout}>
              はい
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
