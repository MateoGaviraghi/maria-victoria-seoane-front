# 🛒 FASE 06 - Carrito y Checkout

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Crear la página del carrito de compras
2. ✅ Crear componentes del carrito (CartItem, CartSummary, CouponInput)
3. ✅ Crear la página de checkout
4. ✅ Integrar MercadoPago para pagos
5. ✅ Crear página de confirmación de orden

---

## 1️⃣ Página del Carrito

### `src/app/(public)/carrito/page.tsx`

```typescript
'use client';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import CartItem from '@/components/carrito/CartItem';
import CartSummary from '@/components/carrito/CartSummary';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, removeFromCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16" />}
          title="Tu carrito está vacío"
          description="Agrega cursos a tu carrito para comenzar tu aprendizaje"
          action={{
            label: 'Explorar Cursos',
            onClick: () => router.push('/cursos'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">Carrito de Compras</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
```

---

## 2️⃣ Componente CartItem

### `src/components/carrito/CartItem.tsx`

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem as CartItemType } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
}

const CartItem = ({ item, onRemove }: CartItemProps) => {
  const course = item.course;

  if (!course) return null;

  const thumbnailUrl = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
    : '/images/placeholder-course.jpg';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <Link
            href={`/cursos/${course.slug}`}
            className="relative aspect-video h-24 w-40 flex-shrink-0 overflow-hidden rounded-md"
          >
            <Image
              src={thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </Link>

          {/* Course Info */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Link href={`/cursos/${course.slug}`}>
                <h3 className="font-semibold hover:text-primary">
                  {course.title}
                </h3>
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {course.description}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold">
                {formatCurrency(course.price)}
              </span>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
```

---

## 3️⃣ Componente CartSummary

### `src/components/carrito/CartSummary.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cart } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';
import CouponInput from './CouponInput';

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Coupon Input */}
        <CouponInput />

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>

          {cart.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{formatCurrency(cart.discount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(cart.total)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button size="lg" className="w-full" onClick={handleCheckout}>
          Proceder al Pago
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
```

---

## 4️⃣ Componente CouponInput

### `src/components/carrito/CouponInput.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useValidateCoupon } from '@/hooks/useCoupons';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CouponInput = () => {
  const [code, setCode] = useState('');
  const { mutate: validateCoupon, isPending } = useValidateCoupon();
  const { couponCode, total, removeCoupon } = useCartStore();

  const handleApplyCoupon = () => {
    if (!code.trim()) return;
    validateCoupon({ code: code.toUpperCase(), total });
    setCode('');
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  if (couponCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">
            Cupón aplicado: {couponCode}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveCoupon}
          className="h-auto p-1 text-green-600 hover:text-green-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Código de Cupón</label>
      <div className="flex gap-2">
        <Input
          placeholder="DESCUENTO10"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
        />
        <Button
          variant="outline"
          onClick={handleApplyCoupon}
          disabled={isPending || !code.trim()}
        >
          {isPending ? 'Validando...' : 'Aplicar'}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
```

---

## 5️⃣ Página de Checkout

### `src/app/(public)/checkout/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCheckout } from '@/hooks/useCheckout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { cart, isLoading: isLoadingCart } = useCart();
  const { createPreference, isCreatingPreference, preferenceData } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (preferenceData?.initPoint) {
      // Redirigir a MercadoPago
      window.location.href = preferenceData.initPoint;
    }
  }, [preferenceData]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingCart) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16" />}
          title="No hay cursos en el carrito"
          description="Agrega cursos a tu carrito antes de continuar con el pago"
          action={{
            label: 'Explorar Cursos',
            onClick: () => router.push('/cursos'),
          }}
        />
      </div>
    );
  }

  const handleCheckout = (couponCode?: string) => {
    setIsProcessing(true);
    createPreference({ couponCode });
  };

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm
            user={user!}
            onSubmit={handleCheckout}
            isProcessing={isProcessing || isCreatingPreference}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
```

---

## 6️⃣ Componente CheckoutForm

### `src/components/checkout/CheckoutForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from '@/types/user';
import { useCartStore } from '@/store/cartStore';
import PaymentMethods from './PaymentMethods';

