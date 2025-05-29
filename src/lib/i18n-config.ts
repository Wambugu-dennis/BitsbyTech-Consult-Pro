
// src/lib/i18n-config.ts
import type { Locale } from 'date-fns';
// For full date-fns localization, you would import specific locales like:
// import { enUS, es } from 'date-fns/locale';

export type SupportedLanguage = 'en' | 'es'; // Add 'fr' etc. as needed
export type SupportedRegion = 'US' | 'GB' | 'ES' | 'FR'; // Add more as needed

export type Translations = {
  [key: string]: string;
};

export interface LanguagePack {
  name: string; // e.g., "English"
  nativeName: string; // e.g., "English" or "Español"
  translations: Translations;
  dateFormat: string; // date-fns format string
  // dateFnsLocale?: Locale; // For full date-fns localization
}

export const defaultLanguage: SupportedLanguage = 'en';
export const defaultRegion: SupportedRegion = 'US';

export const languagePacks: Record<SupportedLanguage, LanguagePack> = {
  en: {
    name: 'English',
    nativeName: 'English (US)',
    translations: {
      // Sidebar
      Dashboard: 'Dashboard',
      Clients: 'Clients',
      Projects: 'Projects',
      Consultants: 'Consultants',
      Finances: 'Finances',
      Calendar: 'Calendar',
      Analytics: 'Analytics',
      Reports: 'Reports',
      'AI Risk Analyzer': 'AI Risk Analyzer',
      Settings: 'Settings',
      Help: 'Help',
      // Page Titles / Common
      'Welcome back, get an overview of your consultancy.': 'Welcome back, get an overview of your consultancy.',
      'Manage your client companies and their engagement details.': 'Manage your client companies and their engagement details.',
      'Add Client': 'Add Client',
      'Save Changes': 'Save Changes',
      'Application Language': 'Application Language',
      'Region (for formatting)': 'Region (for formatting)',
      'Example Date': 'Example Date',
      'Save Language & Region': 'Save Language & Region Settings',
      // Settings Sections
      Account: 'Account',
      Notifications: 'Notifications',
      Security: 'Security',
      Appearance: 'Appearance',
      'Language & Region': 'Language & Region',
      Billing: 'Billing',
      'User Management': 'User Management',
      'Access Control': 'Access Control',
      Integrations: 'Integrations',
      'Workflow Customization': 'Workflow Customization',
      'System & Compliance': 'System & Compliance',
    },
    dateFormat: 'MMMM d, yyyy', // e.g., July 28, 2024
    // dateFnsLocale: enUS,
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español (ES)',
    translations: {
      // Sidebar
      Dashboard: 'Panel',
      Clients: 'Clientes',
      Projects: 'Proyectos',
      Consultants: 'Consultores',
      Finances: 'Finanzas',
      Calendar: 'Calendario',
      Analytics: 'Analíticas',
      Reports: 'Informes',
      'AI Risk Analyzer': 'Analizador de Riesgos IA',
      Settings: 'Configuración',
      Help: 'Ayuda',
      // Page Titles / Common
      'Welcome back, get an overview of your consultancy.': 'Bienvenido de nuevo, obtén una visión general de tu consultoría.',
      'Manage your client companies and their engagement details.': 'Gestiona las empresas de tus clientes y los detalles de su compromiso.',
      'Add Client': 'Añadir Cliente',
      'Save Changes': 'Guardar Cambios',
      'Application Language': 'Idioma de la Aplicación',
      'Region (para formatting)': 'Región (para formato)',
      'Example Date': 'Fecha de Ejemplo',
      'Save Language & Region': 'Guardar Configuración de Idioma y Región',
      // Settings Sections
      Account: 'Cuenta',
      Notifications: 'Notificaciones',
      Security: 'Seguridad',
      Appearance: 'Apariencia',
      'Language & Region': 'Idioma y Región',
      Billing: 'Facturación',
      'User Management': 'Gestión de Usuarios',
      'Access Control': 'Control de Acceso',
      Integrations: 'Integraciones',
      'Workflow Customization': 'Personalización de Flujos',
      'System & Compliance': 'Sistema y Cumplimiento',
    },
    dateFormat: "d 'de' MMMM 'de' yyyy", // e.g., 28 de julio de 2024
    // dateFnsLocale: es,
  },
};

export const supportedLanguages = Object.keys(languagePacks) as SupportedLanguage[];
export const supportedRegions: SupportedRegion[] = ['US', 'GB', 'ES', 'FR', 'DE']; // Example list

    