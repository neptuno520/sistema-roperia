--
-- PostgreSQL database dump
--

\restrict 6KamhJNhdwPD9xQjJsKTBbm4ICLldthcHtnNgMbib4E0ehOM5CvNusippikjgem

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

-- Started on 2025-10-16 19:58:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 17177)
-- Name: categoriaproducto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoriaproducto (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE public.categoriaproducto OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17176)
-- Name: categoriaproducto_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoriaproducto_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoriaproducto_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 227
-- Name: categoriaproducto_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoriaproducto_id_categoria_seq OWNED BY public.categoriaproducto.id_categoria;


--
-- TOC entry 224 (class 1259 OID 17153)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    documento character varying(50) NOT NULL,
    direccion character varying(255),
    telefono character varying(50),
    email character varying(150)
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17152)
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 223
-- Name: cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;


--
-- TOC entry 240 (class 1259 OID 17263)
-- Name: compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compra (
    id_compra integer NOT NULL,
    id_proveedor integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total numeric(14,2) NOT NULL,
    estado boolean DEFAULT true
);


ALTER TABLE public.compra OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17262)
-- Name: compra_id_compra_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compra_id_compra_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compra_id_compra_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 239
-- Name: compra_id_compra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compra_id_compra_seq OWNED BY public.compra.id_compra;


--
-- TOC entry 242 (class 1259 OID 17282)
-- Name: detallecompra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detallecompra (
    id_detalle integer NOT NULL,
    id_compra integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad integer NOT NULL,
    costo_unitario integer NOT NULL,
    iva integer
);


ALTER TABLE public.detallecompra OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17281)
-- Name: detallecompra_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detallecompra_id_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detallecompra_id_detalle_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 241
-- Name: detallecompra_id_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detallecompra_id_detalle_seq OWNED BY public.detallecompra.id_detalle;


--
-- TOC entry 234 (class 1259 OID 17221)
-- Name: detalleventa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalleventa (
    id_detalle integer NOT NULL,
    id_venta integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(12,2) NOT NULL,
    iva integer
);


ALTER TABLE public.detalleventa OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17220)
-- Name: detalleventa_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalleventa_id_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalleventa_id_detalle_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 233
-- Name: detalleventa_id_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalleventa_id_detalle_seq OWNED BY public.detalleventa.id_detalle;


--
-- TOC entry 247 (class 1259 OID 17338)
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id_tienda integer NOT NULL,
    id_producto integer NOT NULL,
    stock_disponible integer DEFAULT 0
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17238)
-- Name: metodopago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodopago (
    id_metodo integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.metodopago OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17237)
-- Name: metodopago_id_metodo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metodopago_id_metodo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metodopago_id_metodo_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 235
-- Name: metodopago_id_metodo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metodopago_id_metodo_seq OWNED BY public.metodopago.id_metodo;


--
-- TOC entry 246 (class 1259 OID 17306)
-- Name: movimientostock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientostock (
    id_movimiento integer NOT NULL,
    id_tipo integer NOT NULL,
    id_producto integer NOT NULL,
    id_tienda integer NOT NULL,
    id_venta integer,
    id_compra integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cantidad integer NOT NULL
);


ALTER TABLE public.movimientostock OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17305)
-- Name: movimientostock_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientostock_id_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimientostock_id_movimiento_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 245
-- Name: movimientostock_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientostock_id_movimiento_seq OWNED BY public.movimientostock.id_movimiento;


--
-- TOC entry 238 (class 1259 OID 17245)
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_venta integer NOT NULL,
    id_metodo integer NOT NULL,
    monto integer NOT NULL,
    fecha_pago date DEFAULT CURRENT_DATE
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17244)
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pago_id_pago_seq OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 237
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.pago.id_pago;


