# ⚙️ Fase 14.2 - Configuración General (Parte 2)

> **Documentación Frontend - Maria Victoria Seoane**  
> Configuración de MercadoPago, documentos legales y servicios

---

## 📋 Contenido

1. [Componente PaymentSettings](#componente-paymentsettings)
2. [Componente LegalSettings](#componente-legalsettings)
3. [Componente RichTextEditor](#componente-richtexteditor)
4. [Página de Pagos](#página-de-pagos)
5. [Página Legal](#página-legal)
6. [Servicios Completos](#servicios-completos)
7. [Tipos Completos](#tipos-completos)
8. [Testing](#testing)
9. [Checklist](#checklist)

---

## 1️⃣ Componente PaymentSettings

**Archivo:** `src/components/admin/settings/PaymentSettings.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  usePaymentSettings,
  useUpdatePaymentSettings,
} from '@/lib/hooks/useSettingsAdmin';

const paymentSchema = z.object({
  mercadoPagoPublicKey: z.string().min(1, 'Public Key requerida'),
  mercadoPagoAccessToken: z.string().min(1, 'Access Token requerido'),
  mercadoPagoSandbox: z.boolean(),
  currency: z.string().default('ARS'),
  allowCoupons: z.boolean(),
  minimumPurchase: z.coerce.number().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentSettings() {
  const { data: settings, isLoading } = usePaymentSettings();
  const { mutate: update, isPending } = useUpdatePaymentSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      mercadoPagoSandbox: true,
      currency: 'ARS',
      allowCoupons: true,
    },
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const sandbox = watch('mercadoPagoSandbox');
  const allowCoupons = watch('allowCoupons');

  const onSubmit = (data: PaymentFormData) => {
    update(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">MercadoPago</h3>
          <Badge variant={sandbox ? 'secondary' : 'default'}>
            {sandbox ? 'Modo Sandbox' : 'Producción'}
          </Badge>
        </div>

        {/* Sandbox Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="space-y-0.5">
            <Label htmlFor="sandbox">Modo Sandbox (Pruebas)</Label>
            <p className="text-xs text-muted-foreground">
              Activa para pruebas sin procesar pagos reales
            </p>
          </div>
          <Switch
            id="sandbox"
            checked={sandbox}
            onCheckedChange={(checked) => setValue('mercadoPagoSandbox', checked)}
          />
        </div>

        {sandbox && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Estás en modo sandbox. Los pagos no serán reales.
            </p>
          </div>
        )}

        {/* Public Key */}
        <div className="space-y-2">
          <Label htmlFor="publicKey">Public Key *</Label>
          <Input
            id="publicKey"
            {...register('mercadoPagoPublicKey')}
            placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
          {errors.mercadoPagoPublicKey && (
            <p className="text-sm text-red-600">
              {errors.mercadoPagoPublicKey.message}
            </p>
          )}
        </div>

        {/* Access Token */}
        <div className="space-y-2">
          <Label htmlFor="accessToken">Access Token *</Label>
          <Input
            id="accessToken"
            type="password"
            {...register('mercadoPagoAccessToken')}
            placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          {errors.mercadoPagoAccessToken && (
            <p className="text-sm text-red-600">
              {errors.mercadoPagoAccessToken.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Obtén tus credenciales en{' '}
            <a
              href="https://www.mercadopago.com.ar/developers/panel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MercadoPago Developers
            </a>
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Opciones de Pago</h3>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Input
            id="currency"
            {...register('currency')}
            placeholder="ARS"
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Actualmente solo soportamos pesos argentinos (ARS)
          </p>
        </div>

        {/* Minimum Purchase */}
        <div className="space-y-2">
          <Label htmlFor="minimumPurchase">Compra Mínima (opcional)</Label>
          <Input
            id="minimumPurchase"
            type="number"
            {...register('minimumPurchase')}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Monto mínimo requerido para completar una compra
          </p>
        </div>

        {/* Allow Coupons */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="allowCoupons">Permitir Cupones</Label>
            <p className="text-xs text-muted-foreground">
              Habilita el uso de cupones de descuento en el checkout
            </p>
          </div>
          <Switch
            id="allowCoupons"
            checked={allowCoupons}
            onCheckedChange={(checked) => setValue('allowCoupons', checked)}
          />
        </div>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Guardando...' : 'Guardar Configuración'}
      </Button>
    </form>
  );
}
```

---

## 2️⃣ Componente LegalSettings

**Archivo:** `src/components/admin/settings/LegalSettings.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import {
  useLegalSettings,
  useUpdateLegalSettings,
} from '@/lib/hooks/useSettingsAdmin';

export default function LegalSettings() {
  const { data: settings, isLoading } = useLegalSettings();
  const { mutate: update, isPending } = useUpdateLegalSettings();

  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [refund, setRefund] = useState('');

  useEffect(() => {
    if (settings) {
      setTerms(settings.termsAndConditions || '');
      setPrivacy(settings.privacyPolicy || '');
      setRefund(settings.refundPolicy || '');
    }
  }, [settings]);

  const handleSave = () => {
    update({
      termsAndConditions: terms,
      privacyPolicy: privacy,
      refundPolicy: refund,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Tabs defaultValue="terms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="terms">Términos</TabsTrigger>
            <TabsTrigger value="privacy">Privacidad</TabsTrigger>
            <TabsTrigger value="refund">Reembolsos</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Términos y Condiciones
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define las reglas de uso de la plataforma
              </p>
            </div>
            <RichTextEditor value={terms} onChange={setTerms} />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Política de Privacidad
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explica cómo manejas los datos de los usuarios
              </p>
            </div>
            <RichTextEditor value={privacy} onChange={setPrivacy} />
          </TabsContent>

          <TabsContent value="refund" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Política de Reembolsos
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define las condiciones para solicitar reembolsos
              </p>
            </div>
            <RichTextEditor value={refund} onChange={setRefund} />
          </TabsContent>
        </Tabs>
      </Card>

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? 'Guardando...' : 'Guardar Documentos Legales'}
      </Button>
    </div>
  );
}
```

---

## 3️⃣ Componente RichTextEditor

**Archivo:** `src/components/admin/settings/RichTextEditor.tsx`

```typescript
'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link, Heading2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const insertTag = (tag: string, closeTag?: string) => {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const close = closeTag || tag;

    const newText =
      value.substring(0, start) +
      `<${tag}>${selectedText}</${close}>` +
      value.substring(end);

    onChange(newText);
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border rounded-t-lg bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertTag('strong')}
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertTag('em')}
          title="Itálica"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertTag('h2')}
          title="Título"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertTag('ul')}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('URL del enlace:');
            if (url) {
              const textarea = document.getElementById('editor') as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = value.substring(start, end) || 'Enlace';
              const newText =
                value.substring(0, start) +
                `<a href="${url}">${text}</a>` +
                value.substring(end);
              onChange(newText);
            }
          }}
          title="Enlace"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        id="editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={15}
        className="font-mono text-sm rounded-t-none"
        placeholder="Escribe el contenido aquí... Puedes usar HTML."
      />

      <p className="text-xs text-muted-foreground">
        Puedes usar etiquetas HTML: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;
      </p>
    </div>
  );
}
```

---

## 4️⃣ Página de Pagos

**Archivo:** `src/app/admin/configuracion/pagos/page.tsx`

```typescript
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentSettings from '@/components/admin/settings/PaymentSettings';

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/configuracion">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configuración de Pagos</h1>
          <p className="text-muted-foreground mt-1">
            Configura MercadoPago y opciones de pago
          </p>
        </div>
      </div>

      <PaymentSettings />
    </div>
  );
}
```

---

## 5️⃣ Página Legal

**Archivo:** `src/app/admin/configuracion/legal/page.tsx`

```typescript
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LegalSettings from '@/components/admin/settings/LegalSettings';

export default function LegalSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/configuracion">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Documentos Legales</h1>
          <p className="text-muted-foreground mt-1">
            Términos, privacidad y política de reembolsos
          </p>
        </div>
      </div>

      <LegalSettings />
    </div>
  );
}
```

---

## 6️⃣ Servicios Completos

**Archivo:** `src/lib/services/settingsService.ts`

```typescript
import api from './api';
import type { AxiosResponse } from 'axios';
import type {
  SiteSettings,
  SEOSettings,
  SocialSettings,
  PaymentSettings,
  LegalSettings,
} from '@/types';

export const settingsService = {
  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const response: AxiosResponse<SiteSettings> =
      await api.get('/settings/site');
    return response.data;
  },

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const response: AxiosResponse<SiteSettings> = await api.patch(
      '/settings/site',
      data,
    );
    return response.data;
  },

  // SEO Settings
  async getSEOSettings(): Promise<SEOSettings> {
    const response: AxiosResponse<SEOSettings> = await api.get('/settings/seo');
    return response.data;
  },

  async updateSEOSettings(data: Partial<SEOSettings>): Promise<SEOSettings> {
    const response: AxiosResponse<SEOSettings> = await api.patch(
      '/settings/seo',
      data,
    );
    return response.data;
  },

  // Social Settings
  async getSocialSettings(): Promise<SocialSettings> {
    const response: AxiosResponse<SocialSettings> =
      await api.get('/settings/social');
    return response.data;
  },

  async updateSocialSettings(
    data: Partial<SocialSettings>,
  ): Promise<SocialSettings> {
    const response: AxiosResponse<SocialSettings> = await api.patch(
      '/settings/social',
      data,
    );
    return response.data;
  },

  // Payment Settings
  async getPaymentSettings(): Promise<PaymentSettings> {
    const response: AxiosResponse<PaymentSettings> =
      await api.get('/settings/payment');
    return response.data;
  },

  async updatePaymentSettings(
    data: Partial<PaymentSettings>,
  ): Promise<PaymentSettings> {
    const response: AxiosResponse<PaymentSettings> = await api.patch(
      '/settings/payment',
      data,
    );
    return response.data;
  },

  // Legal Settings
  async getLegalSettings(): Promise<LegalSettings> {
    const response: AxiosResponse<LegalSettings> =
      await api.get('/settings/legal');
    return response.data;
  },

  async updateLegalSettings(
    data: Partial<LegalSettings>,
  ): Promise<LegalSettings> {
    const response: AxiosResponse<LegalSettings> = await api.patch(
      '/settings/legal',
      data,
    );
    return response.data;
  },
};
```

---

## 7️⃣ Tipos Completos

**Archivo:** `src/types/index.ts` (agregar)

```typescript
export interface PaymentSettings {
  mercadoPagoPublicKey: string;
  mercadoPagoAccessToken: string;
  mercadoPagoSandbox: boolean;
  currency: string;
  allowCoupons: boolean;
  minimumPurchase?: number;
}

export interface LegalSettings {
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
}
```

---

## 8️⃣ Testing

**Archivo:** `src/components/admin/settings/__tests__/PaymentSettings.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentSettings from '../PaymentSettings';

const queryClient = new QueryClient();

describe('PaymentSettings', () => {
  it('renders MercadoPago fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PaymentSettings />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/mercadopago/i)).toBeInTheDocument();
  });

  it('shows sandbox warning when enabled', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PaymentSettings />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/modo sandbox/i)).toBeInTheDocument();
  });
});
```

---

## ✅ Checklist Fase 14 Completa

### Hooks

- [ ] `useSettingsAdmin.ts` - 10 hooks completos

### Componentes Parte 1 (14.1)

- [ ] `SiteSettings.tsx` - Nombre, logo, contacto
- [ ] `SEOSettings.tsx` - Meta tags, Open Graph
- [ ] `SocialMediaSettings.tsx` - 6 redes sociales
- [ ] `ImageUploader.tsx` - Upload con preview

### Componentes Parte 2 (14.2)

- [ ] `PaymentSettings.tsx` - MercadoPago config
- [ ] `LegalSettings.tsx` - 3 documentos legales
- [ ] `RichTextEditor.tsx` - Editor HTML básico
- [ ] `SettingsNav.tsx` - Navegación

### Páginas

- [ ] `app/admin/configuracion/page.tsx` - Principal con tabs
- [ ] `app/admin/configuracion/pagos/page.tsx` - Pagos
- [ ] `app/admin/configuracion/legal/page.tsx` - Legal

### Backend Endpoints

- [ ] `/settings/site` - GET/PATCH
- [ ] `/settings/seo` - GET/PATCH
- [ ] `/settings/social` - GET/PATCH
- [ ] `/settings/payment` - GET/PATCH
- [ ] `/settings/legal` - GET/PATCH

### Validaciones

- [ ] URLs de redes sociales válidas
- [ ] Meta description max 160 chars
- [ ] Meta title max 60 chars
- [ ] Credenciales MercadoPago requeridas

---

## 🐛 Troubleshooting

### Problema: Credenciales MercadoPago no funcionan

**Solución:**
Verificar que estás usando las credenciales correctas según el modo (sandbox/producción).

### Problema: Logo no se sube

**Solución:**
Verificar que el endpoint `/api/upload` esté configurado y el tamaño sea menor a 5MB.

---

## 📝 Resumen Fase 14 Completa

En las partes 14.1 y 14.2 implementamos:

✅ **SiteSettings** - Nombre, logo, favicon, contacto  
✅ **SEOSettings** - Meta tags, Open Graph, Analytics  
✅ **SocialMediaSettings** - 6 redes con validación URL  
✅ **PaymentSettings** - MercadoPago sandbox/producción  
✅ **LegalSettings** - Términos, privacidad, reembolsos  
✅ **RichTextEditor** - Editor HTML básico  
✅ **ImageUploader** - Upload con preview  
✅ **Servicios completos** - 5 endpoints de configuración

**Resultado:** Panel completo de configuración del sitio con todas las opciones necesarias.

---

**¡Fase 14 completada! 🎉**
