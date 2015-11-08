//Test teórico del permiso de circulación B. Hecho con JavaScript, jQuery, XML, HTML. Realizado
//para la asignatura de Lenguaje de Marcas del primer curso de la FP superior de administración
//de sistemas operativos (curioso sí).
//No pretende ser un código perfecto ni libre de posibles optimizaciones, más bien ilustrativo
//y a modo de demostración de lo que se puede hacer con poco (no me considero un experto en JavaScript
//ni mucho menos).

//El test se genera aleatoriamente cada vez desde un archivo (datos/preguntas.xml) que contiene 100 
//preguntas de ejemplo. Estas y sus relativas imágenes han sido sacadas de los tests oficiales de la DGT,
//así como se incluye una plantilla con la estructura (datos/ejemploXML.xml) necesaria para añadir nuevas
//preguntas a este test. Se ha considerado que las preguntas pueden o no tener una imagen asociada y 
//también pueden tener dos o tres respuestas. La interacción y la interfaz de usuario se han enfocado
//hacia la simplicidad y claridad de los datos reflejados (corrección al finalizar el test).

//Los comentarios cubren la mayor y genérica parte de las funciones a las que se refieren, no obstante
//no contemplo comentar cada línea de código ya que lo haría muy espeso y no dejaría ningun lugar
//a la interpretación y el aprendizaje, como me ha pasado a mí. Empecemos...

$(document).ready(function()              //Enseguida que el documento este cargado en su totalidad escondemos
{                                         //ciertos elementos HTML por que o bien aun estan vacíos o aun no nos
  $("#AreaPreguntas").hide();             //interesa mostrarlos pero sí deben existir por que los usaremos.
  $("#AreaResultados").hide();
  $("#Footer").hide();
});
                                          //Declaración de variables globales. Como se ha dicho este código
                                          //no está enfocado exclusivamente a la optimización, por lo tanto
                                          //podría haber alguna de las siguientes que pudieran definirse
                                          //localmente en funciones, si es estrictamente necesario.

var CantidadPreguntas = 1;                //Ambas "1 simbólico" ya que las elige el usuario antes de empezar.
var CantidadPreguntasPorRonda = 1;        //Los numeros y booleanos en JS deben tener un valor en todo momento (evitar NaN).
var CantidadPreguntasTotales = 100;       //Cantidad de preguntas que contine el XML con los datos. Se debe cambiar si se añaden nuevas!
var ContadorPreguntasProcesadas = 0;
var ArrayJugadasInicial = [];
var ArrayJugadasFinal = [];
var ObjetoJSON = xml2json.fromFile('datos/preguntas.xml', 'string');    //Carga el contenido del fichero XML directamente a JSON gracias
                                                                        //a la funcion xml2json que provee el fichero el fichero xml2json.js
                                                                        //externo que se ha utilizado: http://coursesweb.net/javascript/convert-xml-json-javascript_s2

var JSONParseado = ParsearJSON(ObjetoJSON);                             //Envia el objeto que acabamos de generar a la función ParsearJSON.
var HoraInicio = new Date();                                            //Creamos un objeto acesible globalmente de tipo fecha para 
ComprobarCookies();                                                     //posteriormente usarlo cuando el usuario empieze el test y controlar
                                                                        //cuánto ha tardará. También lanzamos una comprobacion de cookies.


function ParsearJSON(ObjetoJSON) {                                //Recibe un objeto JSON y lo parsea con jQuery para poder acceder a el 
                                                                  //posteriormente a través de navegacion anidada de manera más simple.
  $(document).ready(function()
  {
    JSONParseado = jQuery.parseJSON(ObjetoJSON);
  });

}


$(function CalcularTiempoCarga()                                  //Función que se ejecuta sola al cargarse este fichero .js. Calcula 
                                                                  //el tiempo de carga de la página y añade dicho cálculo al pie de
    {                                                             //página (que aun no se muestra).

        var Inicio = new Date().getTime();
        window.onload = CalcularTiempoCargaInterno;
        function CalcularTiempoCargaInterno()

        {

          var Final = new Date().getTime();
          var CalculoTiempo = (Final - Inicio) / 1000;
          $("#Footer").append(

            "<span class='InformacionFooter'>Diseño y programación por Tomeu Torres.<br>Documento generado en "+CalculoTiempo+" ms.<br>JavaScript - jQuery - XML</span>"

          );

        }

    }

);


