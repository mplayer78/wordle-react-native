import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import Index from './index';
import Success from './success';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    // <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="index" 
          component={Index}
        />
        <Stack.Screen 
          name="success" 
          component={Success}
          />
      </Stack.Navigator>
      // </NavigationContainer>
  );
}

