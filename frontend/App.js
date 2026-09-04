
//El useEffect es un hook de react que nos permite ejecutar una función cada vez que el cpmponente se renderiza o cada vez que cambia,ideal para hacer conexiones con  APIds
import {NavigationStack} from './src/navigation/navigationStack';
import {ToastProvider} from './src/components/Toast';


//Envolvemos toda la app con el ToastProvider,para que cualquier pantalla pueda lanzar avisos con el estilo de GoFight
export default function App() {
   return (
    <ToastProvider>
      <NavigationStack />
    </ToastProvider>
   )
}
