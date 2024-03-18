import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {
  ICurrentCoordinates,
  IRenderMarkerImageHashMap,
  IVehiclePosition,
} from './MapScreen.structure';

export default function MapScreen({route}) {
  const navigation = useNavigation();
  const mapRef = useRef();
  const data = route?.params;
  const [currentCoordinates, setCurrentCoordinates] =
    React.useState<ICurrentCoordinates>({
      latitude: data.initialAddress.latitude,
      longitude: data.initialAddress.longitude,
    });
  const [currentIteractionIndex, setCurrentIteractionIndex] = React.useState(0);
  const [completeRoute, setCompleteRoute] = React.useState([]);
  const [currentCompassPosition, setCurrentCompassPosition] =
    React.useState<string>('');

  const RenderMarkerImageHashmap: IRenderMarkerImageHashMap = {
    N: require('../../assets/vehicle-south.png'),

    NE: require('../../assets/vehicle-se.png'),

    NW: require('../../assets/vehicle-sw.png'),
    S: require('../../assets/vehicle-north.png'),
    SE: require('../../assets/vehicle-ne.png'),
    SW: require('../../assets/vehicle-nw.png'),
    E: require('../../assets/vehicle-east.png'),
    W: require('../../assets/vehicle-west.png'),
  };

  function vehicleCompassPosition({
    latitudeInicial,
    longitudeInicial,
    latitudeFinal,
    longitudeFinal,
  }: IVehiclePosition) {
    const radians = Math.atan2(
      longitudeFinal - longitudeInicial,
      latitudeFinal - latitudeInicial,
    );

    const compassReading = radians * (180 / Math.PI);

    const coordNames = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    let coordIndex = Math.round(compassReading / 45);
    if (coordIndex < 0) {
      coordIndex = coordIndex + 8;
    }
    return setCurrentCompassPosition(coordNames[coordIndex]);
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      const presentCoordinates: ICurrentCoordinates =
        data.gps[currentIteractionIndex];
      if (!presentCoordinates) return;
      setCurrentCoordinates({
        latitude: presentCoordinates.latitude,
        longitude: presentCoordinates.longitude,
      });
      setCurrentIteractionIndex(prev => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [currentCoordinates, currentIteractionIndex, data.gps]);

  React.useEffect(() => {
    const getCompleteRoute = data.gps.map(item => {
      return {
        latitude: item.latitude,
        longitude: item.longitude,
      };
    });
    setCompleteRoute(getCompleteRoute);
  }, [data.gps]);

  React.useEffect(() => {
    vehicleCompassPosition({
      latitudeInicial: currentCoordinates.latitude,
      longitudeInicial: currentCoordinates.longitude,
      latitudeFinal: data.initialAddress.latitude,
      longitudeFinal: data.initialAddress.longitude,
    });
  }, [
    currentCoordinates.latitude,
    currentCoordinates.longitude,
    data.initialAddress.latitude,
    data.initialAddress.longitude,
  ]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="z-10 h-8 w-8 bg-white absolute top-3 left-3 justify-center items-center rounded-full">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/left-arrow.png')} />
        </TouchableOpacity>
      </View>
      <MapView
        ref={mapRef}
        onRegionChange={() => {
          mapRef.current?.animateToRegion({
            latitude: currentCoordinates.latitude,
            longitude: currentCoordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        rotateEnabled={false}
        className="flex-1 w-full h-full z-0"
        initialRegion={{
          latitude: data.initialAddress.latitude,
          longitude: data.initialAddress.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Polyline
          coordinates={completeRoute}
          strokeColor="#000"
          strokeWidth={6}
        />
        <Marker
          image={RenderMarkerImageHashmap[currentCompassPosition]}
          className="w-12 h-12"
          coordinate={currentCoordinates}
        />
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