function TransformarDatos(CantidadPreguntas) {                    //Accede anidadamente al objeto JSON parseado que contiene todas las
                                                                  //preguntas cargadas del fichero XML. Para ello hace uso de dos arrays;
  $(document).ready(function()                                    //uno donde se guardan todas las preguntas y otro donde se guardan
  {                                                               //aleatoriamente la cantidad de preguntas que el usuario haya seleccionado.

    for (x = 0; x < CantidadPreguntasTotales; x++) {

        var ControladorCantidadRespuestas = JSONParseado.xml.jugada[x].pregunta["@attributes"].cantidadrespuestas;

        if (ControladorCantidadRespuestas == 3) {

          ArrayJugadasInicial[x] = {
                  Pregunta: JSONParseado.xml.jugada[x].pregunta["#text"],
                  CantidadRespuestas: JSONParseado.xml.jugada[x].pregunta["@attributes"].cantidadrespuestas,
                  Imagen: JSONParseado.xml.jugada[x].pregunta["@attributes"].imagen,
                  Respuesta1: JSONParseado.xml.jugada[x].respuesta[0]["#text"],
                  EsBuena1: JSONParseado.xml.jugada[x].respuesta[0]["@attributes"].buena,
                  Respuesta2: JSONParseado.xml.jugada[x].respuesta[1]["#text"],
                  EsBuena2: JSONParseado.xml.jugada[x].respuesta[1]["@attributes"].buena,
                  Respuesta3: JSONParseado.xml.jugada[x].respuesta[2]["#text"],
                  EsBuena3: JSONParseado.xml.jugada[x].respuesta[2]["@attributes"].buena
                };

        }

        else {

          ArrayJugadasInicial[x] = {
                  Pregunta: JSONParseado.xml.jugada[x].pregunta["#text"],
                  CantidadRespuestas: JSONParseado.xml.jugada[x].pregunta["@attributes"].cantidadrespuestas,
                  Imagen: JSONParseado.xml.jugada[x].pregunta["@attributes"].imagen,
                  Respuesta1: JSONParseado.xml.jugada[x].respuesta[0]["#text"],
                  EsBuena1: JSONParseado.xml.jugada[x].respuesta[0]["@attributes"].buena,
                  Respuesta2: JSONParseado.xml.jugada[x].respuesta[1]["#text"],
                  EsBuena2: JSONParseado.xml.jugada[x].respuesta[1]["@attributes"].buena
                };

        }
   
    }

    for (var i = ArrayJugadasInicial.length - 1; i > 0; i--) {

      var j = Math.floor(Math.random() * (i + 1));
      var temp = ArrayJugadasInicial[i];
      ArrayJugadasInicial[i] = ArrayJugadasInicial[j];
      ArrayJugadasInicial[j] = temp;

    }

    for (z = 0; z < CantidadPreguntas; z++) {

      var CantidadRespuestasDeEstaPregunta = ArrayJugadasInicial[z].CantidadRespuestas;

      if (CantidadRespuestasDeEstaPregunta == 3) {

        ArrayJugadasFinal[z] = {
            Pregunta: "",
            CantidadRespuestas: "",
            Imagen: "",
            Respuesta1: "",
            EsBuena1: "",
            Respuesta2: "",
            EsBuena2: "",
            Respuesta3: "",
            EsBuena3: ""
          };

        ArrayJugadasFinal[z].Pregunta = ArrayJugadasInicial[z].Pregunta;
        ArrayJugadasFinal[z].CantidadRespuestas = ArrayJugadasInicial[z].CantidadRespuestas;
        ArrayJugadasFinal[z].Imagen = ArrayJugadasInicial[z].Imagen;
        ArrayJugadasFinal[z].Respuesta1 = ArrayJugadasInicial[z].Respuesta1;
        ArrayJugadasFinal[z].EsBuena1 = ArrayJugadasInicial[z].EsBuena1;
        ArrayJugadasFinal[z].Respuesta2 = ArrayJugadasInicial[z].Respuesta2;
        ArrayJugadasFinal[z].EsBuena2 = ArrayJugadasInicial[z].EsBuena2;
        ArrayJugadasFinal[z].Respuesta3 = ArrayJugadasInicial[z].Respuesta3;
        ArrayJugadasFinal[z].EsBuena3 = ArrayJugadasInicial[z].EsBuena3;

      }
      
      else {

        ArrayJugadasFinal[z] = {
          Pregunta: "",
          CantidadRespuestas: "",
          Imagen: "",
          Respuesta1: "",
          EsBuena1: "",
          Respuesta2: "",
          EsBuena2: ""
        };

        ArrayJugadasFinal[z].Pregunta = ArrayJugadasInicial[z].Pregunta;
        ArrayJugadasFinal[z].CantidadRespuestas = ArrayJugadasInicial[z].CantidadRespuestas;
        ArrayJugadasFinal[z].Imagen = ArrayJugadasInicial[z].Imagen;
        ArrayJugadasFinal[z].Respuesta1 = ArrayJugadasInicial[z].Respuesta1;
        ArrayJugadasFinal[z].EsBuena1 = ArrayJugadasInicial[z].EsBuena1;
        ArrayJugadasFinal[z].Respuesta2 = ArrayJugadasInicial[z].Respuesta2;
        ArrayJugadasFinal[z].EsBuena2 = ArrayJugadasInicial[z].EsBuena2;

      }

    }

  });

}


