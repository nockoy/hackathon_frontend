import "./App.css";
import { AuthProvider } from './context/AuthContext';
import { Router } from "./router/Router";
import { UserProvider } from "./context/UserContext";

//export const baseURL = "https://hackathon-backend-5au4xuvalq-uc.a.run.app";
export const baseURL = "http://localhost:8000";

const App = () => {
  return (
    <UserProvider>
      <AuthProvider>
        <div className="App">
          <Router />
        </div>
      </AuthProvider>
    </UserProvider>

  );
};

export default App;