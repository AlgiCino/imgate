# Imperium Gate Real Estate Dubai - Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Component Development](#component-development)
6. [Data Management](#data-management)
7. [API Integration](#api-integration)
8. [Internationalization](#internationalization)
9. [Testing](#testing)
10. [Performance Optimization](#performance-optimization)
11. [Deployment](#deployment)
12. [Contributing](#contributing)
13. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **Git**
- **Code Editor** (VS Code recommended)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/imperium-gate-ai.git
cd imperium-gate-ai

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

### Environment Setup
Create a `.env.local` file in the root directory:
```bash
# .env.local
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_APP_ENV=development
```

## Development Environment

### Recommended VS Code Extensions
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind CSS autocomplete
- **Auto Rename Tag** - HTML tag renaming
- **Bracket Pair Colorizer** - Visual bracket matching
- **GitLens** - Git integration
- **Thunder Client** - API testing

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/",
    "type-check": "tsc --noEmit",
    "analyze": "vite-bundle-visualizer"
  }
}
```

### Development Server Features
- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **Fast Refresh**: Preserves component state during development
- **Error Overlay**: Clear error messages in browser
- **Source Maps**: Debug original TypeScript code
- **Network Access**: Access development server from other devices

## Project Structure

### Directory Layout
```
imperium-gate-ai/
├── components/                 # Reusable UI components
│   ├── cards/                 # Card components
│   │   ├── ProjectCard.tsx
│   │   └── DeveloperCard.tsx
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── SplashScreen.tsx
│   ├── features/              # Feature components
│   │   ├── HeroVideo.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ProjectsGrid.tsx
│   └── ui/                    # Base UI components
│       ├── Spinner.tsx
│       └── Button.tsx
├── data/                      # Static JSON data
│   ├── damac/                # DAMAC developer data
│   ├── emaar/                # EMAAR developer data
│   ├── nakheel/              # Nakheel developer data
│   └── sobha/                # SOBHA developer data
├── docs/                      # Documentation files
├── lib/                       # Utility functions and helpers
│   ├── i18n.ts               # Internationalization setup
│   └── utils.ts              # Helper functions
├── pages/                     # Page components
│   ├── HomePage.tsx
│   ├── ProjectsOverviewPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── DeveloperProjectsPage.tsx
│   └── AIAssistantPage.tsx
├── public/                    # Static assets
│   ├── images/               # Image assets
│   ├── locales/              # Translation files
│   └── favicon.ico
├── services/                  # API services and integrations
│   └── geminiService.ts      # Gemini AI integration
├── styles/                    # Global styles
│   └── globals.css
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

### Component Organization
Components are organized by:
1. **Functionality**: Cards, Layout, Features, UI
2. **Reusability**: Shared components in appropriate directories
3. **Maintainability**: Clear separation of concerns

### Naming Conventions
- **Components**: PascalCase (e.g., `ProjectCard.tsx`)
- **Files**: camelCase or kebab-case (e.g., `projectCard.tsx`)
- **Directories**: lowercase with hyphens (e.g., `project-card/`)
- **CSS Classes**: Tailwind utility classes with custom classes in kebab-case

## Development Workflow

### Feature Development Process
1. **Create Branch**
   ```bash
   git checkout -b feature/new-component-name
   ```

2. **Component Development**
   - Create component file in appropriate directory
   - Implement TypeScript interfaces
   - Add Tailwind CSS styling
   - Write unit tests
   - Document component

3. **Integration**
   - Import component in parent component
   - Test functionality
   - Verify responsive design
   - Check accessibility

4. **Code Quality**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new component description"
   git push origin feature/new-component-name
   ```

### Git Workflow
```bash
# Main branches
main          # Production code
develop       # Development code
feature/*     # Feature branches
hotfix/*      # Bug fixes
release/*     # Release preparation

# Commit message format
feat: add new feature
fix: resolve bug
docs: update documentation
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### Code Review Process
1. **Self-Review**: Check code quality before PR
2. **Peer Review**: Assign reviewers from team
3. **Automated Checks**: CI/CD pipeline validation
4. **Merge**: Squash and merge to target branch

## Component Development

### Component Structure
```typescript
// components/ExampleComponent.tsx
import React from 'react';

interface ExampleComponentProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  onAction?: () => void;
  children?: React.ReactNode;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description = '',
  isLoading = false,
  onAction,
  children
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
      {isLoading ? (
        <div className="mt-4">
          <Spinner />
        </div>
      ) : (
        <div className="mt-4">
          {children}
          {onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Action
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExampleComponent;
```

### Component Best Practices
1. **Type Safety**: Use TypeScript interfaces for props
2. **Default Props**: Provide sensible defaults for optional props
3. **Accessibility**: Follow WCAG guidelines
4. **Performance**: Use React.memo for optimization
5. **Testing**: Write unit tests for components
6. **Documentation**: Add JSDoc comments

### Component Testing
```typescript
// components/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleComponent from './ExampleComponent';

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const mockAction = jest.fn();
    render(<ExampleComponent title="Test" onAction={mockAction} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('shows spinner when loading', () => {
    render(<ExampleComponent title="Test" isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

## Data Management

### Data Structure
The application uses a hierarchical JSON structure:

```typescript
// types.ts
export interface Project {
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

### Data Loading Service
```typescript
// services/dataService.ts
class DataService {
  async loadProjects(): Promise<Project[]> {
    const projects: Project[] = [];
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

  async loadProjectById(id: string): Promise<Project | null> {
    // Implementation for loading specific project
  }

  async loadProjectsByDeveloper(developer: string): Promise<Project[]> {
    // Implementation for loading projects by developer
  }
}

export const dataService = new DataService();
```

### Data Validation
```typescript
// lib/validation.ts
export const validateProject = (project: any): project is Project => {
  const requiredFields = ['id', 'name', 'developer', 'price'];
  
  for (const field of requiredFields) {
    if (!project[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  // Validate language objects
  if (!project.name.en || !project.name.ar) {
    console.error('Missing language translations');
    return false;
  }

  return true;
};
```

### Data Updates
To add new data:
1. Create developer directory in `data/`
2. Create `developer_links.json` with project slugs
3. Create project directory with `project_slug.json`
4. Validate JSON structure
5. Test data loading

## API Integration

### Gemini AI Service
```typescript
// services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

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
      throw new Error('Failed to get AI response');
    }
  }

  private buildPrompt(message: string, context?: any): string {
    return `
      You are an AI real estate assistant for Imperium Gate AI.
      Context: ${context ? JSON.stringify(context) : 'No context provided'}
      User message: ${message}
      
      Please provide helpful and accurate responses about Dubai real estate properties.
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
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

### Rate Limiting
```typescript
// lib/rateLimiter.ts
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number = 10;
  private windowMs: number = 60000; // 1 minute

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }
    
    this.requests.push(now);
    return await fn();
  }
}

export const rateLimiter = new RateLimiter();
```

## Internationalization

### i18n Setup
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
            welcome: "Welcome to Imperium Gate AI",
            loading: "Loading...",
            error: "An error occurred",
            search: "Search properties",
            viewDetails: "View Details"
          },
          navigation: {
            home: "Home",
            projects: "All Projects",
            developers: "Developers",
            aiAssistant: "AI Assistant",
            favorites: "Favorites"
          }
        }
      },
      ar: {
        translation: {
          common: {
            welcome: "مرحباً بكم في Imperium Gate AI",
            loading: "جار التحميل...",
            error: "حدث خطأ",
            search: "البحث عن العقارات",
            viewDetails: "عرض التفاصيل"
          },
          navigation: {
            home: "الرئيسية",
            projects: "جميع المشاريع",
            developers: "المطورون",
            aiAssistant: "المساعد الذكي",
            favorites: "المفضلة"
          }
        }
      }
    }
  });

export default i18n;
```

### Using Translations
```typescript
// components/Header.tsx
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-6">
          <li>
            <a href="/">{t('navigation:home')}</a>
          </li>
          <li>
            <a href="/projects">{t('navigation:projects')}</a>
          </li>
          <li>
            <a href="/ai-assistant">{t('navigation:aiAssistant')}</a>
          </li>
        </ul>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher 
            currentLanguage={i18n.language as 'en' | 'ar'}
            onLanguageChange={changeLanguage}
          />
        </div>
      </nav>
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

html[dir="rtl"] .pl-* {
  padding-left: 0;
  padding-right: var(--padding-value);
}

html[dir="rtl"] .pr-* {
  padding-right: 0;
  padding-left: var(--padding-value);
}
```

## Testing

### Unit Testing with Jest
```typescript
// components/ProjectCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from './ProjectCard';
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

  it('calls onClick when card is clicked', () => {
    const mockClick = jest.fn();
    render(<ProjectCard project={mockProject} onClick={mockClick} />);
    
    const card = screen.getByTestId('project-card');
    fireEvent.click(card);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
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

  it('updates language correctly', () => {
    render(
      <GlobalProvider>
        <TestComponent />
      </GlobalProvider>
    );
    
    const button = screen.getByText('Change to Arabic');
    act(() => {
      fireEvent.click(button);
    });
    
    expect(screen.getByTestId('language')).toHaveTextContent('ar');
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

  it('switches language', () => {
    cy.get('[data-testid="language-switcher"]').click();
    cy.get('[data-testid="arabic-option"]').click();
    cy.get('h1').should('contain', 'مرحباً بكم');
  });
});
```

### Test Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Performance Optimization

### Code Splitting
```typescript
// App.tsx
import { lazy, Suspense } from 'react';
import Spinner from './components/ui/Spinner';

const LazyHomePage = lazy(() => import('./pages/HomePage'));
const LazyProjectsPage = lazy(() => import('./pages/ProjectsOverviewPage'));
const LazyProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<LazyHomePage />} />
        <Route path="/projects" element={<LazyProjectsPage />} />
        <Route path="/projects/:id" element={<LazyProjectDetailPage />} />
      </Routes>
    </Suspense>
  );
}
```

### React.memo for Component Optimization
```typescript
// components/ProjectCard.tsx
import React, { memo } from 'react';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = memo(({ project, onClick }) => {
  return (
    <div 
      data-testid="project-card"
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Card content */}
    </div>
  );
});

export default ProjectCard;
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck

# Optimize images
npm run optimize-images
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
    
    if (import.meta.env.PROD) {
      // Send to analytics service
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

### Environment Configuration
```bash
# .env.production
VITE_GEMINI_API_KEY=your_production_api_key
VITE_APP_ENV=production
VITE_BASE_URL=https://imperiumgate.ai
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

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Contributing

### Contribution Guidelines
1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **Semantic Versioning**: Version numbering

### Pull Request Process
1. **Title**: Clear, descriptive title
2. **Description**: Detailed explanation of changes
3. **Tests**: Include unit/integration tests
4. **Documentation**: Update relevant documentation
5. **Review**: Request code review from team members

### Branch Naming
- `feature/new-feature-name`
- `bugfix/issue-description`
- `hotfix/critical-fix`
- `docs/documentation-update`
- `refactor/component-name`

## Troubleshooting

### Common Issues and Solutions

#### 1. Development Server Not Starting
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port availability
lsof -i :3000
```

#### 2. TypeScript Errors
```bash
# Check types
npm run type-check

# Update TypeScript
npm update typescript
```

#### 3. API Integration Issues
```bash
# Check environment variables
echo $VITE_GEMINI_API_KEY

# Test API connectivity
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'
```

#### 4. Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run test:memory
```

#### 5. Deployment Problems
```bash
# Test production build locally
npm run build
npm run preview

# Check build logs
npm run build --verbose
```

### Debugging Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management (if used)
- **Browser DevTools**: Network, performance, console
- **VS Code Debugger**: Breakpoint debugging
- **Console Logging**: Strategic log placement

### Performance Profiling
```bash
# React profiling
npm run dev --profile

# Bundle analysis
npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:3000
```

This developer guide provides comprehensive information for contributing to and maintaining the Imperium Gate AI project. It covers development workflows, best practices, and troubleshooting guidance to ensure consistent and high-quality development.
