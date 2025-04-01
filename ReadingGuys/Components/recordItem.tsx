import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Styles from '../mainStyle.tsx';

interface RecordItemProps {
  examDate: string;
  progressRate: string;
  recordLink: string;
}

const RecordItem: React.FC<RecordItemProps> = ({ examDate, progressRate, recordLink }) => {
  const { width } = useWindowDimensions(); // 화면 크기를 동적으로 가져옴
  const styles = Styles(width);

  return (
    <View >
      <Text>시험 날짜: {examDate}</Text>
      <Text>진행률: {progressRate}%</Text>
      <Text>기록 링크: {recordLink}</Text>
    </View>
  );
};

export default RecordItem;
