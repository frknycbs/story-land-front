// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from 'expo-status-bar';
// import { WelcomeScreen } from './src/screens/WelcomeScreen';
// import { AgeSelectionScreen } from './src/screens/AgeSelectionScreen';
// import { GenderSelectionScreen } from './src/screens/GenderSelectionScreen';
// import { StoryListScreen } from './src/screens/StoryListScreen';
// import { StoryDetailScreen } from './src/screens/StoryDetailScreen';
// import { RootStackParamList } from './src/navigation/types';
// import { colors } from './src/themes/colors';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar style="auto" />
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           contentStyle: { backgroundColor: colors.background },
//         }}
//       >
//         <Stack.Screen name="Welcome" component={WelcomeScreen} />
//         <Stack.Screen name="AgeSelection" component={AgeSelectionScreen} />
//         <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
//         <Stack.Screen name="StoryList" component={StoryListScreen} />
//         <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage } from './src/components/HomePage';
import { CategoryPage } from './src/components/CategoryPage';
import { StoryPage } from './src/components/StoryPage';
import { CategoryInfo, Story } from './src/types';

export type RootStackParamList = {
  Home: undefined;
  Category: { categoryInfo: CategoryInfo };
  Story: { story: Story };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Category" component={CategoryPage} />
        <Stack.Screen name="Story" component={StoryPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
