import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import MainLogo from '../components/main_logo';
import NavBar from '../components/nav_Bar';
import Academy from '../components/academy';
import Student from '../components/student';
import Workbook from '../components/workbook';

function MyApp() {
  const [category, setCategory] = useState('basic');

  const onButtonClick = (e) => {
    setCategory(e.target.id);
  };

  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <NavBar onButtonClick={onButtonClick} />
        <div className='basicspace'>
          {category==='management_academy' && (
            <Academy />
          )}
          {category==='management_student' && (
            <Student />
          )}
          {category==='management_workbook' && (
            <Workbook />
          )}
        </div>
      </div>
    </div>
  );
}
export default MyApp;