import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import {BorderButtonSmallRed} from "../../buttons/Buttons";
import React, {PureComponent} from "react";
import colors from "../../assets/colors/colors";

class AddProductButton extends PureComponent {
    render() {
        return (
            <View>
                {parseInt(this.props.item.quantity) === 0 ?
                    <BorderButtonSmallRed ctaFunction={() => {
                        this.props.selectProduct(this.props.item, "new")
                    }} text={"Add"}/> : <View style={styles.quantityButton}>
                        <TouchableOpacity onPress={() => {
                            this.props.selectProduct(this.props.index, "subtract")
                        }} style={styles.addSubtractButton}>
                            <Text style={texts.whiteTextBold16}>
                                -
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            value={this.props.item.quantity.toString()}
                            maxLength={10}
                            keyboardType={"numeric"}
                            onChangeText={(text) => this.props.setProductQuantity(text, this.props.index)}
                            style={styles.cartInput}>
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            this.props.selectProduct(this.props.item, "add")
                        }} style={styles.addSubtractButton}>
                            <Text style={texts.whiteTextBold16}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>}
            </View>)
    }
}

export default AddProductButton;

const styles = StyleSheet.create({
    productListItem: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: colors.grey,
        alignItems: 'center'
    },
    quantityButton: {
        flexDirection: 'row',
        height: 24
    },
    addSubtractButton: {
        width: 24,
        height: 24,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },
    cartInput: {
        width: 35,
        height: 24,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 3,
        textAlign: 'center',
        fontFamily: 'GothamMedium',
        color: colors.darkGrey,
        fontSize: 12
    },
})