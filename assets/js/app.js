const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener('submit', validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector('#termino').value;

  if (terminoBusqueda === '') {
    mostrarAlerta('¡Debes agregar un término de búsqueda!');
    return;
  }

  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector('.bg-red-200');

  if (!existeAlerta) {
    const alerta = document.createElement('p');
    alerta.classList.add(
      'bg-red-200',
      'border',
      'border-red-400',
      'text-red-700',
      'px-4',
      'py-3',
      'rounded-lg',
      'max-w-lg',
      'mx-auto',
      'mt-6',
      'text-center',
      'font-medium'
    );

    alerta.innerHTML = `
    <span class="block sm:inline">${mensaje}</span>
  `;
    formulario.appendChild(alerta);
    setTimeout(() => alerta.remove(), 2500);
  }
}

function buscarImagenes() {
  const termino = document.querySelector('#termino').value;

  const API_KEY = '51790780-568add8266b034c13b6f4e4bb';
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      totalPaginas = calcularPaginas(data.totalHits);
      mostrarImagenes(data.hits);
    });
}

function formatearVistas(numero) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return Math.ceil(total / registrosPorPagina);
}

function mostrarImagenes(imagenes) {
  limpiarHTML(resultado);

  // Iterar sobre las imagenes
  imagenes.forEach(imagen => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w1/3 lg:w-1/4 p-3">
      <div class="bg-white rounded-lg">
        <img class="w-full rounded-t-lg" src="${previewURL}" />

        <div class="p-4">
          <p class="font-bold"> ${likes} <span class="font-light"> Me gusta</span></p>
          <p class="font-bold"> ${formatearVistas(views)} <span class="font-light"> Vistas</span></p>

          <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="block w-full text-white text-center font-medium bg-blue-700 hover:bg-blue-500 rounded-lg mt-5 p-2 duration-200 ease-in-out">Ver Imagen</a>
        </div>
      </div>
    </div>
    `;
  });

  // Limpiar el paginador previo
  limpiarHTML(paginacionDiv);

  imprimirPaginador();
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    // Sino, genera un botón por cada elemento en el generador
    const boton = document.createElement('a');
    boton.href = '#';
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      'siguiente',
      'bg-yellow-400',
      'px-4',
      'py-1',
      'mr-2',
      'font-bold',
      'mb-4',
      'rounded-lg',
      'cursor-pointer',
      'hover:bg-yellow-300',
      'duration-200',
      'ease-in-out'
    );

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };

    paginacionDiv.appendChild(boton);
  }
}
