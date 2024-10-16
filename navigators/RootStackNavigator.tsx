import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChoreDetailsScreen from '../screens/ChoreDetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import TopTabNavigator, { TopTabParamList } from './TopTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TopTabNavigator: NavigatorScreenParams<TopTabParamList>;
  ChoreDetails: { id: string };
  Sysslor: NavigatorScreenParams<TopTabParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator initialRouteName="Sysslor">
      {/* <RootStack.Screen name="Home" component={HomeScreen} /> */}
      <RootStack.Screen
        name="TopTabNavigator"
        component={TopTabNavigator}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <RootStack.Screen
        name="ChoreDetails"
        component={ChoreDetailsScreen}
        options={{ animation: 'flip' }}
      />
    </RootStack.Navigator>
  );
}
