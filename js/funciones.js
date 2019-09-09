var contentCategorias = document.getElementById('contentCategorias');
var contentDetalle = document.getElementById('contentDetalle');
var contentCards = document.getElementById('contentCards');
var loader = document.getElementById('loader');
var tituloDetalle = document.getElementById('tituloDetalle');
let db = null;
var listPlatos = [];
// init
createDB();
//
function mostrar(value) {
    //createPlato("Aji de Gallina","Plato tipico del peru","25 Soles.","Criollo","ajidegallina,jpg");
    //createPlato("Arroz con Pollo","Plato tipico del peru","30 Soles.","Criollo","arrozconpollo.jpg");
    //createPlato("Frejoles con seco","Plato tipico del peru","18 Soles.","Criollo","frejolesconseco.jpg");
    //createPlato("Lomo saltado","Plato tipico del peru","20 Soles.","Criollo","lomosaltado.jpg");


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
    }, 500);
}

function setTextTitulo(value) {
    switch (value) {
        case 1:
            tituloDetalle.innerHTML = "Lista de Platos Criollos";
            break;
        case 2:
            tituloDetalle.innerHTML = "Lista de Platos Marinos";
            break;
        case 3:
            tituloDetalle.innerHTML = "Lista de Platos de la Selva";
            break;
        case 4:
            tituloDetalle.innerHTML = "Lista de Platos Nortenos";
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
    const tx = db.transaction("platos", "readwrite");
    tx.onerror = e => {
        console.log(e);
    };
    const pPlatos = tx.objectStore("platos");
    pPlatos.add(values);
}

function viewPlatos(value) {
    const tx = db.transaction("platos", "readonly");
    const pNotes = tx.objectStore("platos");
    const request = pNotes.openCursor();
    listPlatos = [];
    let result = request.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
            if (value == 1 && cursor.value.categoria == "Criollo")
                listPlatos.push(cursor.value);
            cursor.continue();
        }
    }
    setTimeout(() => {
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
        pintarImagen(_id,element.img)
    });
}

function pintarImagen(id,img){
    let card = document.getElementById(id);
    card.style.backgroundImage = `url('./img/${img}')`;
}