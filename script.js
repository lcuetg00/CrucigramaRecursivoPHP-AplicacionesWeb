//Variables declaradas
var numPistas=3; //pistas restantes
var guardarDatosVar=true; //variable que controla si se pueden guardar datos en el almacenamiento local
var diccionario; //donde se cargara el diccionario online
var listaPalabras;
var solucion="";
var opcion=0;

//Posiciones para manipular la informacion en el formato en el que se guarda
const indexId=0;
const indexPistas=1;
const indexInfo=2;

async function fetchData() {
 return fetch('https://ordenalfabetix.unileon.es/aw/diccionario.txt')
  .then(response => response.text()
  .then(text => cargarDiccionario(text)));
}

function cargarDiccionario(datos){
 diccionario = new Array();
 diccionario = datos.split(/\r|\n/);
 console.log("Diccionario cargado");
}


function crearTabla() {
 const indexFila = 0;
 const indexColumna = 1;
 var body = document.body;
 //Creamos la tabla con las dimensiones pidiendolas a php


  $.when(
  $.ajax({
   type: "POST",
   url: "http://localhost/index.php",
   data: { 
    accion: 4,
    numCuestionario: opcion
   },
   success: function(dimension) {
    arrayDimension = dimension.split("x");
    var tabla = document.createElement("table");
    tabla.id="tabla";
    tabla.setAttribute("filas", arrayDimension[indexFila]);
    tabla.setAttribute("columna", arrayDimension[indexColumna]);
    tabla.style.width = "100px";
    tabla.style.border = "1px solid black";
    //Escribimos las pistas restandes
    let pistas= document.getElementById("numRestante");
    pistas.innerHTML="Pistas Restantes: "+numPistas;
    //Creamos las filas y celdas con imput texts del interior de la tabla
    for(let i=0;i<arrayDimension[indexFila];i++) {
     var tr = tabla.insertRow();
     for(let j=0;j<arrayDimension[indexColumna];j++) {
      let td= tr.insertCell();
      let textField = document.createElement("INPUT");
      textField.setAttribute("type", "text");
      textField.setAttribute("size", 1);
      textField.setAttribute("maxlength", 1);
      textField.setAttribute("fila", i);
      textField.setAttribute("columna", j);
      textField.setAttribute("id", i+"_"+j);
      textField.onblur= function(){verificarPalabra(this.getAttribute     ("fila"),this.getAttribute("columna"))};



      td.appendChild(textField);
      td.style.border = '1px solid black';
     }
    }
   //Aniado la tabla a la pagina
   body.appendChild(tabla);
   }
  }),
  $.ajax({
   type: "POST",
   url: "http://localhost/index.php",
   data: { 
    accion: 5,
    numCuestionario: opcion
   },
   success: function(output) {
    let arrayCeldas = new Array();
    arrayCeldas = output.split(" ");
    let arrayCeldasOcupadas = new Array();
    let arrayCeldasNumeros = new Array();
    arrayCeldasOcupadas = arrayCeldas[0].split(",");
    arrayCeldasNumeros = arrayCeldas[1].split(",");
    for(let i=0;i<arrayCeldasOcupadas.length;i++) {
     let textField = document.getElementById(arrayCeldasOcupadas[i]);
     textField.setAttribute("value", "X");
     textField.style.color="#0000ff";
     textField.setAttribute("readonly", true);
    }
    for(let i=0;i<arrayCeldasNumeros.length;i++) {
     let textField = document.getElementById(arrayCeldasNumeros[i]);
     textField.value=""+(i+1);
     textField.style.color="#ff0000";
    }
   }
  })
 ).then(function(){
 
 }) 

 fetchData();
}


function getPalabraFila(fila) {
 let tamanioColumnasMax = document.getElementById('tabla').getAttribute("columna");
 let palabra="";
 for(let i=0;i<tamanioColumnasMax;i++) {
  if(!(document.getElementById(fila+"_"+i).readOnly)) {
   palabra += document.getElementById(fila+"_"+i).value;
  }
 }
 return palabra
}

