const socket = io();

// Obtener el usuario autenticado
fetch("/api/sessions/current", { credentials: "include" })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            console.log("✅ Usuario autenticado:", data.user);
            socket.emit("authenticate", data.user);
        }
    });

    socket.on("productList", (products) => {
        
        const productList = document.getElementById("productList");
    
        if (!productList) {
            console.error("❌ No se encontró el elemento 'productList' en el DOM.");
            return;
        }
    
        productList.innerHTML = products.map(p => `
            <li>
                <strong>${p.title}</strong> - $${p.price}
                <p>${p.description}</p>
                <button onclick="deleteProduct('${p._id}')">🗑 Eliminar</button>
            </li>
        `).join('');
    });
    

function applyFilters() {
    const limit = document.getElementById("limit").value;
    const page = document.getElementById("page").value;
    const sort = document.getElementById("sort").value;
    const query = document.getElementById("query").value;

    const params = new URLSearchParams();
    if (limit) params.append("limit", limit);
    if (page) params.append("page", page);
    if (sort) params.append("sort", sort);
    if (query) params.append("query", query);

    fetch(`/api/products?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            socket.emit("filteredProducts", data);
        })
        .catch(error => console.error("Error al filtrar productos:", error));
}

function addProduct() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;

    if (title && description && code && price && stock && category) {
        socket.emit("newProduct", {
            title,
            description,
            code,
            price: parseFloat(price),
            stock: parseInt(stock),
            category
        });
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

function deleteProduct(productId) {
    socket.emit("deleteProduct", productId);
}

socket.on("error", (message) => {
    alert(message);
});
