# Productos GraphQL API

API con Express, Apollo Server y Mongoose para consultar y actualizar productos en MongoDB Atlas.

## Ejecución local

1. Instala Node.js 20 o posterior.
2. Define `MONGODB_URI` con la cadena de conexión de Atlas. La aplicación selecciona `DBProductos` mediante `MONGODB_DATABASE` (ese nombre prevalece sobre la base que aparezca en la URI). Configura en Atlas el acceso de red para Render y los permisos del usuario de base de datos.
3. Ejecuta `npm install` y luego `npm start`.
4. Abre `http://localhost:4000/graphql` para usar Apollo Sandbox. El endpoint `/health` informa el estado de la conexión.

## Operaciones GraphQL

Consultar todos los productos:

```graphql
query {
  products {
    id
    name
    price
    stock
    category
    description
  }
}
```

Filtrar productos (todos los filtros son opcionales y se combinan):

```graphql
query {
  products(filter: { category: "Accesorios", minPrice: 10, maxPrice: 100, inStock: true, name: "cable" }) {
    id
    name
    price
    stock
    category
    description
  }
}
```

Actualizar uno o varios campos:

```graphql
mutation {
  updateProduct(id: "ID_DEL_PRODUCTO", input: { price: 24.99, stock: 12 }) {
    id
    name
    price
    stock
    category
    description
  }
}
```

También está disponible `product(id: ID!)` para obtener un producto individual.

## Despliegue en Render

Usa el `render.yaml` incluido (Blueprint) o configura un Web Service con `npm install` como build command y `npm start` como start command. Define `MONGODB_URI` en el panel de Render usando la cadena de conexión de Atlas; `MONGODB_DATABASE` ya apunta a `DBProductos`. No subas `.env` al repositorio. El endpoint `/graphql` mantiene activa la introspección y sirve Apollo Sandbox.