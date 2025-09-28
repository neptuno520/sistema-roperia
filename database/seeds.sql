/*insert into Usuario (
    id_rol, id_tienda, nombre, email, password_hash, estado)
	values(1, 1, 'Alex', 'alexroap99@gmail.com', '123456', true);
insert into Rol(nombre) values('Administrador');
insert into tienda(nombre, direccion, telefono)
values ('Casa matriz', 'Avda. San José', '+595973890240');
*/
-- =============================================
-- DATOS DE PRUEBA - SISTEMA TIENDA DE ROPA
-- =============================================

-- Limpiar datos existentes (opcional - cuidado en producción)
-- DELETE FROM MovimientoStock;
-- DELETE FROM DetalleVenta;
-- DELETE FROM DetalleCompra;
-- DELETE FROM Venta;
-- DELETE FROM Compra;
-- DELETE FROM Pago;
-- DELETE FROM Producto;
-- DELETE FROM CategoriaProducto;
-- DELETE FROM Cliente;
-- DELETE FROM Proveedor;
-- DELETE FROM Usuario;
-- DELETE FROM Tienda;
-- DELETE FROM Rol;
-- DELETE FROM MetodoPago;
-- DELETE FROM TipoMovimiento;

-- 1. ROLES DEL SISTEMA
INSERT INTO Rol (nombre) VALUES 
('Administrador'),
('Vendedor'), 
('Inventario');

-- 2. MÉTODOS DE PAGO
INSERT INTO MetodoPago (nombre) VALUES 
('Efectivo'),
('Tarjeta Débito'),
('Tarjeta Crédito'),
('Transferencia');

-- 3. TIPOS DE MOVIMIENTO DE STOCK
INSERT INTO TipoMovimiento (descripcion) VALUES 
('Compra a proveedor'),
('Venta a cliente'),
('Ajuste de inventario'),
('Devolución');

-- 4. TIENDAS
INSERT INTO Tienda (nombre, direccion, telefono) VALUES
('Tienda Central', 'Av. Principal 123, Ciudad', '+57 601 123 4567'),
('Sucursal Norte', 'Calle 45 #67-89, Norte', '+57 601 987 6543');

-- 5. USUARIOS DEL SISTEMA
INSERT INTO Usuario (id_rol, id_tienda, nombre, email, password_hash, estado) VALUES 
-- Administradores
(1, 1, 'Ana González', 'admin@tiendaropa.com', '123456', true),
(1, 2, 'Carlos Rodríguez', 'carlos@tiendaropa.com', '123456', true),
-- Vendedores
(2, 1, 'María López', 'maria@tiendaropa.com', '123456', true),
(2, 1, 'Pedro Martínez', 'pedro@tiendaropa.com', '123456', true),
(2, 2, 'Laura García', 'laura@tiendaropa.com', '123456', true),
-- Inventario
(3, 1, 'Roberto Silva', 'inventario@tiendaropa.com', '123456', true);

-- 6. CATEGORÍAS DE PRODUCTOS
INSERT INTO CategoriaProducto (nombre, descripcion) VALUES
('Camisetas', 'Prendas superiores de algodón y mezclilla'),
('Pantalones', 'Jeans, vestir y deportivos'),
('Zapatos', 'Calzado formal, casual y deportivo'),
('Accesorios', 'Bolsos, cinturones y complementos'),
('Ropa Interior', 'Prendas íntimas y calcetines');

-- 7. PROVEEDORES
INSERT INTO Proveedor (ruc, nombre, telefono, direccion, email) VALUES
('901234567-1', 'Textiles Nacionales S.A.', '+57 601 555 0101', 'Zona Industrial, Bodega 45', 'contacto@textilesnac.com'),
('901234568-1', 'Calzado Premium Ltda.', '+57 604 555 0202', 'Calle 80 #12-34, Medellín', 'ventas@calzadopremium.co'),
('901234569-1', 'Importaciones Moda S.A.S.', '+57 605 555 0303', 'Centro Comercial Plaza, Local 23', 'info@importmoda.com');

-- 8. CLIENTES
INSERT INTO Cliente (nombre, apellido, documento, direccion, telefono, email) VALUES
('Juan', 'Pérez', '1234567890', 'Calle 123 #45-67', '+57 300 111 2233', 'juan.perez@email.com'),
('María', 'Gómez', '0987654321', 'Av. Siempre Viva 742', '+57 300 444 5566', 'maria.gomez@email.com'),
('Carlos', 'López', '1122334455', 'Carrera 56 #78-90', '+57 300 777 8899', 'carlos.lopez@email.com'),
('Ana', 'Martínez', '5566778899', 'Diagonal 34 #12-34', '+57 300 222 3344', 'ana.martinez@email.com');

