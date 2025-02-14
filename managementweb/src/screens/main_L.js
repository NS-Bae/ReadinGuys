import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import MainLogo from '../components/main_logo';
// AuthContent 컴포넌트 정의
function AuthContent({ title, children }) {
  return (
    <div className="auth_container">
      {children}
    </div>
  );
};

function LoginForm(props) {
  const [inputs, setInputs] = useState({
    ip1: '', 
    ip2: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleLogin = async(e) => {
    e.preventDefault();

    try
    {
      const response = await api.post('/auth/login',inputs);

      console.log('성공', response.data);
      navigate("managementPage");
    }
    catch(error)
    {
      console.error('실패', error);
    }
  }
  return (
    <AuthContent title="로그인"> 
      <form onSubmit={handleLogin}>
        <div className="input_place">
          <label>ID</label>
          <input
              id='id'
              name='ip1'
              type="text"
              value={inputs.ip1}
              placeholder='ID'
              onChange={handleChange}
              required
            />
        </div>
        <div className="input_place">
          <label>PASSWORD</label>
          <input
            id='pw'
            name='ip2'
            type="password"
            value={inputs.ip2}
            placeholder='PASSWORD'
            onChange={handleChange}
            required
          />
        </div>
        <div className='place'>
          <button className='test_btn' type="submit" value="로그인">로그인</button>
        </div>
      </form>
    </AuthContent>
  );
}
function MyApp() {
  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <LoginForm />
      </div>
    </div>
  );
}
export default MyApp;
