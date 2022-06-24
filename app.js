const d = document;
const items = d.getElementById('gallery')
const itemsCarrito = d.getElementById('items-carrito')
const footer = d.getElementById('footer')
const templateCard = d.getElementById('card').content
const templateFooter = d.getElementById('template-footer').content
const templateCarrito = d.getElementById('template-carrito').content
const clickCar = d.getElementById('shopping_car')
const exitPopup = d.getElementById('cerrar')

const fragment = d.createDocumentFragment()
let carrito = {};

d.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
items.addEventListener('click', (e) => { addCar(e) });
itemsCarrito.addEventListener('click', (e) => { btnAction(e) });

const fetchData = async () => {
    try {
        const res = await fetch('./src/dataBase/api.json')
        const data = await res.json();
        showCards(data)
    } catch (error) {
        console.log(error);
    }
}

const showCards = data => {
    data.forEach(card => {
        templateCard.querySelector('h4').textContent = card.title;
        templateCard.querySelector('.price').textContent = card.price;
        templateCard.querySelector('.description').textContent = card.description;
        templateCard.querySelector('img').setAttribute('src',card.imgUrl)
        templateCard.querySelector('button').dataset.id = card.id
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const addCar = e => {
    if (e.target.classList.contains('card__btn')){
        setCar(e.target.parentElement);//Vamos a selecionar todo el div del padre
    }
    e.stopPropagation(); //detener los eventos heredados

}

const setCar = objeto => {
    const estampita = { //traemos la data y hacemos un objeto
        id: objeto.querySelector('.card__btn').dataset.id,
        title: objeto.querySelector('h4').textContent,
        precio: objeto.querySelector('.price').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(estampita.id)){
        estampita.cantidad = carrito[estampita.id].cantidad + 1;
    }
    carrito[estampita.id] = {...estampita} //empujamos las estampitas en nuestro carrito
    showCar()
}
const showCar = ()=>{
    console.log(carrito);
    itemsCarrito.innerHTML=''
    Object.values(carrito).forEach(estampita => {
        templateCarrito.querySelector('th').textContent =estampita.id
        templateCarrito.querySelectorAll('td')[0].textContent = estampita.title
        templateCarrito.querySelectorAll('td')[1].textContent = estampita.cantidad
        templateCarrito.querySelector('.btn__plus').dataset.id = estampita.id
        templateCarrito.querySelector('.btn__minus').dataset.id = estampita.id
        templateCarrito.querySelector('span').textContent = estampita.cantidad * estampita.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    itemsCarrito.appendChild(fragment)

    showFooter();
}

const showFooter = () => {
    footer.innerHTML=''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th>carrito vacio</th>`
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    const mostrarTotales = d.getElementById('resultados')

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio.toFixed(2)
    mostrarTotales.querySelectorAll('span')[0].textContent = nCantidad
    mostrarTotales.querySelectorAll('span')[1].textContent = nPrecio.toFixed(2)

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = d.getElementById('car-btn')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        showCar()
        mostrarTotales.querySelectorAll('span')[0].textContent = ''
        mostrarTotales.querySelectorAll('span')[1].textContent = ''
    })
}
//Botones de aumentar y disminuir
const btnAction = e =>{
    const estampita = carrito[e.target.dataset.id]
    
    if(e.target.classList.contains('btn__plus')){
        estampita.cantidad++  //=carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...estampita}
        showCar()
    }
    if(e.target.classList.contains('btn__minus')){
        estampita.cantidad--
        if(estampita.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        showCar()
    }

    e.stopPropagation()
}

clickCar.addEventListener('click', (e) =>{
    if(e){
    d.querySelector('.tables').style.display = "block"
    d.querySelector('.container').style.filter = "blur(3px)"
    // d.querySelector('.tables').style.backgroundColor = "#c0c0c0"
}
});

exitPopup.addEventListener('click', (e) =>{
    if(e){
    d.querySelector('.tables').style.display = "none"
    d.querySelector('.container').style.filter = "none"
}
});