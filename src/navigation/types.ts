export type RootStackParamList = {
  Welcome: undefined;
  AgeSelection: undefined;
  GenderSelection: {
    ageGroup: '0-3' | '3-6';
  };
  StoryList: {
    ageGroup: '0-3' | '3-6';
    gender: 'boy' | 'girl';
  };
  StoryDetail: {
    storyId: string;
    ageGroup: '0-3' | '3-6';
    gender: 'boy' | 'girl';
  };
};
