import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import Styles from '../mainStyle.tsx';
import BookScroll from '../Components/bookScroll.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BookInfo from '../Components/bookinfo.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

const Ms = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bookList, setBookList] = useState<any>(null);
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  //사용자정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try
      {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');

        if (storedUserInfo)
          {
          const parsedUserInfo = JSON.parse(storedUserInfo);

          if (parsedUserInfo && parsedUserInfo.academyId)
          {
            setUserInfo(parsedUserInfo);
            console.log('a',parsedUserInfo.academyId); // 데이터 구조 확인
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
    fetchUserInfo();
  }, []);
  useEffect(() => {
    console.log('a', userInfo);
    if(userInfo)
    {
      console.log('aa',userInfo.academyId);
      //문제집 리스트 가져오기
      const getBookList = async () => {
        try
        {
          const response = await axios.get('http://10.0.2.2:3000/workbook/list',{
            params : {academyId : userInfo.academyId},
          });
          if(response.status === 200 || response.status === 201 )
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
      };
      getBookList();
    }
  }, [userInfo]);

  console.log('a',bookList);

  return (
    <GestureHandlerRootView>
      <View style={styles.basic}>
        {width > 600 ? ( //분할화면
          <View style={styles.splitScreen}>
            <BookScroll books = {bookList} />
            <BookInfo />
          </View>
        ) : ( //전체화면
          <View style={styles.basic}>
            <BookScroll books = {bookList} />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};


export default Ms;
