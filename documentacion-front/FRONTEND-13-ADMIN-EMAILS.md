# 📧 Fase 13 - Gestión de Emails (Admin)

> **Documentación Frontend - Maria Victoria Seoane**  
> Sistema completo de gestión de emails con templates, configuración SMTP, logs y preview

---

## 📋 Contenido

1. [Introducción](#introducción)
2. [Hooks de Emails](#hooks-de-emails)
3. [Componente EmailTemplateEditor](#componente-emailtemplateeditor)
4. [Componente EmailPreview](#componente-emailpreview)
5. [Componente EmailTemplateList](#componente-emailtemplatelist)
6. [Componente SMTPConfig](#componente-smtpconfig)
7. [Componente EmailLogs](#componente-emaillogs)
8. [Componente TestEmailDialog](#componente-testemaildialog)
9. [Página Templates](#página-templates)
10. [Página Configuración SMTP](#página-configuración-smtp)
11. [Página Logs](#página-logs)
12. [Variables de Template](#variables-de-template)
13. [Servicios](#servicios)
14. [Testing](#testing)
15. [Checklist](#checklist)

---

## 🎯 Introducción

En esta fase implementaremos el **sistema de gestión de emails**, permitiendo:

- ✅ **Editar templates** de emails (bienvenida, confirmación, reembolso, etc.)
- ✅ **Configurar SMTP** con validación de credenciales
- ✅ **Preview en tiempo real** de emails con variables
- ✅ **Logs de emails** enviados con estado y fecha
- ✅ **Enviar emails de prueba** para validar configuración
- ✅ **Variables dinámicas** en templates ({{nombre}}, {{curso}}, etc.)
- ✅ **Editor HTML** con sintaxis highlighting

---

## 1️⃣ Hooks de Emails

**Archivo:** `src/lib/hooks/useEmailAdmin.ts`

```typescript
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { emailsService } from '@/lib/services/emailsService';
import { toast } from 'sonner';
import type {
  EmailTemplate,
  EmailConfig,
  EmailLog,
  UpdateTemplateDto,
  SendTestEmailDto,
} from '@/types';

/**
 * Hook para obtener todos los templates de email
 */
export function useEmailTemplates(): UseQueryResult<EmailTemplate[]> {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: () => emailsService.getTemplates(),
  });
}

/**
 * Hook para obtener un template por ID
 */
export function useEmailTemplate(
  templateId: string,
): UseQueryResult<EmailTemplate> {
  return useQuery({
    queryKey: ['email-templates', templateId],
    queryFn: () => emailsService.getTemplateById(templateId),
    enabled: !!templateId,
  });
}

/**
 * Hook para obtener configuración SMTP
 */
export function useEmailConfig(): UseQueryResult<EmailConfig> {
  return useQuery({
    queryKey: ['email-config'],
    queryFn: () => emailsService.getConfig(),
  });
}

/**
 * Hook para obtener logs de emails
 */
export function useEmailLogs(filters?: {
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}): UseQueryResult<EmailLog[]> {
  return useQuery({
    queryKey: ['email-logs', filters],
    queryFn: () => emailsService.getLogs(filters),
  });
}

/**
 * Hook para actualizar template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateDto }) =>
      emailsService.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      queryClient.invalidateQueries({
        queryKey: ['email-templates', variables.id],
      });
      toast.success('Template actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar template',
      );
    },
  });
}

/**
 * Hook para actualizar configuración SMTP
 */
export function useUpdateEmailConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EmailConfig>) =>
      emailsService.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-config'] });
      toast.success('Configuración actualizada correctamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al actualizar configuración',
      );
    },
  });
}

/**
 * Hook para testear configuración SMTP
 */
export function useTestSMTPConnection() {
  return useMutation({
    mutationFn: () => emailsService.testConnection(),
    onSuccess: () => {
      toast.success('Conexión SMTP exitosa');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error de conexión SMTP');
    },
  });
}

/**
 * Hook para enviar email de prueba
 */
export function useSendTestEmail() {
  return useMutation({
    mutationFn: (data: SendTestEmailDto) => emailsService.sendTestEmail(data),
    onSuccess: () => {
      toast.success('Email de prueba enviado correctamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al enviar email de prueba',
      );
    },
  });
}

/**
 * Hook para reenviar email fallido
 */
export function useResendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => emailsService.resendEmail(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
      toast.success('Email reenviado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al reenviar email');
    },
  });
}
```

---

## 2️⃣ Componente EmailTemplateEditor

**Archivo:** `src/components/admin/emails/EmailTemplateEditor.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Code } from 'lucide-react';
import EmailPreview from './EmailPreview';
import type { EmailTemplate } from '@/types';

const templateSchema = z.object({
  subject: z.string().min(1, 'El asunto es requerido'),
  htmlContent: z.string().min(1, 'El contenido HTML es requerido'),
  textContent: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface EmailTemplateEditorProps {
  template: EmailTemplate;
  onSave: (data: TemplateFormData) => void;
  isPending?: boolean;
}

export default function EmailTemplateEditor({
  template,
  onSave,
  isPending,
}: EmailTemplateEditorProps) {
  const [activeTab, setActiveTab] = useState('editor');
  const [previewData, setPreviewData] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent || '',
    },
  });

  const htmlContent = watch('htmlContent');
  const subject = watch('subject');

  // Generar datos de ejemplo para preview
  useEffect(() => {
    const mockData: Record<string, string> = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      curso: 'Desarrollo Web Completo',
      precio: '$99.99',
      fecha: new Date().toLocaleDateString('es-AR'),
      orderNumber: 'ORD-12345',
      cupon: 'VERANO2025',
      descuento: '20%',
    };
    setPreviewData(mockData);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      {/* Template Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>
        <Badge variant="outline">{template.type}</Badge>
      </div>

      {/* Variables Available */}
      {template.variables && template.variables.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Variables Disponibles:</h4>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((variable) => (
              <code
                key={variable}
                className="text-xs px-2 py-1 bg-muted rounded"
              >
                {`{{${variable}}}`}
              </code>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Usa estas variables en tu template para insertar datos dinámicos
          </p>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">
            <Code className="mr-2 h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Asunto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="Bienvenido a nuestra plataforma"
            />
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          {/* HTML Content */}
          <div className="space-y-2">
            <Label htmlFor="htmlContent">
              Contenido HTML <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="htmlContent"
              {...register('htmlContent')}
              rows={20}
              className="font-mono text-sm"
              placeholder="<html>...</html>"
            />
            {errors.htmlContent && (
              <p className="text-sm text-red-600">
                {errors.htmlContent.message}
              </p>
            )}
          </div>

          {/* Text Content (fallback) */}
          <div className="space-y-2">
            <Label htmlFor="textContent">Contenido de Texto (Fallback)</Label>
            <Textarea
              id="textContent"
              {...register('textContent')}
              rows={10}
              placeholder="Versión en texto plano del email..."
            />
            <p className="text-xs text-muted-foreground">
              Versión alternativa para clientes de email que no soportan HTML
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <EmailPreview
            subject={subject}
            htmlContent={htmlContent}
            variables={previewData}
          />
        </TabsContent>
      </Tabs>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
```

---

## 3️⃣ Componente EmailPreview

**Archivo:** `src/components/admin/emails/EmailPreview.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface EmailPreviewProps {
  subject: string;
  htmlContent: string;
  variables: Record<string, string>;
}

export default function EmailPreview({
  subject,
  htmlContent,
  variables,
}: EmailPreviewProps) {
  // Reemplazar variables en el contenido
  const replaceVariables = (content: string): string => {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const processedContent = replaceVariables(htmlContent);
  const processedSubject = replaceVariables(subject);

  return (
    <Card className="p-6 space-y-4">
      {/* Email Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">De:</span>
          <span>info@mariavictoriaseoane.com</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">Para:</span>
          <span>{variables.email || 'ejemplo@email.com'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Asunto:
          </span>
          <span className="font-semibold">{processedSubject}</span>
        </div>
      </div>

      <Separator />

      {/* Email Body */}
      <div
        className="border rounded-lg p-6 bg-white"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Warning */}
      <p className="text-xs text-muted-foreground text-center">
        Esta es una vista previa con datos de ejemplo
      </p>
    </Card>
  );
}
```

---

## 4️⃣ Componente EmailTemplateList

**Archivo:** `src/components/admin/emails/EmailTemplateList.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Mail } from 'lucide-react';
import { useEmailTemplates } from '@/lib/hooks/useEmailAdmin';
import { Loader2 } from 'lucide-react';

const typeConfig = {
  welcome: { label: 'Bienvenida', color: 'bg-blue-100 text-blue-800' },
  order_confirmation: {
    label: 'Confirmación de Orden',
    color: 'bg-green-100 text-green-800',
  },
  order_failed: {
    label: 'Orden Fallida',
    color: 'bg-red-100 text-red-800',
  },
  refund: { label: 'Reembolso', color: 'bg-orange-100 text-orange-800' },
  password_reset: {
    label: 'Reseteo de Contraseña',
    color: 'bg-purple-100 text-purple-800',
  },
  course_access: {
    label: 'Acceso a Curso',
    color: 'bg-teal-100 text-teal-800',
  },
};

export default function EmailTemplateList() {
  const { data: templates, isLoading } = useEmailTemplates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No hay templates configurados</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => {
        const typeInfo =
          typeConfig[template.type as keyof typeof typeConfig] || {
            label: template.type,
            color: 'bg-gray-100 text-gray-800',
          };

        return (
          <Card key={template.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Type Badge */}
              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>

              {/* Variables */}
              {template.variables && template.variables.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {template.variables.length} variables disponibles
                </div>
              )}

              {/* Action */}
              <Button asChild className="w-full">
                <Link href={`/admin/emails/templates/${template.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Template
                </Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
```

---

## 5️⃣ Componente SMTPConfig

**Archivo:** `src/components/admin/emails/SMTPConfig.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, CheckCircle2 } from 'lucide-react';
import {
  useEmailConfig,
  useUpdateEmailConfig,
  useTestSMTPConnection,
} from '@/lib/hooks/useEmailAdmin';

const smtpSchema = z.object({
  host: z.string().min(1, 'El host es requerido'),
  port: z.coerce.number().min(1, 'El puerto es requerido'),
  secure: z.boolean(),
  user: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  fromEmail: z.string().email('Email inválido'),
  fromName: z.string().min(1, 'El nombre es requerido'),
});

type SMTPFormData = z.infer<typeof smtpSchema>;

export default function SMTPConfig() {
  const { data: config, isLoading } = useEmailConfig();
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateEmailConfig();
  const { mutate: testConnection, isPending: isTesting } = useTestSMTPConnection();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SMTPFormData>({
    resolver: zodResolver(smtpSchema),
    defaultValues: config
      ? {
          host: config.host,
          port: config.port,
          secure: config.secure,
          user: config.user,
          password: config.password,
          fromEmail: config.fromEmail,
          fromName: config.fromName,
        }
      : {
          secure: true,
          port: 587,
        },
  });

  const secure = watch('secure');

  const handleSave = (data: SMTPFormData) => {
    updateConfig(data);
  };

  const handleTest = () => {
    testConnection();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Configuración del Servidor SMTP</h3>

        {/* Host */}
        <div className="space-y-2">
          <Label htmlFor="host">
            Host SMTP <span className="text-red-500">*</span>
          </Label>
          <Input
            id="host"
            {...register('host')}
            placeholder="smtp.gmail.com"
          />
          {errors.host && (
            <p className="text-sm text-red-600">{errors.host.message}</p>
          )}
        </div>

        {/* Port & Secure */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="port">
              Puerto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="port"
              type="number"
              {...register('port')}
              placeholder="587"
            />
            {errors.port && (
              <p className="text-sm text-red-600">{errors.port.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="secure">Conexión Segura (TLS)</Label>
              <p className="text-xs text-muted-foreground">
                Usar SSL/TLS para la conexión
              </p>
            </div>
            <Switch
              id="secure"
              checked={secure}
              onCheckedChange={(checked) => setValue('secure', checked)}
            />
          </div>
        </div>

        {/* User */}
        <div className="space-y-2">
          <Label htmlFor="user">
            Usuario <span className="text-red-500">*</span>
          </Label>
          <Input
            id="user"
            {...register('user')}
            placeholder="usuario@gmail.com"
          />
          {errors.user && (
            <p className="text-sm text-red-600">{errors.user.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Contraseña <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Para Gmail, usa una contraseña de aplicación
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Remitente Predeterminado</h3>

        {/* From Email */}
        <div className="space-y-2">
          <Label htmlFor="fromEmail">
            Email del Remitente <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fromEmail"
            type="email"
            {...register('fromEmail')}
            placeholder="info@mariavictoriaseoane.com"
          />
          {errors.fromEmail && (
            <p className="text-sm text-red-600">{errors.fromEmail.message}</p>
          )}
        </div>

        {/* From Name */}
        <div className="space-y-2">
          <Label htmlFor="fromName">
            Nombre del Remitente <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fromName"
            {...register('fromName')}
            placeholder="Maria Victoria Seoane"
          />
          {errors.fromName && (
            <p className="text-sm text-red-600">{errors.fromName.message}</p>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleTest}
          disabled={isTesting || isUpdating}
          className="flex-1"
        >
          {isTesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          Probar Conexión
        </Button>
        <Button type="submit" disabled={isUpdating || isTesting} className="flex-1">
          {isUpdating ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </form>
  );
}
```

---

## 6️⃣ Componente EmailLogs

**Archivo:** `src/components/admin/emails/EmailLogs.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RefreshCw, Eye } from 'lucide-react';
import { useEmailLogs, useResendEmail } from '@/lib/hooks/useEmailAdmin';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { EmailLog } from '@/types';

const statusConfig = {
  sent: { label: 'Enviado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
};

export default function EmailLogs() {
  const [filters, setFilters] = useState({});
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const { data: logs, isLoading } = useEmailLogs(filters);
  const { mutate: resend, isPending: isResending } = useResendEmail();

  const handleResend = (logId: string) => {
    if (confirm('¿Reenviar este email?')) {
      resend(logId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={(filters as any).status || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="sent">Enviados</SelectItem>
              <SelectItem value="failed">Fallidos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Email</Label>
          <Select
            value={(filters as any).type || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, type: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="welcome">Bienvenida</SelectItem>
              <SelectItem value="order_confirmation">Confirmación</SelectItem>
              <SelectItem value="refund">Reembolso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {!logs || logs.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No se encontraron logs</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinatario</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const status = statusConfig[log.status as keyof typeof statusConfig];

                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {log.recipient.firstName} {log.recipient.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.recipient.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <span className="line-clamp-1">{log.subject}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">
                        {log.type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(log.createdAt, true)}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {log.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleResend(log.id)}
                            disabled={isResending}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Email</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Para:</span>
                  <span>{selectedLog.recipient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Asunto:</span>
                  <span>{selectedLog.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Tipo:</span>
                  <span className="capitalize">
                    {selectedLog.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Estado:</span>
                  <Badge
                    className={
                      statusConfig[selectedLog.status as keyof typeof statusConfig]
                        .color
                    }
                  >
                    {
                      statusConfig[selectedLog.status as keyof typeof statusConfig]
                        .label
                    }
                  </Badge>
                </div>
              </div>

              {selectedLog.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">Error:</p>
                  <p className="text-sm text-red-700 mt-1">{selectedLog.error}</p>
                </div>
              )}

              {selectedLog.htmlContent && (
                <div className="border rounded-lg p-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedLog.htmlContent }}
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 7️⃣ Componente TestEmailDialog

**Archivo:** `src/components/admin/emails/TestEmailDialog.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send } from 'lucide-react';
import { useSendTestEmail, useEmailTemplates } from '@/lib/hooks/useEmailAdmin';

export default function TestEmailDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [templateId, setTemplateId] = useState('');

  const { data: templates } = useEmailTemplates();
  const { mutate: sendTest, isPending } = useSendTestEmail();

  const handleSend = () => {
    if (!email || !templateId) return;

    sendTest(
      { email, templateId },
      {
        onSuccess: () => {
          setOpen(false);
          setEmail('');
          setTemplateId('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Enviar Email de Prueba
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Email de Prueba</DialogTitle>
          <DialogDescription>
            Envía un email de prueba para validar la configuración y el template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template */}
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecciona un template" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email de Destino</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-email@ejemplo.com"
            />
          </div>

          {/* Action */}
          <Button
            onClick={handleSend}
            disabled={isPending || !email || !templateId}
            className="w-full"
          >
            {isPending ? 'Enviando...' : 'Enviar Email de Prueba'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 8️⃣ Página Templates

**Archivo:** `src/app/admin/emails/templates/page.tsx`

```typescript
'use client';

import EmailTemplateList from '@/components/admin/emails/EmailTemplateList';
import TestEmailDialog from '@/components/admin/emails/TestEmailDialog';

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates de Email</h1>
          <p className="text-muted-foreground mt-1">
            Personaliza los emails automáticos de la plataforma
          </p>
        </div>
        <TestEmailDialog />
      </div>

      {/* Template List */}
      <EmailTemplateList />
    </div>
  );
}
```

**Archivo:** `src/app/admin/emails/templates/[id]/page.tsx`

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmailTemplateEditor from '@/components/admin/emails/EmailTemplateEditor';
import {
  useEmailTemplate,
  useUpdateTemplate,
} from '@/lib/hooks/useEmailAdmin';

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const { data: template, isLoading } = useEmailTemplate(templateId);
  const { mutate: updateTemplate, isPending } = useUpdateTemplate();

  const handleSave = (data: any) => {
    updateTemplate(
      { id: templateId, data },
      {
        onSuccess: () => {
          router.push('/admin/emails/templates');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Template no encontrado</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/emails/templates">Volver a templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/emails/templates">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Template</h1>
          <p className="text-muted-foreground mt-1">
            Personaliza el contenido y diseño del email
          </p>
        </div>
      </div>

      {/* Editor */}
      <Card className="p-6">
        <EmailTemplateEditor
          template={template}
          onSave={handleSave}
          isPending={isPending}
        />
      </Card>
    </div>
  );
}
```

---

## 9️⃣ Página Configuración SMTP

**Archivo:** `src/app/admin/emails/config/page.tsx`

```typescript
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SMTPConfig from '@/components/admin/emails/SMTPConfig';

export default function EmailConfigPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/emails/templates">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configuración de Email</h1>
          <p className="text-muted-foreground mt-1">
            Configura el servidor SMTP para envío de emails
          </p>
        </div>
      </div>

      {/* Config Form */}
      <SMTPConfig />
    </div>
  );
}
```

---

## 🔟 Página Logs

**Archivo:** `src/app/admin/emails/logs/page.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import EmailLogs from '@/components/admin/emails/EmailLogs';

export default function EmailLogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs de Emails</h1>
          <p className="text-muted-foreground mt-1">
            Historial de todos los emails enviados por la plataforma
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/emails/config">
            <Settings className="mr-2 h-4 w-4" />
            Configuración SMTP
          </Link>
        </Button>
      </div>

      {/* Logs */}
      <EmailLogs />
    </div>
  );
}
```

---

## 1️⃣1️⃣ Variables de Template

**Documentación de variables disponibles por tipo de email:**

```typescript
// Variables por tipo de email
const emailVariables = {
  welcome: [
    'nombre', // Nombre del usuario
    'email', // Email del usuario
    'fecha', // Fecha de registro
  ],

  order_confirmation: [
    'nombre', // Nombre del usuario
    'orderNumber', // Número de orden
    'total', // Total de la orden
    'curso', // Nombre del curso (si es uno solo)
    'cursos', // Lista de cursos
    'fecha', // Fecha de la orden
    'metodoPago', // Método de pago
  ],

  order_failed: [
    'nombre',
    'orderNumber',
    'razon', // Razón del fallo
    'fecha',
  ],

  refund: [
    'nombre',
    'orderNumber',
    'monto', // Monto reembolsado
    'fecha',
    'razon', // Razón del reembolso
  ],

  password_reset: [
    'nombre',
    'resetLink', // Link para resetear contraseña
    'expiresIn', // Tiempo de expiración
  ],

  course_access: [
    'nombre',
    'curso', // Nombre del curso
    'cursoLink', // Link al curso
    'instructor', // Nombre del instructor
    'fecha',
  ],
};
```

---

## 1️⃣2️⃣ Servicios Completos

**Archivo:** `src/lib/services/emailsService.ts`

```typescript
import api from './api';
import type { AxiosResponse } from 'axios';
import type {
  EmailTemplate,
  EmailConfig,
  EmailLog,
  UpdateTemplateDto,
  SendTestEmailDto,
} from '@/types';

export const emailsService = {
  /**
   * Obtener todos los templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    const response: AxiosResponse<EmailTemplate[]> =
      await api.get('/emails/templates');
    return response.data;
  },

  /**
   * Obtener template por ID
   */
  async getTemplateById(id: string): Promise<EmailTemplate> {
    const response: AxiosResponse<EmailTemplate> = await api.get(
      `/emails/templates/${id}`,
    );
    return response.data;
  },

  /**
   * Actualizar template
   */
  async updateTemplate(
    id: string,
    data: UpdateTemplateDto,
  ): Promise<EmailTemplate> {
    const response: AxiosResponse<EmailTemplate> = await api.patch(
      `/emails/templates/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Obtener configuración SMTP
   */
  async getConfig(): Promise<EmailConfig> {
    const response: AxiosResponse<EmailConfig> =
      await api.get('/emails/config');
    return response.data;
  },

  /**
   * Actualizar configuración SMTP
   */
  async updateConfig(data: Partial<EmailConfig>): Promise<EmailConfig> {
    const response: AxiosResponse<EmailConfig> = await api.patch(
      '/emails/config',
      data,
    );
    return response.data;
  },

  /**
   * Testear conexión SMTP
   */
  async testConnection(): Promise<{ success: boolean }> {
    const response: AxiosResponse<{ success: boolean }> = await api.post(
      '/emails/test-connection',
    );
    return response.data;
  },

  /**
   * Enviar email de prueba
   */
  async sendTestEmail(data: SendTestEmailDto): Promise<{ success: boolean }> {
    const response: AxiosResponse<{ success: boolean }> = await api.post(
      '/emails/send-test',
      data,
    );
    return response.data;
  },

  /**
   * Obtener logs de emails
   */
  async getLogs(filters?: {
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<EmailLog[]> {
    const response: AxiosResponse<EmailLog[]> = await api.get('/emails/logs', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Reenviar email fallido
   */
  async resendEmail(logId: string): Promise<{ success: boolean }> {
    const response: AxiosResponse<{ success: boolean }> = await api.post(
      `/emails/logs/${logId}/resend`,
    );
    return response.data;
  },
};
```

---

## 🎨 Tipos Adicionales

**Archivo:** `src/types/index.ts` (agregar)

```typescript
export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTemplateDto {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailLog {
  id: string;
  type: string;
  recipient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  subject: string;
  htmlContent?: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  createdAt: string;
}

export interface SendTestEmailDto {
  email: string;
  templateId: string;
}
```

---

## 🧪 Testing

**Archivo:** `src/components/admin/emails/__tests__/EmailTemplateEditor.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailTemplateEditor from '../EmailTemplateEditor';

const queryClient = new QueryClient();

const mockTemplate = {
  id: '1',
  name: 'Bienvenida',
  description: 'Email de bienvenida',
  type: 'welcome',
  subject: 'Bienvenido',
  htmlContent: '<p>Hola {{nombre}}</p>',
  textContent: 'Hola {{nombre}}',
  variables: ['nombre', 'email'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('EmailTemplateEditor', () => {
  it('renders template data', () => {
    const mockSubmit = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <EmailTemplateEditor
          template={mockTemplate}
          onSave={mockSubmit}
        />
      </QueryClientProvider>
    );

    expect(screen.getByDisplayValue('Bienvenido')).toBeInTheDocument();
    expect(screen.getByText(/{{nombre}}/)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <EmailTemplateEditor
          template={{ ...mockTemplate, subject: '' }}
          onSave={mockSubmit}
        />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el asunto es requerido/i)).toBeInTheDocument();
    });
  });

  it('shows preview tab', async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <EmailTemplateEditor
          template={mockTemplate}
          onSave={mockSubmit}
        />
      </QueryClientProvider>
    );

    const previewTab = screen.getByRole('tab', { name: /vista previa/i });
    await user.click(previewTab);

    expect(screen.getByText(/de:/i)).toBeInTheDocument();
  });
});
```

---

## 🎨 Componentes shadcn/ui Adicionales

```bash
npx shadcn-ui@latest add tabs
```

---

## ✅ Checklist de Implementación Fase 13

### Hooks

- [ ] `useEmailAdmin.ts` - 8 hooks completos

### Componentes

- [ ] `EmailTemplateEditor.tsx` - Editor con tabs y preview
- [ ] `EmailPreview.tsx` - Preview con variables reemplazadas
- [ ] `EmailTemplateList.tsx` - Lista de templates con tipos
- [ ] `SMTPConfig.tsx` - Configuración con test de conexión
- [ ] `EmailLogs.tsx` - Tabla de logs con filtros
- [ ] `TestEmailDialog.tsx` - Dialog para enviar pruebas

### Páginas

- [ ] `app/admin/emails/templates/page.tsx` - Lista de templates
- [ ] `app/admin/emails/templates/[id]/page.tsx` - Editar template
- [ ] `app/admin/emails/config/page.tsx` - Configuración SMTP
- [ ] `app/admin/emails/logs/page.tsx` - Logs de emails

### Servicios

- [ ] emailsService completo con todos los endpoints

### Backend

- [ ] Endpoints de templates implementados
- [ ] Endpoint `/emails/test-connection` funcionando
- [ ] Endpoint `/emails/send-test` funcionando
- [ ] Sistema de variables en templates

### shadcn/ui

- [ ] Tabs instalado

### Testing

- [ ] Editor renderiza correctamente
- [ ] Validaciones funcionan
- [ ] Preview muestra variables reemplazadas
- [ ] Test de conexión SMTP funciona

---

## 🐛 Troubleshooting

### Problema: Variables no se reemplazan en preview

**Solución:**
Verificar que el regex en `replaceVariables` sea correcto:

```typescript
const regex = new RegExp(`{{${key}}}`, 'g');
```

### Problema: Error al testear conexión SMTP

**Solución:**
Para Gmail, usar contraseña de aplicación en lugar de la contraseña normal.

### Problema: Emails no se envían

**Solución:**
Verificar configuración del firewall y que el puerto SMTP esté abierto.

---

## 📚 Recursos Adicionales

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [HTML Email Best Practices](https://www.campaignmonitor.com/css/)
- [Email Template Testing](https://litmus.com/)

---

## 📝 Resumen de la Fase 13

En esta fase hemos creado:

✅ **Sistema completo de emails** con templates personalizables  
✅ **EmailTemplateEditor** - Editor con tabs, variables, preview en tiempo real  
✅ **SMTPConfig** - Configuración completa con test de conexión  
✅ **EmailLogs** - Historial con filtros, reenvío de fallidos  
✅ **EmailPreview** - Vista previa con variables reemplazadas  
✅ **TestEmailDialog** - Envío de pruebas para validación  
✅ **Variables dinámicas** - Sistema de reemplazo de variables  
✅ **6 tipos de emails** - Bienvenida, confirmación, fallo, reembolso, reset password, acceso a curso

**Resultado:** Sistema completo de gestión de emails con templates editables, configuración SMTP, logs detallados y preview en tiempo real.

---

**¡Fase 13 completada! 🎉**

Ahora puedes personalizar todos los emails automáticos de la plataforma, configurar el servidor SMTP y monitorear el envío de emails.
