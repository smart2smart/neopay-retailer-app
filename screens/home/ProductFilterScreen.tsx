import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {View, StyleSheet, Text, Dimensions, TextInput, LogBox} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../assets/colors/colors';
import SecondaryHeader from "../../headers/SecondaryHeader";
import texts from '../../styles/texts';
import RangeSlider from 'react-native-range-slider-expo';
import { useSelector } from "react-redux";
import store from "../../store/store";
import { useEffect, useState } from 'react';

let height = (Dimensions.get('window').height)
height = height-height*0.2;


const Divider = ()=>{
    return(
        <View
            style={{
                borderBottomColor: colors.blue,
                borderBottomWidth: 1,
                borderRadius:5,
                marginRight:5,
                marginLeft:5
            }}
        />
    )
}

export default function ProductFilterScreen(props) {

    const navigation = useNavigation();

    let filters = useSelector((state: any) => state.filters);
    const [fromValue, setFromValue] = useState(filters.margin.from.toString());
    const [toValue, setToValue] = useState(filters.margin.to.toString());
    const [margin,setMargin] = useState({
        from : 0,
        to : 100
    })


    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
      ]);

    const setfromValue = (value)=>{
        if(value < 0){
            setFromValue('0')
        }else{
            setFromValue(value)
        }
    }

    const settoValue = (value)=>{
        if(value>=100){
            setToValue(100)
        }else{
            setToValue(value)
        }
        if(value==fromValue){
            setToValue('100')
        }
    }
    const mrgnFilters = ()=>{
        setMargin(margin=>({
            ...margin,
            from : parseInt(fromValue),
            to : parseInt(toValue)
        }))
    }

    useEffect(()=>{
        mrgnFilters();
    },[fromValue,toValue])

    const applyfilters = (val)=>{
       if(val==="clear"){
        store.dispatch({type: "MARGIN_FILTERS", payload: {from:0, to: 100}});
        navigation.navigate("BuildOrder", {comingFrom:"clearfilters"});
       }
       if(val==="apply"){
           store.dispatch({type: "MARGIN_FILTERS", payload: margin});
           navigation.navigate("BuildOrder", {comingFrom:"filters"});
       }
    }

    const resetfilters = (val)=>{
        setMargin(margin=>({
            ...margin,
            from:0,
            to:100
        })) 
        if(val==="clear"){
            applyfilters("clear")       
        }
    }

    const [navigate,setNavigate]=useState({
        company : false,
        brand : false,
        product : false,
        sku : false,
        offers : false,
        margin : true,
        container : false,

    })

    const filterNavigate = (filter)=>{
        if(filter === 'company'){
            let data = {
                company : true,
                brand : false,
                container : false,
                margin : false,
                product : false,
                sku : false,
                offers : false,
            }
            setNavigate({...navigate,...data});
        }
        if(filter === 'brand'){
            let data = {
                company : false,
                brand : true,
                container : false,
                margin : false,
                product : false,
                sku : false,
                offers : false,
            }
            setNavigate({...navigate,...data});
        }
        if(filter === 'margin'){
            let data = {
                company : false,
                brand : false,
                container : false,
                margin : true,
                product : false,
                sku : false,
                offers : false,
            }
            setNavigate({...navigate,...data});
        }
        if(filter === 'offers'){
            let data = {
                company : false,
                brand : false,
                container : false,
                margin : false,
                product : false,
                sku : false,
                offers : true,
            }
            setNavigate({...navigate,...data});
        }
        if(filter === 'product'){
            let data = {
                company : false,
                brand : false,
                container : false,
                margin : false,
                product : true,
                sku : false,
                offers : false,
            }
            setNavigate({...navigate,...data});
        }
        if(filter === 'sku'){
            let data = {
                company : false,
                brand : false,
                container : false,
                margin : false,
                product : false,
                sku : true,
                offers : false,
            }
            setNavigate({...navigate,...data});
        }
        if(filter === 'container') {
            let data = {
                company : false,
                brand : false,
                container : true,
                margin : false,
                product : false,
                sku : false,
                offers : false,
            }
            setNavigate({...navigate,...data});
        }

    }

    return (
        <View>
            <View style={styles.filterHeader}>
                <SecondaryHeader title={"Filter"}/>
                <TouchableOpacity onPress={()=>resetfilters("reset")}>
                    <Text style={styles.filterText}>RESET Filter</Text>
                </TouchableOpacity>
            </View>
            <View>
            <View>
            <View style={styles.container}>
                <View style={{width:'30%'}}>
                    <View >
                        {/* <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('company')}>
                        <Text style={navigate.company?texts.redTextBold14:texts.blueBoldl14}>
                            Company
                        </Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('brand')}>
                        <Text style={navigate.brand?texts.redTextBold14:texts.blueBoldl14}>
                            Brand
                        </Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('product')}>
                        <Text style={navigate.product?texts.redTextBold14:texts.blueBoldl14}>
                            Product
                        </Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('sku')}>
                        <Text style={navigate.sku?texts.redTextBold14:texts.blueBoldl14}>
                            SKUs
                        </Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('offers')}>
                        <Text style={navigate.offers?texts.redTextBold14:texts.blueBoldl14}>
                            Offers
                        </Text>
                    </TouchableOpacity>
                    <Divider /> */}
                        <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('margin')}>
                            <Text style={navigate.margin?texts.redTextBold14:texts.blueBoldl14}>
                                Margin
                            </Text>
                        </TouchableOpacity>
                        <Divider />
                        {/* <TouchableOpacity style={styles.sidemenu} onPress={()=>filterNavigate('container')}>
                        <Text style={navigate.container?texts.redTextBold14:texts.blueBoldl14}>
                            Container
                        </Text>
                    </TouchableOpacity>
                    <Divider /> */}
                    </View>
                </View>

                {   navigate.margin?
                    <View style={{width:'69%',backgroundColor:'white'}}>
                        <View style={{marginTop:40}}>
                            <RangeSlider min={0} max={100}
                                         step={1}
                                         fromValueOnChange={value => setFromValue(value.toString())}
                                         toValueOnChange={value => setToValue(value.toString())}
                                         initialFromValue={margin.from}
                                         initialToValue={margin.to}
                                         styleSize={16}
                                         valueLabelsBackgroundColor={colors.blue}
                                         inRangeBarColor={colors.red}
                                         outOfRangeBarColor={colors.blue}
                                         fromKnobColor={colors.red}
                                         toKnobColor={colors.red}
                            />
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text style={[texts.blueBoldl14,{marginTop:8}]}> Filter Margin From </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={value => setfromValue(value)}
                                value={fromValue}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                            <Text style={[texts.blueBoldl14,{marginTop:8}]}> to </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={value => settoValue(value)}
                                value={toValue}
                                keyboardType="numeric"
                                maxLength={3}
                            />
                        </View>
                    </View>:null
                }

                {
                    navigate.company?
                        <View style={{width:'69%',backgroundColor:'white'}}>
                            <Text style={texts.blueBoldl14}>Company filters</Text>
                        </View>:null
                }

                {
                    navigate.brand?
                        <View style={{width:'69%',backgroundColor:'white'}}>
                            <Text style={texts.blueBoldl14}>Brand filters</Text>
                        </View>:null
                }

                {
                    navigate.offers?
                        <View style={{width:'69%',backgroundColor:'white'}}>
                            <Text style={texts.blueBoldl14}>Offers filters</Text>
                        </View>:null
                }

                {
                    navigate.sku?
                        <View style={{width:'69%',backgroundColor:'white'}}>
                            <Text style={texts.blueBoldl14}>SKUs filters</Text>
                        </View>:null
                }

                {
                    navigate.product?
                        <View style={{width:'69%',backgroundColor:'white'}}>
                            <Text style={texts.blueBoldl14}>Product filters</Text>
                        </View>:null
                }


                {
                    navigate.container?
                        <View style={{width:'69%',backgroundColor:'white'}}>
                            <Text style={texts.blueBoldl14}>Container filters</Text>
                        </View>:null
                }

            </View>
            <View style={styles.filterFooter}>
                {/* <Text style={[texts.blueBoldl14,{marginLeft:20}]}>245 items found</Text> */}
                <TouchableOpacity onPress={()=>resetfilters("clear")}>
                    <Text style={[styles.filterText,{marginLeft:15}]}>Clear Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>applyfilters("apply")}>
                    <Text style={texts.whiteTextBold16}>
                        APPLY
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.white,
        backgroundColor: colors.white,
        paddingLeft: 20,
        paddingBottom: 20,
        paddingRight: 15,
        paddingTop: 8
    },
    filterText: {
        marginTop: 15,
        color: colors.red,
        fontFamily: "GothamMedium",
        fontSize: 15
    },
    container : {
        flexDirection : 'row',
        height:height,
        marginTop:5,
        marginBottom:5
    },
    sidemenu :{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:15,
        paddingBottom:15,
    },
    filterFooter : {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        paddingBottom:10,
        paddingTop : 5
    },
    input: {
        height: 30,
        width:35,
        borderWidth :1,
        borderColor:colors.blue,
        borderRadius:10,
        paddingLeft:5
    },
    button : {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.red,
        backgroundColor: colors.red,
        paddingLeft: 15,
        paddingBottom: 8,
        paddingRight: 15,
        paddingTop: 8,
        marginRight:20,
        marginTop:10
    }
})
