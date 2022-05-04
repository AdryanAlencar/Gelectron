import './App.css';
import { UseSettingsContext } from './context/SettingsContext';
import { Home } from './pages/home';
import { Settings } from './pages/settings';

function App() {
  return (
    <UseSettingsContext>
      <Settings />
    </UseSettingsContext>
  );
}

export default App;
