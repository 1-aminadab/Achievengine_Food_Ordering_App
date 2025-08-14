import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { countries, ILocation } from '../../../domain/dummy-datas/countrys';
import SwipableModal from '../../component/molecule/modal/swipeable-modal';
import SearchInput from '../../component/molecule/input/search-input';
import Button from '../../component/atom/button/button.component';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { Theme } from '../../theme/theme';
import { Size } from '../../../domain/enum/button';
import { useNavigation } from '@react-navigation/native';
import { HomeScreens, RootScreens } from '../../../domain/enum/screen-name';
import { commonStyles } from '../../styles/common-styles';


const MapScreen = () => {
  const navigation  = useNavigation()
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(countries[0].location);
  const [modalVisible, setModalVisible] = useState(true);
  const [userLocation, setUserLocation] = useState<ILocation | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const handleCountrySelect = (location: ILocation) => {
    setSelectedLocation(location);

    mapRef.current?.animateToRegion(
      {
        ...location,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      500
    );
  };

  const toRad = (value: number) => (value * Math.PI) / 180;
  const getDistanceKm = (from: ILocation, to: ILocation) => {
    const R = 6371; // km
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);
    const lat1 = toRad(from.latitude);
    const lat2 = toRad(to.latitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* MapView */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...countries[0].location,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        onUserLocationChange={(e) => {
          const c = e.nativeEvent.coordinate;
          if (c) {
            setUserLocation({ latitude: c.latitude, longitude: c.longitude });
          }
        }}
        onPress={() => setModalVisible(true)}
      >
        <Marker
          coordinate={selectedLocation}
          title="Selected Location"
          description="Selected place"
        >
          <View style={styles.customMarker}>
            <Icon from={IconLibraryName.MaterialCommunityIcons} name="food" size={28} color={Theme.colors.Primary} />
          </View>
        </Marker>
      </MapView>

      {/* Swipable Modal */}
      <SwipableModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          {/* Floating Search Input */}
          <SearchInput
            placeholder="Search country..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => {
              const isSelected =
                selectedLocation.latitude === item.location.latitude &&
                selectedLocation.longitude === item.location.longitude;

              return (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    isSelected && styles.selectedCountryItem, // Highlight selected item
                  ]}
                  onPress={() => handleCountrySelect(item.location)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Icon from={IconLibraryName.MaterialCommunityIcons} name="food" size={18} color={Theme.colors.Primary} />
                    <Text style={styles.countryText}>
                      {item.name}
                      {userLocation && (
                        <Text style={styles.distanceText}>
                          {`  •  ${getDistanceKm(userLocation, item.location).toFixed(1)} km`}
                        </Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Button onPress={() => navigation.navigate(RootScreens.Home, {screen:HomeScreens.Home})} size={Size.Large} style={{ borderRadius: 50 }}>
          <Text style={styles.openModalText}>Confirm Location</Text>
        </Button>
      </SwipableModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 0,
  },
  searchInput: {
    marginBottom: 10,
    width:'100%'
  },
  openModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countryItem: {
    padding: 15,
    // borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedCountryItem: {
    backgroundColor: '#d3f9d855', 
    borderRadius: 50
  },
  countryText: {
    fontSize: 18,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  customMarker: {
  ...commonStyles.centered,
  },
  markerImage: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
  },
});

export default MapScreen;
