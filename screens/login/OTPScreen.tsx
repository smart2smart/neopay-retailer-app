import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, Alert, TouchableOpacity} from 'react-native';
import colors from "../../assets/colors/colors";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {authApi} from "../../api/api";
import {PostRequest} from "../../api/postRequest";
import mapStateToProps from "../../store/mapStateToProps";
import {setIsLoggedIn, setLandingScreen, setTokens} from "../../actions/actions";
// @ts-ignore
import {connect} from "react-redux";
import PersistenceStore from "../../utils/PersistenceStore";
import Indicator from "../../utils/Indicator";
import {BorderButtonSmallRed, SolidButtonBlue} from "../../buttons/Buttons";
import texts from "../../styles/texts";

class OTPScreen extends Component {

    state = {
        isLoading: false
    }

    verifyOTP = (code: string) => {
        if (!(/^\d{6}$/.test(code))) {
            Alert.alert('Please enter a valid OTP');
            return;
        }
        this.setState({isLoading: true});
        const data = {
            method: authApi.otp.method,
            url: authApi.otp.url,
            data: {
                contact_no: this.props.route.params.mobile,
                otp: code
            },
            header: authApi.refresh.header
        }
        PostRequest(data)
            .then((res) => {
                if (res.status == 200) {
                    this.props.setTokens({"access": res["data"]["access"], "refresh":res["data"]["refresh"], "timestamp":(new Date()).toString()})
                    PersistenceStore.setTimeStamp((new Date()).toString());
                    PersistenceStore.setAccessToken(res["data"]["access"]);
                    PersistenceStore.setRefreshToken(res["data"]["refresh"]);
                    PersistenceStore.setLandingScreen(res.data.screen);
                    // @ts-ignore
                    this.props.setIsLoggedIn(true);
                    this.props.setLandingScreen(res.data.screen)
                } else {
                    Alert.alert(res.data.error);
                }
            });
        this.setState({isLoading: false});
    }

    requestOTP = ()=>{
        if(!(/^\d{10}$/.test(this.props.route.params.mobile))){
            Alert.alert('Please enter a valid mobile number');
        }else{
            this.setState({isLoading:true});
            const data = {
                method: authApi.mobileLogin.method,
                url: authApi.mobileLogin.url,
                data: {
                    contact_no:this.props.route.params.mobile
                },
                header:authApi.refresh.header
            }
            PostRequest(data)
                .then((res) => {
                    if(res && res.status ==200){
                        // @ts-ignore
                        Alert.alert("OTP has been sent to the your contact number");
                    }else{
                        Alert.alert(res.data.error);
                    }
                    this.setState({isLoading:false});
                })
        }
    }

    render() {
        return <View style={styles.container}>
            <Indicator isLoading={this.state.isLoading}/>
            <Text style={[texts.blueHeading1, {marginTop:30}]}>
                Enter Verification code
            </Text>
            <Text style={[texts.greyNormal14,{marginTop:18}]}>
                Enter 6-digit Verification Code send to your mobile
            </Text>
            <View style={styles.mobileInputContainer}>
                <OTPInputView
                    codeInputFieldStyle={texts.darkGrey18Bold}
                    codeInputHighlightStyle={styles.borderStyleHighLighted}
                    autoFocusOnLoad={true}
                    pinCount={6}
                    onCodeFilled={(code) => {
                        this.verifyOTP(code)
                    }}
                />
            </View>
            <View style={styles.footer}>
                <Text style={[texts.greyNormal14, {marginRight:10}]}>
                    Didn't received code ?
                </Text>
                <BorderButtonSmallRed  ctaFunction={this.requestOTP} text={"RESEND"} />
            </View>
            <View style={{marginTop:60}}>
            <SolidButtonBlue text={"CONTINUE"} ctaFunction={this.verifyOTP} />
            </View>
        </View>
    }
}

export default connect(
    mapStateToProps,
    {setIsLoggedIn, setTokens, setLandingScreen}
)(OTPScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 70,
        backgroundColor: '#ffffff'
    },
    logo: {
        width: 72,
        height: 56
    },
    mobileInputContainer: {
        height: 48,
        marginTop: 48,
    },
    footer: {
        paddingTop: 20,
        flexDirection: "row",
        alignItems: 'center'
    },
    countryCodeDiv: {
        marginVertical: 12,
        width: '26%',
        borderRightWidth: 1,
        borderRightColor: colors.lightGrey,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    mobileInputDiv: {
        width: '74%',
    },
    downArrow: {
        width: 24,
        height: 24,
        marginLeft: 8
    },
    textInput: {
        borderWidth: 0,
        borderColor: 'transparent',
        width: '100%',
        height: 48,
        paddingLeft: 10
    },
    borderStyleHighLighted: {
        borderColor: colors.primary_color,
    },
})