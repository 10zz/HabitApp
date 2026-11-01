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
                        source={{ uri: 'https://media1.tenor.com/m/ASC_CBFskeEAAAAd/%D0%B3%D0%BE%D0%B9%D0%B4%D0%B0-%D0%BE%D1%85%D0%BB%D0%BE%D0%B1%D1%8B%D1%81%D1%82%D0%B8%D0%BD.gif' }}
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
                        source={{ uri: 'https://media1.tenor.com/m/ASC_CBFskeEAAAAd/%D0%B3%D0%BE%D0%B9%D0%B4%D0%B0-%D0%BE%D1%85%D0%BB%D0%BE%D0%B1%D1%8B%D1%81%D1%82%D0%B8%D0%BD.gif' }}
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

