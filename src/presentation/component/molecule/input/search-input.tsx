import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Input from '../../atom/input/input.component';
import Icon, { IconLibraryName } from '../../atom/icon/icon.component';
import { Theme } from '../../../theme/theme';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  style,
  inputStyle,
  iconColor = '#333',
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[styles.container, style]}
      inputStyle={inputStyle}
      icon={<Icon from={IconLibraryName.Feather} name="search" size={20} color={Theme.colors.gray} />}
      iconPosition="left"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: Theme.colors.GrayLight+'66',
    margin:10,
    overflow:"hidden",
    padding: 3,
  },
});

export default SearchInput;
