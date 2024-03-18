import {t} from 'i18next';
import React from 'react';
import {View, Text} from 'react-native';
import {RouteInfoProps} from './RouteInfo.structure';

export default function RouteInfo(props: RouteInfoProps) {
  return (
    <>
      <View className="w-[80%] flex-row mb-3 justify-start ">
        <Text className="text-base text-black font-bold self-start">
          {t('Partida')}:{'  '}
        </Text>
        <Text className="text-base text-black self-start">
          {props.initialAddress}
        </Text>
      </View>
      <View className="w-[80%] flex-row justify-start mb-3">
        <Text className="text-base text-black font-bold self-start">
          {t('Destino')}:{'  '}
        </Text>
        <Text className="text-base text-black self-start">
          {props.finalAddress}
        </Text>
      </View>
    </>
  );
}
