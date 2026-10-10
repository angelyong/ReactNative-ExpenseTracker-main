import { View, Alert } from "react-native";
import { useEffect } from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";

import { socket, USER_ID } from "./socket";
import store from "./store";
import ManageExpenseTypesScreen from './screens/ManageExpenseTypesScreen';
import {
  AllExpensesScreen,
  ManageExpenseScreen,
  RecentExpensesScreen,
  MyProfileScreen,
  HelpCenterScreen,
  MyAccountScreen,
  CurrencySettingScreen,
  NotificationScreen,
  SetBudgetScreen,
  HomeScreen,
  TransactionsScreen,
  BudgetScreen,
} from "./screens";

import { Theme } from "./constants/theme";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function SocketListener() {
  useEffect(() => {
    socket.emit("join", USER_ID);

    socket.on("budgetExceeded", (notification) => {
      Alert.alert(notification.title, notification.message);
    });

    return () => {
      socket.off("budgetExceeded");
    };
  }, []);

  return null;
}

function BottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Theme.colors.paper,
          borderTopColor: Theme.colors.ink,
          borderTopWidth: 2,
          height: 72,
          paddingTop: 7,
          paddingBottom: 9,
        },
        tabBarActiveTintColor: Theme.colors.ink,
        tabBarInactiveTintColor: Theme.colors.muted,
        tabBarLabelStyle: { fontWeight: "700", fontSize: 11 },
      }}
      sceneContainerStyle={{ backgroundColor: Theme.colors.paper }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 26 : 20}
              color={color}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={focused ? 26 : 20}
              color={color}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          title: "Budget",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pie-chart" : "pie-chart-outline"}
              size={focused ? 26 : 20}
              color={color}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={focused ? 26 : 20}
              color={color}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function HomeWithBanner() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <BottomTabs />
      </View>
    </View>
  );
}

function EmptyDrawerScreen() {
  return null;
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Theme.colors.paper },
        headerTintColor: Theme.colors.ink,
        headerTitleAlign: "center",
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            color={Theme.colors.ink}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        drawerStyle: {
          backgroundColor: Theme.colors.paper,
        },
        drawerActiveTintColor: Theme.colors.ink,
        drawerInactiveTintColor: Theme.colors.muted,
      })}
    >
      <Drawer.Screen
        name="MainTabs"
        component={HomeWithBanner}
        options={({ route }) => {
            const routeName =
            getFocusedRouteNameFromRoute(route) ?? "Home";

          const titleMap = {
            Home: "Home",
            Transactions: "Transactions",
            Budget: "Budget",
            Profile: "Profile",
          };

          return {
            title: titleMap[routeName] || "Expense Tracker",
            drawerLabel: "Expenses",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          };
        }}
      />

       <Drawer.Screen
        name="DrawerManageExpenseTypes"
        component={EmptyDrawerScreen}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("ManageExpenseTypes");
          },
        })}
        options={{
          drawerLabel: "Manage Expense Types",
          title: "Manage Expense Types",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="DrawerMyAccount"
        component={EmptyDrawerScreen}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("MyAccount");
          },
        })}
        options={{
          drawerLabel: "My Account",
          title: "My Account",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="DrawerCurrencySetting"
        component={EmptyDrawerScreen}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("CurrencySetting");
          },
        })}
        options={{
          drawerLabel: "Currency Setting",
          title: "Currency Setting",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="DrawerSetBudget"
        component={EmptyDrawerScreen}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("SetBudget");
          },
        })}
        options={{
          drawerLabel: "Set Budget",
          title: "Set Budget",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="DrawerNotifications"
        component={EmptyDrawerScreen}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("Notifications");
          },
        })}
        options={{
          drawerLabel: "Notifications",
          title: "Notifications",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="DrawerHelpCenter"
        component={EmptyDrawerScreen}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();
            navigation.closeDrawer();
            navigation.navigate("HelpCenter");
          },
        })}
        options={{
          drawerLabel: "Help Center",
          title: "Help Center",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <SocketListener />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: Theme.colors.paper },
              headerTintColor: Theme.colors.ink,
              headerTitleAlign: "center",
              headerShadowVisible: false,
              contentStyle: { backgroundColor: Theme.colors.paper },
            }}
          >
            <Stack.Screen
              name="DrawerRoot"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ManageExpenseScreen"
              component={ManageExpenseScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
                title: "Manage Expense",
              }}
            />

            <Stack.Screen
              name="AllExpenses"
              component={AllExpensesScreen}
              options={{ title: "Monthly Transactions" }}
            />

            <Stack.Screen
              name="MyAccount"
              component={MyAccountScreen}
              options={{ title: "My Account" }}
            />

            <Stack.Screen
              name="CurrencySetting"
              component={CurrencySettingScreen}
              options={{ title: "Currency Setting" }}
            />

            <Stack.Screen
              name="SetBudget"
              component={SetBudgetScreen}
              options={{ title: "Set Budget" }}
            />

            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
              options={{ title: "Notifications" }}
            />

            <Stack.Screen
              name="HelpCenter"
              component={HelpCenterScreen}
              options={{ title: "Help Center" }}
            />
            <Stack.Screen
            name="ManageExpenseTypes"
            component={ManageExpenseTypesScreen}
          />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
