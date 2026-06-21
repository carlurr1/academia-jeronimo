// ════════════════════════════════════════════════════════════════
//  Academia de Jerónimo — Datos del Currículo
// ════════════════════════════════════════════════════════════════

const NUMEROS = {
  1:{es:"uno",en:"one"}, 2:{es:"dos",en:"two"}, 3:{es:"tres",en:"three"},
  4:{es:"cuatro",en:"four"}, 5:{es:"cinco",en:"five"}, 6:{es:"seis",en:"six"},
  7:{es:"siete",en:"seven"}, 8:{es:"ocho",en:"eight"}, 9:{es:"nueve",en:"nine"},
  10:{es:"diez",en:"ten"}, 11:{es:"once",en:"eleven"}, 12:{es:"doce",en:"twelve"},
  13:{es:"trece",en:"thirteen"}, 14:{es:"catorce",en:"fourteen"}, 15:{es:"quince",en:"fifteen"},
  16:{es:"dieciséis",en:"sixteen"}, 17:{es:"diecisiete",en:"seventeen"},
  18:{es:"dieciocho",en:"eighteen"}, 19:{es:"diecinueve",en:"nineteen"}, 20:{es:"veinte",en:"twenty"}
};

const VOCALES = [
  {letra:"A", nombre:"a", ejemplo:"avión",    color:"#FF4B4B"},
  {letra:"E", nombre:"e", ejemplo:"elefante", color:"#1CB0F6"},
  {letra:"I", nombre:"i", ejemplo:"iglú",     color:"#58CC02"},
  {letra:"O", nombre:"o", ejemplo:"oso",      color:"#FF9600"},
  {letra:"U", nombre:"u", ejemplo:"uva",      color:"#CE82FF"}
];

const ABECEDARIO = [
  {letra:"A",ej:"avión"},{letra:"B",ej:"barco"},{letra:"C",ej:"casa"},
  {letra:"D",ej:"dado"},{letra:"E",ej:"elefante"},{letra:"F",ej:"flor"},
  {letra:"G",ej:"gato"},{letra:"H",ej:"helado"},{letra:"I",ej:"iglú"},
  {letra:"J",ej:"jirafa"},{letra:"K",ej:"koala"},{letra:"L",ej:"luna"},
  {letra:"M",ej:"mano"},{letra:"N",ej:"nube"},{letra:"Ñ",ej:"ñandú"},
  {letra:"O",ej:"oso"},{letra:"P",ej:"perro"},{letra:"Q",ej:"queso"},
  {letra:"R",ej:"rana"},{letra:"S",ej:"sol"},{letra:"T",ej:"tren"},
  {letra:"U",ej:"uva"},{letra:"V",ej:"vaca"},{letra:"W",ej:"wifi"},
  {letra:"X",ej:"xilófono"},{letra:"Y",ej:"yoyo"},{letra:"Z",ej:"zapato"}
];
const ABC_COLORES=["#FF4B4B","#1CB0F6","#58CC02","#FF9600","#CE82FF","#FF86D0"];

const COLORES_CURR = [
  {es:"rojo",en:"red",hex:"#FF4B4B"}, {es:"azul",en:"blue",hex:"#1CB0F6"},
  {es:"amarillo",en:"yellow",hex:"#FFC800"}, {es:"verde",en:"green",hex:"#58CC02"},
  {es:"naranja",en:"orange",hex:"#FF9600"}, {es:"morado",en:"purple",hex:"#CE82FF"},
  {es:"negro",en:"black",hex:"#3C3C3C"}, {es:"blanco",en:"white",hex:"#FFFFFF"},
  {es:"rosado",en:"pink",hex:"#FF86D0"}, {es:"café",en:"brown",hex:"#A2845E"}
];

const FIGURAS = [
  {es:"círculo",en:"circle"}, {es:"cuadrado",en:"square"},
  {es:"triángulo",en:"triangle"}, {es:"rectángulo",en:"rectangle"},
  {es:"óvalo",en:"oval"}, {es:"estrella",en:"star"}, {es:"diamante",en:"diamond"}
];
const FIG_HEX={"círculo":"#FF4B4B","cuadrado":"#1CB0F6","triángulo":"#58CC02",
  "rectángulo":"#CE82FF","óvalo":"#FF9600","estrella":"#FFC800","diamante":"#FF86D0"};

const CUERPO = [
  {es:"ojos",en:"eyes",img:"ojos"}, {es:"nariz",en:"nose",img:"nariz"},
  {es:"boca",en:"mouth",img:"boca"}, {es:"orejas",en:"ears",img:"orejas"},
  {es:"manos",en:"hands",img:"manos"}, {es:"pies",en:"feet",img:"pies"}
];

