import {useState, useEffect} from 'react'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [data, setData] = useState(null)

  useEffect(async() => {
   async function fetchData  {
    axios.get('/api').then((response) => {
          setData(response)
      })
   }

  }, [])

  console.log(data);


  return (
    <div className="App">
     <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
