import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon, { IconLibraryName } from '../../atom/icon/icon.component';
import { Theme } from '../../../theme/theme';
import { FontSizes, FontWeights } from '../../../../domain/enum/theme';

export const NavComponent: React.FC<{
  icon: React.ReactNode,
  title: string,
  description?: string,
  navItem?: React.ReactNode,
  isNav?: boolean
}> = ({ icon, title, description, navItem, isNav = true }) => {
  return (
    <View style={styles.infoRow}>
      {/* open */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {
          icon
        }
        <View style={{}}>
          <Text style={styles.infoText}>{title}</Text>
          {
            description && <TouchableOpacity>
              <Text style={styles.description}>{description}</Text>
            </TouchableOpacity>
          }

        </View>
        {/* open */}


      </View>
      <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
        {
          navItem
        }
        {
          isNav && <Icon from={IconLibraryName.AntDesign} name="right" size={15} color={Theme.colors.black} />

        }

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 10,
    justifyContent: 'flex-start',
    marginRight: 20,
  },
  infoText: {
    marginLeft: 10,
    fontWeight: FontWeights.Bold,
    fontSize: FontSizes.Large,

  },
  description: {
    marginLeft: 5,
    color: Theme.colors.gray,
  },
});
