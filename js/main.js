'use strict'
import { GastosCombustible } from './GastoCombustible.js';

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = './json/tarifasCombustible.json';
let gastosJSONpath = './json/gastosCombustible.json';
//Creamos el array con los gastos anuales como variable global
let aniosArray;

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // Inicializamos el array asociativo con clave=año y valor=gasto total
    aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    // Recorremos el array de gastos y lo sumamos en el array que acabamos de crear.
    gastosJSON.forEach(gastosJSON => {
        // Extraer el año de la fecha del viaje
        let anio = new Date(gastosJSON.date).getFullYear();
        // Sumar el precio del viaje al año correspondiente
        if (aniosArray[anio] !== undefined) {
            aniosArray[anio] += gastosJSON.precioViaje;
        }
    });

    //Actualizamos los datos del HTML
    for (let year in aniosArray) {
        document.getElementById(`gasto${year}`).innerText = aniosArray[year].toFixed(2);
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    // Buscamos en el array de la tarifas por anio, el primer elemento cuyo anio coincida
    // con el anio de la fecha del gasto que se introduce en el form. Para ello usamos el método find().
    const tarifaAnio = tarifasJSON.tarifas.find(anio => anio.anio === fecha.getFullYear())
    
    // Una vez localizado el elemento que corresponde al anio del gasto, guardamos la tarifa correspondiente al tipo de vehiculo de ese anio
    var tarifa = tarifaAnio.vehiculos[tipoVehiculo];

    // Creamos un objeto con los datos y lo mostramos en el HTML mediante el método convertToJSON()
    var gasto = new GastosCombustible(tipoVehiculo, fecha, kilometros, tarifa)
    //document.getElementById(`expense-list`).innerText = gasto.convertToJSON();
    var gastoItem = document.createElement('li');
    gastoItem.innerText = gasto.convertToJSON(); // Asumiendo que convertToJSON devuelve una representación legible del gasto
    document.getElementById(`expense-list`).appendChild(gastoItem);

    
    // Actualizamos el array de gastos por anio que hemos creado como variable global y actualizamos el HTML para el anio que corresponda.
    aniosArray[fecha.getFullYear()] += gasto.precioViaje;
    document.getElementById(`gasto${fecha.getFullYear()}`).innerText = aniosArray[fecha.getFullYear()].toFixed(2);

    //Volvemos a poner el formulario en blanco
    document.getElementById('fuel-form').reset();
}