function ComprobarCookies() {                   //Comprueba si existen las cookies que se usan para mostrar datos informativos
                                                //al usuario y en caso de que no existan las crea. Se ha utilizado: https://github.com/carhartl/jquery-cookie/blob/master/src/jquery.cookie.js
    if ($.cookie("CantidadTests") == null) {
      $.cookie('CantidadTests', '0', { expires: 31, path: '/' });
    }

    if ($.cookie("CantidadTestsAprobados") == null) {
      $.cookie('CantidadTestsAprobados', '0', { expires: 31, path: '/' });
    }

    if ($.cookie("CantidadTestsSuspendidos") == null) {
      $.cookie('CantidadTestsSuspendidos', '0', { expires: 31, path: '/' });
    }

    if ($.cookie("CantidadGlobalErrores") == null) {
      $.cookie('CantidadGlobalErrores', '0', { expires: 31, path: '/' });
    }

}


function ControlarCookies(ResultadoTest, CantidadErrores) {     //Lleva el control de las cookies cuando es necesario modificarlas
                                                                //y cambiar o calcular sus valores.
    var CantidadActualTests = $.cookie("CantidadTests");
    CantidadActualTests++;
    $.cookie('CantidadTests', ''+CantidadActualTests+'', { expires: 31, path: '/' });

    var CantidadActualGlobalErrores = $.cookie("CantidadGlobalErrores");
    CantidadActualGlobalErrores = parseInt(CantidadActualGlobalErrores) + parseInt(CantidadErrores);
    $.cookie('CantidadGlobalErrores', ''+CantidadActualGlobalErrores+'', { expires: 31, path: '/' });
    
    if (ResultadoTest == "Suspendido") {

      var CantidadActualTestsSuspendidos = $.cookie("CantidadTestsSuspendidos");
      CantidadActualTestsSuspendidos++;
      $.cookie('CantidadTestsSuspendidos', ''+CantidadActualTestsSuspendidos+'', { expires: 31, path: '/' });

    }

    else if (ResultadoTest == "Aprobado") {

      var CantidadActualTestsAprobados = $.cookie("CantidadTestsAprobados");
      CantidadActualTestsAprobados++;
      $.cookie('CantidadTestsAprobados', ''+CantidadActualTestsAprobados+'', { expires: 31, path: '/' });

    }

}


