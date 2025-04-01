import React, { useCallback, useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Styles from '../mainStyle.tsx';
import BookScroll from '../Components/bookScroll.tsx';
import BookInfo from '../Components/bookinfo.tsx';
import api from '../api.tsx';

const Ms = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bookList, setBookList] = useState<any>(null);
  const [bookInfo, setBookInfo] = useState<any>(null);

  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const getBookList = useCallback(async () => {
    try
    {
      const response = await api.get('/workbook/list',{
        params : {academyId : userInfo.AcademyID},
      });
      if(response)
      {
        console.log(response.data, '성공');
        setBookList(response.data);
      }
      else
      {
        console.log(response, '실패');
      }
    }
    catch(error)
    {
      const axiosError = error as AxiosError;
      console.log('b',axiosError);
    }
  }, [userInfo]);
  const fetchUserInfo = async () => {
    try
    {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');

      if (storedUserInfo)
        {
        const parsedUserInfo = JSON.parse(storedUserInfo);

        if (parsedUserInfo && parsedUserInfo.AcademyID)
        {
          setUserInfo(parsedUserInfo);
          console.log('a parsedUserInfo',parsedUserInfo); // 데이터 구조 확인
        }
        else
        {
          console.warn('academyId가 없습니다.');
        }
      } else {
        console.warn('userInfo가 AsyncStorage에 없습니다.');
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
    }
  };

  const selectCheck = (bookinfo: any) => {
    console.log('q', bookinfo);
    setBookInfo(bookinfo);
  };

  //사용자정보 가져오기
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    getBookList();
  }, [getBookList, userInfo]);

  return (
    <GestureHandlerRootView>
      <View style={styles.basic}>
        {width > 600 ? ( //분할화면
          <View style={styles.splitScreen}>
            <BookScroll
              books = {bookList}
              onSelectCheckBookButton = {selectCheck}
            />
            <BookInfo books = {bookInfo}/>
          </View>
        ) : ( //전체화면
          <View style={styles.basic}>
            <BookScroll
              books = {bookList}
              onSelectCheckBookButton = {selectCheck}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};


export default Ms;
