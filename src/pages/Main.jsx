import React, { useState } from 'react';
import Navbar from './Navbar/Navbar.jsx';
import Home from './Home/Home.jsx'
import home from './Navbar/home.svg';
import homeSelected from './Navbar/home-selected.svg';
import Progress from './Progress/Progress.jsx'
import Profile from './Profile/Profile.jsx'

export default function Main() {
  const pageData = [
    { name: "Progress", image: home, imageSelected: homeSelected },
    { name: "Home", image: home, imageSelected: homeSelected },
    { name: "Profile", image: home, imageSelected: homeSelected }
  ];
  let [currPage, changePage] = useState(1);
  const pages = [<Progress />, <Home />, <Profile />];
  return (
    <>
      {pages[currPage]}
      <Navbar pageData={pageData} currPage={currPage} changePage={changePage} />
    </>
  );
}