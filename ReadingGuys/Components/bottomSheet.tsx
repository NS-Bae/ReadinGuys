import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Styles from '../mainStyle';

interface Book {
  Difficulty: string;
  storageLink: string;
  workbookId: string;
  workbookName: string;
}
interface CustomBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  sK: Book | null;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({ isVisible, onClose, sK }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  if(!sK)
  {
    return null;
  }
  return (
    <BottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['20%', '50%', '90%']}
    >
      <TouchableOpacity style={exclusiveStyles.closeButton} onPress={onClose}>
        <Text>닫기</Text>
      </TouchableOpacity>
      <View style={exclusiveStyles.container}>
        <Text style={exclusiveStyles.text}>책 이름 : {sK.workbookName}</Text>
        <Text style={exclusiveStyles.text}>책 난이도 : {sK.Difficulty}</Text>
        <Text style={exclusiveStyles.text}>최고 점수 : </Text>
        <Text style={exclusiveStyles.text}>응시 횟수 : </Text>
      </View>
      <View style={styles.manyBtnContainer}>
        <TouchableOpacity style={exclusiveStyles.exanButton} >
          <Text style={exclusiveStyles.examButtonText}>시험 보러 가기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={exclusiveStyles.exanButton} >
          <Text style={exclusiveStyles.examButtonText}>지난 시험 보기</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const exclusiveStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 22,
    color: 'black',
  },
  closeButton: {
    alignItems: 'flex-end',
    marginEnd: 20,
  },
  exanButton: {
    alignItems: 'center',
    fontSize: 20,
  },
  examButtonText: {
    fontSize: 20,
    color: 'black',
  },
});

export default CustomBottomSheet;
