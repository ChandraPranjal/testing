import axios from "axios"
import { UserContextProvider } from "./context/UserContext";

import Routes from "./routes/Routes";
function App() {
  //Server address
  axios.defaults.baseURL = "http://localhost:4040"
  //so that we can set cookies from server
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
