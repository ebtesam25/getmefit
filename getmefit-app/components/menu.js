import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

let customFonts  = {
  'Avenir': require('../assets/fonts/Avenir.ttf'),
};

export default class Menu extends React.Component  {
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
        <Image source={require('../assets/home.png')} style={styles.home}></Image><Text style={styles.hometxt} onPress={() => this.props.navigation.navigate('Home')}>HOME</Text>
      <Text style={styles.menutxt}>MENU</Text>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Pulse')}>Pulse</Text>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Temperature')}>Temperature</Text>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Oxygen')}>Oxygen</Text>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Steps')}>Steps</Text>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Gsr')}>GSR</Text>
      <Text style={styles.welcome} onPress={() => this.props.navigation.navigate('Purifier')}>Purifier</Text>
      <Text style={styles.emergency} onPress={() => this.props.navigation.navigate('Emergency')}>Emergency</Text>
      <Image source={require('../assets/back.png')} style={styles.back}></Image><Text style={styles.backtxt} onPress={() => this.props.navigation.navigate('Hometwo')}>BACK</Text>
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
    backgroundColor: '#7d83ff',
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
    fontSize:35,
    alignSelf:'center',
    top:'15%',
    color:'#3f3d56',
  },
  menutxt:{
    fontFamily:'Avenir',
    fontSize:30,
    alignSelf:'center',
    top:'10%',
    color:'#f2f2f2',
  },
  emergency:{
    fontFamily:'Avenir',
    fontSize:40,
    alignSelf:'center',
    top:'20%',
    color:'#16f7cb',
  },
  home:{
      width:'10%',
      height:'10%',
      resizeMode:'contain',
      alignSelf:'center',
      top:'5%',
  },
  back:{
    width:'20%',
    height:'20%',
    resizeMode:'contain',
    alignSelf:'center',
    top:'25%',
},
hometxt:{
    fontSize:40,
    alignSelf:'center',
    top:'7%',
    position:'absolute',
    zIndex:2,
    color:'transparent',
},
backtxt:{
    fontSize:60,
    alignSelf:'center',
    top:'78%',
    position:'absolute',
    zIndex:2,
    color:'transparent',
}
});
