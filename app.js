// Configuración de credenciales de Supabase
const SUPABASE_URL = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variable global para almacenar todos los registros obtenidos y filtrar sin consultar de nuevo a la BD
let listaVideojuegos = [];

// Referencias a elementos del DOM
const tbody = document.getElementById('tbody-contenido');
const inputBusqueda = document.getElementById('input-busqueda');

// Función para renderizar dinámicamente un arreglo de videojuegos en la tabla
function mostrarVideojuegos(datos) {
  tbody.innerHTML = '';

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: #94a3b8;">No se encontraron registros coincidentes.</td></tr>';
    return;
  }

  // Generación completa y dinámica de filas mediante manipulación del DOM (cero filas estáticas en HTML)
  datos.forEach(juego => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${juego.id}</td>
      <td><strong>${juego.titulo}</strong></td>
      <td>${juego.genero}</td>
      <td>${juego.plataforma}</td>
      <td>${juego.anio_lanzamiento}</td>
      <td><span class="badge">★ ${juego.calificacion}</span></td>
    `;
    tbody.appendChild(fila);
  });
}

// Función principal para obtener datos desde Supabase
async function cargarVideojuegos() {
  try {
    const { data, error } = await supabaseClient
      .from('videojuegos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    listaVideojuegos = data; // Guardamos en memoria para filtrar rápido
    mostrarVideojuegos(listaVideojuegos);

  } catch (err) {
    console.error('Error al consultar Supabase:', err.message);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444;">Error al cargar datos: ${err.message}</td></tr>`;
  }
}

// Event listener para escuchar en tiempo real lo que escribe el usuario
inputBusqueda.addEventListener('input', (e) => {
  const textoBusqueda = e.target.value.toLowerCase().trim();

  // Uso del método .filter() para buscar por título (o género si se desea)
  const resultadosFiltrados = listaVideojuegos.filter(juego => 
    juego.titulo.toLowerCase().includes(textoBusqueda) ||
    juego.genero.toLowerCase().includes(textoBusqueda)
  );

  // Volver a renderizar la tabla dinámicamente con los resultados filtrados
  mostrarVideojuegos(resultadosFiltrados);
});

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarVideojuegos);