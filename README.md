Tu Rincón Online

Este repositorio contiene datos en formato JSON para un sistema ficticio de e-commerce llamado "Tu Rincón Online", que comercializa artículos tecnológicos.

📂 Estructura de archivos

usuarios.json → datos de usuarios registrados.

productos.json → información de los productos disponibles.

ventas.json → registro de ventas realizadas, vinculando usuarios y productos.

🔗 Relaciones

ventas.json referencia a usuarios.json mediante el campo id_usuario.

ventas.json referencia a productos.json mediante el campo id dentro del arreglo productos.

***Como usar el proyecto***

1- Clonar el repositorio.

2- Ejecutar el comando "npm i" en la ubicacion del proyecto.

3- Ejecutar "npm run dev" para iniciar el servidor. El puerto de especifica en la consola.

***Rutas***

GET
/productos --> devuelve todos los productos
/productos/:desde/:hasta --> devuelve los productos en el rango de precios 

POST
/cargarUsuario --> carga un nuevo usuario
JSON --> {  "nombre": "",
            "apellido": "",
            "email": "",
            "contrasena": ""
         }
/login --> ingreso de un usuario ya cargado
JSON --> {
            "email": "",
            "contrasena": ""
         }

PUT
/productos/actualizarprecio --> actuliza el precio de un producto
JSON --> {
            id: ,
            precio: 
         }

DELETE
/productos/eliminar/:id --> elimina el producto con ese id. Solo lo hace si el producto existe
                            y ademas no hay ventas pendiente de entrega con ese producto.