interface CheckoutFormProps {
  user: User;
  onSubmit: (couponCode?: string) => void;
  isProcessing: boolean;
}

const CheckoutForm = ({ user, onSubmit, isProcessing }: CheckoutFormProps) => {
  const { couponCode } = useCartStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mercadopago');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(couponCode || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={user.firstName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input value={user.lastName} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethods
            selected={selectedPaymentMethod}
            onSelect={setSelectedPaymentMethod}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? 'Procesando...' : 'Proceder al Pago'}
      </Button>
    </form>
  );
};

export default CheckoutForm;
```

---

## 7️⃣ Componente PaymentMethods

### `src/components/checkout/PaymentMethods.tsx`

```typescript
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

interface PaymentMethodsProps {
  selected: string;
  onSelect: (value: string) => void;
}

const PaymentMethods = ({ selected, onSelect }: PaymentMethodsProps) => {
  return (
    <RadioGroup value={selected} onValueChange={onSelect}>
      <Card className="cursor-pointer transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center space-x-4 p-4">
          <RadioGroupItem value="mercadopago" id="mercadopago" />
          <Label
            htmlFor="mercadopago"
            className="flex flex-1 cursor-pointer items-center justify-between"
          >
            <div>
              <div className="font-medium">MercadoPago</div>
              <div className="text-sm text-muted-foreground">
                Tarjetas de crédito, débito y más
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/mercadopago-logo.png"
                alt="MercadoPago"
                width={80}
                height={30}
                className="object-contain"
              />
            </div>
          </Label>
        </CardContent>
      </Card>
    </RadioGroup>
  );
};

export default PaymentMethods;
```

---

## 8️⃣ Componente OrderSummary

### `src/components/checkout/OrderSummary.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cart } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

interface OrderSummaryProps {
  cart: Cart;
}

