import React, { Component } from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native'
import colors from "../assets/colors/colors";

export default class Indicator extends Component{
    render(){
        if (this.props.isLoading){
            return (
                <ActivityIndicator style={[styles.loading]} size="large" color={colors.primary_color} animating={this.props.isLoading} hidesWhenStopped={true} />
            )
        }else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    loading:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex:1000,
    },
})