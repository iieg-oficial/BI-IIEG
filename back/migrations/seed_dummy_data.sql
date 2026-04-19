-- =============================================================================
-- seed_dummy_data.sql
-- Base de datos externa de prueba para el proyecto BI-IIEG.
-- Contiene datos ficticios pero realistas de municipios de Jalisco,
-- productos, empleados, ventas e indicadores económicos.
--
-- Ejecución: psql -U <superuser> -d postgres -f seed_dummy_data.sql
-- Fecha: 2026-04-18
-- =============================================================================

-- 1. Crear la base de datos si no existe
SELECT 'CREATE DATABASE dummy_data'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dummy_data')
\gexec

-- 2. Conectar a la base de datos
\c dummy_data

-- =============================================================================
-- TABLAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS regiones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    poblacion INT NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    puesto VARCHAR(255) NOT NULL,
    salario_mensual NUMERIC(10,2) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    region_id INT REFERENCES regiones(id)
);

CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    producto_id INT REFERENCES productos(id),
    region_id INT REFERENCES regiones(id),
    cantidad INT NOT NULL,
    monto NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS indicadores_economicos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    indicador VARCHAR(100) NOT NULL,
    valor NUMERIC(12,4) NOT NULL,
    unidad VARCHAR(50) NOT NULL
);

-- =============================================================================
-- DATOS: regiones
-- =============================================================================

INSERT INTO regiones (nombre, estado, poblacion) VALUES
    ('Guadalajara',             'Jalisco', 1385629),
    ('Zapopan',                 'Jalisco', 1476491),
    ('Tlaquepaque',             'Jalisco',  672069),
    ('Tonalá',                  'Jalisco',  569913),
    ('Tlajomulco de Zúñiga',   'Jalisco',  727750),
    ('Puerto Vallarta',         'Jalisco',  291839),
    ('Lagos de Moreno',         'Jalisco',  170908),
    ('Tepatitlán de Morelos',   'Jalisco',  141322);

-- =============================================================================
-- DATOS: productos
-- =============================================================================

INSERT INTO productos (nombre, categoria, precio, stock) VALUES
    ('Laptop HP ProBook 450',       'Electrónica',  18500.00,  30),
    ('Laptop Lenovo ThinkPad',      'Electrónica',  24990.00,  15),
    ('Smartphone Samsung A54',      'Electrónica',   8499.00,  60),
    ('Tablet iPad 10ª gen',         'Electrónica',  12999.00,  25),
    ('Silla ejecutiva ergonómica',  'Mobiliario',    4500.00,  40),
    ('Escritorio en L',             'Mobiliario',    6800.00,  20),
    ('Estante metálico 5 niveles',  'Mobiliario',    2200.00,  35),
    ('Papel bond carta (5000 h)',   'Papelería',      150.00, 200),
    ('Tóner HP 58A',               'Papelería',     1450.00,  50),
    ('Plumas Bic (caja 12)',        'Papelería',       85.00, 150),
    ('Monitor Dell 27" 4K',        'Periféricos',   7200.00,  22),
    ('Teclado mecánico Logitech',   'Periféricos',   1890.00,  45),
    ('Mouse inalámbrico Logitech',  'Periféricos',    650.00,  80),
    ('Café soluble (frasco 400g)',  'Alimentos',      210.00, 100),
    ('Agua purificada 20L',         'Alimentos',       55.00, 300);

-- =============================================================================
-- DATOS: empleados
-- =============================================================================

