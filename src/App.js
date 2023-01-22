import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Main from './pages/Main.jsx';
import Workout from "./pages/Workout/Workout.jsx";

function delay(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

export default function App() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const isLarge = width > 600
  const theme = document.getElementById('theme');
  theme.setAttribute('href', isLarge ? ' ' : './mobile.css');

  React.useEffect(() => {
    const handleResize = delay(() => setWidth(window.innerWidth), 30);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Workout" element={<Workout />} />
      </Routes>
    </BrowserRouter>
  );
}