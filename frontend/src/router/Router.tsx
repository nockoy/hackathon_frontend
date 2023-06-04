import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Mypage from "../pages/Mypage";
import NotFound from "../pages/NotFound";
import ImageUploader from "../ImageUploader";
import Channels from "../pages/Channels";
import NewChannel from "../pages/NewChannel";
import Channel from "../pages/Channel";

export const Router = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Mypage />} />
          <Route path={`/:id`} element={<Mypage />} />
          <Route path={`/signup`} element={<SignUp />} />
          <Route path={`/login`} element={<Login />} />
          <Route path={`/image`} element={<ImageUploader />} />
          <Route path={`/channels`} element={<Channels />} />
          <Route path={`/channels/new`} element={<NewChannel />} />
          <Route path={`/channels/:channelid`} element={<Channel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};