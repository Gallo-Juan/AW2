Tu Rincón Online

Este repositorio contiene datos en formato JSON para un sistema ficticio de e-commerce llamado "Tu Rincón Online", que comercializa artículos tecnológicos.

📂 Estructura de archivos

usuarios.json → datos de usuarios registrados.

productos.json → información de los productos disponibles.

ventas.json → registro de ventas realizadas, vinculando usuarios y productos.

🔗 Relaciones

ventas.json referencia a usuarios.json mediante el campo id_usuario.

ventas.json referencia a productos.json mediante el campo id dentro del arreglo productos.

🚀 Próximos pasos

Estos datos se utilizarán en entregas posteriores
