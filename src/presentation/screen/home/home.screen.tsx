/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet,  ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import FoodCardComponent from '../../component/molecule/card/food-card.component';
import SearchInput from '../../component/molecule/input/search-input';
import Button from '../../component/atom/button/button.component';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { Theme } from '../../theme/theme';
import { Intent, Shape } from '../../../domain/enum/button';
import Typography from '../../component/atom/typography/text.component';
import { FontSizes, FontWeights } from '../../../domain/enum/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeScreens } from '../../../domain/enum/screen-name';
import { SwiperScroll } from '../../component/molecule/card/swiper.component';
import { useThemeContext } from '../../theme/theme-provider';
import { Sun, Moon } from 'lucide-react-native';
import { foodStoresData, homeSwiperData } from '../../../application/data/dummy-data';
import { useFoodStore } from '../../../application/stores/food.store';
import testApiServices from '../../../api/test';

const { width } = Dimensions.get('screen');

const HomeScreen = () => {
  const navigation  = useNavigation<NavigationProp<any>>();
  const { mode, colors, toggleTheme } = useThemeContext();
  const { foodItems, loadFoodsFromApi } = useFoodStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(foodItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        // Check API health first
        const isHealthy = await testApiServices();
        if (isHealthy) {
          // Load foods from API if backend is healthy
          await loadFoodsFromApi();
        } else {
          Alert.alert(
            'Backend Connection', 
            'Could not connect to backend. Please ensure it is running on http://localhost:3000',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Update filtered foods when foodItems or searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(foodItems);
    } else {
      const filtered = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    }
  }, [foodItems, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} stickyHeaderIndices={[0]} showsHorizontalScrollIndicator={false}>
      {/* Address Section */}
      <View style={[styles.addressContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={{}}>
           <Text style={[styles.addressText, { color: colors.muted }]}>Address</Text>
        <Text style={[styles.addressValue, { color: colors.text }]}>Addis Ababa, Ethiopia</Text>
        </View>
       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
        onPress={() => {}}
        icon={<Icon from={IconLibraryName.MaterialCommunityIcons} name="star-four-points-outline" size={19} color={Theme.colors.white} />}
        gradient
        text="0 ETB"
        textStyle={{fontSize:12}}
        style={{borderRadius:20, marginRight: 10}}
        // gradientStart={{ x: 0.5, y: 0 }}
        gradientEnd={{ x: 0.5, y: 1 }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate(HomeScreens.MenuManagement)}
            style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon from={IconLibraryName.MaterialIcons} name="restaurant-menu" size={16} color={colors.text} />
            <Text style={{ color: colors.text, marginLeft: 6, fontSize: 12 }}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }}>
            {mode === 'dark' ? (
              <>
                <Sun color={colors.text} size={16} />
                <Text style={{ color: colors.text, marginLeft: 6 }}>Light</Text>
              </>
            ) : (
              <>
                <Moon color={colors.text} size={16} />
                <Text style={{ color: colors.text, marginLeft: 6 }}>Dark</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
       </View>
      </View>

      {/* Search Input */}
      <SearchInput
        style={[styles.searchInput, { backgroundColor: colors.card, elevation: 20, shadowColor: '#8888', borderWidth:1, borderColor: '#8881' }]}
        placeholder="Search for foods, categories, or services"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Continuous Swiper */}
      <View style={styles.swiperContainer}>
        <SwiperScroll items={homeSwiperData}/>
      </View>

      {/* Services Section */}
      <View style={styles.serviceSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Services</Text>
        <TouchableOpacity onPress={() => navigation.navigate(HomeScreens.MenuGrid)}>
          <Text style={[styles.seeAll, { color: Theme.colors.Primary }]}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
        {foodStoresData.map((item, index) => (
          <FoodCardComponent
            onPress={() => navigation.navigate(HomeScreens.MenuGrid)}
            key={index}
            image={item.image}
            text={item.text}
            tag={item.tag}
          />
        ))}
      </ScrollView>

      {/* Featured Foods Section */}
      <View style={styles.serviceSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Foods</Text>
        <TouchableOpacity onPress={() => navigation.navigate(HomeScreens.MenuGrid)}>
          <Text style={[styles.seeAll, { color: Theme.colors.Primary }]}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Icon from={IconLibraryName.MaterialIcons} name="hourglass-empty" size={32} color={colors.muted} />
            <Text style={[styles.loadingText, { color: colors.muted }]}>Loading foods...</Text>
          </View>
        ) : (
          <>
            {filteredFoods.slice(0, 6).map((item, index) => (
              <FoodCardComponent
                onPress={() => navigation.navigate(HomeScreens.MenuGrid)}
                key={index}
                image={item.imageUrl}
                text={item.name}
              />
            ))}
            <View style={{alignItems:'center', justifyContent: 'center'}}>
                <Button
                onPress={() => navigation.navigate(HomeScreens.MenuManagement)}
            shape={Shape.Circle}
            intent={Intent.Secondary}
            icon={<Icon from={IconLibraryName.MaterialIcons} name="add" size={44} color="black" />}
            style={{height:70, width: 70, backgroundColor:Theme.colors.Primary + '22'}}
                />
                <Typography size={FontSizes.Small} weight={FontWeights.Bold}>
                  Add Menu
                </Typography>
            </View>
          </>
        )}
      </View>



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  addressContainer: {
    
    flexDirection:'row',
    alignItems:'center',
    padding: 15,
    // borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width:width,
  },
  addressText: {
    fontSize: 12,
    color: '#888',
  },
  addressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    marginTop: 10,
    // margin: 15,
    // padding: 10,
    // borderRadius: 10,
    // fontSize: 16,
  },
  swiperContainer: {
    height: 180,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  serviceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  seeAll: {
    color: '#ff4757',
    fontWeight: 'bold',
  },
  servicesScroll: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
});

export default HomeScreen;
