import '../App.css';
import React, { useState } from 'react';

import api from '../api';
import MainLogo from '../components/main_logo';
import NavBar from '../components/nav_Bar';
import Academy from '../components/academy';
import Student from '../components/student';
import Workbook from '../components/workbook';
import CustomModal from '../components/alert';
import AddModal from '../components/bigmodal';

function MyApp() {
  const [category, setCategory] = useState('basic');
  const [buttonId, setButtonId] = useState('');
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBigModalOpen, setIsBigModalOpen] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  let link = '';

  const handleConfirm = () => {
    console.log("확인 버튼을 클릭", buttonId);
    setIsModalOpen(false);
    if(buttonId === 'delete')
    {
      deleteData();
    }
    else if(buttonId === 'novation')
    {
      console.log('a', buttonId, checkedRows);
      novationData();
    }
    setCheckedRows([]);
  };
  const handleCancel = () => {
    console.log("취소 버튼을 클릭");
    setIsModalOpen(false);
    setForceRender((prev) => prev + 1);
    setCheckedRows([]);
  };

  const handleAddConfirm = (data) => {
    console.log("확인 버튼을 클릭", data);
    setIsBigModalOpen(false);
    if(data.length === 0)
    { 
      alert("추가할 정보가 없습니다.");
    }
    else
    {
      addData(data);
    }
  };
  const handleAddCancel = () => {
    console.log("취소 버튼을 클릭", isBigModalOpen);
    setIsBigModalOpen(false);
  };

  const onNavbarButtonClick = (e) => {
    setCategory(e.target.id);
    setCheckedRows([]);
  };
  const handleCheckboxChange = (event, key) => {
    console.log(event.target.checked, key);

    const ischecked = event.target.checked;
    const [data1, data2] = key.split('_');

    if(ischecked)
    {
      setCheckedRows((prevCheckedRows) => [...prevCheckedRows, {data1, data2}]);
    }
    else
    {
      setCheckedRows((prevCheckedRows) => prevCheckedRows.filter((row) => row.data1 !== data1 && row.data2 !== data2));
    }
  };
  const clickAddButton = () => {
    console.log("add");
    setIsBigModalOpen(true);
  };
  const clickDeleteButton = (e) => {
    setButtonId(e.target.id);
    setIsModalOpen(true);
    console.log('delete', checkedRows, buttonId);
  };
  

  async function deleteData()
  {
    switch(category)
    {
      case "management_academy" : link = 'academy'; break;
      case "management_student" : link = 'users'; break;
      case "management_workbook" : link = 'workbook'; break;
      default: link = ''; break;
    };

    try
    {
      const response = await api.delete(`/${link}/deletedata`, {
        data: {checkedRows},
      });
      console.log("삭제성공", response.data);
      alert(`${response.data.deletedCount}개의 정보를 삭제했습니다`);

      setForceRender((prev) => prev + 1);
    }
    catch(error)
    {
      console.log("삭제 실패", error);
    }
  };
  async function novationData()
  {
    console.log('b', buttonId, checkedRows);
    try
    {
      const response = await api.patch('/academy/novation', {
        checkedRows,
      });
      
      console.log("구독정보 업데이트에 성공했습니다.", response.data);
      alert(`${response.data.updatedCount}개 학읜의 구독 정보를 변경했습니다.`);
      
      setForceRender((prev) => prev + 1);
    }
    catch(error)
    {
      console.log("구독정보 갱신에 실패했습니다", error);
    }
  };
  async function addData(data)
  {
    switch(category)
    {
      case "management_academy" : link = 'academy'; break;
      case "management_student" : link = 'users'; break;
      case "management_workbook" : link = 'workbook'; break;
      default: link = ''; break;
    };
    console.log(data);

    try
    {
      const response = await api.post(`/${link}/adddata`, {
        data,
      });
      console.log("추가 성공", response.data);
      alert(`${response.data.addedCount}개의 정보를 추가했습니다`);

      setForceRender((prev) => prev + 1);
    }
    catch(error)
    {
      console.log("추가 실패", error);
    }
  };

  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <NavBar onButtonClick={onNavbarButtonClick} />
        <div className='basicspace'>
          {category==='management_academy' && (
            <Academy forceRender={forceRender} handleCheckboxChange = {handleCheckboxChange} />
          )}
          {category==='management_student' && (
            <Student forceRender={forceRender} handleCheckboxChange = {handleCheckboxChange} />
          )}
          {category==='management_workbook' && (
            <Workbook forceRender={forceRender} handleCheckboxChange = {handleCheckboxChange} />
          )}
        </div>
        <div className='btn_section'>
        {category !== 'basic' && (
          <>
          {category === "management_academy" && (
            <button id='novation' className='normal_btn' onClick = {clickDeleteButton} disabled = {checkedRows.length === 0} >구독 갱신</button>
          )}
            <button id='add' className='normal_btn' onClick = {clickAddButton} >새로 추가하기</button>
            <button id='delete' className='normal_btn' onClick = {clickDeleteButton} disabled = {checkedRows.length === 0} >삭제하기</button>
          </>
        )}
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        message="이 작업을 수행하시겠습니까?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <AddModal
        isOpen={isBigModalOpen}
        onConfirm={handleAddConfirm}
        onCancel={handleAddCancel}
        category={category}
      />
    </div>
  );
}
export default MyApp;