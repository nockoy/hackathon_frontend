import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

function SendBox() {
    return (
      <div className="SendBox">
        <div className='TextBox'
        style={{
          width:"60vw" /*テキストボックスの横幅*/
        }}>
        <TextField
          fullWidth
          id="outlined-textarea"
          label="メッセージを送る"
          placeholder="メッセージを送信してみよう"
          size="small"
          margin="dense"
          multiline
          rows={3}
        />
        <SendIcon />
      </div>
      </div>
    );
  }
  
  export default SendBox;
