document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.querySelector('.product-list__container');
    const addProductForm = document.querySelector('.add-product__form');

    if (!productListContainer || !addProductForm) {
        console.error('No se encontraron los elementos necesarios en el DOM. Verifica los selectores en el HTML.');
        return;
    }

    // Función para cargar productos iniciales desde un JSON local o servidor
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/products'); // Cambiar URL si es necesario
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    // Función para renderizar los productos en la lista
    const renderProducts = (products) => {
        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-card__image">
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__price">$${product.price.toFixed(2)}</p>
                <button class="button product-card__delete" data-id="${product.id}">Eliminar</button>
            `;
            productListContainer.appendChild(productCard);
        });
    };

    // Función para agregar un nuevo producto
    const addProduct = async (product) => {
        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            const newProduct = await response.json();
            renderProduct(newProduct); // Renderizar el nuevo producto directamente
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    // Renderiza un único producto
    const renderProduct = (product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-card__image">
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__price">$${product.price.toFixed(2)}</p>
            <button class="button product-card__delete" data-id="${product.id}">Eliminar</button>
        `;
        productListContainer.appendChild(productCard);
    };

    // Función para eliminar un producto
    const deleteProduct = async (id) => {
        try {
            await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE',
            });
            const productCard = document.querySelector(`.product-card__delete[data-id="${id}"]`).parentElement;
            productCard.remove(); // Eliminar el producto directamente del DOM
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    // Manejador de evento para enviar el formulario
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.querySelector('#name').value;
        const price = parseFloat(document.querySelector('#price').value);
        const image = document.querySelector('#image').value;

        if (name && price && image) {
            const newProduct = { name, price, image };
            addProduct(newProduct);
            addProductForm.reset();
        } else {
            alert('Por favor, completa todos los campos correctamente.');
        }
    });

    // Delegación de eventos para eliminar productos
    productListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('product-card__delete')) {
            const id = event.target.dataset.id;
            deleteProduct(id);
        }
    });

    // Cargar productos al cargar la página
    fetchProducts();
});