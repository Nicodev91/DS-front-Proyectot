# Guía de Migración a Screaming Architecture

## 📋 Estado Actual de la Migración

### ✅ Completado
- [x] Estructura base de módulos creada
- [x] Módulo `core` con componentes UI base
- [x] Módulo `products` completo
- [x] Módulo `shopping-cart` completo
- [x] Módulo `auth` completo
- [x] Módulo `payment` con hooks base
- [x] Módulo `employees` con estructura base
- [x] Actualización de `App.tsx` para usar nuevos módulos
- [x] Ejemplo de migración en `ClientDashboard.tsx`

### 🔄 En Progreso
- [ ] Migración de componentes existentes
- [ ] Actualización de todas las páginas
- [ ] Migración de hooks existentes

### 📋 Pendiente
- [ ] Migración completa de `components/client-dashboard/`
- [ ] Migración de `components/layout/`
- [ ] Migración de `components/auth/`
- [ ] Actualización de todas las importaciones
- [ ] Eliminación de archivos legacy
- [ ] Tests para nuevos módulos

## 🔧 Pasos de Migración

### 1. Migrar Componentes de Client Dashboard

```bash
# Mover componentes específicos de productos
mv src/components/client-dashboard/ProductCard.tsx src/modules/products/components/
mv src/components/client-dashboard/ProductGrid.tsx src/modules/products/components/
mv src/components/client-dashboard/Filters.tsx src/modules/products/components/

# Mover componentes de carrito
mv src/components/client-dashboard/ShoppingCart.tsx src/modules/shopping-cart/components/

# Componentes generales van a core
mv src/components/client-dashboard/Header.tsx src/modules/core/components/
mv src/components/client-dashboard/Banner.tsx src/modules/core/components/
```

### 2. Actualizar Importaciones

Cambiar de:
```typescript
import { ProductCard } from '../../components/client-dashboard';
import { useShoppingCart } from '../../hooks';
```

A:
```typescript
import { ProductCard } from '../../modules/products';
import { useShoppingCart } from '../../modules/shopping-cart';
```

### 3. Migrar Hooks Existentes

#### `useProductFilters.ts` ✅ Migrado
- Ubicación anterior: `src/hooks/useProductFilters.ts`
- Nueva ubicación: `src/modules/products/hooks/useProductFilters.ts`

#### `useShoppingCart.ts` ✅ Migrado
- Ubicación anterior: `src/hooks/useShoppingCart.ts`
- Nueva ubicación: `src/modules/shopping-cart/hooks/useShoppingCart.ts`

### 4. Migrar Servicios

#### API Service
- Ubicación actual: `src/services/api.ts`
- Nueva ubicación: `src/modules/core/services/ApiService.ts`

### 5. Migrar Contextos

#### AuthContext ✅ Migrado
- Ubicación anterior: `src/contexts/AuthContext.tsx`
- Nueva ubicación: `src/modules/auth/contexts/AuthContext.tsx`

## 🔄 Script de Migración Automática

```bash
#!/bin/bash
# migration-script.sh

echo "🚀 Iniciando migración a Screaming Architecture..."

# Crear directorios si no existen
mkdir -p src/modules/core/components
mkdir -p src/modules/core/services

# Migrar componentes de layout a core
echo "📦 Migrando componentes de layout..."
cp -r src/components/layout/* src/modules/core/components/ 2>/dev/null || true

# Migrar componentes de auth
echo "🔐 Migrando componentes de auth..."
mkdir -p src/modules/auth/components
cp -r src/components/auth/* src/modules/auth/components/ 2>/dev/null || true

# Migrar API service
echo "🌐 Migrando servicio de API..."
cp src/services/api.ts src/modules/core/services/ApiService.ts 2>/dev/null || true

echo "✅ Migración completada. Revisa los archivos y actualiza las importaciones."
```

## 📝 Checklist de Migración por Archivo

### Páginas
- [x] `src/pages/client-dashboard/ClientDashboard.tsx`
- [ ] `src/pages/login-page/LoginPage.tsx`
- [ ] `src/pages/register-page/RegisterPage.tsx`
- [ ] `src/pages/forgot-password/ForgotPassword.tsx`
- [ ] `src/pages/forgot-password/VerificationCode.tsx`
- [ ] `src/pages/dashboard/Dashboard.tsx`
- [ ] `src/pages/product-detail/ProductDetail.tsx`

### Componentes
- [ ] `src/components/client-dashboard/Header.tsx` → `src/modules/core/components/`
- [ ] `src/components/client-dashboard/Banner.tsx` → `src/modules/core/components/`
- [x] `src/components/client-dashboard/ProductCard.tsx` → `src/modules/products/components/`
- [ ] `src/components/client-dashboard/ProductGrid.tsx` → `src/modules/products/components/`
- [ ] `src/components/client-dashboard/Filters.tsx` → `src/modules/products/components/`
- [ ] `src/components/client-dashboard/ShoppingCart.tsx` → `src/modules/shopping-cart/components/`
- [ ] `src/components/layout/*` → `src/modules/core/components/`
- [ ] `src/components/auth/*` → `src/modules/auth/components/`

### Hooks
- [x] `src/hooks/useProductFilters.ts` → `src/modules/products/hooks/`
- [x] `src/hooks/useShoppingCart.ts` → `src/modules/shopping-cart/hooks/`
- [ ] `src/hooks/index.ts` → Eliminar después de migración

### Servicios
- [ ] `src/services/api.ts` → `src/modules/core/services/`

### Datos
- [x] `src/data/products.ts` → `src/modules/products/infrastructure/ProductRepository.ts`

## 🎯 Próximos Pasos

1. **Migrar componentes restantes** siguiendo la estructura modular
2. **Actualizar todas las importaciones** en páginas y componentes
3. **Crear tests** para cada módulo
4. **Documentar APIs** de cada módulo
5. **Eliminar archivos legacy** una vez completada la migración

## 🔍 Validación de Migración

Para validar que la migración fue exitosa:

```bash
# Verificar que no hay importaciones rotas
npm run build

# Verificar que la aplicación funciona
npm run dev

# Ejecutar tests (cuando estén implementados)
npm run test
```

## 📚 Recursos

- [Screaming Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)