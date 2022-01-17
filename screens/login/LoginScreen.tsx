import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TextInput, Alert, KeyboardAvoidingView} from 'react-native';
import colors from "../../assets/colors/colors";
import {setIsLoggedIn, setTokens} from "../../actions/actions";
// @ts-ignore
import { connect } from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {PostRequest} from "../../api/postRequest";
import {authApi} from "../../api/api";
import Indicator from '../../utils/Indicator';
import {BorderButtonSmallRed, SolidButtonBlue} from '../../buttons/Buttons';
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import * as Updates from 'expo-updates';


class LoginScreen extends Component {

    state = {
        mobileNumber:'',
        isLoading:false,
    }

    onchangeMobile = (text:string)=>{
        this.setState({mobileNumber:text});
    }

    checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                Alert.alert(
                    "App Updated",
                    "App has been updated. Will restart now.",
                    [
                        {text: "OK", onPress: () => Updates.reloadAsync()}
                    ]
                );
            }
        } catch (e) {

        }
    }

    componentDidMount() {
        this.checkForUpdates();
    }

    requestOTP = ()=>{
        if(!(/^\d{10}$/.test(this.state.mobileNumber))){
            Alert.alert('Please enter a valid mobile number');
        }else{
            this.setState({isLoading:true});
            const data = {
                method: authApi.mobileLogin.method,
                url: authApi.mobileLogin.url,
                data: {
                    contact_no:this.state.mobileNumber
                },
                header:authApi.refresh.header
            }
            PostRequest(data)
                .then((res) => {
                    if(res && res.status ==200){
                        // @ts-ignore
                        this.props.navigation.navigate('Otp', {mobile:this.state.mobileNumber});
                    }else{
                        Alert.alert(res.data.error);
                    }
                    this.setState({isLoading:false});
                })
        }
    }

    render(){
        return(
            <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
                <Indicator isLoading={this.state.isLoading}/>
                <View>
                    <Image style={styles.logo} resizeMode={"contain"} source={require('../../assets/images/neomart_logo.png')} />
                    <Text style={[texts.blueHeading1, {marginTop:30}]}>
                        Enter Mobile Number
                    </Text>
                    <Text style={[texts.greyNormal14,{marginTop:18}]}>
                        Enter your mobile number for account verification
                    </Text>
                    <View style={[styles.mobileInputContainer, {marginBottom:60}]}>
                        <View style={[styles.countryCodeDiv, commonStyles.rowCenter]}>
                            <Text style={texts.greyNormal14}>
                                +91
                            </Text>
                            <Image style={styles.downArrow} source={require('../../assets/images/down_arrow.png')} />
                        </View>
                        <View style={styles.mobileInputDiv}>
                            <TextInput
                                value={this.state.mobileNumber}
                                maxLength={10}
                                keyboardType={"numeric"}
                                onChangeText={(mobile) => this.onchangeMobile(mobile)}
                                style={commonStyles.textInput}>
                            </TextInput>
                        </View>
                    </View>
                    <View style={[commonStyles.rowAlignCenter]}>
                    <SolidButtonBlue text={"REQUEST OTP"} ctaFunction={this.requestOTP} />
                    </View>
                </View>
                <View style={[commonStyles.rowCenter,{marginBottom:30}]}>
                    <Text style={[texts.greyNormal14, {marginRight:10}]}>
                        Need help?
                    </Text>
                    <BorderButtonSmallRed text={"HELP"} />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(
    mapStateToProps,
    { setIsLoggedIn, setTokens }
)(LoginScreen);


const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:24,
        paddingTop:100,
        backgroundColor:'#ffffff',
        justifyContent:"space-between"
    },
    logo:{
        width:100,
        height:100
    },
    mobileInputContainer:{
        height:48,
        marginTop:48,
        borderRadius:5,
        borderColor:colors.lightGrey,
        borderWidth:1,
        flexDirection:'row'
    },
    countryCodeDiv:{
        marginVertical:12,
        width:'26%',
        borderRightWidth:1,
        borderRightColor:colors.lightGrey,
    },
    mobileInputDiv:{
        width:'74%',
    },
    downArrow:{
        width:24,
        height:24,
        marginLeft:8
    },
    textInputDiv: {
        paddingBottom: 30,
        position:"relative"
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        fontFamily: "GothamMedium",
        borderWidth: 0,
        borderColor: 'transparent',
        width: '100%',
        height: 40,
        padding: 0
    },
})