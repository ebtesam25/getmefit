import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight,Dimensions,Alert } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LineChart} from 'react-native-chart-kit';

let customFonts  = {
  'Avenir': require('../assets/fonts/Avenir.ttf'),
  'Futura': require('../assets/fonts/Futura.ttf'),
};

export default class Purifier extends React.Component  {
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
      <Image source={require('../assets/header.png')} style={styles.header}></Image>
      <Text style={styles.txt}>John Doe</Text>
      <Text style={styles.txt2}>Purifier</Text>
        <Image source={require('../assets/menu.png')} style={styles.menu}></Image><Text style={styles.menutxt} onPress={() => this.props.navigation.navigate('Menu')}>MENU</Text>
      <Image source={require('../assets/purifylogo.png')} style={styles.avatar}></Image>

      <Image source={require('../assets/purify.png')} style={styles.body}></Image>
      <Text style={styles.pr} onPress={this._showAlert}>>PURIFY</Text>


      <Image source={require('../assets/drawer.png')} style={styles.drawer}></Image>
      <Text style={styles.text}>Use this tool before 
        touching potential dirty 
        surfaces such as doorknobs
        and elevator buttons to
        protect yourself</Text>


    </View>
    );
    }
    else {
    return <AppLoading />;
    }
  }
  _showAlert = () => {
    Alert.alert(
      'Start Purifier',
      'Are you ready?',
      [
        {text: 'No, Abort', onPress: () => alert('Aborted')},
        {text: 'Yes', onPress: () => alert('Purification in progress'), style: 'cancel'},
      ],
      { cancelable: false }
    )
  }
}



const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%',
    position:'absolute',
    backgroundColor: '#e6ebff',
    alignSelf:'center',
  },
  header:{
    position:'absolute',
    height:'27%',
    width:'110%',
    alignSelf:'center',
    resizeMode:'contain',
    top:-5,
    zIndex:1,
  },
  avatar:{
    height:'15%',
    width:'25%',
    position:'absolute',
    top:'15%',
    left:'60%',
    resizeMode:'contain',
    alignSelf:'center',
    zIndex:2,
  },
  menu:{
    position:'absolute',
    zIndex:5,
    height:'10%',
    width:'10%',
    right:'10%',
    top:'2%',
    resizeMode:'contain',
  },
  menutxt:{
    position:'absolute',
    zIndex:6,
    right:'10%',
    top:'5%',
    fontSize:40,
    color:'transparent'
  },
  txt:{
    fontFamily:'Avenir',
    fontSize:50,
    top:'7.5%',
    marginLeft:20,
    color:'#d0cde1',
    zIndex:2,
  },
  txt2:{
    fontFamily:'Avenir',
    fontSize:50,
    top:'6.5%',
    marginLeft:20,
    color:'#3f3d56',
    zIndex:2,
  },
  body:{
    position:'relative',
    height:'60%',
    width:'60%',
    alignSelf:'center',
    resizeMode:'contain',
    top:'5%',
    zIndex:2,
  },
  pr:{
      fontFamily:'Avenir',
      fontSize:80,
      position:'absolute',
      zIndex:3,
      top:'42%',
      alignSelf:'center',
      color:'transparent',
  },
  drawer:{
      position:'absolute',
      height:'40%',
      width:'100%',
      resizeMode:'contain',
      zIndex:5,
      bottom:0,
  },
  text:{
      fontFamily:'Avenir',
      fontSize:30,
      color:'#3f3d56',
      position:'absolute',
      zIndex:6,
      bottom:'5%',
      marginLeft:20,
      marginRight:20,
      

  }

  
});
