// obtener elementos del html para modificar
const contenedorProductos = document.getElementById('contenedor-productos')

const contCarr = document.getElementById('carrito-contenedor')

const botVaciarCarr = document.getElementById('vaciar-carrito')
const botComprar = document.getElementById('comprar')
const contadorCarrito = document.getElementById('contadorCarrito')

const totalcomp = document.getElementById("precioTotal")





// creacion constructor
class Componente {

    constructor (id, nombre, precio, cant, img) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cant = cant;
        this.img = img;
    }

    
}

// definicion de los componentes

const componentes = [];

componentes.push(new Componente(1,"Memoria Ram", 400, 1, "./img/memoria.png"));
componentes.push(new Componente(2,"Placa de video 1070 8GB", 200, 1, "./img/placa1070.png"));
componentes.push(new Componente(3, "Procesador I5 10400F", 500, 1, "./img/procesador.png"));
componentes.push(new Componente(4, "Mother Asus", 600, 1, "./img/mother.png"));


//creacion de carrito
let carrito = [];

//local storage
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        actCarrito()
    }
})

//vaciar carrito
botVaciarCarr.addEventListener("click", () => {
    carrito.length = 0
    actCarrito()
})

//comprar y vaciar el carrito
botComprar.addEventListener("click", () => {
    swal({
        title: "Compra Realizada con exito",
        text: "Has realizado la compra",
        icon: "success",
    
    
    }).then(() => {
        carrito.length = 0
        actCarrito()
    })
    
})

// recorrido de array para insertar en html
for(const componente of componentes) {
    
    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
    <img src=${componente.img} alt= "">
    <h3>${componente.nombre}</h3>
    <p class="precioProducto">Precio:$ ${componente.precio}</p>
    <button id="agregar${componente.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
    `
    contenedorProductos.appendChild(div)

    const boton = document.getElementById(`agregar${componente.id}`)
    boton.addEventListener(`click`, () =>{
        agrcarrito(componente.id)
    })
}


//carga de los productos sin stock a traves de archivo json
fetch('js/producs.json')
            .then( (res) => res.json())
            .then( (data) => {
            for(const produs of data){
                const div = document.createElement('div')
                div.classList.add('producto')
                div.innerHTML = `
                <img src=${produs.img} alt= "">
                <h3>${produs.nombre}</h3>
                <p class="precioProducto">Precio: ${produs.precio}</p>
                <p>No hay stock disponible</p>
                `
                contenedorProductos.appendChild(div)
                
            }
        })



//agregar al carrito
const agrcarrito = (compid) => {
    //evitar duplicados
    const compduplicado = carrito.some (comp => comp.id === compid)
    if (compduplicado){
        const comp = carrito.map (comp => {
            if (comp.id === compid){
                comp.cant++
            }
        })
    }else{
    const item = componentes.find((comp) => comp.id === compid)
    carrito.push(item)
    
    
    }
    actCarrito()
}

//borrar elementos del carrito
const borrarCarrito = (compid) => {
    const item = carrito.find((comp) => comp.id === compid)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    actCarrito()
}

//actualizar carrito
const actCarrito = () => {

    contCarr.innerHTML = ""

    carrito.forEach((comp) =>{
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${comp.nombre}</p>
        <p>Precio: ${comp.precio}</p>
        <p>Cantidad: <span id="cantidad">${comp.cant}</span></p>
        <button onclick="borrarCarrito(${comp.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `
        contCarr.appendChild(div)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        
    })
    contadorCarrito.innerText = carrito.length
    totalcomp.innerText = carrito.reduce((acc , comp)=> acc + comp.precio * comp.cant, 0)


}