// Configuración de credenciales de Supabase
const SUPABASE_URL = 'https://fxbtxpfuqoldxhlphscg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EDsaz26-S_G2T2TwPYC2gg_UuswGLCE';

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variable global para almacenar los registros y filtrar en memoria
let listaVideojuegos = [];

// Referencias a elementos del DOM
const tbody = document.getElementById('tbody-contenido');
const inputBusqueda = document.getElementById('input-busqueda');

// Función para renderizar dinámicamente los registros en la tabla
function mostrarVideojuegos(datos) {
  tbody.innerHTML = '';

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: #94a3b8;">No se encontraron registros coincidentes.</td></tr>';
    return;
  }

  // Creación dinámica de filas mediante manipulación del DOM
  datos.forEach(juego => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${juego.id}</td>
      <td><strong>${juego.titulo}</strong></td>
      <td>${juego.genero}</td>
      <td>${juego.plataforma}</td>
      <td>${juego.año_lanzamiento}</td>
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

    listaVideojuegos = data;
    mostrarVideojuegos(listaVideojuegos);

  } catch (err) {
    console.error('Error al consultar Supabase:', err.message);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444;">Error al cargar datos: ${err.message}</td></tr>`;
  }
}

// Event listener para capturar texto en tiempo real y filtrar con .filter()
inputBusqueda.addEventListener('input', (e) => {
  const textoBusqueda = e.target.value.toLowerCase().trim();

  const resultadosFiltrados = listaVideojuegos.filter(juego => 
    juego.titulo.toLowerCase().includes(textoBusqueda) ||
    juego.genero.toLowerCase().includes(textoBusqueda)
  );

  mostrarVideojuegos(resultadosFiltrados);
});

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarVideojuegos);
