import { useContext } from 'react';
import './App.css';
import { SettingsContext } from './context/SettingsContext';
import { Home } from './pages/home';
import { Settings } from './pages/settings';
import { Splash } from './pages/splash';

function App() {
  const {page} = useContext(SettingsContext);
  console.log(page);
  return (
    <>
      {page === 'home' ? <Home /> : (page === 'settings' ? <Settings /> : <Splash />)}  
    </>
  );
}

export default App;
