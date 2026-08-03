//Aquí vamos a crear la card para cada uno de los ejercicios
import React, { useEffect, useState,useRef} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import Button from './Button';
import {Image} from 'expo-image';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, categoriaColor, categoriaDescripcion, shadow } from '../theme';

const esGifValido=(url)=> !!url && /\.(gif|png|jpe?g|webp)(\?|$)/i.test(url);

const EjercicioCard=({item, onCompletado})=>{
        const [tiempo,setTiempo]=useState(item.duracion_ejercicio);//Definimos el estado de tiempo de cada uno de los ejercicios,que después lo pasaremos a un intervalo de tiempo
        const [ejecutando,setEjecutando]=useState(false);
        const [imagenFallida,setImagenFallida]=useState(!esGifValido(item.ejercicios.url_video));
        const [Fase,setFase]=useState('ejercicio');//Definimos el estado de la fase de cada uno de lños ejercicios,que después se utilizará para definir el tiempo de descanso y el tiempo de ejercicio,ya que cada uno de los ejercicios tiene un tiempo de ejercicio y un tiempo de descanso,por lo tanto,es importante definir la fase de cada uno de los ejercicios para poder mostrar el tiempo restante de cada uno de los ejercicios correctamente

        const ref=useRef(null);
        //Definimos los hooks,que definiran tiempo,ejecución e intervalo de tiempo de cada uno de los ejercicios
       useEffect(()=>{
            if(ejecutando){
                 ref.current=setInterval(()=>{
                      setTiempo((prevTiempo)=>{
                         if(prevTiempo<=1){
                                clearInterval(ref.current);setEjecutando(false); return 0;
                                //En el casode que el intervalko sea menor a 0,limpiamos el intervalo y pasará a ser "0",ya que el tiempo negativo no existe

                                }
                                return prevTiempo-1;
                                //Y vamos restando el tiempo cada segundo,para mostrar el tiempo restante de cada uno de los ejercicios
                         }

                      );
                 },1000);
            }
            else{
                 clearInterval(ref.current);
            }
            return()=>{
                 clearInterval(ref.current);
            }
         },[ejecutando])
         //Vamos a usar otro useEffect para definr la lógica del tiempo de descanso,la vamos a definir en diferentes fases
         useEffect(()=>{
                if(tiempo===0 ){
                        //Vamos a limpiar el intervalo de tiempo,para que no siga restando el tiempo,cuando sea igual a 0
                                clearInterval(ref.current);
                                if(Fase==='ejercicio'){
                                        setFase('descanso');
                                        setTiempo(item.duracion_descanso);
                                        setTimeout(()=>setEjecutando(true),1000);
                                        //El tiempo de descanso descendera después de 1 segundo

                                        //En el caso de que el tiempo sea igual a 0 y la fase sea "ejercicio",pasaremos a la fase de descanso,definiremos el tiempo de descanso y empezaremos a ejecutar el intervalo de tiempo para mostrar el tiempo restante de cada uno de los ejercicios
                                }
                                else if(Fase==='descanso'){
                                        setFase('Finalizado el tiempo de descanso')
                                        onCompletado();

                        //En el caso de que el tiempo sea igual a 0 y la fase sea "descanso",pasaremos a la fase de ejercicio,definiremos el tiempo de ejercicio y empezaremos a ejecutar el intervalo de tiempo para mostrar el tiempo restante de cada uno de los ejercicios
                 }


                }
         },[tiempo,Fase])
         const formatoTiempo=(tiempo)=>{
             //definimos el formato de tiempo que va a ser de minutos
             const minutos=Math.floor(tiempo/60);//Aquí vamos a definir el formato en minutos
             const segundos=tiempo%60;
                return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
                //Definimos el formato de tiempo que va a ser de minutos y segundos,para que se muestre correctamente el tiempo restante de cada uno de los ejercicios
         }
         //Una vez que hayamos definido el formato de tiempo,lo podemos mostrar en el card sin problema,ya que el formato de tiempo se va a ir actualizando cada segundo,para mostrar el tiempo restante de cada uno de los ejercicios
         const color=categoriaColor(item.ejercicios.categoria);
         return(
                <View style={styles.card}>
      <View style={styles.imageWrapper}>
        {imagenFallida ? (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="boxing-glove" size={40} color={COLORS.textMuted}/>
            <Text style={styles.imagePlaceholderText}>Gif no disponible todavía</Text>
          </View>
        ) : (
          <Image
             source={{ uri: item.ejercicios.url_video }}
             style={styles.video}
             contentFit="contain"
             transition={200}
             onError={()=>setImagenFallida(true)}
          />
        )}
        <View style={[styles.categoryBadge,{ borderColor:color }]}>
          <Text style={[styles.categoryBadgeText,{ color }]}>{item.ejercicios.categoria}</Text>
        </View>
      </View>
      <Text style={styles.nombre}>{item.ejercicios.nombre}</Text>
      <Text style={styles.meta}>{formatoTiempo(item.duracion_ejercicio)} ejercicio  ·  {item.duracion_descanso}s descanso</Text>
      <Text style={styles.descripcion}>{categoriaDescripcion(item.ejercicios.categoria)}</Text>
         {Fase === 'ejercicio' && tiempo > 0 &&
         <Button title={ejecutando ? `Detener ${formatoTiempo(tiempo)}` : `Iniciar  ${formatoTiempo(item.duracion_ejercicio)}`} onPress={() => setEjecutando(!ejecutando)}
          style={styles.startButton}
          />
         }

         {Fase === 'descanso' && tiempo > 0 ? (
                <Text style={styles.CronometroDesanso}>Tiempo de descanso: {formatoTiempo(tiempo)}</Text>


         ) : null}
         {Fase === 'Finalizado el tiempo de descanso' ? (
                <Text style={styles.message}>¡Tiempo de descanso finalizado! Prepárate para el siguiente ejercicio.</Text>
         ) : null}



    </View>
         )
}

