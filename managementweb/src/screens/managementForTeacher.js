import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import api from '../api';
import MainLogo from '../components/main_logo';
import LoginControl from '../components/loginControl';
import NavBar from '../components/nav_Bar';
import CustomModal from '../components/alert';

function MyApp() 
{
  const [category, setCategory] = useState('basic');
  const [alertMessage, setAlertMessage] = useState('');
  const [stateId, setStateId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = Cookies.get("access_token");
    
    if(!verifyToken)
    {
      setAlertMessage('로그인이 필요합니다.');
      setIsModalOpen(true);
      setStateId('notLogin');
      return;
    }

    try 
    {
      const decoded = jwtDecode(verifyToken);

      if (decoded.userType === "관리자") 
      {
        setAlertMessage('교사용 페이지입니다. 관리자계정이므로 관리자 페이지로 넘어갑니다.');
        setIsModalOpen(true);
        setStateId(decoded.userType);
      }
      if (decoded.userType === "학생") 
      {
        setAlertMessage('접근권한이 없습니다');
        setIsModalOpen(true);
        setStateId(decoded.userType);
      }
    } 
    catch (error) 
    {
      console.error("토큰 디코딩 오류:", error);
    }
  }, [navigate]);

  const handleLogout = async(e) => {
    try
    {
      const response = await api.post('/auth/logout', {}, {withCredentials: true});
      setStateId(e.target.id);
      setAlertMessage('로그아웃에 성공했습니다. 로그아웃 페이지로 넘어갑니다.');
      setIsModalOpen(true);
    }
    catch(error)
    {
      console.error("로그아웃 실패:", error);
      alert("알 수 없는 이유로 로그아웃에 실패했습니다")
    }
  };
  const handleConfirm = () => {
    console.log("확인 버튼을 클릭",category);
    setIsModalOpen(false);
    if(stateId === 'logout' || stateId === '학생' || stateId === 'notLogin')
    {
      navigate('/');
    }
    else if(stateId === '관리자')
    {
      navigate('/managementPage');
    }
  };
  const handleCancel = () => {
    console.log("취소 버튼을 클릭");
    setIsModalOpen(false);
    if(stateId === 'logout' || stateId === '학생' || stateId === 'notLogin')
    {
      navigate('/');
    }
    else if(stateId === '관리자')
    {
      navigate('/managementPage');
    }
  };

  const onNavbarButtonClick = (e) => {
    setCategory(e.target.id);
  };

  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <LoginControl handleLogout={handleLogout} />
        <NavBar onButtonClick={onNavbarButtonClick} />
        <div className='basicspace'>
          
        </div>
        <div className='btn_section'>
        
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        message={alertMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
export default MyApp;