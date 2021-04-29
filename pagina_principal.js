function mostrarVistaCrearPost(){

  var creacionPost = document.getElementById("creacionPost");

  if (creacionPost.style.display === "block") {
      creacionPost.style.display = "none";
    }
  else {
      creacionPost.style.display = "block";
    }

}

function hacerPost(){

  var nuevoTitulo = $('#selectTitulo').val();
  var nuevoUsuario = $('#selectUsuario').val();
  var nuevaCategoria = $('#selectCategoria').val();
  var nuevoContenido = $('#selectContenido').val();

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
      document.getElementById("resDePost").style.display = "block";
      $('#resDePost').html("¡Tu publicación se realizó exitosamente!");
      location.replace(`publicacion.html?idPub=${data.id}&idCat=${data.idCategoriaPublicacion}`);
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
  
  var idCategoria = +document.getElementById("categorias").value;
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
                          <a href="publicacion.html?idPub=${pub.id}&idCat=${idCategoria}"> <span class="sp1D">${nombre}</span></a>
                          <img src="img/icons8-discussion-forum-80.png">
                          <br>
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


