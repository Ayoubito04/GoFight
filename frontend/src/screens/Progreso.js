import React from 'react';
import {View,Text,StyleSheet,ActivityIndicator,ScrollView} from 'react-native';
import { Ionicons,FontAwesome } from '@expo/vector-icons';
import { useState,useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BarraProgreso from '../components/BarraProgreso';
import { getTotalCaloriasQuemadas } from '../services/services';


const Progreso=()=>{
       const [caloriasQuemadas,setCaloriasQuemadas]=useState(0);
       const [loading,setloading]=useState(true)
       useEffect(()=>{
             setTimeout(async()=>{
                  setloading(false);
                  const totalCalorias=await getTotalCaloriasQuemadas();
                  setCaloriasQuemadas(totalCalorias);
                  
             },2000);

       },[]);
       if(loading){
            //Vamos a implementar una pantalla de carga,para mostrarla mientras se cargan los datos,antes de mostrar la pantalla de progreso
            return(
                 <View>
                    <ActivityIndicator size="large" color="#ff0000"/>
                 </View>
            )
       }
       else{
            return(
                  <View>
                    <Header/>
                    <ScrollView>
                        <BarraProgreso caloriasActuales={caloriasQuemadas} caloriasObjetivo={1000}/>
                    </ScrollView>
                    <Footer/>
                  </View>
            )
       }
}

