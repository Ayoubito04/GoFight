# Como puedes inicializar el backend

# 1.Instalar dependencias

con npm install dentro de /backend,instalas todas las dependencias necesarias para el backend

# 2.Crea la base de datos y el .env

Crea una base de datos en postgre llamada "GoFight_DB" y creas el archivo .env,que se encontrará a la raiz de la carpeta /backend,aquí introduciras la url que es DATABASE_URL="postgresql://postgre:<Tu contreña de la base de datos>@localhost:5432/GoFight_DB"

# 3.Migrar las tablas a la base de datos que has creado

Después te toca migrar las tablas a tu base de datos,mediante 'npx prisma migrate dev --name init' dentro de /backend (En el caso hipotetico de que ya tengas la BD y las tablas simplemente con 'npx prisma generate' es suficiente)

# 4.generar cliente de prisma

Una vez que hayas migrado todas las tablas en el /backend,toca generarlas mediante 'npx prisma generate' una vez que ya tengas todas las tablas migradas,felicidades ya podras acceder a la BD y hacer consultas SQL

# 5 Generar el Usuario admin(importante para pruebas)

parctica fundamental:Una vez que lo tengas todo coinectado vete a /backend/src/seeds y dale al comando 'node UserAdmin.js',esto va inicializar el usuario administrador de la BD

# 6 Crea el servidor local con node.js

por ultimo vuelve a /backend y incializa el servidor con 'node index.js' y abre la http://localhost:3000,que es el puerto que le hemos asignado

# Acceder al estudio de la base de datos

Si quieres ver el studio de la base de datos,es con 'npx prisma studio',podras consultar todas las tablas y podrás modificar de manera manual cada uno de los datos

# "¿Cómo es la base de datos?"

La BD de datos es relacional y consta de varias tablas:usuarios,ejercicios,rutinas,gamificaciones,sesiones y también tablas intermedias como rutina_ejercicio,que almacena tanto el id de las rutinas,como el id de los ejercicios

En la tabla de usuarios se almacena principalmente el nombre,apellidos,contraseña,rol de usuario,el perfil y las rutinas asignadas al usuario,ya que la relación entre rutinas y usuarios es de 1:N,por tanto es una relación de muchos a uno.

En ejercicios se almacena lo que es el nombre del ejercicio,su categoria(pera,manoplas,cardio,comba,saco) en forma de de Enum y también la url del video,que vamos a asignar a cada uno de los ejercicios

En rutinas almacenamos el id de la rutina,id del usuario,nombre de la rutina,los ejercicios que se asignaran a la rutina,el nivel de dificultad(Facil,intermedio y Avanzado),también rutinas_ejercicios(tabla intermedia de la relación N:M),donde se destaca el id de cada ejercicio,el tiempo de descanso entre series o ejercicios,tiempo de cada uno de los ejercicios y el orden.También se destaca las sesiones,que guarda una relación 1:N,por tanto cada sesión tiene varias rutinas,pero cada rutina depende de una única sesión."Qué se almacenará en sesiones",pues los puntos del ranking,ya que la app contará con un modo ranking para fomentar una competición sana entre los diferentes usuarios,también se destaca que habrá una racha,si se pierde una sesión o al usuario se le olvida registrar esa sesión se dara como rutina no completada y por tanto,perderá la racha.

# Herramientas necesarias:

1.Una base de datos en pgadmin
2.Tener el Insomnia o postman para las pruebas a la base de datos
3.Deberías tener la API key de Cloudinary para insertar fotos de cualquier formato y videos
4.Prisma es como el cerebro de la operación,para generar el cliente y para el ORM
5.jsonwebtoken para poder generar tokens a la hora de logearte y permitir una autenticación de usuario