function verificarPalabraCompuestaPorLaAnterior(fila) {
 let resultado=0;
 if(fila!=0) {
  let palabraAnterior = getPalabraFila(fila-1);
  let palabraActual = getPalabraFila(fila);
  let sinLetra1=0;
  let sinLetra2=0;
  if(palabraAnterior!="") {
   if(palabraAnterior.length == palabraActual.length) {
    let palabraSize = palabraAnterior.length;
    for(let i=0; i<palabraSize;i++) {
     if(!(palabraAnterior.includes(palabraActual.charAt(i)))) {
      sinLetra1++;
     }
     if(!(palabraActual.includes(palabraAnterior.charAt(i)))) {
      sinLetra2++;
     }
     if(sinLetra1==2 || sinLetra2==2) { //mas de una palabra repetida
      resultado=1;
     }
    }
   }
  }
 }
 return resultado;
}

function verificarPalabra(fila,columna) {
 if(opcion!=0) {
  console.log(fila);
  let palabraEnFila="";
  let palabraCompleta=true;
  let tamanioFilaMax = document.getElementById('tabla').getAttribute("filas");
  let tamanioColumnasMax = document.getElementById('tabla').getAttribute("columna");

  //Compruebo si la palabra esta completa, a la vez la recupero en la variable "palabraEnFila"
  for(let i=0;i<tamanioColumnasMax;i++) {
   if(!(document.getElementById(fila+"_"+i).readOnly)) {
    if(document.getElementById(fila+"_"+i).value!="") {
     console.log(document.getElementById(fila+"_"+i));
     palabraEnFila=palabraEnFila+document.getElementById(fila+"_"+i).value.toUpperCase();
     console.log(palabraEnFila);
    } else {
      palabraCompleta=false;
      break;
    }
   }
  }

  if(palabraCompleta==true) {
   let booleanPalabraFila=false;
   console.log("La palabra esta completa"); 
   
   let enDiccionario=false;
   if(booleanPalabraFila==false) {
    let tamanioDiccionario = diccionario.length;
    for(let i=0;i<tamanioDiccionario;i++) {
      if(diccionario[i]==palabraEnFila.toLowerCase()) {
       enDiccionario=true;
       break;
      }
    }
    }
      
    if(enDiccionario==false) {
      borrarFila(fila);
      alert("La palabra introducida no se incluye en el diccionario. Pruebe con otra");
    } 
   }
   //miro si es igual que la palabra anterior pero cambiando una letra
   let valor= verificarPalabraCompuestaPorLaAnterior(fila);
   if(valor==1) {
    alert("La palabra no es como la anterior pero modificandola");
    borrarFila(fila);
   }


   //añado todas las palabras:
   
  
   solucion="";
   for(let i=0; i<tamanioFilaMax;i++) {
    for(let j=0; j<tamanioColumnasMax;j++) {
     if(!(document.getElementById(i+"_"+j).readOnly)) {
      solucion=solucion+document.getElementById(i+"_"+j).value.toUpperCase();
     }
    }
    solucion=solucion+" ";
    espacios= numeroDeColumnasParaFila(i+1);
   }
   console.log(solucion);
  
  
 } else {
  alert("Seleccione un cuestionario en la lista para comenzar.");
 }

}



function recogerPalabras(letras) {
 if(numPistas>=1) {
  let arrayPalabras = new Array();
  let boolean=false;
  let tamanioDiccionario = diccionario.length;
  for(let i=0;i<tamanioDiccionario;i++) {
   if(letras.length==diccionario[i].length) {
    boolean=true;
    for(let j=0;j<letras.length;j++) {
     if(!(diccionario[i].includes(letras.charAt(j)))) {
      boolean=false;
      break;
     } 
     if(!(letras.includes(diccionario[i].charAt(j)))) {
      boolean=false;
      break;
     } 
    }
    if(boolean==true) {
     arrayPalabras.push(diccionario[i]);
    }
   }
  }
  return arrayPalabras;
 } else {  
  let pistasRest= document.getElementById("numRestante");
  pistasRest.innerHTML="Pistas: No quedan mas pistas <br>";
 }
}

