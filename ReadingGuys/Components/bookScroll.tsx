import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, View, useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';

import BookButton from './changedButton';
import Mt from './text.tsx';
import Styles from '../mainStyle.tsx';
import Bs from '../Components/bottomSheet.tsx';
import api from '../api.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  workbookId: string;
  workbookName: string;
  Difficulty: string;
  storageLink: string;
}

interface BookScrollProps {
  books: Book[];
  onSelectCheckBookButton: (bookId: string) => void;
}

const BookScroll: React.FC<BookScrollProps> = ({ books, onSelectCheckBookButton }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  const [openUpIndex, setOpenUpIndex] = useState<string | null>(null);
  const [openMdIndex, setOpenMdIndex] = useState<string | null>(null);
  const [upIsDownloaded, setUpIsDownloaded] = useState<{ [key: string]: boolean }>({});
  const [sK, setSK] = useState<Book | null>(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [existBookList, setExistBookList] = useState<string[][]>([]);//저장된 책들

  //문제집 다운로드 버튼(downFile함수호출)
  const handleBBUToggle = (workbookId: string, workbookName: string, storageLink: string) => {
    if (workbookName && storageLink)
    {
      downFile(workbookId, storageLink, workbookName);
    }
    else
    {
      Alert.alert('문제집 정보가 올바르지 않아 다운로드에 실패했습니다.');
    }
  };
  //다운로드 된 문제집의 상세정보 확인
  const handleBBMToggle = async (bookId: string) => {
    const savedBooks = await AsyncStorage.getItem('downloadedBooks');
    if(savedBooks)
    {
      const parsedBooks = JSON.parse(savedBooks);
      const nowBookInfo = parsedBooks.find((book: Book) => book.workbookId.toString() === bookId);
      console.log(nowBookInfo);
      if (nowBookInfo)
      {
        setSK(nowBookInfo);
        setOpenMdIndex(openMdIndex === bookId ? null : bookId);
        onSelectCheckBookButton(nowBookInfo);
        handleOpenBottomSheet();
      }
      else
      {
        console.log('책 정보를 찾을 수 없습니다.');
      }
    }
    if (openUpIndex !== null)
    {
      setOpenUpIndex(null);
    }
    if (openMdIndex === bookId)
    {
      handleCloseBottomSheet();
    }
  };
  //새로 업로드된 문제집 다운로드
  const downFile = async (workbookId: string, storageLink: string, workbookName: string) => {
    try {
      const response = await api.post('/workbook/download', { storageLink }, { responseType: 'blob' });
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = async () => {
        if (typeof reader.result === 'string')
        {
          const convertData = reader.result.split(',')[1];
          const localPath = `${RNFS.DocumentDirectoryPath}/${workbookId}_${workbookName}.zip`;
          await RNFS.writeFile(localPath, convertData, 'base64');
          setUpIsDownloaded((prevState) => ({ ...prevState, [workbookName]: true }));
          Alert.alert('다운로드 완료');
          //다운이후 저장된 파일상태 갱신
          await checkFileStat();

          //다운이후 다운된 책정보 AsyncStorage저장
          const bookToDownload = books.find(book => book.workbookId === workbookId);
          if (!bookToDownload)
          {
            Alert.alert('책을 찾을 수 없습니다', '해당 책이 목록에 없습니다.');
            return;
          }
          bookToDownload.storageLink = localPath;

          // 새로 다운로드한 책 정보 추가
          const savedBooks = await AsyncStorage.getItem('downloadedBooks');
          const booksInStorage = savedBooks ? JSON.parse(savedBooks) : [];

          const isDuplicate = booksInStorage.some(
            (book: Book) => book.workbookId === bookToDownload.workbookId && book.workbookName === bookToDownload.workbookName
          );

          if (isDuplicate) {
            console.log('이미 다운로드된 책입니다.');
            return;
          }
          const updatedBooks = [...booksInStorage, bookToDownload];
          await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
        }
        else
        {
          Alert.alert('파일 처리 오류', '파일을 변환하는 중 오류가 발생했습니다.');
        }
      };
    }
    catch (error)
    {
      Alert.alert('다운로드 실패', '서버에서 오류가 발생했습니다.');
    }
  };
  //다운로드된 문제집목록 확인
  const checkFileStat = async () => {
    try
    {
      const path = RNFS.DocumentDirectoryPath;
      const files = await RNFS.readDir(path);

      const afterProcessedZipFiles = files
        .filter((file) => file.isFile() && file.name.endsWith('.zip'))
        .map((file) => file.name.replace('.zip', '').split('_'));

      setExistBookList(afterProcessedZipFiles);
    }
    catch (error)
    {
      console.error('파일이 존재하지 않습니다:', error);
    }
  };
  //일반 스마트폰의 문제집 상세정보 확인
  const handleOpenBottomSheet = () => {
    setBottomSheetVisible(true);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
    if (openUpIndex !== null)
    {
      setOpenUpIndex(null);
    }
    if (openMdIndex !== null)
    {
      setOpenMdIndex(null);
    }
  };

  const filteredDownBooks = useMemo(() => {
    if (!books || books.length === 0)
    {
      return [];
    }
    return books.filter((book) => !existBookList.some((existBook) => existBook[0] === book.workbookId.toString()));
  }, [books, existBookList]);

  useEffect(() => {
    checkFileStat();
  }, []);
  useEffect(() => {
    console.log('책 목록 갱신됨:', existBookList);
  }, [existBookList]);

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent1}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tfContainer}>
          <Mt title="다운로드 필요" titleStyle={styles.normal} />
        </View>
        <View style={styles.manyBtnContainer}>
          {filteredDownBooks && filteredDownBooks.length > 0 ? (
            filteredDownBooks.map((book) => (
              !upIsDownloaded[book.workbookName] && (
                <View key={book.workbookId} style={styles.bTContainer}>
                  <BookButton
                    isOpen={openUpIndex === book.workbookId}
                    onPress={() => handleBBUToggle(book.workbookId, book.workbookName, book.storageLink)}
                    screenWidth={width}
                  />
                  <Mt title={book.workbookName} titleStyle={styles.small} />
                </View>
              )
            ))
          ) : (
            <Mt title="책이 없습니다" titleStyle={styles.normal} />
          )}
        </View>
        <View style={styles.tfContainer}>
          <Mt title="이용가능한 도서" titleStyle={styles.normal} />
        </View>
        <View style={styles.manyBtnContainer}>
          {existBookList && existBookList.length > 0 ? (
            existBookList.map((book) => (
              <View key={book[0]} style={styles.bTContainer}>
                <BookButton
                  isOpen={openUpIndex === book[0]}
                  onPress={() => handleBBMToggle(book[0])}
                  screenWidth={width}
                />
                <Mt title={book[1]} titleStyle={styles.small} />
              </View>
            ))
          ) : (
            <Mt title="책이 없습니다" titleStyle={styles.normal} />
          )}
        </View>
      </ScrollView>
      {isBottomSheetVisible && width < 600 && <Bs sK={sK} isVisible={isBottomSheetVisible} onClose={handleCloseBottomSheet} />}
    </>
  );
};

export default BookScroll;
