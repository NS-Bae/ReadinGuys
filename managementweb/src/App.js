import './App.css';
import { Routes, Route } from "react-router-dom";

import Main from './screens/main_L';
import Management from './screens/management_S';

function App() {
  return (
    <Routes>
      <Route path = "/" element = {<Main />} />
      <Route path = "/managementPage" element = {<Management />} />
    </Routes>
  );
}

export default App;
