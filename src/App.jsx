import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";
import Protected from "./components/Protected";
import ConfirmAccount from "./pages/ConfirmAccount";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/chats"
            element={
              <Protected>
                <Chats />
              </Protected>
            }
          />
          <Route
            path="/chats/:senderId/:receiverId"
            element={
              <Protected>
                <Chats />
              </Protected>
            }
          />
          <Route path="/confirm-email" element={<ConfirmAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