INSERT INTO empleados (nombre, departamento, puesto, salario_mensual, fecha_ingreso, region_id) VALUES
    -- Tecnología (5)
    ('Carlos Ramírez López',        'Tecnología',      'Desarrollador Full-Stack',        28000.00, '2020-03-15', 1),
    ('Ana Lucía Torres Medina',     'Tecnología',      'Desarrolladora Backend',          26500.00, '2021-07-01', 2),
    ('Miguel Ángel Soto Ruiz',      'Tecnología',      'Administrador de Sistemas',       30000.00, '2019-01-10', 1),
    ('Fernanda Castillo Ramos',     'Tecnología',      'Analista de Datos',               27000.00, '2022-05-20', 2),
    ('José Eduardo Navarro Díaz',   'Tecnología',      'Desarrollador Frontend',          25000.00, '2023-02-14', 5),
    -- Administración (4)
    ('María Guadalupe Hernández',   'Administración',  'Contadora General',               32000.00, '2018-06-01', 1),
    ('Roberto García Martínez',     'Administración',  'Coordinador de Recursos Humanos', 29000.00, '2019-09-16', 1),
    ('Laura Patricia Morales Vega', 'Administración',  'Asistente Administrativo',        16500.00, '2023-08-01', 3),
    ('Alejandro Jiménez Cruz',      'Administración',  'Auxiliar Contable',               17500.00, '2024-01-15', 4),
    -- Ventas (4)
    ('Sandra Ivette Pérez Luna',    'Ventas',          'Gerente de Ventas',               38000.00, '2018-11-05', 1),
    ('Diego Armando Flores Ríos',   'Ventas',          'Ejecutivo de Ventas',             20000.00, '2022-03-10', 6),
    ('Paola Andrea Méndez Ortiz',   'Ventas',          'Ejecutiva de Ventas',             20000.00, '2022-06-20', 2),
    ('Héctor Manuel Vargas Núñez',  'Ventas',          'Representante Comercial',         18500.00, '2024-04-01', 7),
    -- Investigación (4)
    ('Gabriela Montoya Espinoza',   'Investigación',   'Investigadora Senior',            35000.00, '2019-04-22', 1),
    ('Raúl Enrique Delgado Peña',   'Investigación',   'Analista Estadístico',            28000.00, '2020-10-05', 2),
    ('Mariana Isabel Aguilar Solís','Investigación',   'Investigadora Junior',            22000.00, '2023-01-09', 5),
    ('Óscar Alejandro Ríos Tapia',  'Investigación',   'Analista de Información',         24000.00, '2021-11-15', 3),
    -- Dirección (3)
    ('Patricia Elena Ruiz Sandoval','Dirección',       'Directora General',               45000.00, '2018-02-01', 1),
    ('Jorge Alberto Lara Guzmán',   'Dirección',       'Subdirector de Planeación',       40000.00, '2018-08-16', 1),
    ('Adriana Sofía Campos Ibarra', 'Dirección',       'Coordinadora de Proyectos',       34000.00, '2020-06-01', 2);

-- =============================================================================
-- DATOS: ventas (100 filas, 2024-01 a 2025-12)
-- Distribución: Guadalajara y Zapopan concentran más ventas.
-- Q4 (oct-dic) tiene mayor volumen para simular estacionalidad.
-- =============================================================================

