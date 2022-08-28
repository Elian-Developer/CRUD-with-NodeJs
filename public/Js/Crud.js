//Definición de variables a utilizar
const url = 'http://localhost:3000/api/articulos/';
const contenedor = document.querySelector('tbody');
let resultados = '';

const modalArticulo = new bootstrap.Modal(
  document.getElementById('modalArticulo')
);
const formArticulo = document.querySelector('form');
const descripcion = document.getElementById('descripcion');
const color = document.getElementById('color');
const capacidad = document.getElementById('capacidad');
const categoria = document.getElementById('categoria');
const precio = document.getElementById('precio');
const stock = document.getElementById('stock');
var opcion = '';

btnCrear.addEventListener('click', () => {
  descripcion.value = '';
  color.value = '';
  capacidad.value = '';
  categoria.value = '';
  precio.value = '';
  stock.value = '';
  modalArticulo.show();
  opcion = 'crear';
});

//funcion para mostrar los resultados
const mostrar = (articulos) => {
  articulos.forEach((articulo) => {
    resultados += `<tr>
                            <td>${articulo.id}</td>
                            <td>${articulo.descripcion}</td>
                            <td>${articulo.color}</td>
                            <td>${articulo.capacidad}</td>
                            <td>${articulo.categoria}</td>
                            <td>${articulo.precio}</td>
                            <td>${articulo.stock}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar
                            <i class="bi bi-pencil-square"></i></a>
                            <a class="btnBorrar btn btn-danger">Borrar
                            <i class="bi bi-trash-fill"></i> </a>
                            </td>
                       </tr>
                    `;
  });
  contenedor.innerHTML = resultados;
};

//Procedimiento Mostrar
fetch(url)
  .then((response) => response.json())
  .then((data) => mostrar(data))
  .catch((error) => console.log(error));

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  alertify.confirm(
    'This is a confirm dialog.',
    function () {
      fetch(url + id, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => location.reload());
    },
    function () {
      alertify.error('Cancel');
    }
  );
});

//Procedimiento Editar
let idForm = 0;
on(document, 'click', '.btnEditar', (e) => {
  const fila = e.target.parentNode.parentNode;
  idForm = fila.children[0].innerHTML;
  const descripcionForm = fila.children[1].innerHTML;
  const colorForm = fila.children[2].innerHTML;
  const capacidadForm = fila.children[3].innerHTML;
  const categoriaForm = fila.children[4].innerHTML;
  const precioForm = fila.children[5].innerHTML;
  const stockForm = fila.children[6].innerHTML;
  descripcion.value = descripcionForm;
  color.value = colorForm;
  capacidad.value = capacidadForm;
  categoria.value = categoriaForm;
  precio.value = precioForm;
  stock.value = stockForm;
  opcion = 'editar';
  modalArticulo.show();
});

//Procedimiento para Crear 
formArticulo.addEventListener('submit', (e) => {
  e.preventDefault();
  if (opcion == 'crear') {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descripcion: descripcion.value,
        color: color.value,
        capacidad: capacidad.value,
        categoria: categoria.value,
        precio: precio.value,
        stock: stock.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const nuevoArticulo = [];
        nuevoArticulo.push(data);
        mostrar(nuevoArticulo);
      });
  }

  if (opcion == 'editar') {
    fetch(url + idForm, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descripcion: descripcion.value,
        color: color.value,
        capacidad: capacidad.value,
        categoria: categoria.value,
        precio: precio.value,
        stock: stock.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => location.reload());
  }
  modalArticulo.hide();
});
