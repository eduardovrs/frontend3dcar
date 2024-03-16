import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';
import React, {useRef} from 'react';
import {View, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import Config from 'react-native-config';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function MapScreen({route}) {
  const navigation = useNavigation();
  const mapRef = useRef();
  const data = route?.params;
  const {width, height} = Dimensions.get('window');

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="z-10 h-8 w-8 bg-white absolute top-3 left-3 justify-center items-center rounded-full">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/left-arrow.png')} />
        </TouchableOpacity>
      </View>
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        showsMyLocationButton={true}
        className="flex-1 w-full h-full z-0"
        initialRegion={{
          latitude: data.initialAddress.latitude,
          longitude: data.initialAddress.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <MapViewDirections
          origin={{
            latitude: data.initialAddress.latitude,
            longitude: data.initialAddress.longitude,
          }}
          destination={{
            latitude: data.finalAddress.latitude,
            longitude: data.finalAddress.longitude,
          }}
          apikey={Config.GMAPI_KEY}
          strokeWidth={4}
          mode="DRIVING"
          optimizeWaypoints
          onReady={result => {
            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: width / 20,
                bottom: height / 20,
                left: width / 20,
                top: height / 20,
              },
            });
          }}
        />
        <Marker
          coordinate={{
            latitude: data.initialAddress.latitude,
            longitude: data.initialAddress.longitude,
          }}>
          <Image source={require('../../assets/vehicle.png')} />
        </Marker>
        <Marker
          coordinate={{
            latitude: data.finalAddress.latitude,
            longitude: data.finalAddress.longitude,
          }}
        />
      </MapView>
    </View>
  );
}