INSERT INTO ventas (fecha, producto_id, region_id, cantidad, monto) VALUES
    -- 2024-01
    ('2024-01-05',  1, 1,  2,  37000.00),
    ('2024-01-10',  8, 2,  50,  7500.00),
    ('2024-01-14',  3, 1,  5,  42495.00),
    ('2024-01-22', 14, 3,  20,  4200.00),
    -- 2024-02
    ('2024-02-03',  5, 2,  8,  36000.00),
    ('2024-02-11', 11, 1,  3,  21600.00),
    ('2024-02-18',  9, 4,  6,   8700.00),
    ('2024-02-25', 15, 5, 40,   2200.00),
    -- 2024-03
    ('2024-03-02',  2, 1,  1,  24990.00),
    ('2024-03-08', 12, 2, 10,  18900.00),
    ('2024-03-15',  6, 3,  3,  20400.00),
    ('2024-03-21', 10, 6, 30,   2550.00),
    ('2024-03-28',  4, 1,  2,  25998.00),
    -- 2024-04
    ('2024-04-04',  1, 2,  3,  55500.00),
    ('2024-04-10', 13, 1, 15,   9750.00),
    ('2024-04-17',  7, 7,  5,  11000.00),
    ('2024-04-23',  3, 5,  4,  33996.00),
    -- 2024-05
    ('2024-05-02',  8, 1, 80, 12000.00),
    ('2024-05-09', 14, 2, 25,  5250.00),
    ('2024-05-16',  5, 4,  6, 27000.00),
    ('2024-05-22', 11, 1,  2, 14400.00),
    ('2024-05-30',  9, 3,  4,  5800.00),
    -- 2024-06
    ('2024-06-05',  2, 2,  2, 49980.00),
    ('2024-06-12', 12, 1,  8, 15120.00),
    ('2024-06-18', 15, 5, 50,  2750.00),
    ('2024-06-25',  6, 8,  2, 13600.00),
    -- 2024-07
    ('2024-07-03',  4, 1,  3, 38997.00),
    ('2024-07-10',  1, 6,  1, 18500.00),
    ('2024-07-17', 10, 2, 40,  3400.00),
    ('2024-07-24', 13, 3, 20, 13000.00),
    ('2024-07-31',  3, 1,  6, 50994.00),
    -- 2024-08
    ('2024-08-06',  7, 2,  4,  8800.00),
    ('2024-08-13',  8, 1, 60,  9000.00),
    ('2024-08-20', 14, 4, 15,  3150.00),
    ('2024-08-27', 11, 5,  2, 14400.00),
    -- 2024-09
    ('2024-09-03',  5, 1,  5, 22500.00),
    ('2024-09-10',  9, 2,  8, 11600.00),
    ('2024-09-17',  2, 7,  1, 24990.00),
    ('2024-09-24', 12, 1, 12, 22680.00),
    ('2024-09-30', 15, 3, 30,  1650.00),
    -- 2024-10 (Q4 — más ventas)
    ('2024-10-02',  1, 1,  5, 92500.00),
    ('2024-10-05',  3, 2,  8, 67992.00),
    ('2024-10-09',  4, 1,  4, 51996.00),
    ('2024-10-13', 11, 2,  5, 36000.00),
    ('2024-10-17',  6, 5,  4, 27200.00),
    ('2024-10-21',  8, 1,100, 15000.00),
    ('2024-10-25', 13, 3, 25, 16250.00),
    ('2024-10-29', 14, 4, 30,  6300.00),
    -- 2024-11 (Q4)
    ('2024-11-02',  2, 1,  3, 74970.00),
    ('2024-11-05',  5, 2, 10, 45000.00),
    ('2024-11-08',  1, 2,  4, 74000.00),
    ('2024-11-12',  9, 1, 10, 14500.00),
    ('2024-11-16', 12, 6, 15, 28350.00),
    ('2024-11-20',  7, 1,  6, 13200.00),
    ('2024-11-24', 10, 2, 50,  4250.00),
    ('2024-11-28',  3, 5,  7, 59493.00),
    ('2024-11-30', 15, 8, 60,  3300.00),
    -- 2024-12 (Q4 — pico)
    ('2024-12-02',  1, 1,  6,111000.00),
    ('2024-12-04',  4, 2,  5, 64995.00),
    ('2024-12-06',  2, 1,  4, 99960.00),
    ('2024-12-09', 11, 1,  4, 28800.00),
    ('2024-12-12',  5, 3,  8, 36000.00),
    ('2024-12-15',  3, 2, 10, 84990.00),
    ('2024-12-18', 13, 7, 30, 19500.00),
    ('2024-12-21',  6, 1,  3, 20400.00),
    ('2024-12-24',  8, 2,120, 18000.00),
    ('2024-12-28', 14, 5, 40,  8400.00),
    ('2024-12-31',  9, 1, 12, 17400.00),
    -- 2025-01
    ('2025-01-07',  1, 2,  2, 37000.00),
    ('2025-01-13', 12, 1,  6, 11340.00),
    ('2025-01-20', 15, 4, 35,  1925.00),
    ('2025-01-27',  3, 1,  3, 25497.00),
    -- 2025-02
    ('2025-02-04',  5, 2,  5, 22500.00),
    ('2025-02-12', 11, 1,  2, 14400.00),
    ('2025-02-19',  8, 3, 40,  6000.00),
    ('2025-02-26', 14, 1, 18,  3780.00),
    -- 2025-03
    ('2025-03-05',  2, 1,  2, 49980.00),
    ('2025-03-12', 10, 2, 25,  2125.00),
    ('2025-03-19',  6, 5,  2, 13600.00),
    ('2025-03-26',  7, 1,  3,  6600.00),
    -- 2025-04
    ('2025-04-03',  4, 2,  3, 38997.00),
    ('2025-04-10', 13, 1, 12,  7800.00),
    ('2025-04-17',  9, 6,  5,  7250.00),
    ('2025-04-24',  1, 3,  2, 37000.00),
    -- 2025-05
    ('2025-05-05',  3, 1,  5, 42495.00),
    ('2025-05-12', 12, 2,  7, 13230.00),
    ('2025-05-19', 15, 7, 20,  1100.00),
    ('2025-05-26',  5, 1,  4, 18000.00),
    -- 2025-06
    ('2025-06-04', 11, 2,  3, 21600.00),
    ('2025-06-11',  8, 1, 70, 10500.00),
    ('2025-06-18',  2, 4,  1, 24990.00),
    ('2025-06-25', 14, 2, 22,  4620.00),
    -- 2025-07
    ('2025-07-02',  6, 1,  2, 13600.00),
    ('2025-07-09',  1, 2,  3, 55500.00),
    ('2025-07-16', 10, 5, 35,  2975.00),
    ('2025-07-23',  4, 1,  2, 25998.00),
    -- 2025-08
    ('2025-08-05', 13, 2, 18, 11700.00),
    ('2025-08-12',  7, 1,  5, 11000.00),
    ('2025-08-19',  9, 3,  7, 10150.00),
    ('2025-08-26',  3, 8,  4, 33996.00),
    -- 2025-09
    ('2025-09-03', 12, 1,  9, 17010.00),
    ('2025-09-10',  5, 2,  6, 27000.00),
    ('2025-09-17', 15, 1, 45,  2475.00),
    ('2025-09-24', 11, 6,  2, 14400.00),
    -- 2025-10 (Q4)
    ('2025-10-03',  1, 1,  4, 74000.00),
    ('2025-10-09',  3, 2,  7, 59493.00),
    ('2025-10-15',  4, 1,  3, 38997.00),
    ('2025-10-21',  8, 2, 90, 13500.00),
    ('2025-10-28', 13, 5, 20, 13000.00),
    -- 2025-11 (Q4)
    ('2025-11-04',  2, 1,  3, 74970.00),
    ('2025-11-10',  5, 2,  8, 36000.00),
    ('2025-11-16',  9, 1,  9, 13050.00),
    ('2025-11-22', 12, 3, 12, 22680.00),
    ('2025-11-28', 10, 2, 45,  3825.00),
    -- 2025-12 (Q4 — pico)
    ('2025-12-02',  1, 1,  5, 92500.00),
    ('2025-12-06',  2, 2,  3, 74970.00),
    ('2025-12-10', 11, 1,  4, 28800.00),
    ('2025-12-15',  3, 2,  9, 76491.00),
    ('2025-12-19',  6, 1,  3, 20400.00),
    ('2025-12-23', 14, 5, 35,  7350.00),
    ('2025-12-28',  4, 3,  4, 51996.00),
    ('2025-12-31',  8, 1,100, 15000.00);

