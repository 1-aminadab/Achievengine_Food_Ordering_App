import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Theme } from '../../../theme/theme';
import { commonStyles } from '../../../styles/common-styles';

interface IProp {
  image: string;
  text?: string;
  tag?: {title:string, color:string};
  onPress: () => void;
}

const FoodCardComponent: React.FC<IProp> = ({ image, text, tag, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      {tag && (
        <View style={[styles.tagContainer, {backgroundColor:tag.color}]}>
          <Text style={styles.tagText}>{tag.title}</Text>
        </View>
      )}
      <Image source={{ uri: image }} style={styles.image} />
      {text && <Text style={styles.text}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 90,
    height: 140,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    padding: 10,
  },
  tagContainer: {
    backgroundColor: '#90EE90',
    padding: 5,
    borderRadius: 30,
    position: 'absolute',
    top: 0,
    left: 48,
    zIndex: 1,
    width: 50,
    ...commonStyles.centered,

  },
  tagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    flex: 1,
    width: 81,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    color: Theme.colors.GrayDark,
  },
});

export default FoodCardComponent;
