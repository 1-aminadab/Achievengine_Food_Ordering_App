/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { StyleProp, TextStyle } from 'react-native';

export enum IconLibraryName {
  Ionicons = 'Ionicons',
  FontAwesome = 'FontAwesome',
  SimpleLineIcons = 'SimpleLineIcons',
  FontAwesome5 = 'FontAwesome5',
  FontAwesome6 = 'FontAwesome6',
  Feather = 'Feather',
  AntDesign = 'AntDesign',
  Entypo = 'Entypo',
  MaterialIcons = 'MaterialIcons',
  MaterialCommunityIcons = 'MaterialCommunityIcons',
  Octicons = 'Octicons',
  Fontisto = 'Fontisto'
}
export type IconLibraries =
  | IconLibraryName.Ionicons
  | IconLibraryName.FontAwesome
  | IconLibraryName.SimpleLineIcons
  | IconLibraryName.FontAwesome5
  | IconLibraryName.FontAwesome6
  | IconLibraryName.Feather
  | IconLibraryName.AntDesign
  | IconLibraryName.Entypo
  | IconLibraryName.MaterialIcons
  | IconLibraryName.MaterialCommunityIcons
  | IconLibraryName.Octicons
  | IconLibraryName.Fontisto

interface IconProps {
  from: IconLibraries;
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>
  onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({ from, name, size = 24, color = 'black', style, onPress, ...props }) => {
  const IconComponent = {
    Ionicons,
    FontAwesome,
    SimpleLineIcons,
    FontAwesome5,
    FontAwesome6,
    Feather,
    AntDesign,
    Entypo,
    MaterialIcons,
    MaterialCommunityIcons,
    Octicons,
    Fontisto,
  }[from];

  if (!IconComponent) {
    console.warn(`Icon library '${from}' not found.`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} style={style} onPress={onPress} {...props} />;
};

export default Icon;
