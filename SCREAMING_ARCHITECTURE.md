# Screaming Architecture - DataSentinel

Este proyecto ha sido reorganizado siguiendo los principios de **Screaming Architecture** de Robert C. Martin (Uncle Bob). La arquitectura "grita" el propósito del negocio en lugar de los frameworks utilizados.

## 🏗️ Estructura del Proyecto

```
src/
├── modules/                    # Módulos de dominio de negocio
│   ├── core/                   # Funcionalidades compartidas
│   │   ├── components/
│   │   │   └── ui/             # Componentes UI reutilizables
│   │   └── index.ts
│   │
│   ├── products/               # 🛍️ GESTIÓN DE PRODUCTOS
│   │   ├── domain/             # Entidades y reglas de negocio
│   │   ├── services/           # Lógica de aplicación
│   │   ├── infrastructure/     # Repositorios y datos
│   │   ├── components/         # Componentes específicos
│   │   ├── hooks/              # Hooks personalizados
│   │   └── index.ts
│   │
│   ├── shopping-cart/          # 🛒 CARRITO DE COMPRAS
│   │   ├── domain/
│   │   ├── services/
│   │   ├── infrastructure/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   ├── auth/                   # 🔐 AUTENTICACIÓN
│   │   ├── domain/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── index.ts
│   │
│   ├── employees/              # 👥 GESTIÓN DE EMPLEADOS
│   │   ├── domain/
│   │   └── index.ts
│   │
│   ├── payment/                # 💳 SISTEMA DE PAGOS
│   │   ├── domain/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   └── index.ts                # Exportaciones principales
│
├── components/                 # Componentes legacy (a migrar)
├── pages/                      # Páginas de la aplicación
├── assets/                     # Recursos estáticos
└── ...
```

## 🎯 Principios Aplicados

### 1. **Organización por Dominio de Negocio**
En lugar de organizar por tipo técnico (`components/`, `services/`, `utils/`), organizamos por **capacidades de negocio**:
- `products/` - Todo lo relacionado con productos
- `shopping-cart/` - Funcionalidad del carrito
- `auth/` - Autenticación y autorización
- `payment/` - Procesamiento de pagos
- `employees/` - Gestión de empleados

### 2. **Arquitectura Hexagonal por Módulo**
Cada módulo sigue una estructura hexagonal:
- **`domain/`** - Entidades, interfaces y reglas de negocio
- **`services/`** - Casos de uso y lógica de aplicación
- **`infrastructure/`** - Implementaciones concretas (APIs, localStorage, etc.)
- **`components/`** - Interfaz de usuario específica del módulo
- **`hooks/`** - Lógica de estado y efectos

### 3. **Inversión de Dependencias**
- Los servicios dependen de interfaces (abstracciones)
- Las implementaciones concretas están en `infrastructure/`
- Fácil intercambio de implementaciones (mock ↔ API real)

### 4. **Separación de Responsabilidades**
- **Domain**: Qué hace el sistema (reglas de negocio)
- **Services**: Cómo se ejecutan los casos de uso
- **Infrastructure**: Detalles técnicos de implementación
- **Components**: Presentación e interacción

## 📦 Módulos del Sistema

### 🛍️ Products (Productos)
**Responsabilidad**: Gestión del catálogo de productos
- Búsqueda y filtrado
- Categorización
- Visualización de detalles

### 🛒 Shopping Cart (Carrito)
**Responsabilidad**: Gestión del carrito de compras
- Agregar/quitar productos
- Cálculo de totales
- Persistencia local

### 🔐 Auth (Autenticación)
**Responsabilidad**: Gestión de usuarios y sesiones
- Login/logout
- Registro de usuarios
- Manejo de tokens
- Roles y permisos

### 💳 Payment (Pagos)
**Responsabilidad**: Procesamiento de pagos
- Métodos de pago
- Transacciones
- Historial de pagos

### 👥 Employees (Empleados)
**Responsabilidad**: Gestión de empleados (Admin)
- CRUD de empleados
- Departamentos y cargos
- Información laboral

### ⚙️ Core (Núcleo)
**Responsabilidad**: Funcionalidades compartidas
- Componentes UI reutilizables
- Utilidades comunes
- Tipos base

## 🔄 Migración Gradual

La migración se está realizando de forma gradual:

1. ✅ **Creada nueva estructura modular**
2. ✅ **Migrados módulos core: products, cart, auth, payment**
3. 🔄 **En progreso**: Migración de componentes existentes
4. 📋 **Pendiente**: Migración completa de páginas
5. 📋 **Pendiente**: Eliminación de estructura legacy

## 🚀 Beneficios Obtenidos

### **Claridad de Propósito**
- La estructura "grita" que es un sistema de e-commerce
- Fácil identificación de funcionalidades de negocio

### **Mantenibilidad**
- Cambios en productos no afectan autenticación
- Cada módulo es independiente y cohesivo

### **Testabilidad**
- Fácil mockeo de dependencias
- Tests unitarios por módulo

### **Escalabilidad**
- Nuevas funcionalidades = nuevos módulos
- Equipos pueden trabajar en módulos independientes

### **Reutilización**
- Servicios y hooks reutilizables
- Componentes específicos por dominio

## 📝 Convenciones de Uso

### Importaciones
```typescript
// ✅ Correcto - Usar exports del módulo
import { useProductFilters, ProductCard } from '../modules/products';
import { useShoppingCart } from '../modules/shopping-cart';
import { useAuth } from '../modules/auth';

// ❌ Evitar - Importaciones directas internas
import { useProductFilters } from '../modules/products/hooks/useProductFilters';
```

### Nuevas Funcionalidades
1. Identificar el módulo correspondiente
2. Si no existe, crear nuevo módulo
3. Seguir la estructura domain → services → infrastructure
4. Exportar en el index.ts del módulo

### Testing
```typescript
// Tests por módulo
src/modules/products/__tests__/
src/modules/auth/__tests__/
```

## 🎉 Resultado

La nueva arquitectura hace que el propósito del sistema sea evidente desde la estructura de carpetas. Un desarrollador nuevo puede entender inmediatamente que se trata de un sistema de e-commerce con gestión de productos, carrito, autenticación, pagos y empleados.

**La arquitectura grita: "¡SOY UN SISTEMA DE E-COMMERCE!"** 🛍️