function ProcesarPeticion() {                                     //Cada vez que se peticiona, procesa el rango de preguntas que toca
                                                                  //mostrar a continuación si aun no se ha alcanzado el fin de las preguntas.
  $(document).ready(function()                                    //Contiene una subfunción interna que hace los cálculos necesarios
  {                                                               //para establecer el rango.

    if (ContadorPreguntasProcesadas < CantidadPreguntas) {

      ProcesarPeticionInterna();

    }

    else {

      FinalizarTest();

    }

    function ProcesarPeticionInterna() {

      if (ContadorPreguntasProcesadas == 0) {

        HoraInicio = new Date();

        $("#AreaPreguntas").show();
        $("#Footer").show();

        CantidadPreguntas = parseInt($("#CantidadDePreguntas option:selected").text());
        CantidadPreguntasPorRonda = parseInt($("#CantidadPorRonda option:selected").text());

        TransformarDatos(CantidadPreguntas);

        $("#ContenedorInformacion").hide("drop", 400);
        $("#AreaPrincipal").switchClass("AreaPrincipalEstrecha", "AreaPrincipalAncha", 800);
           
      }

      var UltimaPeticionParaProcesar = ContadorPreguntasProcesadas + CantidadPreguntasPorRonda;
      MostrarDatos(ContadorPreguntasProcesadas, UltimaPeticionParaProcesar);
      ControlarBotonProcesarPeticion();
      ContadorPreguntasProcesadas = ContadorPreguntasProcesadas + CantidadPreguntasPorRonda;

    }

  });

}


function ControlarBotonProcesarPeticion() {                     //Controla el texto del botón que pide procesar más peticiones 
                                                                //en función de la cantidad de preguntas restantes.
  $(document).ready(function()
  {

    $('#BotonProcesarPeticion').css("margin-top","1%");                                                                

    if (ContadorPreguntasProcesadas < CantidadPreguntas) {

      $('#BotonProcesarPeticion').text("Cargar más");

    }

    else {

      $('#BotonProcesarPeticion').text("Finalizar Test");

    }

  });

}