const styles=StyleSheet.create({
        card:{
                backgroundColor:COLORS.surface,
                borderRadius:RADIUS.xl,
                padding:SPACING.md,
                marginBottom:SPACING.lg,
                borderColor:COLORS.border,
                borderWidth:1,
                ...shadow('rgba(0,0,0,0.5)',0.5,10,5,{width:0,height:2}),
        },
         imageWrapper:{
                width:'100%',
                aspectRatio:1,
                borderRadius:RADIUS.xl,
                marginBottom:SPACING.md,
                backgroundColor:COLORS.white,
                borderWidth:1,
                borderColor:COLORS.border,
                overflow:'hidden',
                position:'relative',
                ...shadow(COLORS.primaryGlow,0.35,14,6,{width:0,height:4}),
        },
        video:{
                width:'100%',
                height:'100%',
        },
        imagePlaceholder:{
                width:'100%',
                height:'100%',
                justifyContent:'center',
                alignItems:'center',
                gap:SPACING.sm,
                backgroundColor:COLORS.surfaceAlt,
        },
        imagePlaceholderText:{
                fontSize:12,
                fontWeight:'600',
                color:COLORS.textMuted,
                letterSpacing:0.3,
        },
        categoryBadge:{
                position:'absolute',
                top:SPACING.sm,
                left:SPACING.sm,
                backgroundColor:'rgba(10,10,10,0.85)',
                borderWidth:1,
                paddingHorizontal:SPACING.sm,
                paddingVertical:4,
                borderRadius:RADIUS.pill,
        },
        categoryBadgeText:{
                fontSize:11,
                fontWeight:'800',
                letterSpacing:1,
                textTransform:'uppercase',
        },
        nombre:{
                fontSize:20,
                fontWeight:'800',
                marginBottom:4,
                letterSpacing:0.3,
                 color:COLORS.textPrimary,
        },
        meta:{
                fontSize:13,
                fontWeight:'600',
                color:COLORS.textSecondary,
                marginBottom:SPACING.sm,
                letterSpacing:0.3,
        },
        descripcion:{
                fontSize:13,
                fontWeight:'400',
                color:COLORS.textSecondary,
                lineHeight:19,
                marginBottom:SPACING.md,
        },
        startButton:{
                borderRadius:RADIUS.pill,
        },
        message:{
               fontSize: 14,
               fontWeight: '700',
               color: COLORS.success,
               borderColor: COLORS.success,
               borderWidth: 1,
               padding: SPACING.md,
               borderRadius: RADIUS.md,
               textAlign: 'center',
               marginTop: SPACING.md,
               letterSpacing: 0.5,
        },
        CronometroDesanso:{
              fontSize: 15,
              fontWeight: '700',
              color: COLORS.info,
              textAlign: 'center',
              letterSpacing: 3,
              marginVertical: SPACING.md,
        },
})
export default EjercicioCard;
