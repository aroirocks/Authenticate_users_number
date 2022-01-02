import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import AppRoutes from './screens/AppRoutes';

const App = () => {
  return <AppRoutes />;
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
