import React from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import '../../utils/i18n/index';

import {useTranslation} from 'react-i18next';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {gps_data} from '../../utils/gps_data';
import {useNavigation} from '@react-navigation/native';
import {shortenAddress} from '../../utils/string';

function Home(): React.JSX.Element {
  const {t, i18n} = useTranslation('translation');
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const courses = gps_data.courses;
  const [courseInfo, setCourseInfo] = React.useState();
  const [selectedCourse, setSelectedCourse] = React.useState();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCourses = React.useCallback(() => {
    const separateCourseInfo = courses.map(course => {
      const lastIndex = course.gps.length - 1;
      return {
        initialAddress: {
          street: shortenAddress(course.gps[0].address),
          coords: {
            latitude: course.gps[0].latitude,
            longitude: course.gps[0].longitude,
          },
        },
        finalAddress: {
          street: shortenAddress(course.gps[lastIndex].address),
          coords: {
            latitude: course.gps[lastIndex].latitude,
            longitude: course.gps[lastIndex].longitude,
          },
        },
        gps: course.gps,
      };
    });
    setCourseInfo(separateCourseInfo);
  }, [courses]);

  React.useEffect(() => {
    getCourses();
  }, [getCourses]);

  React.useEffect(() => {
    if (selectedCourse) {
      navigation.navigate('MapScreen', selectedCourse);
    }
  }, [navigation, selectedCourse]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TouchableOpacity
        className="w-[8%] h-[3%] bg-black self-start left-3 top-3"
        onPress={() => changeLanguage('pt')}>
        <Image
          className="object-cover object-center w-full h-full"
          source={require('../../assets/flag-brazil.jpg')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="w-[8%] h-[3%] bg-black self-start left-3 top-5"
        onPress={() => changeLanguage('en')}>
        <Image
          className="object-cover object-center w-full h-full"
          source={require('../../assets/flag-en.png')}
        />
      </TouchableOpacity>
      <Image
        className="w-[50%] h-[20%] mt-5"
        source={require('../../assets/logo.png')}
      />
      <Text className="text-lg font-bold text-md text-black mt-10 mb-8">
        {t('Selecione um trajeto')}
      </Text>
      <FlatList
        data={courseInfo}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              className="bg-white w-[100%] self-center items-start p-1 mb-3 justify-center rounded-md border-b-2 border-gray-200"
              onPress={() => {
                setSelectedCourse({
                  initialAddress: {
                    latitude: item.initialAddress.coords.latitude,
                    longitude: item.initialAddress.coords.longitude,
                  },
                  finalAddress: {
                    latitude: item.finalAddress.coords.latitude,
                    longitude: item.finalAddress.coords.longitude,
                  },
                  gps: item.gps,
                });
              }}>
              <View className="w-[80%] flex-row mb-3 justify-start ">
                <Text className="text-base text-black font-bold self-start">
                  {t('Partida')}:{'  '}
                </Text>
                <Text className="text-base text-black self-start">
                  {item.initialAddress.street}
                </Text>
              </View>
              <View className="w-[80%] flex-row justify-start mb-3">
                <Text className="text-base text-black font-bold self-start">
                  {t('Destino')}:{'  '}
                </Text>
                <Text className="text-base text-black self-start">
                  {item.finalAddress.street}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default Home;