const OrderSummary = ({ cart }: OrderSummaryProps) => {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Resumen de la Orden</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => {
            const course = item.course;
            if (!course) return null;

            const thumbnailUrl = course.thumbnail
              ? `${process.env.NEXT_PUBLIC_API_URL}${course.thumbnail}`
              : '/images/placeholder-course.jpg';

            return (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="line-clamp-2 text-sm font-medium">
                    {course.title}
                  </h4>
                  <p className="text-sm font-semibold">
                    {formatCurrency(course.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>

          {cart.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{formatCurrency(cart.discount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(cart.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
```

---

## 9️⃣ Instalación de MercadoPago SDK

### Instalar el SDK

```bash
npm install @mercadopago/sdk-react
```

### Configurar MercadoPago (Opcional - si quieres usar el Brick)

Si deseas usar los componentes de MercadoPago directamente en el frontend, puedes crear un componente wrapper:

### `src/components/checkout/MercadoPagoButton.tsx`

```typescript
'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect } from 'react';

interface MercadoPagoButtonProps {
  preferenceId: string;
}

const MercadoPagoButton = ({ preferenceId }: MercadoPagoButtonProps) => {
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey);
    }
  }, []);

  return (
    <Wallet
      initialization={{ preferenceId }}
      customization={{ texts: { valueProp: 'smart_option' } }}
    />
  );
};

export default MercadoPagoButton;
```

---

## 🔟 Página de Éxito (Success)

### `src/app/(public)/checkout/success/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'approved') {
      // Vaciar el carrito
      clearCart();
    }
  }, [status, clearCart]);

  if (status !== 'approved') {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Pago Pendiente o Rechazado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Tu pago está siendo procesado o fue rechazado.
            </p>
            <Button asChild className="w-full">
              <Link href="/mis-ordenes">Ver Mis Órdenes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            <CheckCircle className="mb-4 h-16 w-16 text-green-600" />
            <CardTitle className="text-center text-2xl">
              ¡Pago Exitoso!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Tu pago ha sido procesado correctamente.
            </p>
            {paymentId && (
              <p className="text-sm text-muted-foreground">
                ID de Pago: <span className="font-mono">{paymentId}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-medium">
              Ya puedes acceder a tus cursos adquiridos
            </p>
            <Button asChild className="w-full">
              <Link href="/mis-cursos">Ir a Mis Cursos</Link>
            </Button>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/mis-ordenes">Ver Detalles de la Orden</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 1️⃣1️⃣ Página de Fallo (Failure)

### `src/app/(public)/checkout/failure/page.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutFailurePage() {
  const router = useRouter();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            <XCircle className="mb-4 h-16 w-16 text-destructive" />
            <CardTitle className="text-center text-2xl">
              Pago Rechazado
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
          </p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/carrito">Volver al Carrito</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cursos">Seguir Explorando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 1️⃣2️⃣ Página Pendiente (Pending)

### `src/app/(public)/checkout/pending/page.tsx`

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPendingPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center">
            <Clock className="mb-4 h-16 w-16 text-yellow-600" />
            <CardTitle className="text-center text-2xl">
              Pago Pendiente
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/mis-ordenes">Ver Mis Órdenes</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cursos">Seguir Explorando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎯 Checklist de Verificación - Fase 6

Verificar que todos los archivos estén creados:

### Páginas

- [ ] `src/app/(public)/carrito/page.tsx`
- [ ] `src/app/(public)/checkout/page.tsx`
- [ ] `src/app/(public)/checkout/success/page.tsx`
- [ ] `src/app/(public)/checkout/failure/page.tsx`
- [ ] `src/app/(public)/checkout/pending/page.tsx`

### Componentes de Carrito

- [ ] `src/components/carrito/CartItem.tsx`
- [ ] `src/components/carrito/CartSummary.tsx`
- [ ] `src/components/carrito/CouponInput.tsx`

### Componentes de Checkout

- [ ] `src/components/checkout/CheckoutForm.tsx`
- [ ] `src/components/checkout/PaymentMethods.tsx`
- [ ] `src/components/checkout/OrderSummary.tsx`
- [ ] `src/components/checkout/MercadoPagoButton.tsx` (opcional)

### Dependencias

- [ ] Instalar MercadoPago SDK: `npm install @mercadopago/sdk-react`

### Configuración

- [ ] Agregar `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` a `.env.local`

### Comandos para verificar:

```bash
# Instalar MercadoPago SDK
npm install @mercadopago/sdk-react

# Verificar que no hay errores de TypeScript
npm run type-check

# Verificar ESLint
npm run lint

# Ejecutar en desarrollo
npm run dev
```

---

## 📋 Resumen de lo Creado

En esta fase hemos creado:

1. **Página del Carrito** con lista de items y resumen
2. **Componentes del Carrito** (CartItem, CartSummary, CouponInput)
3. **Página de Checkout** con formulario y resumen de orden
4. **Componentes de Checkout** (CheckoutForm, PaymentMethods, OrderSummary)
5. **Integración con MercadoPago** para procesamiento de pagos
6. **Páginas de respuesta** (Success, Failure, Pending)
7. **Sistema de cupones** funcional

Todo el flujo de compra está **completo y funcional** desde agregar al carrito hasta completar el pago.

---

## 💡 Flujo de Compra Completo

1. **Usuario navega cursos** → Ve cursos en catálogo
2. **Selecciona curso** → Ve detalles del curso
3. **Agrega al carrito** → Curso se agrega al carrito
4. **Ve su carrito** → Puede aplicar cupones y ver total
5. **Va a checkout** → Completa información y método de pago
6. **Paga con MercadoPago** → Se redirige a MercadoPago
7. **MercadoPago procesa** → Webhook notifica al backend
8. **Backend crea orden** → Se crean enrollments
9. **Usuario vuelve** → Ve página de éxito
10. **Accede a cursos** → Puede ver sus cursos en "Mis Cursos"

---

## 🚀 Siguiente Paso

Una vez completados todos los archivos de esta fase:

**✅ FASE 6 COMPLETA - Continuar con → [FASE 07 - Área de Estudiante](./FRONTEND-07-AREA-ESTUDIANTE.md)**
