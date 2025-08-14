import { Dimensions, PixelRatio } from 'react-native';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '../../domain/enum/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Base width for scaling

export const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const Theme = {
  colors: Colors,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  spacing: Spacing,
  borderRadius: BorderRadius,
  normalize,
};