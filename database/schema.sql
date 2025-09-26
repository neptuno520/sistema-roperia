-- ===========================
-- TABLAS PRINCIPALES
-- ===========================

CREATE TABLE Rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Tienda (
    id_tienda SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(50)
);

CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL,
    id_tienda INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_tienda) REFERENCES Tienda(id_tienda)
);

CREATE TABLE Cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(50) UNIQUE NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(150) UNIQUE
);

CREATE TABLE Proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    ruc VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    direccion VARCHAR(255),
    email VARCHAR(150)
);

CREATE TABLE CategoriaProducto (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Producto (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    iva INT CHECK (iva IN (0,5,10)), -- ajustable según normativa
    codigo_barras VARCHAR(100) UNIQUE,
    color VARCHAR(50),
    talla VARCHAR(50),
    precio INT NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (id_categoria) REFERENCES CategoriaProducto(id_categoria)
);

-- ===========================
-- VENTAS Y PAGOS
-- ===========================

CREATE TABLE Venta (
    id_venta SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(14,2) NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE DetalleVenta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    iva INT,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE MetodoPago (
    id_metodo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Pago (
    id_pago SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    id_metodo INT NOT NULL,
    monto INT NOT NULL,
    fecha_pago DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo) REFERENCES MetodoPago(id_metodo)
);

-- ===========================
-- COMPRAS
-- ===========================

CREATE TABLE Compra (
    id_compra SERIAL PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(14,2) NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE DetalleCompra (
    id_detalle SERIAL PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    costo_unitario INT NOT NULL,
    iva INT,
    FOREIGN KEY (id_compra) REFERENCES Compra(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- ===========================
-- STOCK E INVENTARIO
-- ===========================

CREATE TABLE TipoMovimiento (
    id_tipo SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL
);

CREATE TABLE MovimientoStock (
    id_movimiento SERIAL PRIMARY KEY,
    id_tipo INT NOT NULL,
    id_producto INT NOT NULL,
    id_tienda INT NOT NULL,
    id_venta INT,
    id_compra INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES TipoMovimiento(id_tipo),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_tienda) REFERENCES Tienda(id_tienda),
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
    FOREIGN KEY (id_compra) REFERENCES Compra(id_compra)
);

CREATE TABLE Inventario (
    id_tienda INT NOT NULL,
    id_producto INT NOT NULL,
    stock_disponible INT DEFAULT 0,
    PRIMARY KEY (id_tienda, id_producto),
    FOREIGN KEY (id_tienda) REFERENCES Tienda(id_tienda),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);