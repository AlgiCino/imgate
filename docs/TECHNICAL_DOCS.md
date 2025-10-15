# Imperium Gate Real Estate Dubai - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Architecture](#data-architecture)
5. [Component Architecture](#component-architecture)
6. [API Integration](#api-integration)
7. [State Management](#state-management)
8. [Routing](#routing)
9. [Internationalization](#internationalization)
10. [Performance Optimization](#performance-optimization)
11. [Security](#security)
12. [Testing Strategy](#testing-strategy)
13. [Deployment](#deployment)
14. [Monitoring](#monitoring)
15. [Maintenance](#maintenance)

## Architecture Overview

Imperium Gate AI follows a modern React-based architecture with a focus on performance, scalability, and maintainability. The application is built using a component-driven approach with clear separation of concerns.

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Services      │    │   Data Store    │
│                 │    │                 │    │                 │
│  React/Vite     │◄──►│  Gemini AI      │◄──►│  JSON Files     │
│  TypeScript     │    │  APIs           │    │  (Static)       │
│  Tailwind CSS   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Principles
- **Component Reusability**: Modular, self-contained components
- **Data Decoupling**: Static JSON data with dynamic loading
- **Performance First**: Optimized loading and rendering
- **Progressive Enhancement**: Core functionality without JavaScript
- **Mobile-First**: Responsive design approach

## Technology Stack

### Core Technologies
- **React 18**: Component-based UI library
- **TypeScript**: Static typing for JavaScript
- **Vite 4**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **React Router 6**: Declarative routing

### AI Integration
- **Google Gemini API**: Natural language processing
- **@google/generative-ai**: Official SDK for Gemini integration

### Internationalization
- **i18next**: Internationalization framework
- **react-i18next**: React integration for i18next

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Jest**: Unit testing framework
- **Cypress**: End-to-end testing
- **Storybook**: Component development environment

### Build and Deployment
- **Vite**: Build tool and development server
- **Rollup**: Module bundler (via Vite)
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Project Structure

```
imperium-gate-ai/
├── components/                 # Reusable UI components
│   ├── cards/                 # Card components
│   ├── layout/                # Layout components
│   ├── features/              # Feature components
│   └── ui/                    # Base UI components
├── data/                      # Static JSON data
│   ├── damac/                # DAMAC developer data
│   ├── emaar/                # EMAAR developer data
│   ├── nakheel/              # Nakheel developer data
│   └── sobha/                # SOBHA developer data
├── docs/                      # Documentation files
├── lib/                       # Utility functions and helpers
├── pages/                     # Page components
├── public/                    # Static assets
│   ├── images/               # Image assets
│   ├── locales/              # Translation files
│   └── favicon.ico           # Favicon
├── services/                  # API services and integrations
├── styles/                    # Global styles and Tailwind config
├── tests/                     # Test files
├── types/                     # TypeScript interfaces and types
├── .env*                     # Environment files
├── .gitignore                # Git ignore rules
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── README.md                 # Project documentation
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── yarn.lock                 # Dependency lock file
```

## Data Architecture

### Data Organization
The application uses a hierarchical JSON structure organized by developer:

```
data/
├── developer_name/
│   ├── developer_name_links.json
│   ├── project_slug/
│   │   └── project_slug.json
│   └── ...
└── ...
```

### Data Schema
Each project JSON file follows a standardized schema:

```typescript
interface Project {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  developer: string;
  location: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price: {
    starting: string;
    currency: string;
  };
  images: string[];
  amenities: {
    en: string[];
    ar: string[];
  };
  specifications: {
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
    type?: string;
  };
  status: 'off_plan' | 'under_construction' | 'ready';
  completion_date?: string;
  features: {
    en: string[];
    ar: string[];
  };
  createdAt: string;
  updatedAt: string;
}
```

### Data Loading Strategy
```typescript
// services/dataService.ts
class DataService {
  async loadProjects(): Promise<Project[]> {
    // Dynamic imports for code splitting
    const projects: Project[] = [];
    
    // Load projects from each developer
    const developers = ['damac', 'emaar', 'nakheel', 'sobha'];
    
    for (const developer of developers) {
      try {
        const links = await import(`../data/${developer}/${developer}_links.json`);
        const developerProjects = await Promise.all(
          links.projects.map(async (slug: string) => {
            const project = await import(`../data/${developer}/${slug}/${slug}.json`);
            return project.default;
          })
        );
        projects.push(...developerProjects);
      } catch (error) {
        console.error(`Error loading ${developer} projects:`, error);
      }
    }
    
    return projects;
  }
}
```

### Data Caching
- **Browser Caching**: Static JSON files are cached by the browser
- **Service Worker**: Optional offline support via service worker
- **Memory Caching**: Runtime caching of loaded data

## Component Architecture

### Component Hierarchy
```
App
├── Header
│   ├── Logo
│   ├── LanguageSwitcher
│   └── Navigation
├── Routes
│   ├── HomePage
│   │   ├── HeroVideo
│   │   ├── ProjectsGrid
│   │   │   └── ProjectCard
│   │   └── DeveloperCard
│   ├── ProjectsOverviewPage
│   │   └── ProjectsGrid
│   ├── ProjectDetailPage
│   │   ├── ImageGallery
│   │   ├── PropertyDetails
│   │   └── DeveloperInfo
│   ├── DeveloperProjectsPage
│   │   └── ProjectsGrid
│   └── AIAssistantPage
│       └── AIAssistant
├── SplashScreen
└── Footer
```

### Component Design Patterns
1. **Presentational Components**: Pure UI components with props
2. **Container Components**: Handle data fetching and state
3. **Compound Components**: Related components that work together
4. **Higher-Order Components**: Logic reuse patterns
5. **Render Props**: Flexible component composition

### Component Interface Standards
```typescript
// Example component interface
interface ComponentProps {
  // Required props first
  data: DataType;
  
  // Optional props with defaults
  isLoading?: boolean;
  error?: string;
  className?: string;
  
  // Event handlers
  onAction?: (data: DataType) => void;
  
  // Render props for customization
  renderCustom?: (data: DataType) => React.ReactNode;
}

// Default props pattern
const Component: React.FC<ComponentProps> = ({
  data,
  isLoading = false,
  error = null,
  className = '',
  onAction,
  renderCustom
}) => {
  // Component implementation
};
```

## API Integration

### Gemini AI Service
```typescript
// services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async sendMessage(message: string, context?: any): Promise<string> {
    try {
      const prompt = this.buildPrompt(message, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  private buildPrompt(message: string, context?: any): string {
    return `
      You are an AI real estate assistant for Imperium Gate AI.
      Context: ${context ? JSON.stringify(context) : 'No context provided'}
      User message: ${message}
    `;
  }
}

export const geminiService = new GeminiService();
```

### API Error Handling
```typescript
// lib/apiClient.ts
class ApiClient {
  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Network error: ${error.message}`,
        0
      );
    }
  }
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## State Management

### React Hooks Pattern
The application uses React's built-in hooks for state management:

```typescript
// hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { Project } from '../types';
import { dataService } from '../services/dataService';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await dataService.loadProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, loading, error };
};
```

### Custom Hooks for Complex State
```typescript
// hooks/useFavorites.ts
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
};
```

### Context API for Global State
```typescript
// contexts/GlobalContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface GlobalContextType {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  setLanguage: (lang: 'en' | 'ar') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <GlobalContext.Provider value={{ language, theme, setLanguage, setTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
```

## Routing

### React Router Implementation
```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Spinner from './components/ui/Spinner';

const LazyHomePage = lazy(() => import('./pages/HomePage'));
const LazyProjectsPage = lazy(() => import('./pages/ProjectsOverviewPage'));
const LazyProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const LazyDeveloperPage = lazy(() => import('./pages/DeveloperProjectsPage'));
const LazyAIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LazyHomePage />} />
          <Route path="/projects" element={<LazyProjectsPage />} />
          <Route path="/projects/:id" element={<LazyProjectDetailPage />} />
          <Route path="/developers/:developer" element={<LazyDeveloperPage />} />
          <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Route Parameters and Query Strings
```typescript
// pages/ProjectDetailPage.tsx
import { useParams, useSearchParams } from 'react-router-dom';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  
  const source = searchParams.get('source') || 'direct';
  const utmSource = searchParams.get('utm_source');
  
  // Load project data based on ID
  // Track source for analytics
};
```

### Programmatic Navigation
```typescript
// components/ProjectCard.tsx
import { useNavigate } from 'react-router-dom';

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/projects/${project.id}`, {
      state: { from: 'home', timestamp: Date.now() }
    });
  };
  
  return (
    <div onClick={handleClick}>
      {/* Project card content */}
    </div>
  );
};
```

## Internationalization

### i18next Configuration
```typescript
// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          common: {
            welcome: "Welcome",
            loading: "Loading...",
            error: "An error occurred"
          }
        }
      },
      ar: {
        translation: {
          common: {
            welcome: "مرحباً",
            loading: "جار التحميل...",
            error: "حدث خطأ"
          }
        }
      }
    }
  });

export default i18n;
```

### Translation Usage
```typescript
// components/Header.tsx
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <header>
      <h1>{t('common:welcome')}</h1>
      <button onClick={() => changeLanguage('ar')}>
        {t('common:switch_to_arabic')}
      </button>
    </header>
  );
};
```

### RTL Support
```css
/* styles/globals.css */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

html[dir="rtl"] .ml-* {
  margin-left: 0;
  margin-right: var(--margin-value);
}

html[dir="rtl"] .mr-* {
  margin-right: 0;
  margin-left: var(--margin-value);
}
```

## Performance Optimization

### Code Splitting
```typescript
// App.tsx
import { lazy, Suspense } from 'react';

// Route-based code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsOverviewPage'));

// Component-based code splitting
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization
```typescript
// components/ResponsiveImage.tsx
import { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const ResponsiveImage: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className = '',
  loading = 'lazy'
}) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img
      src={src}
      srcSet={`${src}?w=320 320w, ${src}?w=640 640w, ${src}?w=1024 1024w`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      className={`${className} transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
      loading={loading}
      onLoad={() => setLoaded(true)}
    />
  );
};
```

### Bundle Optimization
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ai: ['@google/generative-ai'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
```

### Performance Monitoring
```typescript
// lib/performance.ts
class PerformanceMonitor {
  static measureRenderTime(componentName: string, callback: () => void) {
    const start = performance.now();
    callback();
    const end = performance.now();
    
    console.log(`${componentName} render time: ${end - start}ms`);
    
    // Send to analytics
    if (import.meta.env.PROD) {
      // Analytics integration
    }
  }
  
  static trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${loadTime}ms`);
      
      // Core Web Vitals
      const cls = performance.getEntriesByName('CLS')[0]?.value || 0;
      const lcp = performance.getEntriesByName('LCP')[0]?.value || 0;
      const fid = performance.getEntriesByName('FID')[0]?.value || 0;
      
      console.log('Core Web Vitals:', { cls, lcp, fid });
    });
  }
}

export default PerformanceMonitor;
```

## Security

### Environment Variables
```bash
# .env.production
VITE_GEMINI_API_KEY=your_production_api_key
VITE_APP_ENV=production
VITE_BASE_URL=https://yourdomain.com
```

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://generativelanguage.googleapis.com;">
```

### Input Validation
```typescript
// lib/validation.ts
export const validateProjectId = (id: string): boolean => {
  // Validate ID format
  const regex = /^[a-zA-Z0-9-_]+$/;
  return regex.test(id) && id.length > 0 && id.length <= 100;
};

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000);
};
```

### Error Handling
```typescript
// lib/errorHandler.ts
class ErrorHandler {
  static handle(error: Error, context: string) {
    console.error(`Error in ${context}:`, error);
    
    // Don't expose internal errors to users
    if (import.meta.env.PROD) {
      // Send to error tracking service
      // Display user-friendly message
      return 'An unexpected error occurred. Please try again.';
    }
    
    // Development: show detailed error
    return error.message;
  }
}
```

## Testing Strategy

### Unit Testing with Jest
```typescript
// components/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { Project } from '../../types';

const mockProject: Project = {
  id: 'test-project',
  name: { en: 'Test Project', ar: 'مشروع تجريبي' },
  developer: 'Test Developer',
  location: { en: 'Dubai', ar: 'دبي' },
  description: { en: 'Test description', ar: 'وصف تجريبي' },
  price: { starting: 'AED 1,000,000', currency: 'AED' },
  images: ['/test-image.jpg'],
  amenities: { en: ['Pool'], ar: ['مسبح'] },
  specifications: { bedrooms: 3, bathrooms: 2 },
  status: 'off_plan',
  features: { en: ['Feature'], ar: ['ميزة'] },
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01'
};

describe('ProjectCard', () => {
  it('renders project name correctly', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays correct price', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('AED 1,000,000')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// contexts/GlobalContext.test.tsx
import { render, screen, act } from '@testing-library/react';
import { GlobalProvider, useGlobal } from './GlobalContext';

const TestComponent = () => {
  const { language, theme, setLanguage, setTheme } = useGlobal();
  
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setLanguage('ar')}>Change to Arabic</button>
      <button onClick={() => setTheme('dark')}>Change to Dark</button>
    </div>
  );
};

describe('GlobalContext', () => {
  it('provides default values', () => {
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
```

### End-to-End Testing with Cypress
```typescript
// cypress/e2e/homepage.cy.ts
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays hero section', () => {
    cy.get('[data-testid="hero-video"]').should('be.visible');
    cy.get('h1').should('contain', 'Imperium Gate AI');
  });

  it('shows project cards', () => {
    cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
  });

  it('navigates to project detail page', () => {
    cy.get('[data-testid="project-card"]').first().click();
    cy.url().should('include', '/projects/');
    cy.get('[data-testid="project-detail"]').should('be.visible');
  });
});
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Build analysis
npm run analyze
```

### Vite Configuration for Production
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react'],
          ai: ['@google/generative-ai']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});
```

### Deployment Options
1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **Cloud Storage**: AWS S3, Google Cloud Storage
3. **CDN**: Cloudflare, Akamai
4. **Container**: Docker with Nginx

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --dir=dist --prod
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

## Monitoring

### Performance Monitoring
```typescript
// lib/analytics.ts
class Analytics {
  static trackEvent(event: string, data?: Record<string, any>) {
    if (import.meta.env.PROD) {
      // Send to analytics service
      console.log('Analytics event:', event, data);
    }
  }
  
  static trackPageView(path: string) {
    if (import.meta.env.PROD) {
      // Send page view to analytics
      console.log('Page view:', path);
    }
  }
  
  static trackError(error: Error, context: string) {
    if (import.meta.env.PROD) {
      // Send error to error tracking service
      console.error('Tracked error:', error, context);
    }
  }
}
```

### Error Tracking
```typescript
// lib/errorTracker.ts
class ErrorTracker {
  static init() {
    window.addEventListener('error', (event) => {
      this.trackError(event.error, 'window.error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, 'unhandledrejection');
    });
  }
  
  private static trackError(error: Error, context: string) {
    console.error('Error tracked:', error, context);
    
    if (import.meta.env.PROD) {
      // Send to error tracking service
    }
  }
}

export default ErrorTracker;
```

### User Experience Monitoring
```typescript
// lib/uxMonitor.ts
class UXMonitor {
  static trackInteraction(element: string, action: string) {
    console.log('User interaction:', element, action);
    
    if (import.meta.env.PROD) {
      // Send to analytics
    }
  }
  
  static trackScrollDepth() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      maxScroll = Math.max(maxScroll, scrollPercent);
    });
    
    window.addEventListener('beforeunload', () => {
      console.log('Max scroll depth:', maxScroll);
      // Send to analytics
    });
  }
}
```

## Maintenance

### Update Strategy
```json
// package.json scripts for updates
{
  "scripts": {
    "update:deps": "npm outdated && npm update",
    "update:check": "npm outdated",
    "audit:fix": "npm audit fix",
    "clean:install": "rm -rf node_modules package-lock.json && npm install"
  }
}
```

### Data Maintenance
```typescript
// scripts/updateData.ts
class DataUpdater {
  static async validateData() {
    // Validate all JSON files
    const developers = ['damac', 'emaar', 'nakheel', 'sobha'];
    
    for (const developer of developers) {
      try {
        const links = await import(`../data/${developer}/${developer}_links.json`);
        
        for (const projectSlug of links.projects) {
          const project = await import(`../data/${developer}/${projectSlug}/${projectSlug}.json`);
          this.validateProjectSchema(project.default);
        }
      } catch (error) {
        console.error(`Validation error for ${developer}:`, error);
      }
    }
  }
  
  private static validateProjectSchema(project: any) {
    // Validate required fields
    const requiredFields = ['id', 'name', 'developer', 'price'];
    
    for (const field of requiredFields) {
      if (!project[field]) {
        throw new Error(`Missing required field: ${field} in project ${project.id}`);
      }
    }
  }
}
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/data_backup_$DATE.tar.gz" ./data/
tar -czf "$BACKUP_DIR/code_backup_$DATE.tar.gz" --exclude=node_modules --exclude=dist .

echo "Backup completed: $DATE"
```

### Health Checks
```typescript
// lib/healthCheck.ts
class HealthCheck {
  static async checkDataIntegrity() {
    try {
      // Check if data files are accessible
      const damacLinks = await import('../data/damac/damac_links.json');
      const emaarLinks = await import('../data/emaar/emaar_links.json');
      
      // Validate links structure
      if (!Array.isArray(damacLinks.projects)) {
        throw new Error('Invalid DAMAC links structure');
      }
      
      if (!Array.isArray(emaarLinks.projects)) {
        throw new Error('Invalid EMAAR links structure');
      }
      
      console.log('Data integrity check passed');
      return true;
    } catch (error) {
      console.error('Data integrity check failed:', error);
      return false;
    }
  }
  
  static async checkAPIServices() {
    // Check if external services are accessible
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'health check'
            }]
          }]
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}
```

This technical documentation provides a comprehensive overview of the Imperium Gate AI application's architecture, implementation details, and maintenance considerations. It serves as a reference for developers working on the project and helps ensure consistent development practices.
