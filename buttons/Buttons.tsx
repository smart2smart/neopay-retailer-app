import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import commonStyles from "../styles/commonStyles";
import Icon from 'react-native-vector-icons/Feather';
import texts from "../styles/texts";
import colors from "../assets/colors/colors";

export const SolidButtonBlue = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.solidButtonBlue}>
        <Text style={texts.whiteTextBold14}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const SolidButtonRed = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={[commonStyles.solidButtonRed]}>
        <Text style={[texts.whiteTextBold14]}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const BorderButtonSmallRed = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.borderButtonSmallRed}>
        <Text style={[texts.primaryTextBold12, {textAlign:'center'}]}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const BorderButtonSmallWhite = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.borderButtonSmallWhite}>
        <Text style={[texts.greyTextBold12, {textAlign:'center'}]}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}


export const BorderButtonSmallBlue= (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.borderButtonSmallBlue}>
        <Text style={[texts.blueBold12, {textAlign:'center'}]}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}


export const BorderButtonBigRed = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.borderButtonSmallRed}>
        <Text style={texts.primaryTextBold15}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const GreyBorderButtonBig = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.greyBorderButton}>
        <Text style={texts.greyTextBold15}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const BorderButtonBigBlue = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.borderButtonBigBlue}>
        <Text style={texts.blueBoldl14}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const BorderButtonBigOrange = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.solidButtonBigOrange}>
        <Text style={texts.whiteTextBold14}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const BlueButtonSmall = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.blueButtonSmall}>
        <Text style={texts.whiteTextBold12}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}


export const BlueButtonMedium = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.blueButtonMedium}>
        <Text style={texts.whiteTextBold12}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}


export const GreenButtonSmall = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.greenButtonSmall}>
        <Text style={texts.whiteTextBold12}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}

export const CircleButtonGrey = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.circleButtonGrey}>
        <Text style={texts.whiteTextBold12}>
            {props.text}
        </Text>
        {props.icon && props.icon.length > 0 && <Icon name={props.icon} size={25} style={commonStyles.rightIcon} />}
    </TouchableOpacity>)
}

export const CircleButtonGreen = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.circleButtonGreen}>
        <Text style={texts.whiteTextBold12}>
            {props.text}
        </Text>
        {props.icon && props.icon.length > 0 && <Icon name={props.icon} size={25} style={commonStyles.whiteRightIcon} />}
    </TouchableOpacity>)
}

export const SolidButtonSmallRed = (props:any)=>{
    return(<TouchableOpacity onPress={props.ctaFunction} style={commonStyles.solidButtonSmallRed}>
        <Text style={[texts.primaryTextBold12, {textAlign:'center'}]}>
            {props.text}
        </Text>
    </TouchableOpacity>)
}



