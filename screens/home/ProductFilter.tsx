import commonStyles from "../../styles/commonStyles";
import {Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import colors from "../../assets/colors/colors";
import React, {useEffect, useState} from "react";
import Icon from 'react-native-vector-icons/AntDesign';
import texts from "../../styles/texts";
import {connect, useSelector} from "react-redux";
import {BorderButtonSmallRed, BorderButtonSmallBlue} from "../../buttons/Buttons";
import mapStateToProps from "../../store/mapStateToProps";
import RangeSlider from "react-native-range-slider-expo";
import store from "../../store/store";


function ProductFilter(props) {

  let filters = useSelector((state: any) => state.filters);
  console.log(filters)
  
  const [mR,setMR] = useState({
    from : '0',
    to : '100'
  })
  const [fromValue, setFromValue] = useState(filters.margin.from);
  const [toValue, setToValue] = useState(filters.margin.to);

    const settoValue = (value)=>{
      setToValue(value);
      if(value>100){
          setToValue('100')
      }
  }
  const mrgnFilters = ()=>{
      setMR(mR=>({
          ...mR,
          from : fromValue,
          to : toValue
      }))
  }

  useEffect(()=>{
      mrgnFilters();
  },[fromValue,toValue])

  const applyFilters = ()=>{
    store.dispatch({type: "MARGIN_FILTERS", payload: mR})
    props.closeModal()
  }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.closeModal();
            }}
        >
            <View style={[commonStyles.modalContainer, {backgroundColor: "rgba(0,0,0,0.4)", padding: 10}]}>
                <View style={styles.container}>
                    <View style={{flex: 95}}>
                        <View style={styles.headerDiv}>
                            <Text style={texts.darkGrey18Bold}>
                                Filters
                            </Text>
                            <TouchableOpacity onPress={() => {
                                props.closeModal();
                            }} style={commonStyles.modalCloseIcon}>
                                <Icon name="close" size={24} color={colors.black}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contentDiv}>
                            <View style={styles.contentDivLeft}>
                                <TouchableOpacity style={styles.filterItem}>
                                  <Text style={texts.redTextBold14}>
                                    Margin
                                  </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.contentDivRight}>
                              <View>
                                <View style={{marginTop:40}}> 
                                    <RangeSlider min={0} max={100}
                                        step={1}
                                        fromValueOnChange={value => setFromValue(value.toString())}
                                        toValueOnChange={value => setToValue(value.toString())}
                                        initialFromValue={parseInt(mR.from)}
                                        initialToValue={parseInt(mR.to)}
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
                                        onChangeText={setFromValue}
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
                              </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={commonStyles.rowAlignCenter}>
                            <TouchableOpacity style={styles.button} onPress={applyFilters}>
                              <Text style={texts.whiteTextBold16}>
                                APPLY
                              </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default connect(mapStateToProps, {})(ProductFilter);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 5,
        justifyContent: 'space-between'
    },
    headerDiv: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey
    },
    footer: {
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.light_grey,
        flex: 5,
        padding: 12,
    },
    contentDiv: {
        flex: 1,
        flexDirection: "row",
    },
    contentDivLeft: {
        flex: 0.3,
        backgroundColor: '#f8f8f8',
        borderRightWidth: 1,
        borderRightColor: colors.light_grey,
    },
    contentDivRight: {
        flex: 0.7,
    },
    filterItem: {
        paddingVertical: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        borderLeftColor: 'transparent',
        borderLeftWidth: 3,
    },
    selected: {
        borderLeftColor: colors.primary_color,
        borderLeftWidth: 3,
        backgroundColor: colors.white
    },
    salesmanContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
        paddingTop: 16
    },
    salesmanBtn: {
        marginRight: 10,
        marginBottom: 10
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
  },
  input: {
    height: 30,
    width:35,
    borderWidth :1,
    borderColor:colors.blue,
    borderRadius:10,
    paddingLeft:5
  },
})