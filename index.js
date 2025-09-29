import express from 'express'
import dotenv from 'dotenv'
import {readFile, writeFile} from 'fs/promises'

dotenv.config()

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.listen(port,()=>{
    console.log(`Servidor levantado en el puerto ${port}`)
})

//Leo el archivo y lo guardo en una constante
const fileProductos=await readFile('./Data/productos.json','utf-8')
const productoData=JSON.parse(fileProductos)

const fileUsuarios=await readFile('./Data/usuarios.json','utf-8')
const usuarioData=JSON.parse(fileUsuarios)

const fileVentas=await readFile('./Data/ventas.json','utf-8')
const ventasData=JSON.parse(fileVentas)

//GET que devuelve todos los productos
app.get('/productos',(req,res)=>{
    if(productoData){
        res.status(200).json(productoData)
    }
    else{
        res.status(400).json('ERROR')
    }
})

//GET que devuelve los productos con precio entre los valores desde y hasta
app.get('/productos/:desde/:hasta',(req,res)=>{
    const desde=req.params.desde
    const hasta=req.params.hasta
    const result=productoData.filter(e=>e.precio>=desde&&e.precio<=hasta)
    if(result){
        res.status(200).json(result)
    }else{
        res.status(400).json('Error')
    }
})

//POST para cargar usuario nuevo
app.post('/cargarUsuario', async (req, res) => {
    try {
        const usuNuevo = {
            id: usuarioData.length +1,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            contrasena: req.body.contrasena
        }

        // Agrego al array en memoria
        usuarioData.push(usuNuevo)

        // Escribo el JSON actualizado en el archivo
        await writeFile('./Data/usuarios.json', JSON.stringify(usuarioData, null, 2))

        // Respuesta exitosa
        res.status(200).json("Usuario agregado correctamente")
    } catch (err) {
        console.error(err)
        res.status(500).json("No se pudo guardar el usuario")
    }
})

//POST para "login" de usuario
app.post('/login', (req, res) => {
    const email = req.body.email;
    const contrasena=req.body.contrasena

    if (!email || !contrasena) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Buscar usuario que coincida con email y contraseña
    const usuario = usuarioData.find(e => e.email === email && e.contrasena === contrasena);

    if (usuario) {
        res.status(200).json("Login exitoso")
    }else{
         res.status(400).json({ error: "Email o contraseña incorrectos" });
    }
});

//PUT para actualizar precio de un producto
app.put('/productos/actualizarprecio',async (req,res)=>{
    const id=req.body.id
    const precio=req.body.precio

    if (!id || !precio) {
        return res.status(400).json({ error: "Faltan datos: id y precio son obligatorios" });
    }

    // Busco el producto
    const producto = productoData.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Actualizo el precio
    producto.precio = precio;

    try {
        // Escribo el JSON actualizado
        await writeFile('./Data/productos.json', JSON.stringify(productoData, null, 2));
        res.status(200).json({ mensaje: "Precio actualizado correctamente", producto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al guardar los cambios" });
    }

})

//DELETE para eliminar productos solo si las ventas que tienen ya fueron entregadas
app.delete('/productos/eliminar/:id', async (req, res) => {
  const id = parseInt(req.params.id); 

 
  const indexProducto = productoData.findIndex(p => p.id === id);
  if (indexProducto === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  
  const ventasConProducto = ventasData.filter(v => v.productos.includes(id));

 
  if (ventasConProducto.length === 0) {
    productoData.splice(indexProducto, 1);
    try {
      await writeFile('./Data/productos.json', JSON.stringify(productoData, null, 2));
      return res.status(200).json({ mensaje: "Producto eliminado correctamente (sin ventas)" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al guardar cambios en productos" });
    }
  }

  
  const hayPendiente = ventasConProducto.some(v => v.entregado !== true);
  if (hayPendiente) {
    return res.status(400).json({
      error: "No se puede eliminar el producto, tiene ventas sin entregar"
    });
  }

  
  const ventasFiltradas = ventasData.map(v => ({
    ...v,
    productos: v.productos.filter(pid => pid !== id) 
  }));

  try {
    
    await writeFile('./Data/ventas.json', JSON.stringify(ventasFiltradas, null, 2));

    productoData.splice(indexProducto, 1);
    await writeFile('./Data/productos.json', JSON.stringify(productoData, null, 2));

    return res.status(200).json({
      mensaje: "Producto y sus ventas entregadas eliminados correctamente"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al guardar cambios en productos o ventas" });
  }
});

