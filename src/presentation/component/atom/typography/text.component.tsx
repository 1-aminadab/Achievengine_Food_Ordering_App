import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { FontSizes, FontWeights, Colors } from '../../../../domain/enum/theme';
import { useThemeContext } from '../../../theme/theme-provider';

interface TypographyProps extends TextProps {
  size?: FontSizes;
  weight?: FontWeights;
  color?: Colors | string;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  size = FontSizes.Regular,
  weight = FontWeights.Regular,
  color,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { colors } = useThemeContext();
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: size,
          fontWeight: weight,
          color: color ?? colors.text,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    marginVertical: 2,
  },
});

export default Typography;
