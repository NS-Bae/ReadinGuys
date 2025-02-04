import '../App.css';
import React, { useEffect } from 'react';
import axios from 'axios';

const Workbook = () => {
  async function getWorkbook()
  {
    try
    {
      const response = await axios.get('http://localhost:3000/workbook/list');
      console.log('성공', response.data);
    }
    catch(error)
    {
      console.error('실패', error);
    }
  };
  useEffect(() => {
    getWorkbook();
  });

  return (
    <div className='basicspace'>
      <p>workbook</p>
    </div>
  )
};

export default Workbook;