import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { PinCodeT, DEFAULT } from './types';

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
	const [countDown, setCountDown] = useState(null);   
    const [nowTimer, setNowTimer] = useState(null);   
    const [actual, setActual] = useState(null);  
    useEffect(() => {
       
        const setTimerOperation = async () => {

            
            var pin_locked_finish = await AsyncStorage.getItem('@pin_locked_finish');
            if(pin_locked_finish){
                if (parseInt(pin_locked_finish) > parseInt(Date.now())){
                    setNowTimer(parseInt(pin_locked_finish));
                    setCountDown(duration);
                }else{
                    await AsyncStorage.removeItem('@pin_locked_finish');
                    onFinish();
                }              
                
            }else{

                var clock_timer = parseInt(Date.now()) + parseInt(duration); 
                await AsyncStorage.setItem('@pin_locked_finish',clock_timer.toString());   
                setNowTimer(parseInt(clock_timer));
                setCountDown(duration);
            }
        }

        setTimerOperation().catch(()=>{});
        
    },[]);

    useEffect(() => {
       
            setTimeout(async () => {                
                if(countDown != null){
                    setCountDown(prevCountDown => parseInt(prevCountDown) - 1000);
                    
                    if (parseInt(nowTimer) >= parseInt(Date.now())) {                        
                        setActual(parseInt(nowTimer) - parseInt(Date.now()))      
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