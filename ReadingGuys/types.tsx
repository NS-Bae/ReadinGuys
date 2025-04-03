interface Records {
  ExamDate: string;
  ProgressRate: string;
  RecordLink: string;
  WorkbookName: string;
  examDate: string;
}
export type StackParamList = {
  Main: any;
  Login: undefined;
  Home: undefined;
  Record: { examData: Records[] };
  Exam: any;
};
