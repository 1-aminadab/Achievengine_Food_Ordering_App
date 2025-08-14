/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme as theme } from '../../../theme/theme';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
  iconName: string;
  fullIcon?: React.ReactNode;
  rightIcon?: string;
  error?: string;
  secureTextEntry?: boolean;
  onRightIconPress?: () => void;
  leftCustom?:any
}

const CustomInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  iconName,
  fullIcon,
  rightIcon,
  error,
  secureTextEntry = false,
  onRightIconPress,
  leftCustom,
}) => {

  return (
    <ScrollView style={styles.inputContainer}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray}
        style={[styles.input, { borderRadius: 22 }]}
        outlineColor={error ? theme.colors.Error : theme.colors.Primary}
        secureTextEntry={secureTextEntry}
        left={
        <TextInput.Icon
          icon={(props) =>
            leftCustom ?
            leftCustom : fullIcon ?
            fullIcon :
            <MaterialCommunityIcons name={iconName} {...props} />
          }
        color={theme.colors.Primary}
        style={{width:100}}
        />}

        right={<TextInput.Icon icon={(props) => rightIcon &&  <MaterialIcons name={rightIcon} {...props} onPress={onRightIconPress} color={theme.colors.Primary}/>} />}
        theme={{
            colors: {
                primary: theme.colors.Primary,
                text: theme.colors.black,
                placeholder:'#aaa',
            },
        }}

        maxLength={maxLength}
      />
      {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.colors.white,
    color: theme.colors.black,
    height: 60,
    borderRadius: 22,
  },
});

export default CustomInput;
