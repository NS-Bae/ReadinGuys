import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View, useWindowDimensions } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import BookButton from './changedButton';
import Mt from './text.tsx';
import Styles from '../mainStyle.tsx';
import Bs from '../Components/bottomSheet.tsx';

interface Book {
  workbookId: string;
  workbookName: string;
  Difficulty: string;
  storageLink: string;
}
interface BookScrollProps
{
  books: Book[];
}

const BookScroll: React.FC<BookScrollProps> = ({books}) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const [openUpIndex, setOpenUpIndex] = useState<string | null>(null);
  const [openMdIndex, setOpenMdIndex] = useState<number | null>(null);
  const [upIsDownloaded, setUpIsDownloaded] = useState<{ [key: string]: boolean }>({});
  const [sK, setSK] = useState <string|null>(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

//문제집 다운 필요시 컨트롤 함수
  const handleBBUToggle = (workbookName : string, storageLink : string) => {
    console.log(workbookName, 'a', storageLink);

    if(workbookName && storageLink)
    {
      downFile(storageLink, workbookName);
    }
  };
  const handleBBMToggle = (index:number) => {
    console.log('a', upIsDownloaded[0]);
    setOpenMdIndex(openMdIndex === index ? null : index);
    setSK(`ing${index}`);
    handleOpenBottomSheet();

    if (openUpIndex !== null)
    {
      setOpenUpIndex(null);
    }
    if (openMdIndex === index)
    {
      handleCloseBottomSheet();
    }
  };
  const downFile = async (storageLink : string, workbookName : string) => {
    try
    {
      const response = await axios.post(
        'http://10.0.2.2:3000/workbook/download',
        { storageLink },
        { responseType : 'blob' }
      );

      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = async () => {
        try
        {
          if(typeof reader.result === 'string')
          {
            const convertData = reader.result.split(',')[1];
            const localPath = `${RNFS.DocumentDirectoryPath}/${workbookName}.zip`;

            await RNFS.writeFile(localPath, convertData, 'base64');
            Alert.alert('다운로드 완료');
            console.log('다운로드 완료:', response, 'd', workbookName, 'f', localPath);

            await checkFileStat(localPath);
          }
          else
          {
            console.error('파일을 Base64로 변황할 수 없습니다');
          }
        }
        catch(error)
        {
          console.error('FileReader 처리 중 오류 발생:', error);
          Alert.alert('파일 처리 오류', '파일을 변환하는 중 오류가 발생했습니다.');
        }
      };

      setUpIsDownloaded(prevState => ({
        ...prevState,
        [workbookName]: true,  // 특정 책에 대해 다운로드 완료 상태 업데이트
      }));
    }
    catch(error)
    {
      console.error('다운로드 실패:', error);
      Alert.alert('다운로드 실패', '서버에서 오류가 발생했습니다.');
    }
  };
  const checkFileStat = async (filePath: string) => {
    try {
      const fileStat = await RNFS.stat(filePath);
      console.log('파일 정보:', fileStat);
    } catch (error) {
      console.error('파일이 존재하지 않습니다:', error);
    }
  };
//bottom modal 컨트롤 함수
  const handleOpenBottomSheet = () => {
    setBottomSheetVisible(true);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);

    //bottomsheet닫을때 책버튼도 닫힘으로 변경하기 함수
    if(openUpIndex !== null)
    {
      setOpenUpIndex(null);
    }
    if(openMdIndex !== null)
    {
      setOpenMdIndex(null);
    }
  };
//문제집 리스트 호출(예정)
  useEffect(() => {
    console.log('useEffect동작중');
    if(openUpIndex === null && openMdIndex === null)
    {
      console.log('버튼 클릭 없음', openUpIndex, 'a', openMdIndex);
    }
    else
    {
      console.log(openUpIndex, 'a', openMdIndex);
    }
  });

  return (
    <>
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent1}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.tfContainer}>
        <Mt title = "다운로드 필요" titleStyle={styles.normal} />
      </View>
      <View style={styles.manyBtnContainer}>
        {books && books.length > 0 ? (
          books.map((book) => (
            !upIsDownloaded[book.workbookName] && (
              <View key={book.workbookId} style={styles.bTContainer}>
                <BookButton
                  isOpen={openUpIndex === book.workbookId}
                  onPress={ () => handleBBUToggle(book.workbookName, book.storageLink) }
                  screenWidth={width}
                />
                <Mt title={book.workbookName} titleStyle={styles.small} />
              </View>
            )
          ))
        ) : (
          <Mt title = "책이 없습니다" titleStyle={styles.normal}/>
        )}
      </View>
      <View style={styles.tfContainer}>
        <Mt title="이용가능한 도서" titleStyle={styles.normal} />
      </View>
      <View style={styles.manyBtnContainer}>
        {[0, 1].map((_, index) => (
          <View key={`ing${index}`} style={styles.bTContainer}>
            <BookButton
              isOpen={openMdIndex === index}
              onPress={() => handleBBMToggle(index)}
              screenWidth={width}
            />
            <Mt title={String(index)} titleStyle={styles.small} />
          </View>
        ))}
      </View>
    </ScrollView>
    { isBottomSheetVisible && width < 600 && <Bs sK = {sK} isVisible={isBottomSheetVisible} onClose={handleCloseBottomSheet} /> }
    </>
  );
};

export default BookScroll;
