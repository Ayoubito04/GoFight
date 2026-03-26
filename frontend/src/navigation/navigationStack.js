//Aquí vamos a definir la navegación de paginas
import {NavigationContainer} from '@react-navigation/native';//Es el contenedor de navegación
import {createNativeStackNavigator} from '@react-navigation/native-stack';//Es el stack de navegación,que nos permite definir las pantallas de navegación,y sus rutas en el frontend
import Register from '../screens/Register';//importamos la pantalla de registro
import Login from '../screens/Login';//importamos la pantalla de login
import Home from '../screens/Home';//importamos la pantalla de inicio
import Rutinas from '../screens/Rutinas';//importamos la pantalla de rutinas
import Ejercicios from '../screens/ejercicios';//importamos la pantalla de ejercicios

//Vale ccon eso ya podremos definir el contendor de navegación
//Vamos a definir las pantallas de navegación

const Stack=createNativeStackNavigator();

const NavigationStack=()=>{
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='register' component={Register} options={{headerShown:false}}/>
                <Stack.Screen name='login' component={Login} options={{headerShown:false}}/>
                <Stack.Screen name='home' component={Home} options={{headerShown:false}}/>
                <Stack.Screen name='Rutinas' component={Rutinas} options={{headerShown:false}}/>
                <Stack.Screen name='Ejercicios' component={Ejercicios} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export {NavigationStack}