<?php
 header('Access-Control-Allow-Origin: *');
 define("NUMMAXCRUCIGRAMAS", "3");
 define("INDICENOMBRE", "0");
 define("INDICEDESCRIPCCION", "1");
 define("INDICESOLUCION", "4");
 define("INDICETAMANIO", "2");
 define("INDICECELDASNOINPUT", "3");

 switch($_POST["accion"]) {
  case 1:  //Peticion para comprobar si la solucion del cuestionario es valida
   if($_POST["numCuestionario"] != 0) {
    $myFile = "./soluciones/" . $_POST["numCuestionario"] . ".txt";
    $lines = file($myFile);
    $lines[INDICESOLUCION]= str_replace("\r\n","",$lines[INDICESOLUCION]);
    if($lines[INDICESOLUCION] == $_POST["enviarSol"]) {
     print "La solución es correcta";
    } else {
     print "La solución no es correcta";
    }
   } else {
    print "Seleccione un cuestionario para resolverlo";
   }
    break;
  case 2: //Escribir la descricion del crucigrama
   $myFile = "./soluciones/" . $_POST["numCuestionario"] . ".txt";
   $lines = file($myFile);
   $lines[INDICEDESCRIPCCION]= str_replace("\r\n","",$lines[INDICEDESCRIPCCION]);
   echo $lines[INDICEDESCRIPCCION];
   break;

  case 3:
   $nombres = "";
   for($i=1; $i<=NUMMAXCRUCIGRAMAS;$i++) {
    $myFile = "./soluciones/" . $i . ".txt";
    $lines = file($myFile);
    $nombres = $nombres . $lines[INDICENOMBRE];
    if($i!=3) {
     $nombres = $nombres . "-";
    }
   }
   echo $nombres;
   break;
  
  case 4:  
   $myFile = "./soluciones/" . $_POST["numCuestionario"] . ".txt";
   $lines = file($myFile);
   $lines[INDICETAMANIO]= str_replace("\r\n","",$lines[INDICETAMANIO]);
   echo $lines[INDICETAMANIO];
   break;

  case 5:  
   $myFile = "./soluciones/" . $_POST["numCuestionario"] . ".txt";
   $lines = file($myFile);
   $lines[INDICECELDASNOINPUT]= str_replace("\r\n","",$lines[INDICECELDASNOINPUT]);
   echo $lines[INDICECELDASNOINPUT];
   break;


  case 6:  
   break;
  default: print "error";

    //$myfile = fopen("./soluciones/" . $_POST["numCuestionario"] . ".txt", "r") or die("Unable to open file!");
    //$solucion = file_get_contents("./soluciones/" . $_POST["numCuestionario"] . ".txt");
    //fclose($myfile);
 }


?>
