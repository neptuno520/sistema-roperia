<<<<<<< Updated upstream

INSERT INTO public.categoriaproducto VALUES (1, 'Camisetas', 'Prendas superiores de algodón y mezclilla');
INSERT INTO public.categoriaproducto VALUES (2, 'Pantalones', 'Jeans, vestir y deportivos');
INSERT INTO public.categoriaproducto VALUES (3, 'Zapatos', 'Calzado formal, casual y deportivo');
INSERT INTO public.categoriaproducto VALUES (4, 'Accesorios', 'Bolsos, cinturones y complementos');
INSERT INTO public.categoriaproducto VALUES (5, 'Ropa Interior', 'Prendas íntimas y calcetines');




INSERT INTO public.cliente VALUES (1, 'Juan', 'Pérez', '1234567890', 'Calle 123 #45-67', '+57 300 111 2233', 'juan.perez@email.com');
INSERT INTO public.cliente VALUES (2, 'María', 'Gómez', '0987654321', 'Av. Siempre Viva 742', '+57 300 444 5566', 'maria.gomez@email.com');
INSERT INTO public.cliente VALUES (3, 'Carlos', 'López', '1122334455', 'Carrera 56 #78-90', '+57 300 777 8899', 'carlos.lopez@email.com');
INSERT INTO public.cliente VALUES (4, 'Ana', 'Martínez', '5566778899', 'Diagonal 34 #12-34', '+57 300 222 3344', 'ana.martinez@email.com');



INSERT INTO public.proveedor VALUES (1, '901234567-1', 'Textiles Nacionales S.A.', '+57 601 555 0101', 'Zona Industrial, Bodega 45', 'contacto@textilesnac.com');
INSERT INTO public.proveedor VALUES (2, '901234568-1', 'Calzado Premium Ltda.', '+57 604 555 0202', 'Calle 80 #12-34, Medellín', 'ventas@calzadopremium.co');
INSERT INTO public.proveedor VALUES (3, '901234569-1', 'Importaciones Moda S.A.S.', '+57 605 555 0303', 'Centro Comercial Plaza, Local 23', 'info@importmoda.com');



INSERT INTO public.rol VALUES (1, 'Administrador');
INSERT INTO public.rol VALUES (2, 'Vendedor');
INSERT INTO public.rol VALUES (3, 'Inventario');



INSERT INTO public.tienda VALUES (1, 'Tienda Central', 'Av. Principal 123, Ciudad', '+57 601 123 4567');
INSERT INTO public.tienda VALUES (2, 'Sucursal Norte', 'Calle 45 #67-89, Norte', '+57 601 987 6543');