function darPista(letras) {
 if(opcion!=0) {
  let pistasRest= document.getElementById("numRestante");
  let array=recogerPalabras(letras.toLowerCase());
  if(array != undefined) {
   for(let i=0;i<array.length;i++) {
    pistas.innerHTML+="Palabras pista"+numPistas+": "+array[i]+"<br>";
   }
   numPistas=numPistas-1;
   pistasRest.innerHTML="Pistas Restantes: "+numPistas+"<br>";
  }  
 } else {
  alert("Seleccione primero un crucigrama.");
 } 
}

function borrarFila(fila) {
 let tamanioColumnasMax = document.getElementById('tabla').getAttribute("columna");
 for(let i=0;i<tamanioColumnasMax;i++) {
  if(!(document.getElementById(fila+"_"+i).readOnly)) {
   document.getElementById(fila+"_"+i).value="";
  }
 }
}

function numeroDeColumnasParaFila(numFila) {
 if(numFila<6) {
  return 5;
 }
 if(numFila>=6) {
  return 7;
 }
}

function seleccionCuestionario(valor) {
 opcion=valor;
 document.getElementById("numCrucigrama").disabled = true;
 let huecoTexto= document.getElementById("palabrasResolver");
 let opciones= document.getElementById("opciones");

 $(document).ready(function(){
    $.ajax({
     type: "POST",
     url: "http://localhost/index.php",
     data: { 
       accion: 2,
       numCuestionario: opcion
     },
     success: function(textoCuestionario, status, jqXHR) {
       huecoTexto.innerHTML=textoCuestionario;
     }
   });
 });

 
 opciones.innerHTML="Identifique la primera palabra y la última de cada bloque con las pistas que se dan. A continuación , trate de descubrir las palabras intermedias. Para lograrlo, cambie una letra de la primera palabra para obtener la próxima y, después, altere el orden de una o varias letra para encontrar la siguiente. Siga así, sucesivamente hasta que logre completar ambos casilleros. Todas las palabras intermedias deben tener significado.";

 crearTabla(); 
 if(localStorage.getItem("numeroCuestionariosGuardados") != null) {
  let numeroCuestionariosGuardados ="Número de cuestionarios guardados: " + localStorage.getItem("numeroCuestionariosGuardados")+"<br>";
  document.getElementById("numGuardados").innerHTML = numeroCuestionariosGuardados;
 }
}


function permitirGuardarDatos() {
 guardarDatosVar = confirm("¿Quiere guardar datos sobre crucigrama en el equipo?");
 if(guardarDatosVar==true) {
  alert("Has dado permiso para poder guardar los datos del crucigrama");
 } else { 
  alert("No has dado permiso para poder guardar los datos del crucigrama");
 }
 if(guardarDatosVar==true) {
   //cargarDatos();
 }
}

function guardarDatos() {
 if(opcion!=0) {
  console.log("Guardando datos");
  if(guardarDatosVar) {
    guardar();
  } else {
      alert("Ha seleccionado que no quería guardar datos en el almacenamiento local, si prefiere guardarlos recargue la pagina y seleccione \"Aceptar\"");
  }
 } else {
  alert("Seleccione primero un crucigrama");
 }
}

function guardar() {
 let arrayDatos= new Array();
 let id;
 let numeroCuestionariosGuardados = localStorage.getItem("numeroCuestionariosGuardados");
 if(numeroCuestionariosGuardados == undefined) {
  numeroCuestionariosGuardados=0;
 } 
 id=numeroCuestionariosGuardados;
    
 arrayDatos.push(id);
 arrayDatos.push(numPistas);

  let tamanioFilaMax = document.getElementById('tabla').getAttribute("filas");
  let tamanioColumnasMax = document.getElementById('tabla').getAttribute("columna");
   for(let i=0; i<tamanioFilaMax;i++) {
    for(let j=0; j<tamanioColumnasMax;j++) {
     if(!(document.getElementById(i+"_"+j).readOnly)) {
      arrayDatos.push(document.getElementById(i+"_"+j).value);
     }
    }
   }
 if(numeroCuestionariosGuardados >=3) {
  alert("No puede guardar más estados, primero borrelos");
 } else {
  localStorage.setItem(opcion+" "+id.toString(),arrayDatos);
  numeroCuestionariosGuardados++;
  localStorage.setItem("numeroCuestionariosGuardados",numeroCuestionariosGuardados);
  alert("Se ha guardado este cuestionario");

  //actualizo el contador
  numeroCuestionariosGuardados ="Número de cuestionarios guardados: " + localStorage.getItem("numeroCuestionariosGuardados")+"<br>";
  document.getElementById("numGuardados").innerHTML = numeroCuestionariosGuardados;
 }
}

