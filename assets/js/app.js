const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

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

  buscarImagenes(terminoBusqueda);
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
      'rounded',
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

function buscarImagenes(termino) {
  const API_KEY = '51790780-568add8266b034c13b6f4e4bb';
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${termino}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      mostrarImagenes(data.hits);
    });
}

function formatearVistas(numero) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function mostrarImagenes(imagenes) {
  console.log(imagenes);
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

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
        </div>
      </div>
    </div>
    `;
  });
}
