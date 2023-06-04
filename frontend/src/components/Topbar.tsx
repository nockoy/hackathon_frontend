import TextField from '@mui/material/TextField';

function Topbar() {
  return (
    <div className="Topbar">
      <div className='SearchBox'
        style={{
          width:"80vw"
        }}>
        <TextField
          fullWidth
          id="outlined-textarea"
          label="slack-like app内を検索"
          placeholder="メッセージや返信を検索してみよう"
          size="small"
          margin="dense"
        />
      </div>  
    </div>
  );
}

export default Topbar;