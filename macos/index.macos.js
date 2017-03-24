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
  View,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';

const {width,height} = Dimensions.get('window');

import ViewPager from './react-native-viewpager';

import Img1 from './images/1.jpg';
import Img2 from './images/2.jpg';
import Img3 from './images/3.jpg';
import Img4 from './images/4.jpg';
import Img5 from './images/5.jpg';

export default class ReactNativeViewpager extends Component {
  render() {
    return (
      <ViewPager style={styles.container}>
        <Image source={Img1} style={styles.img}/>
        <Image source={Img2} style={styles.img}/>
        <Image source={Img3} style={styles.img}/>
        <Image source={Img4} style={styles.img}/>
        <Image source={Img5} style={styles.img}/>
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
  img: {
    width,
    height: height
  }
});

AppRegistry.registerComponent('ReactNativeViewpager', () => ReactNativeViewpager);


/*import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Img1 from './images/1.jpg';
import Img2 from './images/2.jpg';
import Img3 from './images/3.jpg';
import Img4 from './images/4.jpg';
import Img5 from './images/5.jpg';

export default class ReactNativeViewpager extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeViewpager', () => ReactNativeViewpager);*/

