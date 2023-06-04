import { useNavigate } from 'react-router-dom';


const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="NotFound">
      <div className='modal'>
          <h1 >
            404 NotFound
          </h1>
        <h3>お探しのページは見つかりませんでした。</h3>
        <button onClick={() => navigate('/')}>ホームに戻る</button>
      </div>
    </div>
  );
};

export default NotFound

