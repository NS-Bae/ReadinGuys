import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

interface CustomBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  sK: string | null;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({ isVisible, onClose, sK }) => {
  return (
    <BottomSheet
      index={isVisible ? 0 : -1}
      onClose={onClose}
      snapPoints={['20%', '50%', '90%']}
    >
      <View style={styles.container}>
        <Text>여기에 내용을 추가하세요!</Text>
        <Text>선택된 키: {sK}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>닫기</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
});

export default CustomBottomSheet;
