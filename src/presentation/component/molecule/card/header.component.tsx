import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../atom/button/button.component';
import { Intent } from '../../../../domain/enum/button';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../../../styles/common-styles';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress }) => {
    const navigation = useNavigation()
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.iconContainer} onPress={onBackPress ? onBackPress : () => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 30
  },
  iconContainer: {
    width: 40,
    ...commonStyles.centered,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Header;
