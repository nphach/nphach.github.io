import logo from './logo.svg';
import './App.css';
import {NavBar} from "./components/NavBar";
import {Header} from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Header />
    </div>
  );
}

export default App;
