import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Mypage from "../pages/Mypage";
import NotFound from "../pages/NotFound";
import ImageUploader from "../pages/ImageUploader";
import Channels from "../pages/AllChannels";
import NewChannel from "../pages/NewChannel";
import Reply from "../pages/Reply";

export const Router = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Mypage />} />
          <Route path={`/:channel_id`} element={<Mypage />} />
          <Route path={`/reply`} element={<Reply />} />
          <Route path={`/signup`} element={<SignUp />} />
          <Route path={`/login`} element={<Login />} />
          <Route path={`/image`} element={<ImageUploader />} />
          <Route path={`/channels`} element={<Channels />} />
          <Route path={`/channels/new`} element={<NewChannel />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};