--
-- TOC entry 230 (class 1259 OID 17186)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    id_categoria integer NOT NULL,
    nombre character varying(150) NOT NULL,
    iva integer,
    codigo_barras character varying(100),
    color character varying(50),
    talla character varying(50),
    precio integer NOT NULL,
    stock integer DEFAULT 0,
    CONSTRAINT producto_iva_check CHECK ((iva = ANY (ARRAY[0, 5, 10])))
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17185)
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_producto_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 229
-- Name: producto_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;


--
-- TOC entry 226 (class 1259 OID 17166)
-- Name: proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor (
    id_proveedor integer NOT NULL,
    ruc character varying(50) NOT NULL,
    nombre character varying(150) NOT NULL,
    telefono character varying(50),
    direccion character varying(255),
    email character varying(150)
);


ALTER TABLE public.proveedor OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17165)
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proveedor_id_proveedor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedor_id_proveedor_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 225
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proveedor_id_proveedor_seq OWNED BY public.proveedor.id_proveedor;


--
-- TOC entry 218 (class 1259 OID 17117)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17116)
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_rol_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 217
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- TOC entry 220 (class 1259 OID 17124)
-- Name: tienda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tienda (
    id_tienda integer NOT NULL,
    nombre character varying(150) NOT NULL,
    direccion character varying(255),
    telefono character varying(50)
);


ALTER TABLE public.tienda OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17123)
-- Name: tienda_id_tienda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tienda_id_tienda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tienda_id_tienda_seq OWNER TO postgres;

--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 219
-- Name: tienda_id_tienda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tienda_id_tienda_seq OWNED BY public.tienda.id_tienda;


--
-- TOC entry 244 (class 1259 OID 17299)
-- Name: tipomovimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipomovimiento (
    id_tipo integer NOT NULL,
    descripcion character varying(150) NOT NULL
);


ALTER TABLE public.tipomovimiento OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17298)
-- Name: tipomovimiento_id_tipo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipomovimiento_id_tipo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipomovimiento_id_tipo_seq OWNER TO postgres;

--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 243
-- Name: tipomovimiento_id_tipo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipomovimiento_id_tipo_seq OWNED BY public.tipomovimiento.id_tipo;


--
-- TOC entry 222 (class 1259 OID 17131)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    id_rol integer NOT NULL,
    id_tienda integer NOT NULL,
    nombre character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    estado boolean DEFAULT true
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17130)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 232 (class 1259 OID 17202)
-- Name: venta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venta (
    id_venta integer NOT NULL,
    id_cliente integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total numeric(14,2) NOT NULL,
    estado boolean DEFAULT true
);


ALTER TABLE public.venta OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17201)
-- Name: venta_id_venta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venta_id_venta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venta_id_venta_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 231
-- Name: venta_id_venta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venta_id_venta_seq OWNED BY public.venta.id_venta;


