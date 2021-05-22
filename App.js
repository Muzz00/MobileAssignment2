import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
// import MapView from 'react-native-maps'
import MapView, { Marker, Callout } from 'react-native-maps'
import * as Location from 'expo-location';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: -32.88083800623871,
      longitude: 172.70746492207425,
    }
  }

  componentDidMount() {
    // this._getLocation();
    console.log("hello")
    this.updateLocation();
    this.forceUpdate();
  }




  updateLocation = () => {
    this.setState({
      latitude: -36.88083800623871,
      longitude: 174.70746492207425
    })
  }

  getLocation = async () =>{

    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    console.log(location.coords.longitude)
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude })
  }
  
  render() {
    console.log('sfad');
    let latitude = 33.7872131;
    let longitude = -84.381931;

    if (this.state.latitude != 0) {
      console.log(this.state.latitude)
      latitude = this.state.latitude;
      longitude = this.state.longitude;
    }

    

    return (
      <>
      <MapView
        style={{ ...StyleSheet.absoluteFillObject }}
        initialRegion={{
          // latitude: 33.7872131,
          // longitude: -84.381931,
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: .005,
          longitudeDelta: .005
        }} region={{latitude: latitude,
          longitude: longitude,
          latitudeDelta: .005,
          longitudeDelta: .005}} >
        
        <Marker
          // coordinate={{ latitude: 33.7872131, longitude: -84.381931 }}
          coordinate={{ latitude: latitude, longitude: longitude }}
          title='Flatiron School Atlanta'
          description='This is where the magic happens!'
        ></Marker>

      </MapView>
      <View style={styles.container}>
      <Text style={styles.txt}>{latitude} -- {longitude}</Text>
      <View style={styles.getLocButton}>
      <Button onPress={this.getLocation} title="Get My Location" />
      </View>
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 750,
    backgroundColor: "white",
    padding:10,
  },
  txt:{
    backgroundColor: "#dedede",
  },
  getLocButton: {
    // position: absolute,
    backgroundColor: "black",
    width: "40%",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
  }
})