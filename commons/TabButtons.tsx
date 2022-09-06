import {StyleSheet, Text, View} from "react-native";
import React from "react";
import commonStyles from "@commonStyles";
import colors from "@colors";
import {BorderButtonSmallRed, BorderButtonSmallWhite, SolidButtonSmallRed} from "@Buttons";

export const TabButtons = (props: any) => {

    let items = [];
    props.data.map((item, index)=>{
        if(item.selected){
            items.push(<View>
                <BorderButtonSmallRed ctaFunction={()=>{props.selectItem(item.key)}} text={item.value} />
            </View>)
        }else{
            items.push(<View>
                <BorderButtonSmallWhite ctaFunction={()=>{props.selectItem(item.key)}} text={item.value} />
            </View>)
        }
        if(index<props.data.length-1){
            items.push(<View style={styles.verticalBorder}>

            </View>)
        }
    })

    return (
        <View style={styles.categories}>
            {items.map((item)=>{
                return item
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    categories: {
        borderColor: colors.light_grey,
        borderWidth: 1,
        borderRadius: 5,
        // marginBottom: 16,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:10,
    },
    verticalBorder: {
        borderRightWidth: 1,
        borderRightColor: colors.light_grey,
        height:45
    },

});

