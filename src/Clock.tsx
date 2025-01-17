import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { PinCodeT, DEFAULT } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Clock = ({
    duration = DEFAULT.Options.lockDuration,
	style,
	textStyle,
	onFinish
}: {
	duration?: number;
	style?: ViewStyle | ViewStyle[];
	textStyle?: TextStyle | TextStyle[];
	onFinish: () => void;    
}) => {
	const [countDown, setCountDown] = useState<any>(null);   
    const [nowTimer, setNowTimer] = useState<any>(null);   
    const [actual, setActual] = useState<any>(null);  
    useEffect(() => {
       
        const setTimerOperation = async () => {

            
            var pin_locked_finish = await AsyncStorage.getItem('@pin_locked_finish');
            if(pin_locked_finish){
                if (parseInt(pin_locked_finish) > parseInt(Date.now().toString())){
                    setNowTimer(parseInt(pin_locked_finish));
                    setCountDown(duration);
                }else{
                    await AsyncStorage.removeItem('@pin_locked_finish');
                    onFinish();
                }              
                
            }else{

                var clock_timer = parseInt(Date.now().toString()) + parseInt(duration.toString()); 
                await AsyncStorage.setItem('@pin_locked_finish',clock_timer.toString());   
                setNowTimer(parseInt(clock_timer.toString()));
                setCountDown(duration);
            }
        }

        setTimerOperation().catch(()=>{});
        
    },[]);

    useEffect(() => {
       
            setTimeout(async () => {                
                if(countDown != null){
                    setCountDown(parseInt(countDown) - 1000);
                    
                    if (parseInt(nowTimer) >= parseInt(Date.now().toString())) {                        
                        setActual(parseInt(nowTimer) - parseInt(Date.now().toString()))      
                    }
                    else {                                        
                        await AsyncStorage.removeItem('@pin_locked_finish');
                        onFinish();
                    }
                }
                
            }, 1000);
        
        
    },[countDown])
    

    return <View style={[styles.container, style]}>
		<Text style={[styles.time, textStyle]}>{millisToMinutesAndSeconds(actual)}</Text>
	</View>;
}

export function millisToMinutesAndSeconds(milliseconds: number): string {
	const minutes = Math.floor(milliseconds / 60000);
	const seconds = Math.floor((milliseconds % 60000) / 1000);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const styles = StyleSheet.create({
	container: { justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 30, paddingVertical: 10, borderColor: 'white' },
	time: { fontSize: 20, color: 'white' }
})

export default Clock;