/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import RNViewPager from './react-native-viewpager';

const { ViewPager } = RNViewPager;

export default class ReactNativeViewpager extends Component {
  render() {
    return (
      <ViewPager style={styles.container}>
        <View key="index0">
            <Text>First Page</Text>
        </View>
        <View key="index1">
            <Text>Second Page</Text>
        </View>
        <View key="index2">
            <Text>Third Page</Text>
        </View>
      </ViewPager>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('ReactNativeViewpager', () => ReactNativeViewpager);
