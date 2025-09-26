insert into Usuario (
    id_rol, id_tienda, nombre, email, password_hash, estado)
	values(1, 1, 'Alex', 'alexroap99@gmail.com', '123456', true);
insert into Rol(nombre) values('Administrador');
insert into tienda(nombre, direccion, telefono)
values ('Casa matriz', 'Avda. San José', '+595973890240');