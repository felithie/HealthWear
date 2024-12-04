import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams  } from 'expo-router';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";


export default function DayGraph() {
    let data: any = []
    const router = useRouter()
    const { graphData } = useLocalSearchParams();
    const parsedGraphData = graphData ? JSON.parse(graphData) : null;
    const date = new Date(parsedGraphData[1].timestamp)
    const convertToPercentage = (value: number): number => {

        return ((50 - value) / 50) * 100;
    };

    for(let i = 0; i < 24; i++) {
        data.push({
            value: convertToPercentage(parsedGraphData[i].value),
            label: new Date(parsedGraphData[i].timestamp).getHours(),
            dataPointText: convertToPercentage(parsedGraphData[i].value).toFixed(2),
        })
    }

    const getAverageValue = () => {
        let value = 0;

        parsedGraphData.forEach((element: any) => {
            value += element.value / parsedGraphData.length
        });

        return convertToPercentage(value).toFixed(2);
    }


    return(
     
        <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Day Graph
                </Text>
             </View>
             <View style={styles.graphContainer}>
                <Text style={styles.normalText}>This is your Backtrack Data of {date.getDate()}-{date.getMonth()}-{date.getFullYear()}</Text>

                <LineChart data = {data}
                    areaChart   
                    thickness={2}   
                    yAxisColor="#bd3a05" 
                    xAxisColor="#bd3a05" 
                    color="#000000" 
                    dataPointsHeight={30}
                    textFontSize={13}
                    dataPointsColor='#000000'
                    startFillColor="#18e107"
                    endFillColor="#bd3a05"
                    startOpacity={0.8}
                    endOpacity={0.7}
                    />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    Average: {getAverageValue()}%
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.normalButton} onPress={() => router.replace("/(tabs)/home")}>
                        <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
         
        </View>
    )
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "white", 
  },
  graphContainer: {
    marginTop: 40,
    alignItems: "center",
    height: "auto",
    width: "100%",
  },
  titleContainer: {
    height: "20%",
    justifyContent: "center" ,
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    height: "20%",
    justifyContent: "center" ,
    alignItems: "center",
    width: "100%",
  },
  normalButton: {
    width: '80%',
    maxWidth: 200,
    height: 60,
    backgroundColor: '#bd3a05',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 50,
  },
  titleText: {
    color: '#bd3a05',
    fontSize: 40,
  },
  textContainer: {
    marginHorizontal: 30,
    marginTop: 30
  },
  text: {
    fontSize: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  normalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20
  },
});

{/* <BarChart data = {data} />
<LineChart data = {data} />
<PieChart data = {data} />
<PopulationPyramid data = {[{left:10,right:12}, {left:9,right:8}]} />

<PieChart data = {data} donut />

<BarChart data = {data} horizontal />

<LineChart data = {data} areaChart /> */}