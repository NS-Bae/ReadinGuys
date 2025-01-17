import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import Styles from '../mainStyle.tsx';

const BookInfo: React.FC = () => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  return (
    <View style={styles.rightPanel}>
      <Text>문제집 정보</Text>
    </View>
  );
};

export default BookInfo;