function guardarFichero() {
 let tamanioFilaMax = document.getElementById('tabla').getAttribute("filas");
 let tamanioColumnasMax = document.getElementById('tabla').getAttribute("columna");
 let palabrasGuardadas = "";
 for(let i=0; i<tamanioFilaMax;i++) {
  for(let j=0; j<tamanioColumnasMax;j++) {
   if(!(document.getElementById(i+"_"+j).readOnly)) {
    palabrasGuardadas= palabrasGuardadas + "" + document.getElementById(i+"_"+j).value;
   }
  }
 }
 let guardarPalabras= palabrasGuardadas.substring(0, palabrasGuardadas.length-1) + "\r\n";
  $(document).ready(function(){
  $.ajax({
   type: "POST",
   url: "http://localhost/index.php",
   data: { 
    accion: 6,
    numCuestionario: opcion,
    guardar: guardarPalabras
   },
   success: function(salida) {
    //alert(salida);
   }
  });
 });
}


function cargarDatos() {
 if(opcion!=0) {
  console.log("Cargando datos");
  let numGuardado= localStorage.getItem("numeroCuestionariosGuardados");
  try {
   if(numGuardado != undefined) {
    numGuardado=numGuardado-1;
    cargar(numGuardado);
   } 
  alert("Se ha cargado el ultimo cuestionario guardado");
  } catch (e) {
   alert("No hay ningun cuestionario guardado");
   console.log("No se ha podido restaurar los datos");
  }
 } else {
  alert("Seleccione primero un crucigrama");
 }
}

function cargar(num) {
 let item=localStorage.getItem(opcion+" "+num);
 if(item!=null) {
  let array = new Array();
  array= item.split(",");
  let index=0;
  numPistas=array[indexPistas];
  //se actualizan las pistas
  let pistas= document.getElementById("numRestante");
  pistas.innerHTML="Pistas Restantes: "+numPistas;

  let tamanioFilaMax = document.getElementById('tabla').getAttribute("filas");
  let tamanioColumnasMax = document.getElementById('tabla').getAttribute("columna");
   for(let i=0; i<tamanioFilaMax;i++) {
    for(let j=0; j<tamanioColumnasMax;j++) {
     if(!(document.getElementById(i+"_"+j).readOnly)) {
      document.getElementById(i+"_"+j).value=array[indexInfo+index];
      index=index+1;
     }
    }
   }
 } else {
  alert("No hay datos guardados para este crucigrama");
 }
}


function borrarDatos() {
 localStorage.clear();
 localStorage.setItem("numeroCuestionariosGuardados",0);
 alert("Se han borrado todos los crucigramas guardados");
 document.getElementById("numGuardados").innerHTML = "Número de cuestionarios guardados: " + localStorage.getItem("numeroCuestionariosGuardados")+"<br>";
}

//function borrarUltimo() {
 //let numeroCuestionariosGuardados = localStorage.getItem("numeroCuestionariosGuardados");
 //if(numeroCuestionariosGuardados==0 || numeroCuestionariosGuardados==null) {
     //alert("No se ha podido borrar el utlimo cuestionario ya que no quedan mas cuestionarios guardados")
 //} else {
  //let ultimoCuestionario=numeroCuestionariosGuardados-1;
  //console.log("Borrando el cuestionario"+ultimoCuestionario);
  //alert("Se ha borrado el ultimo crucigrama guardado")
  //localStorage.removeItem(ultimoCuestionario);
  //numeroCuestionariosGuardados=numeroCuestionariosGuardados-1;
  //localStorage.setItem("numeroCuestionariosGuardados",numeroCuestionariosGuardados);
  //numeroCuestionariosGuardados ="Número de cuestionarios guardados: " + localStorage.getItem("numeroCuestionariosGuardados")+"<br>";
  //document.getElementById("numGuardados").innerHTML = numeroCuestionariosGuardados;
 //}
//}