--
-- TOC entry 4770 (class 2604 OID 17180)
-- Name: categoriaproducto id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoriaproducto ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoriaproducto_id_categoria_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 17156)
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 17266)
-- Name: compra id_compra; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compra ALTER COLUMN id_compra SET DEFAULT nextval('public.compra_id_compra_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 17285)
-- Name: detallecompra id_detalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallecompra ALTER COLUMN id_detalle SET DEFAULT nextval('public.detallecompra_id_detalle_seq'::regclass);


--
-- TOC entry 4776 (class 2604 OID 17224)
-- Name: detalleventa id_detalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalleventa ALTER COLUMN id_detalle SET DEFAULT nextval('public.detalleventa_id_detalle_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 17241)
-- Name: metodopago id_metodo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodopago ALTER COLUMN id_metodo SET DEFAULT nextval('public.metodopago_id_metodo_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 17309)
-- Name: movimientostock id_movimiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock ALTER COLUMN id_movimiento SET DEFAULT nextval('public.movimientostock_id_movimiento_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 17248)
-- Name: pago id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago ALTER COLUMN id_pago SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);


--
-- TOC entry 4771 (class 2604 OID 17189)
-- Name: producto id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 17169)
-- Name: proveedor id_proveedor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN id_proveedor SET DEFAULT nextval('public.proveedor_id_proveedor_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 17120)
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 17127)
-- Name: tienda id_tienda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tienda ALTER COLUMN id_tienda SET DEFAULT nextval('public.tienda_id_tienda_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 17302)
-- Name: tipomovimiento id_tipo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipomovimiento ALTER COLUMN id_tipo SET DEFAULT nextval('public.tipomovimiento_id_tipo_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 17134)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4773 (class 2604 OID 17205)
-- Name: venta id_venta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta ALTER COLUMN id_venta SET DEFAULT nextval('public.venta_id_venta_seq'::regclass);


--
-- TOC entry 5005 (class 0 OID 17177)
-- Dependencies: 228
-- Data for Name: categoriaproducto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categoriaproducto VALUES (1, 'Camisetas', 'Prendas superiores de algodón y mezclilla');
INSERT INTO public.categoriaproducto VALUES (2, 'Pantalones', 'Jeans, vestir y deportivos');
INSERT INTO public.categoriaproducto VALUES (3, 'Zapatos', 'Calzado formal, casual y deportivo');
INSERT INTO public.categoriaproducto VALUES (4, 'Accesorios', 'Bolsos, cinturones y complementos');
INSERT INTO public.categoriaproducto VALUES (5, 'Ropa Interior', 'Prendas íntimas y calcetines');


--
-- TOC entry 5001 (class 0 OID 17153)
-- Dependencies: 224
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cliente VALUES (1, 'Juan', 'Pérez', '1234567890', 'Calle 123 #45-67', '+57 300 111 2233', 'juan.perez@email.com');
INSERT INTO public.cliente VALUES (2, 'María', 'Gómez', '0987654321', 'Av. Siempre Viva 742', '+57 300 444 5566', 'maria.gomez@email.com');
INSERT INTO public.cliente VALUES (3, 'Carlos', 'López', '1122334455', 'Carrera 56 #78-90', '+57 300 777 8899', 'carlos.lopez@email.com');
INSERT INTO public.cliente VALUES (4, 'Ana', 'Martínez', '5566778899', 'Diagonal 34 #12-34', '+57 300 222 3344', 'ana.martinez@email.com');


--
-- TOC entry 5017 (class 0 OID 17263)
-- Dependencies: 240
-- Data for Name: compra; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5019 (class 0 OID 17282)
-- Dependencies: 242
-- Data for Name: detallecompra; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5011 (class 0 OID 17221)
-- Dependencies: 234
-- Data for Name: detalleventa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.detalleventa VALUES (1, 1, 1, 2, 25000.00, 10);
INSERT INTO public.detalleventa VALUES (2, 1, 9, 1, 89000.00, 10);
INSERT INTO public.detalleventa VALUES (3, 2, 5, 1, 35000.00, 10);
INSERT INTO public.detalleventa VALUES (4, 2, 13, 1, 250000.00, 10);
INSERT INTO public.detalleventa VALUES (5, 3, 1, 2, 25000.00, 10);
INSERT INTO public.detalleventa VALUES (6, 4, 7, 1, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (7, 5, 21, 3, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (8, 6, 21, 2, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (9, 7, 21, 1, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (10, 8, 21, 1, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (11, 9, 23, 1, 35000.00, 10);
INSERT INTO public.detalleventa VALUES (12, 10, 23, 1, 35000.00, 10);
INSERT INTO public.detalleventa VALUES (13, 11, 23, 1, 35000.00, 10);
INSERT INTO public.detalleventa VALUES (14, 12, 23, 1, 35000.00, 10);
INSERT INTO public.detalleventa VALUES (15, 13, 21, 1, 45000.00, 10);
INSERT INTO public.detalleventa VALUES (18, 16, 19, 1, 180000.00, 10);
INSERT INTO public.detalleventa VALUES (19, 17, 23, 1, 35000.00, 10);


--
-- TOC entry 5024 (class 0 OID 17338)
-- Dependencies: 247
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inventario VALUES (1, 21, 6);
INSERT INTO public.inventario VALUES (1, 19, 11);
INSERT INTO public.inventario VALUES (1, 23, 25);
INSERT INTO public.inventario VALUES (1, 8, 5);
INSERT INTO public.inventario VALUES (1, 1, 30);
INSERT INTO public.inventario VALUES (1, 11, 5);
INSERT INTO public.inventario VALUES (1, 9, 10);
INSERT INTO public.inventario VALUES (1, 5, 15);
INSERT INTO public.inventario VALUES (1, 3, 15);
INSERT INTO public.inventario VALUES (1, 13, 12);
INSERT INTO public.inventario VALUES (1, 15, 40);
INSERT INTO public.inventario VALUES (1, 4, 10);
INSERT INTO public.inventario VALUES (1, 6, 12);
INSERT INTO public.inventario VALUES (1, 10, 8);
INSERT INTO public.inventario VALUES (1, 17, 6);
INSERT INTO public.inventario VALUES (1, 2, 20);
INSERT INTO public.inventario VALUES (1, 12, 6);
INSERT INTO public.inventario VALUES (1, 16, 8);
INSERT INTO public.inventario VALUES (1, 7, 8);
INSERT INTO public.inventario VALUES (1, 22, 10);
INSERT INTO public.inventario VALUES (1, 20, 20);
INSERT INTO public.inventario VALUES (1, 18, 15);
INSERT INTO public.inventario VALUES (1, 14, 10);
INSERT INTO public.inventario VALUES (2, 2, 20);
INSERT INTO public.inventario VALUES (2, 3, 15);
INSERT INTO public.inventario VALUES (2, 4, 10);
INSERT INTO public.inventario VALUES (2, 5, 15);
INSERT INTO public.inventario VALUES (2, 6, 12);
INSERT INTO public.inventario VALUES (2, 13, 12);
INSERT INTO public.inventario VALUES (2, 14, 10);
INSERT INTO public.inventario VALUES (2, 1, 30);


--
-- TOC entry 5013 (class 0 OID 17238)
-- Dependencies: 236
-- Data for Name: metodopago; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.metodopago VALUES (1, 'Efectivo');
INSERT INTO public.metodopago VALUES (2, 'Tarjeta Débito');
INSERT INTO public.metodopago VALUES (3, 'Tarjeta Crédito');
INSERT INTO public.metodopago VALUES (4, 'Transferencia');


--
-- TOC entry 5023 (class 0 OID 17306)
-- Dependencies: 246
-- Data for Name: movimientostock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.movimientostock VALUES (1, 2, 1, 1, 3, NULL, '2025-09-28 20:29:22.824896', -2);
INSERT INTO public.movimientostock VALUES (2, 2, 7, 1, 4, NULL, '2025-09-28 20:42:59.357388', -1);
INSERT INTO public.movimientostock VALUES (3, 3, 1, 1, NULL, NULL, '2025-09-29 17:42:10.159605', 5);
INSERT INTO public.movimientostock VALUES (4, 3, 21, 1, NULL, NULL, '2025-09-29 18:01:29.915741', 4);
INSERT INTO public.movimientostock VALUES (5, 3, 21, 1, NULL, NULL, '2025-09-29 18:48:22.654905', 5);
INSERT INTO public.movimientostock VALUES (6, 2, 21, 1, 5, NULL, '2025-09-29 18:49:47.892126', -3);
INSERT INTO public.movimientostock VALUES (7, 3, 21, 1, NULL, NULL, '2025-09-30 21:08:52.06565', 5);
INSERT INTO public.movimientostock VALUES (8, 2, 21, 1, 6, NULL, '2025-10-02 19:41:19.510046', -2);
INSERT INTO public.movimientostock VALUES (9, 2, 21, 1, 7, NULL, '2025-10-05 16:55:08.526667', -1);
INSERT INTO public.movimientostock VALUES (10, 2, 21, 1, 8, NULL, '2025-10-05 16:55:35.429106', -1);
INSERT INTO public.movimientostock VALUES (11, 2, 23, 1, 9, NULL, '2025-10-15 01:00:33.703971', -1);
INSERT INTO public.movimientostock VALUES (12, 2, 23, 1, 10, NULL, '2025-10-15 01:13:07.907273', -1);
INSERT INTO public.movimientostock VALUES (13, 2, 23, 1, 11, NULL, '2025-10-15 01:14:14.559556', -1);
INSERT INTO public.movimientostock VALUES (14, 2, 23, 1, 12, NULL, '2025-10-15 01:20:44.667392', -1);
INSERT INTO public.movimientostock VALUES (15, 2, 21, 1, 13, NULL, '2025-10-15 01:23:42.678959', -1);
INSERT INTO public.movimientostock VALUES (18, 2, 19, 1, 16, NULL, '2025-10-15 01:28:04.826678', -1);
INSERT INTO public.movimientostock VALUES (19, 2, 23, 1, 17, NULL, '2025-10-15 21:31:27.252441', -1);


--
-- TOC entry 5015 (class 0 OID 17245)
-- Dependencies: 238
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pago VALUES (1, 1, 1, 189000, '2025-09-28');
INSERT INTO public.pago VALUES (2, 2, 2, 255000, '2025-09-28');
INSERT INTO public.pago VALUES (3, 3, 1, 55000, '2025-09-28');
INSERT INTO public.pago VALUES (4, 4, 1, 49500, '2025-09-28');
INSERT INTO public.pago VALUES (5, 5, 1, 148500, '2025-09-29');
INSERT INTO public.pago VALUES (6, 6, 1, 99000, '2025-10-02');
INSERT INTO public.pago VALUES (7, 7, 1, 49500, '2025-10-05');
INSERT INTO public.pago VALUES (8, 8, 1, 49500, '2025-10-05');
INSERT INTO public.pago VALUES (9, 9, 1, 38500, '2025-10-15');
INSERT INTO public.pago VALUES (10, 10, 1, 38500, '2025-10-15');
INSERT INTO public.pago VALUES (11, 11, 1, 38500, '2025-10-15');
INSERT INTO public.pago VALUES (12, 12, 1, 38500, '2025-10-15');
INSERT INTO public.pago VALUES (13, 13, 1, 49500, '2025-10-15');
INSERT INTO public.pago VALUES (14, 16, 1, 198000, '2025-10-15');
INSERT INTO public.pago VALUES (15, 17, 1, 38500, '2025-10-15');


--
-- TOC entry 5007 (class 0 OID 17186)
-- Dependencies: 230
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

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
INSERT INTO public.producto VALUES (20, 3, 'Sandalias Casual', 10, '7501001234586', 'Marrón', '39', 75000, 20);
INSERT INTO public.producto VALUES (7, 1, 'Camiseta Manga Larga', 10, '7501001234573', 'Gris', 'M', 45000, 8);
INSERT INTO public.producto VALUES (1, 1, 'Camiseta Básica Algodón', 10, '7501001234567', 'Blanco', 'S', 25000, 30);
INSERT INTO public.producto VALUES (22, 4, 'Bolso Messenger', 10, '7501001234588', 'Azul', 'Única', 95001, 5);
INSERT INTO public.producto VALUES (21, 4, 'Cinturón Cuero Genuino', 10, '7501001234587', 'Negro', 'Única', 45000, 6);
INSERT INTO public.producto VALUES (19, 3, 'Tenis Deportivos Running', 10, '7501001234585', 'Azul', '43', 180000, 11);
INSERT INTO public.producto VALUES (23, 4, 'Gorra Deportiva', 10, '7501001234589', 'Rojo', 'Única', 35000, 25);


--
-- TOC entry 5003 (class 0 OID 17166)
-- Dependencies: 226
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.proveedor VALUES (1, '901234567-1', 'Textiles Nacionales S.A.', '+57 601 555 0101', 'Zona Industrial, Bodega 45', 'contacto@textilesnac.com');
INSERT INTO public.proveedor VALUES (2, '901234568-1', 'Calzado Premium Ltda.', '+57 604 555 0202', 'Calle 80 #12-34, Medellín', 'ventas@calzadopremium.co');
INSERT INTO public.proveedor VALUES (3, '901234569-1', 'Importaciones Moda S.A.S.', '+57 605 555 0303', 'Centro Comercial Plaza, Local 23', 'info@importmoda.com');


--
-- TOC entry 4995 (class 0 OID 17117)
-- Dependencies: 218
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rol VALUES (1, 'Administrador');
INSERT INTO public.rol VALUES (2, 'Vendedor');
INSERT INTO public.rol VALUES (3, 'Desarrollador');


--
-- TOC entry 4997 (class 0 OID 17124)
-- Dependencies: 220
-- Data for Name: tienda; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tienda VALUES (1, 'Tienda Central', 'Av. Principal 123, Ciudad', '+57 601 123 4567');
INSERT INTO public.tienda VALUES (2, 'Sucursal Norte', 'Calle 45 #67-89, Norte', '+57 601 987 6543');


--
-- TOC entry 5021 (class 0 OID 17299)
-- Dependencies: 244
-- Data for Name: tipomovimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipomovimiento VALUES (1, 'Compra a proveedor');
INSERT INTO public.tipomovimiento VALUES (2, 'Venta a cliente');
INSERT INTO public.tipomovimiento VALUES (3, 'Ajuste de inventario');
INSERT INTO public.tipomovimiento VALUES (4, 'Devolución');


--
-- TOC entry 4999 (class 0 OID 17131)
-- Dependencies: 222
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuario VALUES (1, 1, 1, 'Ana González', 'admin@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (2, 1, 2, 'Carlos Rodríguez', 'carlos@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (3, 2, 1, 'María López', 'maria@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (4, 2, 1, 'Pedro Martínez', 'pedro@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (5, 2, 2, 'Laura García', 'laura@tiendaropa.com', '123456', true);
INSERT INTO public.usuario VALUES (6, 3, 1, 'Roberto Silva', 'inventario@tiendaropa.com', '123456', true);


--
-- TOC entry 5009 (class 0 OID 17202)
-- Dependencies: 232
-- Data for Name: venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.venta VALUES (1, 1, 3, '2025-09-28 17:36:42.587958', 189000.00, true);
INSERT INTO public.venta VALUES (2, 2, 4, '2025-09-28 17:36:42.587958', 255000.00, true);
INSERT INTO public.venta VALUES (3, 1, 1, '2025-09-28 20:29:22.824896', 55000.00, true);
INSERT INTO public.venta VALUES (4, 3, 1, '2025-09-28 20:42:59.357388', 49500.00, true);
INSERT INTO public.venta VALUES (5, 3, 1, '2025-09-29 18:49:47.892126', 148500.00, true);
INSERT INTO public.venta VALUES (6, 2, 1, '2025-10-02 19:41:19.510046', 99000.00, true);
INSERT INTO public.venta VALUES (7, 3, 1, '2025-10-05 16:55:08.526667', 49500.00, true);
INSERT INTO public.venta VALUES (8, 4, 1, '2025-10-05 16:55:35.429106', 49500.00, true);
INSERT INTO public.venta VALUES (9, 1, 1, '2025-10-15 01:00:33.703971', 38500.00, true);
INSERT INTO public.venta VALUES (10, 4, 1, '2025-10-15 01:13:07.907273', 38500.00, true);
INSERT INTO public.venta VALUES (11, 3, 1, '2025-10-15 01:14:14.559556', 38500.00, true);
INSERT INTO public.venta VALUES (12, 1, 1, '2025-10-15 01:20:44.667392', 38500.00, true);
INSERT INTO public.venta VALUES (13, 3, 1, '2025-10-15 01:23:42.678959', 49500.00, true);
INSERT INTO public.venta VALUES (16, 2, 1, '2025-10-15 01:28:04.826678', 198000.00, true);
INSERT INTO public.venta VALUES (17, 1, 1, '2025-10-15 21:31:27.252441', 38500.00, true);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 227
-- Name: categoriaproducto_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoriaproducto_id_categoria_seq', 5, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 223
-- Name: cliente_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 4, true);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 239
-- Name: compra_id_compra_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compra_id_compra_seq', 1, false);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 241
-- Name: detallecompra_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detallecompra_id_detalle_seq', 1, false);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 233
-- Name: detalleventa_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalleventa_id_detalle_seq', 19, true);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 235
-- Name: metodopago_id_metodo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodopago_id_metodo_seq', 4, true);


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 245
-- Name: movimientostock_id_movimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientostock_id_movimiento_seq', 19, true);


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 237
-- Name: pago_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_pago_seq', 15, true);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 229
-- Name: producto_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_id_producto_seq', 23, true);


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 225
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedor_id_proveedor_seq', 3, true);


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 217
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 3, true);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 219
-- Name: tienda_id_tienda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tienda_id_tienda_seq', 2, true);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 243
-- Name: tipomovimiento_id_tipo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipomovimiento_id_tipo_seq', 4, true);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 6, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 231
-- Name: venta_id_venta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venta_id_venta_seq', 17, true);


--
-- TOC entry 4808 (class 2606 OID 17184)
-- Name: categoriaproducto categoriaproducto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoriaproducto
    ADD CONSTRAINT categoriaproducto_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4798 (class 2606 OID 17162)
-- Name: cliente cliente_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_documento_key UNIQUE (documento);


--
-- TOC entry 4800 (class 2606 OID 17164)
-- Name: cliente cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_key UNIQUE (email);


--
-- TOC entry 4802 (class 2606 OID 17160)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 4822 (class 2606 OID 17270)
-- Name: compra compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compra
    ADD CONSTRAINT compra_pkey PRIMARY KEY (id_compra);


--
-- TOC entry 4824 (class 2606 OID 17287)
-- Name: detallecompra detallecompra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallecompra
    ADD CONSTRAINT detallecompra_pkey PRIMARY KEY (id_detalle);


--
-- TOC entry 4816 (class 2606 OID 17226)
-- Name: detalleventa detalleventa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalleventa
    ADD CONSTRAINT detalleventa_pkey PRIMARY KEY (id_detalle);


--
-- TOC entry 4830 (class 2606 OID 17343)
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id_tienda, id_producto);


--
-- TOC entry 4818 (class 2606 OID 17243)
-- Name: metodopago metodopago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodopago
    ADD CONSTRAINT metodopago_pkey PRIMARY KEY (id_metodo);


--
-- TOC entry 4828 (class 2606 OID 17312)
-- Name: movimientostock movimientostock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock
    ADD CONSTRAINT movimientostock_pkey PRIMARY KEY (id_movimiento);


--
-- TOC entry 4820 (class 2606 OID 17251)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4810 (class 2606 OID 17195)
-- Name: producto producto_codigo_barras_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_codigo_barras_key UNIQUE (codigo_barras);


--
-- TOC entry 4812 (class 2606 OID 17193)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4804 (class 2606 OID 17173)
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id_proveedor);


--
-- TOC entry 4806 (class 2606 OID 17175)
-- Name: proveedor proveedor_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_ruc_key UNIQUE (ruc);


--
-- TOC entry 4790 (class 2606 OID 17122)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4792 (class 2606 OID 17129)
-- Name: tienda tienda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tienda
    ADD CONSTRAINT tienda_pkey PRIMARY KEY (id_tienda);


--
-- TOC entry 4826 (class 2606 OID 17304)
-- Name: tipomovimiento tipomovimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipomovimiento
    ADD CONSTRAINT tipomovimiento_pkey PRIMARY KEY (id_tipo);


--
-- TOC entry 4794 (class 2606 OID 17141)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 4796 (class 2606 OID 17139)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4814 (class 2606 OID 17209)
-- Name: venta venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_pkey PRIMARY KEY (id_venta);


--
-- TOC entry 4840 (class 2606 OID 17271)
-- Name: compra compra_id_proveedor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compra
    ADD CONSTRAINT compra_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor);


--
-- TOC entry 4841 (class 2606 OID 17276)
-- Name: compra compra_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compra
    ADD CONSTRAINT compra_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 4842 (class 2606 OID 17288)
-- Name: detallecompra detallecompra_id_compra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallecompra
    ADD CONSTRAINT detallecompra_id_compra_fkey FOREIGN KEY (id_compra) REFERENCES public.compra(id_compra) ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 17293)
-- Name: detallecompra detallecompra_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallecompra
    ADD CONSTRAINT detallecompra_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 4836 (class 2606 OID 17232)
-- Name: detalleventa detalleventa_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalleventa
    ADD CONSTRAINT detalleventa_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 4837 (class 2606 OID 17227)
-- Name: detalleventa detalleventa_id_venta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalleventa
    ADD CONSTRAINT detalleventa_id_venta_fkey FOREIGN KEY (id_venta) REFERENCES public.venta(id_venta) ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 17349)
-- Name: inventario inventario_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 4850 (class 2606 OID 17344)
-- Name: inventario inventario_id_tienda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES public.tienda(id_tienda);


--
-- TOC entry 4844 (class 2606 OID 17333)
-- Name: movimientostock movimientostock_id_compra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock
    ADD CONSTRAINT movimientostock_id_compra_fkey FOREIGN KEY (id_compra) REFERENCES public.compra(id_compra);


--
-- TOC entry 4845 (class 2606 OID 17318)
-- Name: movimientostock movimientostock_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock
    ADD CONSTRAINT movimientostock_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 4846 (class 2606 OID 17323)
-- Name: movimientostock movimientostock_id_tienda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock
    ADD CONSTRAINT movimientostock_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES public.tienda(id_tienda);


--
-- TOC entry 4847 (class 2606 OID 17313)
-- Name: movimientostock movimientostock_id_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock
    ADD CONSTRAINT movimientostock_id_tipo_fkey FOREIGN KEY (id_tipo) REFERENCES public.tipomovimiento(id_tipo);


--
-- TOC entry 4848 (class 2606 OID 17328)
-- Name: movimientostock movimientostock_id_venta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientostock
    ADD CONSTRAINT movimientostock_id_venta_fkey FOREIGN KEY (id_venta) REFERENCES public.venta(id_venta);


--
-- TOC entry 4838 (class 2606 OID 17257)
-- Name: pago pago_id_metodo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_metodo_fkey FOREIGN KEY (id_metodo) REFERENCES public.metodopago(id_metodo);


--
-- TOC entry 4839 (class 2606 OID 17252)
-- Name: pago pago_id_venta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_venta_fkey FOREIGN KEY (id_venta) REFERENCES public.venta(id_venta) ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 17196)
-- Name: producto producto_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoriaproducto(id_categoria);


--
-- TOC entry 4831 (class 2606 OID 17142)
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- TOC entry 4832 (class 2606 OID 17147)
-- Name: usuario usuario_id_tienda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_tienda_fkey FOREIGN KEY (id_tienda) REFERENCES public.tienda(id_tienda);


--
-- TOC entry 4834 (class 2606 OID 17210)
-- Name: venta venta_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 4835 (class 2606 OID 17215)
-- Name: venta venta_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


-- Completed on 2025-10-16 19:58:41

--
-- PostgreSQL database dump complete
--

\unrestrict 6KamhJNhdwPD9xQjJsKTBbm4ICLldthcHtnNgMbib4E0ehOM5CvNusippikjgem

