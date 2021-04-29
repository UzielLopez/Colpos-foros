var idPub = 0;

function setIdPub(value){
  idPub = value;
}

function getIdPub(){
  return idPub;
}

function mostrarVistaCrearRespuesta(){

    var creacionPost = document.getElementById("creacionRespuesta");

    if (creacionPost.style.display === "block") {
        creacionPost.style.display = "none";
      }
    else {
        creacionPost.style.display = "block";
      }


}

function hacerRespuesta(){

  var nuevoUsuario = $('#selectUsuario').val();
  var nuevoContenido = $('#contenidoRespuesta').val();
  var nuevoIdPub = getIdPub();

  var hoy = new Date();
  var dia = String(hoy.getDate()).padStart(2, '0');
  var mes = String(hoy.getMonth() + 1).padStart(2, '0'); //Enero es 0, por alguna razón
  var anio = hoy.getFullYear();

  var nuevaFecha = anio + '-' + mes + '-' + dia;

  var nuevaRespuesta = {

      usuario: nuevoUsuario,
      fecha: nuevaFecha,
      contenido: nuevoContenido,
      idPublicacion: nuevoIdPub

  };

  $.ajax({
    url: "http://35.223.20.167:8087/api/respuesta",
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      $('#resDePost').html("¡Tu respuesta se publicó exitosamente!");
      if(data){
        setTimeout(function(){
             location.reload();
        }, 2000); 
     }
    },
    data: JSON.stringify(nuevaRespuesta)
  });


}

var sanitizeHTML = function (str) {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

function loadRespuestas(idPublicacion){

  var ol = document.getElementById("lista");
  ol.innerHTML = "";
    var url = "http://35.223.20.167:8087/api/respuesta/" + idPublicacion.toString();
    $.getJSON(url,
      function(json){

        var arrRespuestas = json.respuesta;
        arrRespuestas.forEach(function(res){

          var fecha = res.fecha.substr(0,10);
          
          ol.innerHTML += `
                        <li>
                        <aside><p>${sanitizeHTML(res.usuario)}</p></aside>
                        <h6>Publicado el</h6>
                        <h6>${fecha}</h6>
                        <p>${sanitizeHTML(res.contenido)}</p>
                        </li>
          
          `;


        });


      })


}

function findElement(arr, propName, propValue) {
  for (var i=0; i < arr.length; i++)
    if (arr[i][propName] == propValue)
      return arr[i];
}

function setUp(){

    var creacionPost = document.getElementById("creacionRespuesta");
    creacionPost.style.display = "none";
    

    var url_string = window.location.href;
    var url = new URL(url_string);
    var idPublicacion = url.searchParams.get("idPub");
    var idCategoria = url.searchParams.get("idCat");

    var url_res = "http://35.223.20.167:8087/api/publicacion/" + idCategoria.toString();

    $.getJSON(url_res,
      function(json){

        var arrRespuestas = json.publicacion;
        var pubActual = findElement(arrRespuestas, "id", idPublicacion);

        var fechaPub = pubActual.fecha.substr(0,10);

        var opContenido = document.getElementById("contenidoOP");
        opContenido.innerHTML = `
        
        <h6>Publicado el</h6>
        <h6>${fechaPub}</h6>

        <p>${sanitizeHTML(pubActual.contenido)}</p>
        
  
        `
        document.getElementById("usuarioOP").innerHTML = sanitizeHTML(pubActual.usuario);
        document.getElementById("tituloPublicacion").innerHTML = sanitizeHTML(pubActual.nombre);
        document.getElementById("cabezaTit").innerHTML = sanitizeHTML(pubActual.nombre);


      });

      var url_cat = "http://35.223.20.167:8087/api/categoria";

      $.getJSON(url_cat,
        function(json){
    
          var arrCategorias = json.categorias;
    
          var selector = document.getElementById("categorias");
    
          document.getElementById("cabezaCat").innerHTML = (findElement(arrCategorias, "id", idCategoria)).nombre;
    
    
        });


    setIdPub(idPublicacion);
    loadRespuestas(idPublicacion);
    

}