-- 9. PRODUCTOS - CAMISETAS
INSERT INTO Producto (id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock) VALUES
(1, 'Camiseta Básica Algodón', 10, '7501001234567', 'Blanco', 'S', 25000, 50),
(1, 'Camiseta Básica Algodón', 10, '7501001234568', 'Blanco', 'M', 25000, 45),
(1, 'Camiseta Básica Algodón', 10, '7501001234569', 'Blanco', 'L', 25000, 40),
(1, 'Camiseta Básica Algodón', 10, '7501001234570', 'Blanco', 'XL', 25000, 35),
(1, 'Camiseta Premium Pima', 10, '7501001234571', 'Negro', 'S', 35000, 30),
(1, 'Camiseta Premium Pima', 10, '7501001234572', 'Negro', 'M', 35000, 25),
(1, 'Camiseta Manga Larga', 10, '7501001234573', 'Gris', 'M', 45000, 20),
(1, 'Polo Clásico', 10, '7501001234574', 'Azul Marino', 'L', 38000, 15);

-- 10. PRODUCTOS - PANTALONES
INSERT INTO Producto (id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock) VALUES
(2, 'Jeans Slim Fit', 10, '7501001234575', 'Azul Claro', '30', 89000, 25),
(2, 'Jeans Slim Fit', 10, '7501001234576', 'Azul Claro', '32', 89000, 20),
(2, 'Jeans Slim Fit', 10, '7501001234577', 'Azul Claro', '34', 89000, 15),
(2, 'Jeans Regular Fit', 10, '7501001234578', 'Azul Oscuro', '32', 79000, 30),
(2, 'Pantalón de Vestir', 10, '7501001234579', 'Negro', '32', 120000, 12),
(2, 'Pantalón de Vestir', 10, '7501001234580', 'Gris', '34', 120000, 10),
(2, 'Short Deportivo', 10, '7501001234581', 'Rojo', 'M', 45000, 40);

-- 11. PRODUCTOS - ZAPATOS
INSERT INTO Producto (id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock) VALUES
(3, 'Zapatos Formales Cuero', 10, '7501001234582', 'Negro', '40', 250000, 8),
(3, 'Zapatos Formales Cuero', 10, '7501001234583', 'Café', '42', 250000, 6),
(3, 'Tenis Deportivos Running', 10, '7501001234584', 'Blanco', '41', 180000, 15),
(3, 'Tenis Deportivos Running', 10, '7501001234585', 'Azul', '43', 180000, 12),
(3, 'Sandalias Casual', 10, '7501001234586', 'Marrón', '39', 75000, 20);

-- 12. PRODUCTOS - ACCESORIOS
INSERT INTO Producto (id_categoria, nombre, iva, codigo_barras, color, talla, precio, stock) VALUES
(4, 'Cinturón Cuero Genuino', 10, '7501001234587', 'Negro', 'Única', 45000, 25),
(4, 'Bolso Messenger', 10, '7501001234588', 'Azul', 'Única', 95000, 10),
(4, 'Gorra Deportiva', 10, '7501001234589', 'Rojo', 'Única', 35000, 30);

-- 13. INVENTARIO INICIAL
INSERT INTO Inventario (id_tienda, id_producto, stock_disponible) VALUES
-- Tienda 1 - Stock variado
(1, 1, 25), (1, 2, 20), (1, 3, 15), (1, 4, 10),
(1, 5, 15), (1, 6, 12), (1, 7, 8), (1, 8, 5),
(1, 9, 10), (1, 10, 8), (1, 11, 5), (1, 12, 6),
-- Tienda 2 - Stock reducido
(2, 1, 15), (2, 2, 12), (2, 3, 10), (2, 4, 8),
(2, 5, 8), (2, 6, 6), (2, 13, 4), (2, 14, 3);

-- 14. VENTAS DE EJEMPLO (opcional - para probar módulo de ventas después)
INSERT INTO Venta (id_cliente, id_usuario, total, estado) VALUES
(1, 3, 189000, true),
(2, 4, 255000, true);

INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario, iva) VALUES
(1, 1, 2, 25000, 10),
(1, 9, 1, 89000, 10),
(2, 5, 1, 35000, 10),
(2, 13, 1, 250000, 10);

INSERT INTO Pago (id_venta, id_metodo, monto) VALUES
(1, 1, 189000),
(2, 2, 255000);

-- Mensaje de confirmación
SELECT '✅ Datos de prueba insertados correctamente' as mensaje;

-- Verificar datos insertados
SELECT 'Roles: ' || COUNT(*) FROM Rol
UNION ALL SELECT 'Usuarios: ' || COUNT(*) FROM Usuario
UNION ALL SELECT 'Productos: ' || COUNT(*) FROM Producto
UNION ALL SELECT 'Clientes: ' || COUNT(*) FROM Cliente;