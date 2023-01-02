import './App.css';
import { newLocalStorage, newCookies } from "./sanitizeService";
import { useState } from 'react';

const addOnStorage = () => {
  console.log("addOnStorage");

  for (let i = 0; i < 10; i++) {
    const myObj = { "value": "Tom on LS" + i };
    const randTTLInSecs = Math.floor(Math.random() * 20);
    newLocalStorage.setItem('meuGato' + i, JSON.stringify(myObj), randTTLInSecs);
  }
}

const addOnCookies = () => {
  console.log("addOnCookies");

  for (let i = 0; i < 10; i++) {
    const myObj = { "value": "Tom on Cookies" + i };
    const randTTLInSecs = Math.floor(Math.random() * 20);
    newCookies.setCookie('meuGato' + i, JSON.stringify(myObj), randTTLInSecs);
  }
}

const removeOnStorage = () => {
  console.log("removeOnStorage");
  newLocalStorage.removeItem('meuGato');
}

const removeOnCookies = () => {
  console.log("removeOnCookies");
  newCookies.deleteCookie('meuGato');
}


function App() {
  const [valLocalStorage, setValLocalStorage] = useState();
  const [valCookies, setValCookies] = useState();

  const showRandom = () => {
    const randCat = Math.floor(Math.random() * 10);
    getOnStorage(randCat);
  }


  const getCookiesRandom = () => {
    const randCat = Math.floor(Math.random() * 10);
    getOnCookies(randCat);
  }

  const getOnStorage = (i:number) => {
    const res = newLocalStorage.getItem('meuGato' + i);
    setValLocalStorage(res);
  }

  const getOnCookies = (i:number) => {
    const res = newCookies.getCookie('meuGato' + i);
   // setValCookies(res);
  }

  return (
    <div className="App">
      <div >
        <button onClick={addOnStorage}
        >

          add value to Local Storage
        </button>
        <button onClick={removeOnStorage}
        >

          remove value to Local Storage
        </button>
        <button onClick={showRandom}
        >

          get Data
        </button>
        <br></br>

        {valLocalStorage}
      </div>
      <br>
      </br>

      <div className="App">
        <button onClick={addOnCookies}
        >

          add value to Cookies
        </button>
        <button onClick={removeOnCookies}
        >

          remove value to Cookies
        </button>
        <button onClick={getCookiesRandom}
        >

          get Data
        </button>
        <br></br>

        {valCookies}
      </div>

    </div>
  );
}

export default App;
