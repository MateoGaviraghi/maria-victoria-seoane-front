# ⚙️ Fase 14.1 - Configuración General (Parte 1)

> **Documentación Frontend - Maria Victoria Seoane**  
> Configuración del sitio, SEO y redes sociales

---

## 📋 Contenido

1. [Introducción](#introducción)
2. [Hooks de Configuración](#hooks-de-configuración)
3. [Componente SiteSettings](#componente-sitesettings)
4. [Componente SEOSettings](#componente-seosettings)
5. [Componente SocialMediaSettings](#componente-socialmediasettings)
6. [Componente ImageUploader](#componente-imageuploader)
7. [Página Principal de Configuración](#página-principal-de-configuración)
8. [Navegación de Configuración](#navegación-de-configuración)

---

## 🎯 Introducción

La Fase 14 está dividida en dos partes:

**Parte 14.1 (este archivo):**

- ✅ Configuración general del sitio (nombre, logo, contacto)
- ✅ Configuración SEO (meta tags, Open Graph)
- ✅ Redes sociales (links, íconos)

**Parte 14.2:**

- Configuración de MercadoPago
- Documentos legales (términos, privacidad)
- Testing y checklist

---

## 1️⃣ Hooks de Configuración

**Archivo:** `src/lib/hooks/useSettingsAdmin.ts`

```typescript
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { settingsService } from '@/lib/services/settingsService';
import { toast } from 'sonner';
import type {
  SiteSettings,
  SEOSettings,
  SocialSettings,
  PaymentSettings,
  LegalSettings,
} from '@/types';

/**
 * Hook para obtener configuración del sitio
 */
export function useSiteSettings(): UseQueryResult<SiteSettings> {
  return useQuery({
    queryKey: ['settings', 'site'],
    queryFn: () => settingsService.getSiteSettings(),
  });
}

/**
 * Hook para actualizar configuración del sitio
 */
export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) =>
      settingsService.updateSiteSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'site'] });
      toast.success('Configuración del sitio actualizada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar');
    },
  });
}

/**
 * Hook para obtener configuración SEO
 */
export function useSEOSettings(): UseQueryResult<SEOSettings> {
  return useQuery({
    queryKey: ['settings', 'seo'],
    queryFn: () => settingsService.getSEOSettings(),
  });
}

/**
 * Hook para actualizar SEO
 */
export function useUpdateSEOSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SEOSettings>) =>
      settingsService.updateSEOSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'seo'] });
      toast.success('Configuración SEO actualizada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar');
    },
  });
}

/**
 * Hook para obtener redes sociales
 */
export function useSocialSettings(): UseQueryResult<SocialSettings> {
  return useQuery({
    queryKey: ['settings', 'social'],
    queryFn: () => settingsService.getSocialSettings(),
  });
}

/**
 * Hook para actualizar redes sociales
 */
export function useUpdateSocialSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SocialSettings>) =>
      settingsService.updateSocialSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'social'] });
      toast.success('Redes sociales actualizadas');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar');
    },
  });
}

/**
 * Hook para obtener configuración de pagos
 */
export function usePaymentSettings(): UseQueryResult<PaymentSettings> {
  return useQuery({
    queryKey: ['settings', 'payment'],
    queryFn: () => settingsService.getPaymentSettings(),
  });
}

/**
 * Hook para actualizar pagos
 */
export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentSettings>) =>
      settingsService.updatePaymentSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'payment'] });
      toast.success('Configuración de pagos actualizada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar');
    },
  });
}

/**
 * Hook para obtener documentos legales
 */
export function useLegalSettings(): UseQueryResult<LegalSettings> {
  return useQuery({
    queryKey: ['settings', 'legal'],
    queryFn: () => settingsService.getLegalSettings(),
  });
}

/**
 * Hook para actualizar legales
 */
export function useUpdateLegalSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LegalSettings>) =>
      settingsService.updateLegalSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'legal'] });
      toast.success('Documentos legales actualizados');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al guardar');
    },
  });
}
```

---

## 2️⃣ Componente SiteSettings

**Archivo:** `src/components/admin/settings/SiteSettings.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import {
  useSiteSettings,
  useUpdateSiteSettings,
} from '@/lib/hooks/useSettingsAdmin';

const siteSchema = z.object({
  siteName: z.string().min(1, 'El nombre es requerido'),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

type SiteFormData = z.infer<typeof siteSchema>;

export default function SiteSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const { mutate: update, isPending } = useUpdateSiteSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const logo = watch('logo');
  const favicon = watch('favicon');

  const onSubmit = (data: SiteFormData) => {
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
        <h3 className="text-lg font-semibold">Información del Sitio</h3>

        <div className="space-y-2">
          <Label htmlFor="siteName">Nombre del Sitio *</Label>
          <Input
            id="siteName"
            {...register('siteName')}
            placeholder="Maria Victoria Seoane"
          />
          {errors.siteName && (
            <p className="text-sm text-red-600">{errors.siteName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteDescription">Descripción</Label>
          <Textarea
            id="siteDescription"
            {...register('siteDescription')}
            placeholder="Plataforma de cursos online..."
            rows={3}
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Imágenes</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUploader
              value={logo}
              onChange={(url) => setValue('logo', url)}
              aspectRatio="16/9"
            />
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <ImageUploader
              value={favicon}
              onChange={(url) => setValue('favicon', url)}
              aspectRatio="1/1"
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 32x32px o 64x64px
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Contacto</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de Contacto *</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              placeholder="info@ejemplo.com"
            />
            {errors.contactEmail && (
              <p className="text-sm text-red-600">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Teléfono</Label>
            <Input
              id="contactPhone"
              {...register('contactPhone')}
              placeholder="+54 11 1234-5678"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="Buenos Aires, Argentina"
          />
        </div>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
}
```

---

## 3️⃣ Componente SEOSettings

**Archivo:** `src/components/admin/settings/SEOSettings.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import {
  useSEOSettings,
  useUpdateSEOSettings,
} from '@/lib/hooks/useSettingsAdmin';

const seoSchema = z.object({
  metaTitle: z.string().max(60, 'Máximo 60 caracteres'),
  metaDescription: z.string().max(160, 'Máximo 160 caracteres'),
  metaKeywords: z.string().optional(),
  ogImage: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  twitterHandle: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
});

type SEOFormData = z.infer<typeof seoSchema>;

export default function SEOSettings() {
  const { data: settings, isLoading } = useSEOSettings();
  const { mutate: update, isPending } = useUpdateSEOSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const metaTitle = watch('metaTitle') || '';
  const metaDescription = watch('metaDescription') || '';
  const ogImage = watch('ogImage');

  const onSubmit = (data: SEOFormData) => {
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
        <h3 className="text-lg font-semibold">Meta Tags</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <span className="text-xs text-muted-foreground">
              {metaTitle.length}/60
            </span>
          </div>
          <Input
            id="metaTitle"
            {...register('metaTitle')}
            placeholder="Maria Victoria Seoane - Cursos Online"
          />
          {errors.metaTitle && (
            <p className="text-sm text-red-600">{errors.metaTitle.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <span className="text-xs text-muted-foreground">
              {metaDescription.length}/160
            </span>
          </div>
          <Textarea
            id="metaDescription"
            {...register('metaDescription')}
            placeholder="Aprende con los mejores cursos online..."
            rows={3}
          />
          {errors.metaDescription && (
            <p className="text-sm text-red-600">
              {errors.metaDescription.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaKeywords">Keywords (separadas por coma)</Label>
          <Input
            id="metaKeywords"
            {...register('metaKeywords')}
            placeholder="cursos, online, desarrollo personal"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Open Graph (Redes Sociales)</h3>

        <div className="space-y-2">
          <Label>Imagen OG (1200x630px recomendado)</Label>
          <ImageUploader
            value={ogImage}
            onChange={(url) => setValue('ogImage', url)}
            aspectRatio="1200/630"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ogTitle">OG Title</Label>
          <Input
            id="ogTitle"
            {...register('ogTitle')}
            placeholder="Título para redes sociales"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ogDescription">OG Description</Label>
          <Textarea
            id="ogDescription"
            {...register('ogDescription')}
            placeholder="Descripción para redes sociales..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterHandle">Twitter Handle</Label>
          <Input
            id="twitterHandle"
            {...register('twitterHandle')}
            placeholder="@usuario"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Analytics</h3>

        <div className="space-y-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
          <Input
            id="googleAnalyticsId"
            {...register('googleAnalyticsId')}
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-muted-foreground">
            ID de medición de Google Analytics 4
          </p>
        </div>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
}
```

---

## 4️⃣ Componente SocialMediaSettings

**Archivo:** `src/components/admin/settings/SocialMediaSettings.tsx`

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
import { Loader2 } from 'lucide-react';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
} from 'lucide-react';
import {
  useSocialSettings,
  useUpdateSocialSettings,
} from '@/lib/hooks/useSettingsAdmin';

const socialSchema = z.object({
  instagram: z.string().url('URL inválida').optional().or(z.literal('')),
  facebook: z.string().url('URL inválida').optional().or(z.literal('')),
  twitter: z.string().url('URL inválida').optional().or(z.literal('')),
  youtube: z.string().url('URL inválida').optional().or(z.literal('')),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  tiktok: z.string().url('URL inválida').optional().or(z.literal('')),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
});

type SocialFormData = z.infer<typeof socialSchema>;

const socialFields = [
  { name: 'instagram' as const, icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/usuario' },
  { name: 'facebook' as const, icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/pagina' },
  { name: 'twitter' as const, icon: Twitter, label: 'Twitter / X', placeholder: 'https://twitter.com/usuario' },
  { name: 'youtube' as const, icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/@canal' },
  { name: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/usuario' },
  { name: 'website' as const, icon: Globe, label: 'Sitio Web', placeholder: 'https://miweb.com' },
];

export default function SocialMediaSettings() {
  const { data: settings, isLoading } = useSocialSettings();
  const { mutate: update, isPending } = useUpdateSocialSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: SocialFormData) => {
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
        <h3 className="text-lg font-semibold">Redes Sociales</h3>
        <p className="text-sm text-muted-foreground">
          Configura los enlaces a tus redes sociales. Aparecerán en el footer.
        </p>

        <div className="space-y-4">
          {socialFields.map((field) => {
            const Icon = field.icon;
            const error = errors[field.name];

            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                />
                {error && (
                  <p className="text-sm text-red-600">{error.message}</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
}
```

---

## 5️⃣ Componente ImageUploader

**Archivo:** `src/components/admin/settings/ImageUploader.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: string;
}

export default function ImageUploader({
  value,
  onChange,
  aspectRatio = '16/9',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir');

      const { url } = await response.json();
      onChange(url);
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative border rounded-lg overflow-hidden">
          <div style={{ aspectRatio }} className="relative">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          style={{ aspectRatio }}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click para subir imagen
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
```

---

## 6️⃣ Página Principal de Configuración

**Archivo:** `src/app/admin/configuracion/page.tsx`

```typescript
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Search, Share2 } from 'lucide-react';
import SiteSettings from '@/components/admin/settings/SiteSettings';
import SEOSettings from '@/components/admin/settings/SEOSettings';
import SocialMediaSettings from '@/components/admin/settings/SocialMediaSettings';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Configuración General</h1>
        <p className="text-muted-foreground mt-1">
          Administra la configuración global del sitio
        </p>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="site">
            <Settings className="mr-2 h-4 w-4" />
            Sitio
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="mr-2 h-4 w-4" />
            Redes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <SiteSettings />
        </TabsContent>

        <TabsContent value="seo">
          <SEOSettings />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 7️⃣ Navegación de Configuración

**Archivo:** `src/components/admin/settings/SettingsNav.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Settings,
  Search,
  Share2,
  CreditCard,
  FileText,
} from 'lucide-react';

const navItems = [
  { href: '/admin/configuracion', label: 'General', icon: Settings },
  { href: '/admin/configuracion/seo', label: 'SEO', icon: Search },
  { href: '/admin/configuracion/social', label: 'Redes', icon: Share2 },
  { href: '/admin/configuracion/pagos', label: 'Pagos', icon: CreditCard },
  { href: '/admin/configuracion/legal', label: 'Legal', icon: FileText },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

---

## 🎨 Tipos (Parte 1)

**Archivo:** `src/types/index.ts` (agregar)

```typescript
export interface SiteSettings {
  siteName: string;
  siteDescription?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  logo?: string;
  favicon?: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
}

export interface SocialSettings {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  website?: string;
}
```

---

## 📝 Resumen Fase 14.1

En esta parte implementamos:

✅ **Hooks completos** para todas las configuraciones  
✅ **SiteSettings** - Nombre, logo, favicon, contacto  
✅ **SEOSettings** - Meta tags, Open Graph, Analytics  
✅ **SocialMediaSettings** - 6 redes sociales con validación URL  
✅ **ImageUploader** - Componente reutilizable con preview  
✅ **Página con Tabs** - Navegación por secciones

---

**Continúa en FRONTEND-14.2** con: MercadoPago, Documentos Legales, Servicios, Testing y Checklist.
