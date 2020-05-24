import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { TouchableOpacity } from 'react-native-gesture-handler';

let customFonts  = {
  'Avenir': require('../assets/fonts/Avenir.ttf'),
  'Futura': require('../assets/fonts/Futura.ttf'),
};

export default class Home extends React.Component  {
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
      <Text style={styles.txt}>Hello,</Text>
      <Text style={styles.txt2}>John Doe</Text>
     <Image source={require('../assets/menu.png')} style={styles.menu}></Image><Text style={styles.menutxt} onPress={() => this.props.navigation.navigate('Menu')}>MENU</Text>
      <Image source={require('../assets/avatar.png')} style={styles.avatar}></Image>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Hometwo')}><Image source={require('../assets/body.png')} style={styles.body} ></Image></TouchableOpacity>
      <Image source={require('../assets/pointer.png')} style={styles.temp}></Image>
      <Image source={require('../assets/pointerw.png')} style={styles.atemp}></Image>
      <Image source={require('../assets/pointer.png')} style={styles.pulse}></Image>
      <Image source={require('../assets/pointer.png')} style={styles.oxy}></Image>
      
      <Image source={require('../assets/btempline.png')} style={styles.line1}></Image>
      <Text style={styles.bdy}>BODY</Text>
      <Text style={styles.tmpr}>TEMPERATURE</Text>
      <Text style={styles.btnum} onPress={() => this.props.navigation.navigate('Temperature')}>70°</Text>

    
      <Image source={require('../assets/line2.png')} style={styles.line2}></Image>
      <Text style={styles.amb}>AMBIENT</Text>
      <Text style={styles.atmpr}>TEMPERATURE</Text>
      <Text style={styles.atnum}>63°</Text>


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
    width:'100%',
    position:'absolute',
    backgroundColor: '#d4dcff',
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
    height:'90%',
    width:'82%',
    alignSelf:'center',
    resizeMode:'contain',
    top:'20%',
    zIndex:2,
  },
  temp:{
    position:'absolute',
    height:'2%',
    width:'2%',
    alignSelf:'center',
    resizeMode:'contain',
    top:'45%',
    zIndex:2,
  },
  atemp:{
    position:'absolute',
    height:'2%',
    width:'2%',
    alignSelf:'center',
    resizeMode:'contain',
    top:'50%',
    left:'40%',
    zIndex:2,
  },
  pulse:{
    position:'absolute',
    height:'2%',
    width:'2%',
    alignSelf:'center',
    resizeMode:'contain',
    top:'55%',
    left:'51%',
    zIndex:2,
  },
  oxy:{
    position:'absolute',
    height:'2%',
    width:'2%',
    alignSelf:'center',
    resizeMode:'contain',
    top:'57%',
    left:'49%',
    zIndex:2,
  },
  line1:{
    position:'absolute',
    height:'25%',
    width:'25%',
    alignSelf:'center',
    resizeMode:'contain',
    zIndex:4,
    top:'31.5%',
    left:'50%',
  },
  bdy:{
      fontFamily:'Futura',
      zIndex:4,
      position:'absolute',
      top:'41%',
      right:'15%',
  },
  tmpr:{
    fontFamily:'Futura',
    zIndex:4,
    position:'absolute',
    top:'43%',
    right:'15%',
  },
  btnum:{
    fontFamily:'Avenir',
    fontSize:40,
    zIndex:4,
    position:'absolute',
    top:'36%',
    right:'12%',
  },
  line2:{
    position:'absolute',
    height:'25%',
    width:'25%',
    alignSelf:'center',
    resizeMode:'contain',
    zIndex:4,
    top:'32%',
    left:'16%',
  },
  amb:{
      fontFamily:'Futura',
      zIndex:4,
      position:'absolute',
      top:'37.3%',
      left:'2%',
  },
  atmpr:{
    fontFamily:'Futura',
    zIndex:4,
    position:'absolute',
    top:'39%',
    left:'2%',
  },
  atnum:{
    fontFamily:'Avenir',
    fontSize:40,
    zIndex:4,
    position:'absolute',
    top:'32%',
    left:'2%',
  },
});
