var contentCategorias = document.getElementById('contentCategorias');
var contentDetalle = document.getElementById('contentDetalle');
var contentCards = document.getElementById('contentCards');
var contentNuevo = document.getElementById('contentNuevo');
var loader = document.getElementById('loader');
var tituloDetalle = document.getElementById('tituloDetalle');
var tituloForm = document.getElementById('tituloForm');
var txtNombrePlato = document.getElementById('txtNombrePlato');
var txtDesPlato = document.getElementById('txtDesPlato');
var txtPrecioPlato = document.getElementById('txtPrecioPlato');
var txtImagenPlato = document.getElementById('txtImagenPlato');
var modal = document.getElementById("myModal");
var closeModal = document.getElementsByClassName("close")[0];

var valueCategoria;
let db = null;
var listPlatos = [];
// init
createDB();
//
function mostrar(value) {
    // createPlato("Aji de Gallina","Plato tipico del peru","25 Soles.","Criollo","ajidegallina.jpg");
    // createPlato("Arroz con Pollo","Plato tipico del peru","30 Soles.","Criollo","arrozconpollo.jpg");
    // createPlato("Frejoles con seco","Plato tipico del peru","18 Soles.","Criollo","frejolesconseco.jpg");
    // createPlato("Lomo saltado","Plato tipico del peru","20 Soles.","Criollo","lomosaltado.jpg");

    // createPlato("Tiradito de pescado","Plato marino","25 Soles.","Marino","tiradito.jpg");
    // createPlato("Arroz con mariscos","Plato marino","30 Soles.","Marino","arrozconmarisco.jpg");
    // createPlato("Jalea mixta","Plato marino","18 Soles.","Marino","jaleamixta.jpg");
    // createPlato("Ceviche de pescado ","Plato marino","20 Soles.","Marino","cevichedepescado.jpg");



    // createPlato("Juane","Plato de la Selva","25 Soles.","Selva","juanes.jpg");
    // createPlato("Chaufa de cecina","Plato de la Selva","30 Soles.","Selva","chaufadecesina.jpg");
    // createPlato("Tacacho con cecina","Plato de la Selva","18 Soles.","Selva","tacachoconcesina.jpg");
    // createPlato("Patarashca","Plato de la Selva","20 Soles.","Selva","patarashca.jpg");

    // createPlato("Pepian de pavita","Plato Norteño","25 Soles.","Norteño","pavita.jpg");
    // createPlato("Arroz con pato ","Plato Norteño","30 Soles.","Norteño","secocabrito.jpg");
    // createPlato("Seco de cabrito con frejoles","Plato Norteño","18 Soles.","Norteño","chabelo.jpg");
    // createPlato("Seco de chabelo ","Plato Norteño","20 Soles.","Norteño","arrozpato.jpg");


    showLoader();
    viewPlatos(value);
    setTimeout(() => {
        hideLoader();
        setTextTitulo(value);
        contentCategorias.style.display = "none";
        contentDetalle.style.display = "";
    }, 500);
}
function volver() {

    showLoader();
    setTimeout(() => {
        hideLoader();
        contentCategorias.style.display = "";
        contentDetalle.style.display = "none";
        contentNuevo.style.display = "none";

    }, 500);
}

function setTextTitulo(value) {
    valueCategoria = value;
    switch (value) {
        case 1:
            tituloDetalle.innerHTML = "Lista de Platos Criollos";
            tituloForm.innerHTML = "Criollo";
            break;
        case 2:
            tituloDetalle.innerHTML = "Lista de Platos Marinos";
            tituloForm.innerHTML = "Marino";
            break;
        case 3:
            tituloDetalle.innerHTML = "Lista de Platos de la Selva";
            tituloForm.innerHTML = "Selva";
            break;
        case 4:
            tituloDetalle.innerHTML = "Lista de Platos Norteños";
            tituloForm.innerHTML = "Norteño";
            break;
        default:
            break;
    }
}
function showLoader() {
    loader.style.display = "";
}
function hideLoader() {
    loader.style.display = "none";
}

// Creacion de database
function createDB() {
    const request = indexedDB.open("restaurante", 1);
    request.onupgradeneeded = e => {
        db = e.target.result;
        const platosRestaurante = db.createObjectStore("platos", { keyPath: "_id" });
    };
    request.onsuccess = e => {
        db = e.target.result;
    };
    request.onerror = e => {
        console.log(e);
    };
}

function createPlato(nombre, descripcion, precio, categoria, img) {
    const values = {
        _id: "_id" + Math.floor(Math.random() * 10100),
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        img: img
    };
    console.log(values);
    const tx = db.transaction("platos", "readwrite");
    tx.onerror = e => {
        console.log(e);
    };
    const pPlatos = tx.objectStore("platos");
    pPlatos.add(values);
    limpiarText();
}

function viewPlatos(value) {

    const tx = db.transaction("platos", "readonly");
    const pNotes = tx.objectStore("platos");
    const request = pNotes.openCursor();
    listPlatos = [];
    let result = request.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
            console.log(cursor.value.categoria)
            if (value == 1 && cursor.value.categoria == "Criollo")
                listPlatos.push(cursor.value);

            if (value == 2 && cursor.value.categoria == "Marino")
                listPlatos.push(cursor.value);

            if (value == 3 && cursor.value.categoria == "Selva")
                listPlatos.push(cursor.value);

            if (value == 4 && cursor.value.categoria == "Norteño")
                listPlatos.push(cursor.value);
            cursor.continue();
        }
    }
    setTimeout(() => {
        // Mostramos Formulario
        limpiarText();
        contentNuevo.style.display = "";
        //
        pintarPlatos();
    }, 500);

}

function pintarPlatos() {
    contentCards.innerHTML = "";
    listPlatos.forEach(element => {
        let _id = "card" + element._id;
        contentCards.innerHTML +=
            `<div class="card card1" id="${_id}">
            <h1>${ element.nombre}</h1>
            <p>${ element.descripcion}</p>
            <p class = "precio">${ element.precio}</p>
        </div>`;
        pintarImagen(_id, element.img)
    });
}

function pintarImagen(id, img) {
    let card = document.getElementById(id);
    card.style.backgroundImage = `url('./img/${img}')`;
}

/* MODAL FUNCIONES */
function showModal() {
    modal.style.display = "block";
}

function hideModal() {
    modal.style.display = "none";

}
closeModal.onclick = function () {
    hideModal();
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function guardarPlato() {
    hideModal();
    showLoader();
    var valNombrePlato = txtNombrePlato.value;
    var valDesPlato = txtDesPlato.value;
    var valPrecioPlato = txtPrecioPlato.value;
    var valImagenPlato = txtImagenPlato.value;
    var categoria = tituloForm.innerHTML;
    // createPlato("Juane","Plato de la Selva","25 Soles.","Selva","juanes.jpg");

    createPlato(valNombrePlato, valDesPlato, valPrecioPlato, categoria, valImagenPlato);
    setTimeout(() => {
        hideLoader();
        viewPlatos(valueCategoria);
    }, 500);
}

function limpiarText() {
    txtNombrePlato.value = "";
    txtDesPlato.value = "";
    txtPrecioPlato.value = "";
    txtImagenPlato.value = "";
}