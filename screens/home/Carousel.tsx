import {Dimensions, Image, StyleSheet, View} from "react-native";
import React, {useState} from "react";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import colors from "../../assets/colors/colors";


const RenderCarousel = (props) => {

    const [activeSlide, setActiveSlide] = useState(0);

    const renderCarouselItem = ({item, index}) => {
        return (
            <View style={{
                width: Dimensions.get("window").width,
                paddingVertical:2,
                height: 200,
             
            }}>
                <Image resizeMode={"stretch"} style={{width: "100%", height: "100%"}} source={{uri: item.image}}/>
            </View>
        );
    }

    const getPagination = () => {
        return (
            <Pagination
                dotsLength={props.bannerData.length}
                activeDotIndex={activeSlide}
                containerStyle={{paddingTop:10, paddingBottom:0}}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 6,
                    borderWidth:1,
                    backgroundColor: colors.primaryThemeColor,
                    borderColor:colors.primaryThemeColor
                }}
                inactiveDotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth:1,
                    borderColor:colors.primaryThemeColor,
                    backgroundColor: colors.white,
                }}
                dotContainerStyle={{
                    marginHorizontal:3
                }}
                inactiveDotOpacity={1}
                inactiveDotScale={0.7}
            />)
    }


    return (
        <View style={{paddingHorizontal: 0, paddingBottom: 10, backgroundColor:colors.white}}>
            <Carousel
                loop={true}
                autoplay={true}
                data={props.bannerData}
                renderItem={renderCarouselItem}
                sliderWidth={Dimensions.get("window").width}
                itemWidth={Dimensions.get("window").width}
                onSnapToItem={(index) => setActiveSlide(index)}
            />
            {getPagination()}
        </View>
    )
}

export default RenderCarousel;