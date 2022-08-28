const express = require('express');
const mysql = require('mysql');
const { json } = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

//Establecemos los prámetros para la conexión a la DB
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'softtech_db',
});

//Conexión a la database
conexion.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log('¡The connection to DB was sucessfully!');
  }
});

app.get('/', function (req, res) {
  res.send('INICIO');
});

//Mostrar todos los artículos
app.get('/api/articulos', (req, res) => {
  conexion.query('SELECT * FROM articulos', (error, filas) => {
    if (error) {
      throw error;
    } else {
      res.send(filas);
    }
  });
});

//Mostrar un SOLO artículo
app.get('/api/articulos/:id', (req, res) => {
  conexion.query(
    'SELECT * FROM articulos WHERE id = ?',
    [req.params.id],
    (error, fila) => {
      if (error) {
        throw error;
      } else {
        res.send(fila);
      }
    }
  );
});

//Crear un artículo
app.post('/api/articulos', (req, res) => {
  let data = {
    descripcion: req.body.descripcion,
    color: req.body.color,
    capacidad: req.body.capacidad,
    categoria: req.body.categoria,
    precio: req.body.precio,
    stock: req.body.stock,
  };
  let sql = 'INSERT INTO articulos SET ?';
  conexion.query(sql, data, function (err, result) {
    if (err) {
      throw err;
    } else {
      Object.assign(data, { id: result.insertId }); //agregamos el ID al objeto data
      res.send(data); //enviamos los valores
    }
  });
});

//Editar articulo
app.put('/api/articulos/:id', (req, res) => {
  let id = req.params.id;
  let descripcion = req.body.descripcion;
  let color = req.body.color;
  let capacidad = req.body.capacidad;
  let categoria = req.body.categoria;
  let precio = req.body.precio;
  let stock = req.body.stock;
  let sql =
    'UPDATE articulos SET descripcion = ?, color = ?, capacidad = ?, categoria = ?, precio = ?, stock = ? WHERE id = ?';
  conexion.query(
    sql,
    [descripcion, color, capacidad, categoria, precio, stock, id],
    function (error, results) {
      if (error) {
        throw error;
      } else {
        res.send(results);
      }
    }
  );
});

//Eliminar articulo
app.delete('/api/articulos/:id', (req, res) => {
  conexion.query(
    'DELETE FROM articulos WHERE id = ?',
    [req.params.id],
    function (error, filas) {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
});

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function () {
  console.log('Server Ok on port: ' + puerto);
});
