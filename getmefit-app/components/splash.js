import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

let customFonts  = {
  'Avenir': require('../assets/fonts/Avenir.ttf'),
};

export default class Splash extends React.Component  {
  state = {
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render(){
    if (this.state.fontsLoaded) {
    return (
    <View style={styles.container}>
      <Image source={require('../assets/splash.png')} style={styles.header}></Image>
      <Image source={require('../assets/applogo.png')} style={styles.logo}></Image>
      <Image source={require('../assets/splashb.png')} style={styles.bg}></Image>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Home')}>Welcome!</Text>
    </View>
    );
    }
    else {
    return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    position:'relative',
    backgroundColor: '#d4dcff',
  },
  header:{
    height:'50%',
    width:'100%',
  },
  logo:{
    height:'50%',
    width:'50%',
    resizeMode:'contain',
    zIndex:3,
    position:'absolute',
    alignSelf:'center',
    top:'-10%',
  },
  bg:{
    height:'35%',
    width:'65%',
    alignSelf:'center',
    position:'absolute',
    top:'35%',
    resizeMode:'contain',
  },
  welcome:{
    fontFamily:'Avenir',
    fontSize:50,
    alignSelf:'center',
    top:'20%',
    color:'#3f3d56',
  }
});