function MostrarDatos(x, y) {                                     //Muestra (carga en el documento HTML) el rango de preguntas recibido.
                                                                  //Genera las debidas etiquetas y atributos HTML que posteriormente
  $(document).ready(function()                                    //necesitaremos para trabajar (procesar) sobre este mismo.
  {

    for (i = x; i < y; i++) {

      if (i + 1 <= CantidadPreguntas) {

        var CantidadRespuestasDeEstaPregunta = ArrayJugadasFinal[i].CantidadRespuestas;

        if (CantidadRespuestasDeEstaPregunta == 3) {

          var NumeroPreguntaMostrar = i + 1;

          $("#AreaPreguntas").append(

            "<div id='Jugada"+i+"' class='Jugada'>"+
            "<p class='NumeroPregunta'>Pregunta "+NumeroPreguntaMostrar+"</p>"+
            "<div class='ImagenPregunta'>"+
            "<img src='imagenes/"+ArrayJugadasFinal[i].Imagen+"'>"+
            "</div>"+
            "<p class='Pregunta'>"+ArrayJugadasFinal[i].Pregunta+"</p>"+
            "<form class='FormRespuesta'>"+
            "<input type='radio' value='1' name='CheckBoxRespuesta"+i+"' id='Jugada"+i+"Respuesta1' buena='no'><span id='SpanJugada"+i+"Respuesta1'><label for='Jugada"+i+"Respuesta1'>"+ArrayJugadasFinal[i].Respuesta1+"</label></span><br>"+
            "<input type='radio' value='2' name='CheckBoxRespuesta"+i+"' id='Jugada"+i+"Respuesta2' buena='no'><span id='SpanJugada"+i+"Respuesta2'><label for='Jugada"+i+"Respuesta2'>"+ArrayJugadasFinal[i].Respuesta2+"</label></span><br>"+
            "<input type='radio' value='3' name='CheckBoxRespuesta"+i+"' id='Jugada"+i+"Respuesta3' buena='no'><span id='SpanJugada"+i+"Respuesta3'><label for='Jugada"+i+"Respuesta3'>"+ArrayJugadasFinal[i].Respuesta3+"</label></span><br>"+
            "</form>"+
            "<div id='Limpiador'></div>"+
            "</div>"
            
          )

          if (ArrayJugadasFinal[i].EsBuena1 == "si") {

            $('#Jugada'+i+'Respuesta1').attr('buena', 'si');

          }

          else if (ArrayJugadasFinal[i].EsBuena2 == "si") {

            $('#Jugada'+i+'Respuesta2').attr('buena', 'si');

          }

          else if (ArrayJugadasFinal[i].EsBuena3 == "si") {

            $('#Jugada'+i+'Respuesta3').attr('buena', 'si');

          }

        }

        else {

          var NumeroPreguntaMostrar = i + 1;

          $("#AreaPreguntas").append(

            "<div id='Jugada"+i+"' class='Jugada'>"+
            "<p class='NumeroPregunta'>Pregunta "+NumeroPreguntaMostrar+"</p>"+
            "<div class='ImagenPregunta'>"+
            "<img src='imagenes/"+ArrayJugadasFinal[i].Imagen+"'>"+
            "</div>"+
            "<p class='Pregunta'>"+ArrayJugadasFinal[i].Pregunta+"</p>"+
            "<form class='FormRespuesta'>"+
            "<input type='radio' value='1' name='CheckBoxRespuesta"+i+"' id='Jugada"+i+"Respuesta1' buena='no'><span id='SpanJugada"+i+"Respuesta1'><label for='Jugada"+i+"Respuesta1'>"+ArrayJugadasFinal[i].Respuesta1+"</label></span><br>"+
            "<input type='radio' value='2' name='CheckBoxRespuesta"+i+"' id='Jugada"+i+"Respuesta2' buena='no'><span id='SpanJugada"+i+"Respuesta2'><label for='Jugada"+i+"Respuesta2'>"+ArrayJugadasFinal[i].Respuesta2+"</label></span><br>"+
            "</form>"+
            "<div id='Limpiador'></div>"+
            "</div>"


          )

          if (ArrayJugadasFinal[i].EsBuena1 == "si") {

            $('#Jugada'+i+'Respuesta1').attr('buena', 'si');

          }
          else if (ArrayJugadasFinal[i].EsBuena2 == "si") {

            $('#Jugada'+i+'Respuesta2').attr('buena', 'si');

          }

        }

      }

    } 

  });

}