INSERT INTO public.usuario VALUES (1, 1, 1, 'Ana González', 'admin@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (2, 1, 2, 'Carlos Rodríguez', 'carlos@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (3, 2, 1, 'María López', 'maria@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (4, 2, 1, 'Pedro Martínez', 'pedro@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (5, 2, 2, 'Laura García', 'laura@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (6, 3, 1, 'Roberto Silva', 'inventario@tiendaropa.com', '123456', true);



INSERT INTO public.producto VALUES (2, 1, 'Camiseta Básica Algodón', 10, '7501001234568', 'Blanco', 'M', 25000, 20);
INSERT INTO public.producto VALUES (3, 1, 'Camiseta Básica Algodón', 10, '7501001234569', 'Blanco', 'L', 25000, 15);
INSERT INTO public.producto VALUES (4, 1, 'Camiseta Básica Algodón', 10, '7501001234570', 'Blanco', 'XL', 25000, 10);
INSERT INTO public.producto VALUES (5, 1, 'Camiseta Premium Pima', 10, '7501001234571', 'Negro', 'S', 35000, 15);
INSERT INTO public.producto VALUES (6, 1, 'Camiseta Premium Pima', 10, '7501001234572', 'Negro', 'M', 35000, 12);
INSERT INTO public.producto VALUES (8, 1, 'Polo Clásico', 10, '7501001234574', 'Azul Marino', 'L', 38000, 5);
INSERT INTO public.producto VALUES (9, 2, 'Jeans Slim Fit', 10, '7501001234575', 'Azul Claro', '30', 89000, 10);
INSERT INTO public.producto VALUES (10, 2, 'Jeans Slim Fit', 10, '7501001234576', 'Azul Claro', '32', 89000, 8);
INSERT INTO public.producto VALUES (11, 2, 'Jeans Slim Fit', 10, '7501001234577', 'Azul Claro', '34', 89000, 5);
INSERT INTO public.producto VALUES (12, 2, 'Jeans Regular Fit', 10, '7501001234578', 'Azul Oscuro', '32', 79000, 6);
INSERT INTO public.producto VALUES (13, 2, 'Pantalón de Vestir', 10, '7501001234579', 'Negro', '32', 120000, 12);
INSERT INTO public.producto VALUES (14, 2, 'Pantalón de Vestir', 10, '7501001234580', 'Gris', '34', 120000, 10);
INSERT INTO public.producto VALUES (15, 2, 'Short Deportivo', 10, '7501001234581', 'Rojo', 'M', 45000, 40);
INSERT INTO public.producto VALUES (16, 3, 'Zapatos Formales Cuero', 10, '7501001234582', 'Negro', '40', 250000, 8);
INSERT INTO public.producto VALUES (17, 3, 'Zapatos Formales Cuero', 10, '7501001234583', 'Café', '42', 250000, 6);
INSERT INTO public.producto VALUES (18, 3, 'Tenis Deportivos Running', 10, '7501001234584', 'Blanco', '41', 180000, 15);
INSERT INTO public.producto VALUES (19, 3, 'Tenis Deportivos Running', 10, '7501001234585', 'Azul', '43', 180000, 12);
INSERT INTO public.producto VALUES (20, 3, 'Sandalias Casual', 10, '7501001234586', 'Marrón', '39', 75000, 20);
INSERT INTO public.producto VALUES (23, 4, 'Gorra Deportiva', 10, '7501001234589', 'Rojo', 'Única', 35000, 30);
INSERT INTO public.producto VALUES (7, 1, 'Camiseta Manga Larga', 10, '7501001234573', 'Gris', 'M', 45000, 8);
INSERT INTO public.producto VALUES (1, 1, 'Camiseta Básica Algodón', 10, '7501001234567', 'Blanco', 'S', 25000, 30);
INSERT INTO public.producto VALUES (21, 4, 'Cinturón Cuero Genuino', 10, '7501001234587', 'Negro', 'Única', 45000, 6);
INSERT INTO public.producto VALUES (22, 4, 'Bolso Messenger', 10, '7501001234588', 'Azul', 'Única', 95001, 5);




INSERT INTO public.venta VALUES (1, 1, 3, '2025-09-28 17:36:42.587958', 189000.00, true);
INSERT INTO public.venta VALUES (2, 2, 4, '2025-09-28 17:36:42.587958', 255000.00, true);
INSERT INTO public.venta VALUES (3, 1, 1, '2025-09-28 20:29:22.824896', 55000.00, true);
INSERT INTO public.venta VALUES (4, 3, 1, '2025-09-28 20:42:59.357388', 49500.00, true);
INSERT INTO public.venta VALUES (5, 3, 1, '2025-09-29 18:49:47.892126', 148500.00, true);


INSERT INTO public.detalleventa VALUES (1, 1, 1, 2, 25000.00, 10);
INSERT INTO public.detalleventa VALUES (2, 1, 9, 1, 89000.00, 10);
INSERT INTO public.detalleventa VALUES (3, 2, 5, 1, 35000.00, 10);
INSERT INTO public.detalleventa VALUES (4, 2, 13, 1, 250000.00, 10);
INSERT INTO public.detalleventa VALUES (5, 3, 1, 2, 25000.00, 10);
INSERT INTO public.detalleventa VALUES (6, 4, 7, 1, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (7, 5, 21, 3, 45000.00, 10);



INSERT INTO public.inventario VALUES (2, 1, 15);
INSERT INTO public.inventario VALUES (2, 2, 12);
INSERT INTO public.inventario VALUES (2, 3, 10);
INSERT INTO public.inventario VALUES (2, 4, 8);
INSERT INTO public.inventario VALUES (2, 5, 8);
INSERT INTO public.inventario VALUES (2, 6, 6);
INSERT INTO public.inventario VALUES (2, 13, 4);
INSERT INTO public.inventario VALUES (2, 14, 3);
INSERT INTO public.inventario VALUES (1, 2, 20);
INSERT INTO public.inventario VALUES (1, 3, 15);
INSERT INTO public.inventario VALUES (1, 4, 10);
INSERT INTO public.inventario VALUES (1, 5, 15);
INSERT INTO public.inventario VALUES (1, 6, 12);
INSERT INTO public.inventario VALUES (1, 8, 5);
INSERT INTO public.inventario VALUES (1, 9, 10);
INSERT INTO public.inventario VALUES (1, 10, 8);
INSERT INTO public.inventario VALUES (1, 11, 5);
INSERT INTO public.inventario VALUES (1, 12, 6);
INSERT INTO public.inventario VALUES (1, 13, 12);
INSERT INTO public.inventario VALUES (1, 14, 10);
INSERT INTO public.inventario VALUES (1, 15, 40);
INSERT INTO public.inventario VALUES (1, 16, 8);
INSERT INTO public.inventario VALUES (1, 17, 6);
INSERT INTO public.inventario VALUES (1, 18, 15);
INSERT INTO public.inventario VALUES (1, 19, 12);
INSERT INTO public.inventario VALUES (1, 20, 20);
INSERT INTO public.inventario VALUES (1, 22, 10);
INSERT INTO public.inventario VALUES (1, 23, 30);
INSERT INTO public.inventario VALUES (1, 7, 8);
INSERT INTO public.inventario VALUES (1, 1, 30);
INSERT INTO public.inventario VALUES (1, 21, 6);



INSERT INTO public.metodopago VALUES (1, 'Efectivo');
INSERT INTO public.metodopago VALUES (2, 'Tarjeta Débito');
INSERT INTO public.metodopago VALUES (3, 'Tarjeta Crédito');
INSERT INTO public.metodopago VALUES (4, 'Transferencia');



INSERT INTO public.tipomovimiento VALUES (1, 'Compra a proveedor');
INSERT INTO public.tipomovimiento VALUES (2, 'Venta a cliente');
INSERT INTO public.tipomovimiento VALUES (3, 'Ajuste de inventario');
INSERT INTO public.tipomovimiento VALUES (4, 'Devolución');



INSERT INTO public.movimientostock VALUES (1, 2, 1, 1, 3, NULL, '2025-09-28 20:29:22.824896', -2);
INSERT INTO public.movimientostock VALUES (2, 2, 7, 1, 4, NULL, '2025-09-28 20:42:59.357388', -1);
INSERT INTO public.movimientostock VALUES (3, 3, 1, 1, NULL, NULL, '2025-09-29 17:42:10.159605', 5);
INSERT INTO public.movimientostock VALUES (4, 3, 21, 1, NULL, NULL, '2025-09-29 18:01:29.915741', 4);
INSERT INTO public.movimientostock VALUES (5, 3, 21, 1, NULL, NULL, '2025-09-29 18:48:22.654905', 5);
INSERT INTO public.movimientostock VALUES (6, 2, 21, 1, 5, NULL, '2025-09-29 18:49:47.892126', -3);




INSERT INTO public.pago VALUES (1, 1, 1, 189000, '2025-09-28');
INSERT INTO public.pago VALUES (2, 2, 2, 255000, '2025-09-28');
INSERT INTO public.pago VALUES (3, 3, 1, 55000, '2025-09-28');
INSERT INTO public.pago VALUES (4, 4, 1, 49500, '2025-09-28');
INSERT INTO public.pago VALUES (5, 5, 1, 148500, '2025-09-29');



SELECT pg_catalog.setval('public.categoriaproducto_id_categoria_seq', 5, true);



SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 4, true);



SELECT pg_catalog.setval('public.compra_id_compra_seq', 1, false);


SELECT pg_catalog.setval('public.detallecompra_id_detalle_seq', 1, false);



SELECT pg_catalog.setval('public.detalleventa_id_detalle_seq', 7, true);



SELECT pg_catalog.setval('public.metodopago_id_metodo_seq', 4, true);



SELECT pg_catalog.setval('public.movimientostock_id_movimiento_seq', 6, true);

SELECT pg_catalog.setval('public.pago_id_pago_seq', 5, true);


SELECT pg_catalog.setval('public.producto_id_producto_seq', 23, true);



SELECT pg_catalog.setval('public.proveedor_id_proveedor_seq', 3, true);


SELECT pg_catalog.setval('public.rol_id_rol_seq', 3, true);


SELECT pg_catalog.setval('public.tienda_id_tienda_seq', 2, true);

SELECT pg_catalog.setval('public.tipomovimiento_id_tipo_seq', 4, true);


SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 6, true);


SELECT pg_catalog.setval('public.venta_id_venta_seq', 5, true);


=======
insert into Usuario (
    id_rol, id_tienda, nombre, email, password_hash, estado)
	values(1, 1, 'Alex', 'alexroap99@gmail.com', '123456', true);
insert into Rol(nombre) values('Administrador');
insert into tienda(nombre, direccion, telefono)
values ('Casa matriz', 'Avda. San José', '+595973890240');
>>>>>>> Stashed changes
