function mostrarVistaCrearPost(){

  var creacionPost = document.getElementById("creacionPost");

  if (creacionPost.style.display === "none") {
      creacionPost.style.display = "block";
    }
  else {
      creacionPost.style.display = "none";
    }

}

function hacerPost(){

  var nuevoTitulo = $('#selectTitulo').val();
  var nuevoUsuario = $('#selectUsuario').val();
  var nuevaCategoria = $('#selectCategoria').val();
  var nuevoContenido = $('#selectContenido').val();

  try {

    if(nuevoTitulo === "" ) throw 'Por favor, coloca un título a la publicación';
    if(nuevoUsuario === "" ) throw 'Se requiere un usuario para poder publicar';
    if(nuevaCategoria === null ) throw 'Por favor, selecciona una categoría';

  } catch (error) {
    document.getElementById("resDePost").style.display = "block";
    document.getElementById("resDePost").innerHTML = error;
    return;
  }


  var hoy = new Date();
  var dia = String(hoy.getDate()).padStart(2, '0');
  var mes = String(hoy.getMonth() + 1).padStart(2, '0'); //Enero es 0, por alguna razón
  var anio = hoy.getFullYear();

  var nuevaFecha = anio + '-' + mes + '-' + dia;

  var nuevoPost = {

    contenido: nuevoContenido,
    nombre: nuevoTitulo,
    fecha: nuevaFecha,
    usuario: nuevoUsuario,
    idCategoriaPublicacion: nuevaCategoria

  };

  $.ajax({
    url: "http://35.223.20.167:8087/api/publicacion",
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      var res_query = document.getElementById("resDePost");
      res_query.style.color = "#FFFFFF";
      res_query.style.display = "block";
      $('#resDePost').html("¡Tu publicación se realizó exitosamente!");
      setTimeout(function(){
        location.replace(`publicacion.html?idPub=${data.publicacion.id}&idCat=${data.publicacion.idCategoriaPublicacion}`); 
      }, 2000);
      

    },
    data: JSON.stringify(nuevoPost)
  });


}

function setUp(){

  document.getElementById("creacionPost").style.display = "none";
  document.getElementById("resDePost").style.display = "none";
  getCategories();
  loadPublicaciones();

}

var sanitizeHTML = function (str) {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};


function loadPublicaciones(){

  
  var ol = document.getElementById("lista");
  
  var idCategoria = document.getElementById("categorias").value;
  if(idCategoria === null) {return;}
  var url = "http://35.223.20.167:8087/api/publicacion/" + idCategoria.toString();

  ol.innerHTML = "";
  $.getJSON(url,
    function(json){

      var arrPublicaciones = json.publicacion;
      arrPublicaciones.forEach(function(pub) {

        var nombre = sanitizeHTML(pub.nombre);
        var usuario = sanitizeHTML(pub.usuario);
        ol.innerHTML += `
                          <li>
                          <a href="publicacion.html?idPub=${pub.id}&idCat=${idCategoria}"> 
                          </a>
                          <img src="img/icons8-discussion-forum-80.png">
                          <span class="sp1D"> ${nombre} </span>
                          <span class="sp2D">${usuario}</span>
                          </li>`;
      });


    })


}


function getCategories(){

  var url = "http://35.223.20.167:8087/api/categoria";

  $.getJSON(url,
    function(json){

      var arrCategorias = json.categorias;

      var selector = document.getElementById("categorias");
      var selectorNewPost = document.getElementById("selectCategoria");

      arrCategorias.forEach(function(cat) {
        selector.innerHTML += `<option value=${cat.id}>` + cat.nombre + '</option>';
        selectorNewPost.innerHTML += `<option value=${cat.id}>` + cat.nombre + '</option>';
      });


    })
    
}



