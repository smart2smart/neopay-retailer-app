import {StyleSheet,Platform,StatusBar, Dimensions} from "react-native";
import colors from "../assets/colors/colors";

const commonStyles = StyleSheet.create({
    container:{
        paddingHorizontal: 24,
        paddingTop: 30,
        flex: 1,
        backgroundColor:'#fcfcfc'
    },
    solidButtonBlue:{
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.blue,
        borderRadius:5,
        flex:1
    },
    solidButtonRed:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.orange,
        borderRadius:5,
        paddingVertical:6,
        paddingHorizontal:12,
        flex:1,
        display: 'flex',
        flexDirection: 'row'
    },
    greenButtonSmall: {
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.green,
        borderRadius:30,
        flex:1,
        padding: 10
    },
    borderButtonSmallRed:{
        borderRadius:4,
        borderColor:colors.primary_color,
        borderWidth:1.5,
        paddingHorizontal:12,
        paddingVertical:5
    },
    solidButtonSmallRed:{
        borderRadius:4,
        borderColor:colors.primary_color,
        borderWidth:1.5,
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor: colors.light_yellow
    },
    borderButtonSmallWhite:{
        borderRadius:4,
        borderColor:colors.white,
        backgroundColor:colors.white,
        borderWidth:2,
        paddingHorizontal:12,
        paddingVertical:5
    },
    borderButtonSmallBlue:{
        borderRadius:4,
        borderColor:colors.blue,
        borderWidth:1.5,
        paddingHorizontal:12,
        paddingVertical:5
    },
    blueButtonSmall:{
        borderRadius:4,
        paddingHorizontal:14,
        paddingVertical:7,
        backgroundColor:colors.blue
    },
    blueButtonMedium:{
        borderRadius:4,
        paddingHorizontal:12,
        paddingVertical:8,
        backgroundColor:colors.blue,
        elevation:2
    },
    borderButtonBigBlue:{
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        flex:1,
        borderWidth:1.5,
        borderColor:colors.blue
    },
    solidButtonBigOrange:{
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        flex:1,
        backgroundColor:colors.primary_color
    },
    greyBorderButton:{
        borderRadius:4,
        borderColor:colors.grey,
        borderWidth:2,
        paddingHorizontal:12,
        paddingVertical:5
    },
    textInput:{
        borderWidth:0,
        borderColor:'transparent',
        width:'100%',
        height:48,
        paddingLeft:10
    },
    modalTextInput:{
        borderWidth:0,
        borderColor:'transparent',
        width:'100%',
        height:36,
        paddingLeft:0
    },
    row:{
        flexDirection: "row"
    },
    rowCenter:{
        justifyContent:'center',
        flexDirection:"row",
        alignItems:'center'
    },
    rowAlignCenter:{
        flexDirection:"row",
        alignItems:'center'
    },
    rowFlexEnd:{
        flexDirection:"row",
        justifyContent:"flex-end"
    },
    rowSpaceBetween:{
        justifyContent:'space-between',
        flexDirection:"row",
        alignItems:'center',
    },
    ordersCard:{
        borderTopWidth: 1,
        borderTopColor: colors.grey,
        borderRadius: 1,
        paddingVertical: 10,
        borderStyle: 'dashed',
    },
    searchContainer: {
        borderRadius: 5,
        borderColor: colors.grey,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        elevation: 2,
        flexDirection: 'row',
        height: 40
    },
    imageContainer: {
        height:250,
        backgroundColor: '#d6d6d6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnSpaceBetween:{
        justifyContent:'space-between',
        flex:1
    },
    salesmanCard:{
        borderTopWidth: 1,
        borderTopColor: colors.grey,
        borderRadius: 1,
        position: 'relative',
        paddingVertical: 10,
        borderStyle: 'dashed',
    },
    retailerCard:{
        borderTopWidth: 1,
        borderTopColor: colors.grey,
        borderRadius: 1,
        position: 'relative',
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        alignItems:'center',
        borderStyle: 'dashed',
    },
    statusButton:{
        borderRadius:20,
        paddingHorizontal:12,
        paddingVertical:6
    },
    orangeContainer:{
        backgroundColor: colors.orangeFaded,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        flexDirection:"row",
        alignItems:"center"
    },
    modalContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: colors.white,
        padding: 24
    },
    modalTextInputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        padding: 0
    },
    searchTextInputContainer: {
        borderWidth: 1,
        borderColor: colors.grey,
        padding: 8,
        marginTop: 30,
        marginBottom: 15
    },
    modalBeatPlanDiv: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        paddingLeft: 5
    },
    modalBeatPlanContainer: {
        paddingVertical: 30
    },
    modalCloseIconDiv: {
        alignItems: 'flex-end'
    },
    modalCloseIcon: {
        paddingLeft: 10,
        paddingBottom: 10
    },
    selectedFiltersDiv: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 4,
        marginHorizontal: 8,
        backgroundColor: colors.primary_theme_color
    },
    solidStatusRed:{
        height: 22,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.brightOrange,
        borderRadius:50,
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 4,
        paddingLeft: 4
    },
    solidStatusGreen:{
        height: 22,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.green,
        borderRadius:50,
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 4,
        paddingLeft: 4
    },
    greyButtonSmall: {
        borderColor:colors.grey,
        borderBottomWidth:2,
        paddingHorizontal:12,
        paddingVertical:5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    circleButtonGrey: {
        borderColor:colors.grey,
        borderWidth: 2,
        borderRadius: 100,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleButtonGreen: {
        borderRadius: 100,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
    },
    rightIcon: {
        paddingBottom: 12,
        color: colors.grey
    },
    whiteRightIcon: {    
        paddingBottom: 12, 
        color: colors.white
    }
});

export default commonStyles;