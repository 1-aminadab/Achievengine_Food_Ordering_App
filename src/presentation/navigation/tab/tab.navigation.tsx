import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from 'react-native';
import { HomeNavigator } from '../stack/home/home.navigation';
import { Theme } from '../../theme/theme';

// Text placeholders for screens
const FoodScreen = () => <Text>Food Screen</Text>;
const GroceryScreen = () => <Text>Grocery Screen</Text>;
const AllServicesScreen = () => <Text>All Services Screen</Text>;
const RewardsScreen = () => <Text>Rewards Screen</Text>;
const ProfileScreen = () => <Text>Profile Screen</Text>;

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const scale = useSharedValue(focused ? 1.2 : 1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon name={name} size={20} color={focused ? Theme.colors.Primary : Theme.colors.gray+'bb'} />
    </Animated.View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = '';

          switch (route.name) {
            case 'Food':
              iconName = 'food';
              break;
            case 'Grocery':
              iconName = 'cart';
              break;
            case 'All Services':
              iconName = 'grid';
              break;
            case 'Rewards':
              iconName = 'diamond';
              break;
            case 'Profile':
              iconName = 'account';
              break;
          }

          return <AnimatedIcon name={iconName} focused={focused} />;
        },
        tabBarLabel: ({ focused }) => {
          return (
            <Text style={{ fontSize: 10, fontWeight:"bold", color: focused ? Theme.colors.Primary : Theme.colors.gray+'bb'}}>
              {route.name}
            </Text>
          );
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: 'white',
          shadowOpacity: 0,  // Remove shadow
          elevation: 0, 
          borderTopWidth:0
        },
        headerShown: false,  // Hide header
      })}
    >
      <Tab.Screen name="Food" component={HomeNavigator} />
      <Tab.Screen name="Grocery" component={GroceryScreen} />
      <Tab.Screen name="All Services" component={AllServicesScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
