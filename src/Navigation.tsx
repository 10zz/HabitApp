import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator, createBottomTabScreen } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import CreateScreen from "./screens/CreateScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import { createNativeStackNavigator, createNativeStackScreen } from '@react-navigation/native-stack';

type TabsType = typeof Tabs;
declare module "@react-navigation/core" {
    interface RootNavigator extends TabsType {}
}

const Tabs = createBottomTabNavigator({
    screens: {
        HomeScreen: createBottomTabScreen({
            screen: HomeScreen,
            options: {
                title: "Ваши привычки",
                tabBarLabel: "Привычки",
                tabBarIcon: ({ size }) => (
                    <Image
                        source={require("../drawable/Home.png")}
                        style={{ width: size, height: size }}
                    />
                ),
                //headerShown: false,
            },
        }),
        CreateScreen: createBottomTabScreen({
            screen: CreateScreen,
            options: {
                
                title: "Добавить привычку",
                tabBarLabel: "Добавить...",
                tabBarIcon: ({ size }) => (
                    <Image
                        source={require("../drawable/Add.png")}
                        style={{ width: size, height: size }}
                    />
                ),
                //headerShown: false,
            },
        }),
    },
    screenOptions: {animation: "shift"},
});

const RootStack = createNativeStackNavigator({
    screens: {
        Tabs: createNativeStackScreen({
            screen: Tabs,
            options: {
                headerShown: false
            },
        }),
        DetailsScreen: createNativeStackScreen({
            screen: DetailsScreen,
            options: {
                title: 'Детали',
                presentation: 'card',
            },
        }),
    },
});

export const Navigation = createStaticNavigation(RootStack);

