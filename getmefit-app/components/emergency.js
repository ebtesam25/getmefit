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

export default class Emergency extends React.Component  {
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
      <Text style={styles.txt2}>Emergency</Text>
        <Image source={require('../assets/menu.png')} style={styles.menu}></Image><Text style={styles.menutxt} onPress={() => this.props.navigation.navigate('Menu')}>MENU</Text>
      <Image source={require('../assets/emergencylogo.png')} style={styles.avatar}></Image>

      <Image source={require('../assets/fall.png')} style={styles.body}></Image>
     


      <Image source={require('../assets/drawer.png')} style={styles.drawer}></Image>
      <Image source={require('../assets/imokaybtn.png')} style={styles.btn}></Image>
      <Text style={styles.text}>I'M OKAY</Text>
      <Text style={styles.overlay} onPress={this._showAlert}>OKAY</Text>


    </View>
    );
    }
    else {
    return <AppLoading />;
    }
  }

  _showAlert = () => {
    Alert.alert(
      'Stop Alarm',
      'Are you sure?',
      [
        {text: 'No', onPress: () => alert('Sending Help')},
        {text: 'Yes', onPress: () => alert('Alarm Stopped'), style: 'cancel'},
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
    fontSize:45,
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
  btn:{
      position:'absolute',
      zIndex:6,
      bottom:'10%',
      height:'20%',
      width:'20%',
      resizeMode:'contain',
      alignSelf:'center',
  },
  text:{
    fontFamily:'Avenir',
    color:'#7d83ff',
    fontSize:25,
    position:'absolute',
    zIndex:6,
    bottom:'10%',
    alignSelf:'center',
},
overlay:{
    fontFamily:'Avenir',
    color:'transparent',
    fontSize:65,
    position:'absolute',
    zIndex:7,
    bottom:'15%',
    alignSelf:'center',
}

  
});
