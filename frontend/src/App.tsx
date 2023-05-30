import "./App.css";
import { AuthProvider } from './context/AuthContext';
import {Router} from "./router/Router";

const App = () => {
  return (
    <AuthProvider>
        <div className="App">
          <Router />
        </div>
    </AuthProvider>
  );
};

export default App;