const ANIMALES = [
  {es:"perro",en:"dog",img:"perro"}, {es:"gato",en:"cat",img:"gato"},
  {es:"vaca",en:"cow",img:"vaca"}, {es:"caballo",en:"horse",img:"caballo"},
  {es:"cerdo",en:"pig",img:"cerdo"}, {es:"rana",en:"frog",img:"rana"},
  {es:"león",en:"lion",img:"leon"}, {es:"elefante",en:"elephant",img:"elefante"},
  {es:"mariposa",en:"butterfly",img:"mariposa"}, {es:"pájaro",en:"bird",img:"pajaro"},
  {es:"conejo",en:"rabbit",img:"conejo"}, {es:"pez",en:"fish",img:"pez"},
  {es:"tortuga",en:"turtle",img:"tortuga"}, {es:"mono",en:"monkey",img:"mono"},
  {es:"jirafa",en:"giraffe",img:"jirafa"}, {es:"pollo",en:"chicken",img:"pollo"},
  {es:"pato",en:"duck",img:"pato"}, {es:"oso",en:"bear",img:"oso"}
];

const FRUTAS = [
  {es:"manzana",en:"apple",img:"manzana"}, {es:"banano",en:"banana",img:"banano"},
  {es:"naranja",en:"orange",img:"naranja"}, {es:"uva",en:"grape",img:"uva"},
  {es:"fresa",en:"strawberry",img:"fresa"}, {es:"sandía",en:"watermelon",img:"sandia"},
  {es:"piña",en:"pineapple",img:"pina"}, {es:"mango",en:"mango",img:"mango"},
  {es:"pera",en:"pear",img:"pera"}, {es:"limón",en:"lemon",img:"limon"},
  {es:"cereza",en:"cherry",img:"cereza"}, {es:"durazno",en:"peach",img:"durazno"}
];

const INGLES = [
  {es:"sol",en:"sun",img:"sol"}, {es:"luna",en:"moon",img:"luna"},
  {es:"casa",en:"house",img:"casa"}, {es:"árbol",en:"tree",img:"arbol"},
  {es:"flor",en:"flower",img:"flor"}, {es:"agua",en:"water",img:"agua"},
  {es:"leche",en:"milk",img:"leche"}, {es:"perro",en:"dog",img:"perro"},
  {es:"gato",en:"cat",img:"gato"}, {es:"manzana",en:"apple",img:"manzana"}
];

const TRANSPORTE = [
  {es:"carro",en:"car",img:"carro"}, {es:"bus",en:"bus",img:"bus"},
  {es:"avión",en:"airplane",img:"avion"}, {es:"barco",en:"boat",img:"barco"},
  {es:"tren",en:"train",img:"tren"}, {es:"bicicleta",en:"bicycle",img:"bicicleta"},
  {es:"moto",en:"motorcycle",img:"moto"}, {es:"helicóptero",en:"helicopter",img:"helicoptero"},
  {es:"cohete",en:"rocket",img:"cohete"}, {es:"globo",en:"balloon",img:"globo"}
];

// Configuración de cada módulo (color, nombre, imagen del menú)
const MODULOS = [
  {clave:"lecciones",  nombre:"Repite conmigo", color:"#FF86D0", img:"libro", especial:true},
  {clave:"numeros",    nombre:"Números",    color:"#FF4B4B", img:"lapiz"},
  {clave:"vocales",    nombre:"Vocales",    color:"#1CB0F6", img:"libro"},
  {clave:"abecedario", nombre:"Abecedario", color:"#CE82FF", img:"libro"},
  {clave:"colores",    nombre:"Colores",    color:"#FFC800", img:"arcoiris"},
  {clave:"figuras",    nombre:"Figuras",    color:"#CE82FF", img:"estrella"},
  {clave:"cuerpo",     nombre:"Cuerpo",     color:"#FF86D0", img:"manos"},
  {clave:"animales",   nombre:"Animales",   color:"#58CC02", img:"perro"},
  {clave:"frutas",     nombre:"Frutas",     color:"#FF9600", img:"manzana"},
  {clave:"ingles",     nombre:"Inglés",     color:"#1CB0F6", img:"casa"},
  {clave:"transporte", nombre:"Transporte", color:"#FF9600", img:"carro"}
];

const COLORES_BTN = ["#FF4B4B","#1CB0F6","#58CC02","#FF9600"];
