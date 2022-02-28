import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image,
    TouchableHighlight,
    StyleSheet,
    ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Voice, {
    SpeechRecognizedEvent,
    SpeechResultsEvent,
    SpeechErrorEvent,
} from '@react-native-voice/voice';
import colors from '../assets/colors/colors';

type Props = {
    textFunction: Function
};
type State = {
    micOn: boolean,
    // recognized: string;
    // pitch: string;
    // error: string;
    // end: string;
    // started: string;
    results: string[];
    partialResults: string[];
};

class VoiceToText extends Component<Props, State> {
    state = {
        micOn: false,
        results: [],
        partialResults: [],
    };

    constructor(props: Props) {
        super(props);
        Voice.onSpeechStart = this.onSpeechStart;
        // Voice.onSpeechRecognized = this.onSpeechRecognized;
        Voice.onSpeechEnd = this.onSpeechEnd;
        // Voice.onSpeechError = this.onSpeechError;
        // Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        // Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    onSpeechStart = (e: any) => {
        ToastAndroid.show('Listening...',ToastAndroid.SHORT)
    };

    // onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    //     ToastAndroid.show('Voice Recognized...',ToastAndroid.SHORT)
    // };

    onSpeechEnd = (e: any) => {
        this.setState({
            micOn: false
        })
        this.props.textFunction(this.state.partialResults[0])
    };

    // onSpeechResults = (e: SpeechResultsEvent) => {
    //     console.log('onSpeechResults: ', e);
    //     this.setState({
    //         results: e.value,
    //     });
    // };

    onSpeechPartialResults = (e: SpeechResultsEvent) => {
        this.setState({
            partialResults: e.value,
        });
    };

    _startRecognizing = async () => {
        this.setState({
            micOn: true,
            partialResults: [],
        });

        try {
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        this.setState({
            micOn: false
        })
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        return (
            <>
                <TouchableOpacity onPress={() => { this.state.micOn ? this._stopRecognizing() : this._startRecognizing() }}>
                    <Icon name={this.state.micOn ? "mic-circle" : "mic"} size={this.state.micOn ? 26 : 18} />
                </TouchableOpacity >
            </>
        );
    }
}



export default VoiceToText