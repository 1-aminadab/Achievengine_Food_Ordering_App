import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';
import { Theme } from '../../theme/theme';
import Typography from '../atom/typography/text.component';
import { FontWeights } from '../../../domain/enum/theme';
import { commonStyles } from '../../styles/common-styles';

const { width } = Dimensions.get('window');

export default function SwiperPagerButton() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const buttons = ['Delivery', 'TakeAway'];

    const onClick = (i: number) => {
        scrollViewRef.current?.scrollTo({ x: i * width, animated: true });
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 5, paddingTop: 0 }}>
                <ButtonContainer buttons={buttons} onClick={onClick} scrollX={scrollX} />
            </View>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}>
                {buttons.map((x, index) => (
                    <View style={[styles.card]} key={index} />
                ))}
            </ScrollView>
        </View>
    );
}

interface ButtonContainerProps {
    buttons: string[];
    onClick: (index: number) => void;
    scrollX: Animated.Value;
}

function ButtonContainer({ buttons, onClick, scrollX }: ButtonContainerProps) {
    const [btnContainerWidth, setWidth] = useState(0);
    const btnWidth = btnContainerWidth / buttons.length;

    const translateX = scrollX.interpolate({
        inputRange: [0, width],
        outputRange: [0, btnWidth],
    });

    const translateXOpposite = scrollX.interpolate({
        inputRange: [0, width],
        outputRange: [0, -btnWidth],
    });

    return (
        <View
            style={styles.btnContainer}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
            {buttons.map((btn, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.btn}
                    onPress={() => onClick(i)}>
                    <Typography weight={FontWeights}>{btn}</Typography>
                </TouchableOpacity>
            ))}
            <Animated.View
                style={[
                    styles.animatedBtnContainer,
                    { width: btnWidth, transform: [{ translateX }] },
                ]}>
                {buttons.map((btn, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.animatedBtn,
                            { width: btnWidth, transform: [{ translateX: translateXOpposite }] },
                        ]}>
                        <Text style={styles.btnTextActive}>{btn}</Text>
                    </Animated.View>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5,
    },
    btnContainer: {
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        flexDirection: 'row',
        backgroundColor: '#00000011',
        width: '100%',
        
    },
    btn: {
        flex: 1,
        ...commonStyles.centered,
    },
    animatedBtnContainer: {
        height: 45,
        flexDirection: 'row',
        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: Theme.colors.black,
        borderRadius:50,
    },
    animatedBtn: {
        height: 40,
        ...commonStyles.centered,
    },
    btnTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        width: width - 10,
        height: '100%',
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: 'red',
    },
});