function FinalizarTest() {                                          //Llamada al finalizar la cantidad de preguntas a mostrar, recorre cada
                                                                    //respuesta de cada jugada y corrige el test (entre otras cosas determina
  $(document).ready(function()                                      //si está bien o mal gracias a los atributos HTML que tienen estas jugadas).
  {                                                                 //Calcula las cantidades de preguntas falladas, acertadas y sin responder
                                                                    //así como el tiempo que se ha tardado en realizar el test.
    var HoraFinal = new Date();
    var TotalMinutos = Math.floor(((HoraFinal - HoraInicio) / 1000) / 60);
    var TotalMinutosMostrar = Math.floor(TotalMinutos);
    var CantidadPreguntasAcertadas = 0;
    var CantidadPreguntasFalladas = 0;
    var CantidadPreguntasSinResponder = 0;

    function SubrayarRespuestasCorrecta() {

      if ($('#Jugada'+i+'Respuesta'+x+'').attr('buena') == "si") {

        $('#SpanJugada'+i+'Respuesta'+x+'').css("text-decoration", "underline");

      }

    }

    for (i = 0; i < CantidadPreguntas; i++) {

      $("#Jugada"+i+"").removeClass("Jugada");
      var ContadorRespuestasDeLaPreguntaSinResponder = 0;
      var CantidadRespuestasDeEstaPregunta = ArrayJugadasFinal[i].CantidadRespuestas;

      for (x = 1; x <= CantidadRespuestasDeEstaPregunta; x++) {

        if ($('#Jugada'+i+'Respuesta'+x+'').is(':checked') && $('#Jugada'+i+'Respuesta'+x+'').attr('buena') == "si") {

          CantidadPreguntasAcertadas++;
          $('#Jugada'+i+'').addClass("Acertada");

        }

        else if ($('#Jugada'+i+'Respuesta'+x+'').is(':checked') && $('#Jugada'+i+'Respuesta'+x+'').attr('buena') == "no") {

          CantidadPreguntasFalladas++;
          $('#Jugada'+i+'').addClass("Fallada");

        }    

        else {

          ContadorRespuestasDeLaPreguntaSinResponder++;

        }

        if ((ContadorRespuestasDeLaPreguntaSinResponder == 3 && CantidadRespuestasDeEstaPregunta == 3) || (ContadorRespuestasDeLaPreguntaSinResponder == 2 && CantidadRespuestasDeEstaPregunta == 2)) {      

          $('#Jugada'+i+'').addClass("NoContestada");
          CantidadPreguntasSinResponder++;

        } 

        SubrayarRespuestasCorrecta();
        $("input[type=radio]").attr('disabled', true);

      }

    }

    var Nota = "Aprobado";
    var MostrarCantidadSinResponder = "Ninguna";

    if (CantidadPreguntasFalladas > 3 || CantidadPreguntasSinResponder > 0 || TotalMinutos > 30) {

      Nota = "Suspendido";

    }

    if (CantidadPreguntasSinResponder > 0) {

      MostrarCantidadSinResponder = CantidadPreguntasSinResponder;

    }

    ControlarCookies(Nota, CantidadPreguntasFalladas);

    var CookieCantidadTests = $.cookie("CantidadTests");
    var CookieCantidadTestsAprobados = $.cookie("CantidadTestsAprobados");
    var CookieCantidadTestsSuspendidos = $.cookie("CantidadTestsSuspendidos");
    var CookieCantidadGlobalErrores = $.cookie("CantidadGlobalErrores");

    $("#AreaBoton").remove();
    $("#AreaInformacion").empty();

    $("#AreaInformacion").append(

      "<p class='InformacionAcertadas'>Aciertos: "+CantidadPreguntasAcertadas+"</p>"+
      "<p class='InformacionFalladas'>Errores: "+CantidadPreguntasFalladas+"</p>"+
      "<p class='InformacionSinResponder'>Sin responder: "+MostrarCantidadSinResponder+""+
      "<p class='InformacionNota"+Nota+"'>"+Nota.toUpperCase()+"</p>"+
      "<p class='InformacionTiempo'>Duración del test: "+TotalMinutosMostrar+" minutos</p>"

    )

    var CantidadMediaDeErrores = Math.round(CookieCantidadGlobalErrores / CookieCantidadTests);

    $("#AreaResultados").append(

      "<p class='TituloAreaResultados'>Estadísticas</p>"+
      "<table class='TablaResultados'>"+
      "<tr>"+
      "<td>Total tests</td>"+
      "<td class='CeldaTablaCentrarContenido'>"+CookieCantidadTests+"</td>"+
      "</tr>"+
      "<tr>"+
      "<td>Tests aprobados</td>"+
      "<td class='CeldaTablaCentrarContenido'>"+CookieCantidadTestsAprobados+"</td>"+
      "</tr>"+
      "<tr>"+
      "<td>Tests suspendidos</td>"+
      "<td class='CeldaTablaCentrarContenido'>"+CookieCantidadTestsSuspendidos+"</td>"+
      "</tr>"+
      "<tr>"+
      "<td>Errores por test</td>"+
      "<td class='CeldaTablaCentrarContenido'>"+CantidadMediaDeErrores+"</td>"+
      "</tr>"+
      "</table>"

    )

    $("#AreaInstrucciones").remove();
    $("#AreaPrincipal").switchClass("AreaPrincipalAncha", "AreaPrincipalEstrecha", 800);
    $("#ContenedorInformacion").show("fold", 600);
    $("#AreaResultados").show("fold", 600);

  });

}