-- =============================================================================
-- DATOS: indicadores_economicos (48 filas: 4 indicadores × 24 meses)
-- =============================================================================

INSERT INTO indicadores_economicos (fecha, indicador, valor, unidad) VALUES
    -- PIB (tasa de crecimiento trimestral anualizada, %)
    ('2024-01-01', 'PIB', 3.2000, '%'),
    ('2024-02-01', 'PIB', 3.1500, '%'),
    ('2024-03-01', 'PIB', 3.2800, '%'),
    ('2024-04-01', 'PIB', 2.9500, '%'),
    ('2024-05-01', 'PIB', 2.8000, '%'),
    ('2024-06-01', 'PIB', 2.7500, '%'),
    ('2024-07-01', 'PIB', 3.0000, '%'),
    ('2024-08-01', 'PIB', 3.1000, '%'),
    ('2024-09-01', 'PIB', 3.0500, '%'),
    ('2024-10-01', 'PIB', 3.4000, '%'),
    ('2024-11-01', 'PIB', 3.5500, '%'),
    ('2024-12-01', 'PIB', 3.6000, '%'),
    ('2025-01-01', 'PIB', 3.1000, '%'),
    ('2025-02-01', 'PIB', 2.9000, '%'),
    ('2025-03-01', 'PIB', 2.8500, '%'),
    ('2025-04-01', 'PIB', 2.7000, '%'),
    ('2025-05-01', 'PIB', 2.6500, '%'),
    ('2025-06-01', 'PIB', 2.7000, '%'),
    ('2025-07-01', 'PIB', 2.9500, '%'),
    ('2025-08-01', 'PIB', 3.0000, '%'),
    ('2025-09-01', 'PIB', 3.1500, '%'),
    ('2025-10-01', 'PIB', 3.3000, '%'),
    ('2025-11-01', 'PIB', 3.4500, '%'),
    ('2025-12-01', 'PIB', 3.5000, '%'),
    -- Inflación (tasa interanual, %)
    ('2024-01-01', 'Inflación', 4.8800, '%'),
    ('2024-02-01', 'Inflación', 4.9200, '%'),
    ('2024-03-01', 'Inflación', 4.7600, '%'),
    ('2024-04-01', 'Inflación', 4.6500, '%'),
    ('2024-05-01', 'Inflación', 4.5800, '%'),
    ('2024-06-01', 'Inflación', 4.9800, '%'),
    ('2024-07-01', 'Inflación', 5.5700, '%'),
    ('2024-08-01', 'Inflación', 5.0200, '%'),
    ('2024-09-01', 'Inflación', 4.5800, '%'),
    ('2024-10-01', 'Inflación', 4.7600, '%'),
    ('2024-11-01', 'Inflación', 4.3200, '%'),
    ('2024-12-01', 'Inflación', 4.2100, '%'),
    ('2025-01-01', 'Inflación', 3.9500, '%'),
    ('2025-02-01', 'Inflación', 3.7800, '%'),
    ('2025-03-01', 'Inflación', 3.8200, '%'),
    ('2025-04-01', 'Inflación', 3.9000, '%'),
    ('2025-05-01', 'Inflación', 4.0100, '%'),
    ('2025-06-01', 'Inflación', 4.1500, '%'),
    ('2025-07-01', 'Inflación', 4.4200, '%'),
    ('2025-08-01', 'Inflación', 4.3600, '%'),
    ('2025-09-01', 'Inflación', 4.1800, '%'),
    ('2025-10-01', 'Inflación', 4.0500, '%'),
    ('2025-11-01', 'Inflación', 3.9200, '%'),
    ('2025-12-01', 'Inflación', 3.8000, '%'),
    -- Desempleo (tasa, %)
    ('2024-01-01', 'Desempleo', 2.8000, '%'),
    ('2024-02-01', 'Desempleo', 2.7500, '%'),
    ('2024-03-01', 'Desempleo', 2.6000, '%'),
    ('2024-04-01', 'Desempleo', 2.7000, '%'),
    ('2024-05-01', 'Desempleo', 2.8500, '%'),
    ('2024-06-01', 'Desempleo', 2.9000, '%'),
    ('2024-07-01', 'Desempleo', 3.1000, '%'),
    ('2024-08-01', 'Desempleo', 3.0500, '%'),
    ('2024-09-01', 'Desempleo', 2.9500, '%'),
    ('2024-10-01', 'Desempleo', 2.8000, '%'),
    ('2024-11-01', 'Desempleo', 2.6500, '%'),
    ('2024-12-01', 'Desempleo', 2.5000, '%'),
    ('2025-01-01', 'Desempleo', 3.0000, '%'),
    ('2025-02-01', 'Desempleo', 3.1000, '%'),
    ('2025-03-01', 'Desempleo', 3.0500, '%'),
    ('2025-04-01', 'Desempleo', 2.9500, '%'),
    ('2025-05-01', 'Desempleo', 2.8500, '%'),
    ('2025-06-01', 'Desempleo', 2.9000, '%'),
    ('2025-07-01', 'Desempleo', 3.2000, '%'),
    ('2025-08-01', 'Desempleo', 3.3500, '%'),
    ('2025-09-01', 'Desempleo', 3.2000, '%'),
    ('2025-10-01', 'Desempleo', 3.0000, '%'),
    ('2025-11-01', 'Desempleo', 2.8500, '%'),
    ('2025-12-01', 'Desempleo', 2.7000, '%'),
    -- Tipo de cambio (USD/MXN)
    ('2024-01-01', 'Tipo de cambio', 17.1200, 'MXN'),
    ('2024-02-01', 'Tipo de cambio', 17.0800, 'MXN'),
    ('2024-03-01', 'Tipo de cambio', 16.7900, 'MXN'),
    ('2024-04-01', 'Tipo de cambio', 16.9400, 'MXN'),
    ('2024-05-01', 'Tipo de cambio', 16.6200, 'MXN'),
    ('2024-06-01', 'Tipo de cambio', 18.2800, 'MXN'),
    ('2024-07-01', 'Tipo de cambio', 17.9500, 'MXN'),
    ('2024-08-01', 'Tipo de cambio', 18.4600, 'MXN'),
    ('2024-09-01', 'Tipo de cambio', 19.1500, 'MXN'),
    ('2024-10-01', 'Tipo de cambio', 19.8300, 'MXN'),
    ('2024-11-01', 'Tipo de cambio', 20.3100, 'MXN'),
    ('2024-12-01', 'Tipo de cambio', 20.1500, 'MXN'),
    ('2025-01-01', 'Tipo de cambio', 20.4200, 'MXN'),
    ('2025-02-01', 'Tipo de cambio', 20.3800, 'MXN'),
    ('2025-03-01', 'Tipo de cambio', 20.1100, 'MXN'),
    ('2025-04-01', 'Tipo de cambio', 19.8500, 'MXN'),
    ('2025-05-01', 'Tipo de cambio', 19.6200, 'MXN'),
    ('2025-06-01', 'Tipo de cambio', 19.4800, 'MXN'),
    ('2025-07-01', 'Tipo de cambio', 19.2500, 'MXN'),
    ('2025-08-01', 'Tipo de cambio', 18.9800, 'MXN'),
    ('2025-09-01', 'Tipo de cambio', 19.1500, 'MXN'),
    ('2025-10-01', 'Tipo de cambio', 19.3600, 'MXN'),
    ('2025-11-01', 'Tipo de cambio', 19.5200, 'MXN'),
    ('2025-12-01', 'Tipo de cambio', 19.4000, 'MXN');
