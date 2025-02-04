import '../App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

const Academy = () => {
  async function getStudent()
  {
    try
    {
      const response = await axios.get('http://localhost:3000/academy/totallist');
      console.log('성공', response.data);
    }
    catch(error)
    {
      console.error('실패', error);
    }
  };
  useEffect(() => {
    getStudent();
  });
  return (
    <div className='basicspace'>
      <p>aca</p>
    </div>
  )
};

export default Academy;