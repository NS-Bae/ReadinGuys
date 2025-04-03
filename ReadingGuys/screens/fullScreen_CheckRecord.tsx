import React from 'react';
import { SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { StackParamList } from '../types.tsx';

import Styles from '../mainStyle.tsx';
import Mt from '../Components/text.tsx';

type CheckRecordScreenNavigationProps = NativeStackNavigationProp<StackParamList, 'Record'>;

interface CheckRecordScreenProps
{
  navigation: CheckRecordScreenNavigationProps;
}
interface Records {
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}

function CheckRecordScreen({ navigation } : CheckRecordScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  const route = useRoute();
  const { RecordList } = route.params as{ RecordList: Records[] };

  console.log('RECORD', RecordList);

  return (
    <SafeAreaView style = {styles.basic}>
      <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titlecontainer}>
          <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CheckRecordScreen;
