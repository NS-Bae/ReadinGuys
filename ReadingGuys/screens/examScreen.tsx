import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types.tsx';

import Styles from '../mainStyle.tsx';
import Mt from '../Components/text.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type ExamScreenNavigationProps = NativeStackNavigationProp<StackParamList, 'Exam'>;

interface ExamScreenProps
{
  navigation: ExamScreenNavigationProps;
}

function ExamScreen({ navigation } : ExamScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = Styles(width);
  return (
    <GestureHandlerRootView>
      <View style={styles.basic}>
        {width > 600 ? ( //분할화면
          <View style={styles.splitScreen}>
            <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
              <View style={styles.titlecontainer}>
                <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
              </View>
            </ScrollView>
            <ScrollView style = {styles.scrollContainer} contentContainerStyle = {styles.scrollContent} keyboardShouldPersistTaps="handled">
              <View style={styles.titlecontainer}>
                <Mt title = "독(讀)한 녀석들" titleStyle = {styles.title}/>
              </View>
            </ScrollView>
          </View>
        ) : ( //전체화면
          <View style={styles.basic}>
            <Mt title = "독한 녀석들" titleStyle = {styles.title}/>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

export default ExamScreen;
