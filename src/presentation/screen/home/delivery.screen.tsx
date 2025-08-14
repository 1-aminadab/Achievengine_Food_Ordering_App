import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SwipableModal from '../../component/molecule/modal/swipeable-modal';
import Typography from '../../component/atom/typography/text.component';
import Button from '../../component/atom/button/button.component';
import { FontSizes, FontWeights, Colors } from '../../../domain/enum/theme';
import { Theme } from '../../theme/theme';
import { Shape } from '../../../domain/enum/button';
import { Image } from 'react-native';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { Clipboard } from 'react-native';
import { SwiperScroll } from '../../component/molecule/card/swiper.component';
import { cosmeticsData } from '../../../application/data/dummy-data';

const DeliveryScreen = () => {
    const [isModalVisible, setModalVisible] = useState(true);
    const code = '31625817'
    // Dummy coordinates for the map
    const origin = {
        latitude: 37.7749,
        longitude: -122.4194,
    };
    const destination = {
        latitude: 37.7849,
        longitude: -122.4094,
    };

    // Intermediate points for the polyline to simulate a curve
    const route = [
        origin,
        { latitude: 37.7799, longitude: -122.4154 },
        { latitude: 37.7829, longitude: -122.4124 },
        destination,
    ];

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        Clipboard.setString(code);
        setCopied(true);

        // Hide "Copied!" message after 3 seconds
        setTimeout(() => setCopied(false), 3000);
    };

    const handleCall = () => {
        Linking.openURL('tel:+251946450835').catch((err:any) =>
            Alert.alert('Error', 'Unable to make a call. Please try again.')
        );
    };
    return (
        <View style={styles.container}>
            {/* Map View */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={origin} title="Restaurant" />
                <Marker coordinate={destination} title="Your Location" />
                <Polyline
                    coordinates={route}
                    strokeColor={Colors.black}
                    strokeWidth={4}
                />
            </MapView>

            {/* Overlay Button to Open Modal */}
            <TouchableOpacity
                style={styles.overlayButton}
                onPress={() => setModalVisible(true)}
            >
                <Typography size={FontSizes.Large} weight={FontWeights.Bold} color={Colors.black}>
                    Open Delivery Details
                </Typography>
            </TouchableOpacity>

            {/* Delivery Details Modal */}
            <SwipableModal visible={isModalVisible} onClose={() => setModalVisible(false)}>
                <View >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Button shape={Shape.Circle} onPress={() => handleCopy()} style={{ backgroundColor: Theme.colors.GrayLight + '77', width: 'auto', gap: 10 }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: 5 }}>{code}</Text>
                            <Icon from={IconLibraryName.Ionicons} name="copy" size={15} color={Theme.colors.gray} />
                        </Button>
                    </View>

                    {/* Delivery Information */}
                    <Typography
                        size={FontSizes.Medium}
                        weight={FontWeights.Bold}
                        color={Theme.colors.gray}
                        align="center"
                        style={styles.modalTitle}
                    >
                        Will be delivered in
                    </Typography>
                    <Typography
                        size={FontSizes.Jumbo}
                        weight={FontWeights.Bold}
                        color={Theme.colors.black}
                        align="center"
                    >
                        30 - 40 mins
                    </Typography>


                    {/* Order Progress */}
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressStep, styles.activeStep]} >
                            <Icon from={IconLibraryName.MaterialIcons} name="done" size={24} color={Theme.colors.white} />
                        </View>
                        {/* line start */}
                        <View style={[styles.progressLine, styles.activeStep]}/>
                        {/* line end */}

                        <View style={[styles.progressStep, styles.activeStep]} >
                            <Icon from={IconLibraryName.MaterialIcons} name="propane" size={24} color={Theme.colors.white} />

                        </View>
                        {/* line start */}
                        <View style={styles.progressLine}/>
                        {/* line end */}
                        <View style={styles.progressStep} >
                            <Icon from={IconLibraryName.Ionicons} name="flag-sharp" size={24} color={Theme.colors.white} />
                        </View>
                          {/* line start */}
                          <View style={styles.progressLine}/>
                        {/* line end */}
                        <View style={styles.progressStep} >
                            <Icon from={IconLibraryName.MaterialCommunityIcons} name="bike" size={24} color={Theme.colors.white} />
                        </View>
                    </View>
                    <Typography
                        size={FontSizes.Regular}
                        weight={FontWeights.Bold}
                        align="center"
                        color={Colors.TextSecondary}
                        style={styles.modalSubtitle}
                    >
                        Spice and Sizzle is preparing your order
                    </Typography>
                    {/* Restaurant Info */}
                    <View style={styles.restaurantInfo}>
                        <View>
                            <Image style={styles.restaurantInfoImage} source={{ uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTAVYdSTRqpn4q5s9nzlLG-_vp3I5_y5wHLJM12i6Y0iFCV5jYM_pvND6O5B4qHQW46zuw5ThatK9q3EmJA2gQmzwnAmL6jyhPuVBzphg' }} />
                        </View>
                        <Typography size={FontSizes.Medium} weight={FontWeights.Bold}>
                            Spice and Sizzle
                        </Typography>
                        <Button
                            icon={<Icon from={IconLibraryName.Ionicons} name="call-sharp" size={15} color={Theme.colors.black} />
                            }
                            text="call"
                            onPress={() => handleCall()}
                            style={styles.callButton}
                            textStyle={{ color: Theme.colors.black }}
                        />
                    </View>
                    <View style={{}}>
                     <SwiperScroll items={cosmeticsData}/>
                    </View>
                </View>
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
    overlayButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: Colors.GrayLight + '77',
        padding: 10,
        borderRadius: 50,
    },
    modalTitle: {
        marginBottom: 8,
    },
    modalTime: {
        marginBottom: 16,
        color: Colors.PrimaryDark,
    },
    modalSubtitle: {
        marginBottom: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: 16,
    },
    progressStep: {
        padding:15,
        borderRadius: 50,
        backgroundColor: Colors.GrayLight,


    },
    progressLine : {
        width:30,
        height:3,
        backgroundColor:Theme.colors.GrayLight,
    },
    activeStep: {
        backgroundColor: Colors.Primary,
    },
    restaurantInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: Theme.colors.white,
        elevation: 10,
        shadowColor: Theme.colors.gray + 'dd',
        padding: 5,
        borderRadius: 50,
    },
    callButton: {
        paddingHorizontal: 16,
        backgroundColor: Theme.colors.GrayLight + '77',
        borderRadius: 20,
    },
    promoBanner: {
        backgroundColor: Colors.PrimaryLight,
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    restaurantInfoImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
    }
});

export default DeliveryScreen;
