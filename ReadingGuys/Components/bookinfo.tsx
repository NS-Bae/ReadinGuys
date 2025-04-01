import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Styles from '../mainStyle.tsx';
import api from '../api.tsx';
import Mt from './text.tsx';
import Accordion from './accordionList.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';

interface Book {
  workbookId: string;
  workbookName: string;
  Difficulty: string;
  storageLink: string;
}

interface BookInfoProps {
  books: Book;
}

const BookInfo: React.FC<BookInfoProps> = ({ books }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);
  const basicInfo = '시험 정보';

  const [collapsed, setCollapsed] = useState(true);
  const [refineData, setRefineData] = useState<{ userId: string; userName: string; academyId: string; workbookId: string } | null>(null);
  const [recordList, setRecordList] = useState<any>(null);
  const [recordCount, setRecordCount] = useState<number>(0);

  useEffect(() => {
    setBasicInfo();
  }, [books]);
  useEffect(() => {
    getWorkbookExamRecord();
  }, [refineData]);

  //books props가 없는(null) 경우 return null
  if(books === null)
  {
    return null;
  }
  //아코디언 컴포넌트 접힘 판단
  const handleAccordion = async () => {
    setCollapsed(!collapsed);
  };
  //백엔드에 전송될 정보 정제
  async function setBasicInfo()
  {
    const myinfo = await AsyncStorage.getItem('userInfo');
    if(myinfo === null)
    {
      return null;
    }
    const parsedMyInfo = JSON.parse(myinfo);
    const selectedData = {
      userId: parsedMyInfo.id,
      userName: parsedMyInfo.userName,
      academyId: parsedMyInfo.AcademyID,
      workbookId: books.workbookId,
    };
    setRefineData(selectedData);
  }
  //내 시험기록중 특정 문제집을 가져오기
  async function getWorkbookExamRecord()
  {
    try
    {
      const response = await api.post('/records/oneonerecord',{refineData});
      if(response)
      {
        console.log(response.data, '성공');
        setRecordList(response.data);
        setRecordCount(response.data.length);
      }
      else
      {
        console.log(response, '실패');
      }
    }
    catch(error)
    {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    }
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent1}
      keyboardShouldPersistTaps="handled"
    >
      <View style={exclusiveStyles.basic}>
        <View style={styles.tfContainer}>
          <Mt title="문제집 정보" titleStyle={styles.normal} />
        </View>
        <View style={exclusiveStyles.container}>
          <Text style={exclusiveStyles.normal}>책 이름 : {books.workbookName}</Text>
          <Text style={exclusiveStyles.normal}>책 난이도 : {books.Difficulty}</Text>
          <Text style={exclusiveStyles.normal}>응시 횟수 : {recordCount}</Text>
        </View>
        <Accordion basicInfo={basicInfo} onPress={handleAccordion} isCollapsed={collapsed} info={recordList} />
      </View>
    </ScrollView>
  );
};

const exclusiveStyles = StyleSheet.create({
  basic:
  {
    flex: 1,
    width: '100%',
  },
  container: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',

  },
  normal: {
    fontSize: 27,
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'black',
    margin: 0,
    padding: 0,
  },
});

export default BookInfo;
