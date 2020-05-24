import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight,Dimensions } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LineChart} from 'react-native-chart-kit';

let customFonts  = {
  'Avenir': require('../assets/fonts/Avenir.ttf'),
  'Futura': require('../assets/fonts/Futura.ttf'),
};

export default class Stepsweek extends React.Component  {
 
  state = {
    fontsLoaded: false,
    data: ''
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };


  componentDidMount() {
    this._loadFontsAsync();
    fetch('https://us-central1-aiot-fit-xlab.cloudfunctions.net/ufitgetsteps', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
         this.setState({
            data: responseJson
         });
      })
      .catch((error) => {
         console.error(error);
      });
    
  }

  render(){
    if (this.state.fontsLoaded) {
    return (
    <View style={styles.container}>
      <Image source={require('../assets/header.png')} style={styles.header}></Image>
      <Text style={styles.txt}>John Doe</Text>
      <Text style={styles.txt2}>Steps</Text>
        <Image source={require('../assets/menu.png')} style={styles.menu}></Image><Text style={styles.menutxt} onPress={() => this.props.navigation.navigate('Menu')}>MENU</Text>
      <Image source={require('../assets/steplogo.png')} style={styles.avatar}></Image>

      <Image source={require('../assets/step.png')} style={styles.body}></Image>
      <Text style={styles.pr} onPress={() => this.props.navigation.navigate('Stepstotal')}>{parseInt(this.state.data.weeklysteps)}</Text>
      <Text style={styles.state}>WEEKLY</Text>


      <LineChart
            data={{
                labels: ['January', 'February', 'March', 'April'],
                datasets: [
                {
                    data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    ],
                },
                ],
            }}
            width={Dimensions.get('window').width} 
            height={300}
            chartConfig={{
                backgroundColor: '#e6ebff',
                backgroundGradientFrom: "#e6ebff",
                backgroundGradientTo: "#e6ebff",
                decimalPlaces: 2,
                color: (opacity = 255) => `rgba(125, 131, 255, ${opacity})`,
                style: {
                borderRadius: 16,
                },
            }}
            bezier
            style={{
                position:'absolute',
                zIndex:4,
                bottom:-10,
            }}
            />


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
      fontSize:60,
      position:'absolute',
      zIndex:6,
      top:'42%',
      alignSelf:'center',
      color:'#3f3d56',
  },
  deg:{
    fontFamily:'Avenir',
    fontSize:40,
    position:'absolute',
    zIndex:3,
    top:'45%',
    right:'32.5%',
    color:'#3f3d56',
  },
  state:{
    fontFamily:'Futura',
    fontSize:20,
    position:'absolute',
    zIndex:3,
    top:'53%',
    alignSelf:'center',
    color:'#e6ebff',
  },

  
});
