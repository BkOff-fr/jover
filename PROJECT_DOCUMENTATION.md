# Jover Photography Portfolio - Documentation Technique Complète

## 📋 Table des Matières
1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Composants détaillés](#composants-détaillés)
4. [Système de gestion d'état](#système-de-gestion-détat)
5. [Système de design CSS](#système-de-design-css)
6. [Système d'animations](#système-danimations)
7. [Assets et ressources](#assets-et-ressources)
8. [Configuration et build](#configuration-et-build)
9. [Workflows de développement](#workflows-de-développement)

---

## 🎯 Vue d'ensemble du projet

### Description
Portfolio professionnel de photographie construit avec React, mettant en avant des animations sophistiquées, un système de thème dynamique et une expérience utilisateur premium.

### Technologies principales
- **React 19.1.0** - Framework principal
- **TypeScript** - Migration partielle en cours
- **GSAP 3.13.0** - Animations avancées
- **Lenis 1.3.5** - Smooth scrolling
- **Three.js + React Three Fiber** - Éléments 3D
- **Framer Motion** - Animations supplémentaires
- **Create React App** - Build system

### Métriques du projet
- **Taille du bundle** : ~117KB (gzippé)
- **Composants** : 10 composants principaux
- **Hooks personnalisés** : 4 hooks
- **Fichiers CSS** : 10 fichiers modulaires
- **Images** : 21 images haute qualité

---

## 🏗️ Architecture technique

### Structure des répertoires
```
src/
├── components/           # Composants React
│   ├── ContactSection.js
│   ├── CustomCursor.js
│   ├── ExperienceSection.js
│   ├── GlobalBackground.js
│   ├── Header.js
│   ├── HeroSection.js
│   ├── ImagesGallery.js
│   ├── ParallaxGallery.tsx
│   ├── PortfolioSection.js
│   └── PresentationSection.js
├── context/
│   └── AppContext.tsx    # Contexte global
├── hooks/
│   ├── index.ts
│   ├── useClickAnimation.ts
│   ├── useMouse.ts
│   ├── useScroll.ts
│   └── useTheme.ts
├── styles/               # CSS modulaire
│   ├── variables.css     # Design tokens
│   ├── base.css
│   ├── [component].css
│   └── index.css
├── assets/               # Ressources
├── types/                # Types TypeScript
├── utils/                # Utilitaires
└── constants/            # Constantes
```

### Flux de données
```
App.js → AppProvider → AppContext
↓
Hooks personnalisés (useScroll, useMouse, useTheme, useClickAnimation)
↓
Composants consommateurs
↓
Mise à jour des styles CSS et animations
```

---

## 🧩 Composants détaillés

### 1. **App.js** - Composant racine
**Rôle** : Orchestration de l'application
```javascript
// Architecture à deux niveaux
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
```

**Fonctionnalités** :
- Gestion du thème global via `isDarkTheme`
- Composition des sections principales
- Intégration des composants overlay (cursor, background)

### 2. **CustomCursor.js** - Curseur personnalisé
**Rôle** : Curseur style appareil photo Sony
```javascript
const [isFlashing, setIsFlashing] = useState(false);
const crosshairRef = useRef(null);
const rectangleRef = useRef(null);
```

**Fonctionnalités** :
- **Dual-cursor system** : Réticule (12px) + Rectangle (50x30px)
- **Mouvement différentiel** : Réticule précis, rectangle avec retard
- **Détection hover** : Reconnaissance automatique des éléments interactifs
- **Animation flash** : Feedback visuel sur clic (150ms)
- **Smooth movement** : `requestAnimationFrame` avec interpolation

### 3. **GlobalBackground.js** - Système de fond dynamique
**Rôle** : Gestion centralisée des arrière-plans
```javascript
const backgroundStates = useMemo(() => ({
  accueil: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    effects: { /* ... */ }
  },
  // États pour chaque section
}), []);
```

**Fonctionnalités** :
- **États par section** : Différents arrière-plans selon la section active
- **Parallaxe souris** : Effets dynamiques basés sur la position de la souris
- **Transitions GSAP** : Animations fluides entre les états (1.2s)
- **Synchronisation thème** : Mise à jour automatique des classes CSS

### 4. **Header.js** - Navigation et progression
**Rôle** : Header fixe avec navigation et barre de progression
```javascript
const { scrollProgress, activeSection, scrollToSection } = useAppScroll();
const { handleClick } = useAppClickAnimation();
```

**Fonctionnalités** :
- **Barre de progression** : Indicateur visuel du scroll
- **Navigation active** : Highlighting dynamique des sections
- **Scroll smooth** : Navigation fluide via `scrollToSection`
- **Animations clic** : Feedback visuel sur interaction

### 5. **HeroSection.js** - Section d'accueil
**Rôle** : Section landing avec animations d'entrée
```javascript
const [isLoading, setIsLoading] = useState(true);
const scrollIndicatorRef = useRef(null);
```

**Fonctionnalités** :
- **Animation de chargement** : Loader de 3 secondes
- **Indicateur scroll** : Disparaît après 50px de scroll
- **Logo principal** : Animation d'entrée sophistiquée
- **Accessibilité** : Titre caché pour lecteurs d'écran

### 6. **PresentationSection.js** - Section complexe
**Rôle** : Section la plus sophistiquée avec animations avancées
```javascript
const mainImageRef = useRef(null);
const additionalImagesRef = useRef([]);
const textContentRef = useRef(null);
const scrollVelocity = useRef(0);
```

**Fonctionnalités** :
- **Parallaxe multi-couches** : Vitesses différentielles pour les images
- **Animation lettre par lettre** : Révélation progressive du texte
- **Calcul de vélocité** : Momentum après arrêt du scroll
- **Easing polynomial** : Fonctions d'easing personnalisées
- **Scroll timeout** : Continuation d'animation après arrêt

### 7. **ExperienceSection.js** - Storytelling immersif
**Rôle** : Section narrative avec effets visuels
```javascript
const storySteps = [
  {
    id: 1,
    title: "LE PREMIER REGARD",
    effect: "glitch",
    position: "left"
  },
  // ... autres étapes
];
```

**Fonctionnalités** :
- **Storytelling par étapes** : 4 étapes avec animations spécifiques
- **Effets visuels dynamiques** : Glitch, distortion, chromatic
- **ScrollTrigger GSAP** : Animations déclenchées par scroll
- **Parallaxe souris** : Image héro responsive à la souris

### 8. **PortfolioSection.js** - Galerie interactive
**Rôle** : Showcase portfolio avec système de filtres
```javascript
const [selectedProject, setSelectedProject] = useState(null);
const [activeFilter, setActiveFilter] = useState('all');
```

**Fonctionnalités** :
- **Système de filtres** : Filtrage par catégorie avec animations
- **Modal avancé** : Présentation détaillée des projets
- **Hover effects** : Animations sur survol
- **Données projet** : Structure complète avec métadonnées

### 9. **ContactSection.js** - Formulaire de contact
**Rôle** : Formulaire professionnel avec validation
```javascript
const [formData, setFormData] = useState({
  name: '', email: '', phone: '', projectType: '', message: '', budget: ''
});
```

**Fonctionnalités** :
- **Validation complète** : Champs requis et validation email
- **États de soumission** : Loading, succès, erreur
- **Contact info** : Informations complètes avec icônes
- **Liens sociaux** : Intégration réseaux sociaux

### 10. **ParallaxGallery.tsx** - Galerie TypeScript
**Rôle** : Composant galerie avec types TypeScript
```typescript
interface ParallaxGalleryProps {
  transitionImageRef: React.RefObject<HTMLDivElement | null>;
}
```

**Fonctionnalités** :
- **Types complets** : Interfaces TypeScript robustes
- **Animations parallaxe** : Effets de défilement
- **Révélation de texte** : Animation mot par mot

---

## 🧠 Système de gestion d'état

### AppContext.tsx - Contexte global
```typescript
interface AppContextType {
  // Scroll state
  scrollProgress: number;
  activeSection: string;
  isDarkTheme: boolean;
  scrollToSection: (sectionId: string) => void;
  
  // Mouse state
  mousePosition: MousePosition;
  screenPosition: MousePosition;
  
  // Theme state
  themeClass: string;
  
  // Click animations
  handleClick: (element: HTMLElement | null) => void;
}
```

### Hooks personnalisés

#### useScroll.ts
```typescript
export const useScroll = (): ScrollHookReturn => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const lenisRef = useRef<Lenis | null>(null);
  
  // Lenis avec easing personnalisé
  // Section detection automatique
  // Calcul de thème basé sur scroll
}
```

#### useMouse.ts
```typescript
export const useMouse = (): MouseHookReturn => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  
  // Tracking position en pourcentage
  // Mise à jour CSS custom properties
  // Conversion screen coordinates
}
```

#### useTheme.ts
```typescript
export const useTheme = (isDarkTheme: boolean): ThemeHookReturn => {
  // Gestion classe body
  // Cleanup automatique
  // Retour état et classe
}
```

#### useClickAnimation.ts
```typescript
export const useClickAnimation = (): ClickAnimationHookReturn => {
  // Animations configurables
  // Cleanup automatique
  // Intégration navigation
}
```

---

## 🎨 Système de design CSS

### Variables CSS (Design Tokens) - Version Finale
```css
:root {
  /* Palette Monochrome Professionnelle */
  --color-black: #000000;
  --color-gray-900: #111111;
  --color-gray-800: #1a1a1a;
  --color-gray-700: #2a2a2a;
  --color-gray-600: #404040;
  --color-gray-500: #666666;
  --color-gray-400: #999999;
  --color-gray-300: #cccccc;
  --color-gray-200: #e6e6e6;
  --color-gray-100: #f5f5f5;
  --color-gray-50: #fafafa;
  --color-white: #ffffff;
  
  /* Accent Vert (Usage Stratégique) */
  --color-accent-primary: #1EB900;
  --color-accent-light: #4CAF50;
  --color-accent-dark: #0F5D00;
  
  /* Système de Couleurs Fonctionnel */
  --color-text-dark: var(--color-gray-800);   /* Texte thème clair */
  --color-text-light: var(--color-white);     /* Texte thème sombre */
  
  /* Espacement Harmonisé (base 4px) */
  --spacing-xs: 4px;
  --spacing-xxxl: 64px;
  
  /* Typographie Professionnelle */
  --font-family: 'Pathway Extreme', sans-serif;
  --h2-font-size: clamp(2rem, 4vw, 3.5rem);
  --h3-font-size: clamp(1.25rem, 2.5vw, 1.875rem);
  --font-weight-normal: 500;
  --font-weight-black: 900;
  
  /* Animations */
  --duration-fast: 0.15s;
  --duration-slowest: 1.2s;
  --easing-ease: cubic-bezier(0.23, 1, 0.32, 1);
}

/* Thème Sombre Adaptatif */
body.dark-theme {
  --color-text-dark: var(--color-white);
  --color-text-light: var(--color-white);
}
```

### Architecture CSS modulaire
```css
/* index.css - Point d'entrée */
@import './variables.css';      /* 1. Design tokens */
@import './base.css';           /* 2. Reset et base */
@import './global-background.css'; /* 3. Composants globaux */
@import './header.css';         /* 4. Composants layout */
@import './hero-presentation.css'; /* 5. Composants sections */
```

### Système de thème adaptatif unifié
```css
/* Principe : Variables qui s'adaptent automatiquement */

/* Thème clair (défaut) */
h2, h3, p {
  color: var(--color-text-dark);  /* = #1a1a1a */
  transition: color var(--duration-slowest) var(--easing-ease);
}

/* Thème sombre automatique */
body.dark-theme h2,
body.dark-theme h3,
body.dark-theme p {
  color: var(--color-text-light);  /* = #ffffff */
}

/* Les variables s'adaptent automatiquement dans body.dark-theme */
body.dark-theme {
  --color-text-dark: var(--color-white);
  --color-text-light: var(--color-white);
}
```

### Principes du design final
1. **Monochrome first** : Base en niveaux de gris pour elegance professionnelle
2. **Vert stratégique** : `--color-accent-primary` uniquement pour sélections/interactions
3. **Variables adaptatives** : `--color-text-dark` et `--color-text-light` changent automatiquement
4. **Thème unifié** : `body.dark-theme` appliqué systématiquement partout

---

## 🎭 Système d'animations

### GSAP Integration
```javascript
// ScrollTrigger pour animations déclenchées par scroll
gsap.registerPlugin(ScrollTrigger);

// Animations avec easing personnalisé
gsap.to(element, {
  duration: 1.2,
  ease: "cubic-bezier(0.02, 0.4, 0.05, 1)",
  transform: 'translateY(0)',
  opacity: 1
});
```

### Lenis Smooth Scroll
```javascript
lenisRef.current = new Lenis({
  duration: 1.2,
  easing: (t) => {
    // Implémentation cubic-bezier personnalisée
    return sampleCurveY(solveCurveX(t));
  },
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2
});
```

### Animations CSS
```css
/* Keyframes pour effets spéciaux */
@keyframes backgroundGrain {
  0% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(-100px) translateY(-100px); }
}

/* Micro-interactions */
.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 185, 0, 0.2);
  transition: all var(--duration-normal) var(--easing-ease);
}
```

---

## 📁 Assets et ressources

### Structure des assets
```
src/assets/
├── parallaxe/           # Images de photographie
│   ├── 1.jpg           # Image principale
│   ├── 2.jpg - 4.jpg   # Images additionnelles
│   ├── 5.jpg - 10.jpg  # Images galerie
│   └── 11.png - 16.png # Images portfolio
├── portfolio/           # Répertoire préparé pour portfolio
└── logo.svg            # Logo principal
```

### Optimisation images
- **Format** : JPG pour photos, PNG pour transparence
- **Tailles** : Images haute résolution pour qualité
- **Chargement** : Lazy loading avec IntersectionObserver
- **Responsive** : Adaptation automatique aux écrans

---

## ⚙️ Configuration et build

### Package.json - Dépendances principales
```json
{
  "dependencies": {
    "react": "^19.1.0",
    "gsap": "^3.13.0",
    "lenis": "^1.3.5",
    "three": "^0.178.0",
    "framer-motion": "^12.23.6"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "@types/react": "^19.1.8"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

### Build Output
- **Bundle principal** : ~117KB (gzippé)
- **Assets** : Images optimisées
- **CSS** : ~8.5KB (gzippé)
- **Chunks** : Code splitting automatique

---

## 🛠️ Workflows de développement

### Scripts disponibles
```bash
npm start          # Serveur de développement
npm run build      # Build de production
npm test           # Tests unitaires
```

### Bonnes pratiques
1. **Commits sémantiques** : Convention de commits claire
2. **Code quality** : ESLint et Prettier configurés
3. **Performance** : Monitoring bundle size
4. **Accessibility** : Tests d'accessibilité
5. **Type safety** : Migration progressive vers TypeScript

### Debugging
- **React DevTools** : Inspection des composants
- **Performance tab** : Analyse des animations
- **Network tab** : Optimisation des ressources
- **Console** : Logging des interactions

---

## 🔍 Points d'attention

### Performance
- **Animations** : Utilisation de `transform` et `opacity`
- **Scroll** : Throttling des event listeners
- **Images** : Lazy loading et optimisation
- **Bundle** : Code splitting et tree shaking

### Accessibility
- **Navigation clavier** : Skip links et focus
- **Lecteurs d'écran** : ARIA labels et sémantique
- **Contraste** : Vérification des couleurs
- **Responsive** : Adaptation mobile

### SEO
- **Meta tags** : Title et description optimisés
- **Structured data** : Schema.org pour portfolio
- **Open Graph** : Partage sur réseaux sociaux
- **Sitemap** : Navigation pour crawlers

---

## 📚 Documentation développeur

### Structure des composants
```javascript
// Pattern standard pour composants
const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks et état
  const [state, setState] = useState(initialValue);
  const ref = useRef(null);
  
  // 2. Effets et lifecycle
  useEffect(() => {
    // Logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  // 3. Handlers
  const handleEvent = useCallback(() => {
    // Logic
  }, [dependencies]);
  
  // 4. Render
  return (
    <section className="component-name">
      {/* Content */}
    </section>
  );
};
```

### Conventions de nommage
- **Composants** : PascalCase
- **Hooks** : camelCase avec préfixe 'use'
- **CSS classes** : kebab-case
- **Variables** : camelCase
- **Constantes** : UPPER_SNAKE_CASE

### Patterns critiques pour la détection de thème

#### **✅ Pattern correct - Détection par section active**
```typescript
const calculateTheme = useCallback((scrollTop: number, windowHeight: number): boolean => {
  const scrollPosition = scrollTop + windowHeight * SECTIONS_CONFIG.thresholds.detection;
  
  // Définir explicitement les sections qui utilisent le thème sombre
  const darkSections = ['presentation', 'experience', 'portfolio'];
  
  // Déterminer la section active (parcours inverse pour la plus basse)
  for (let i = SECTIONS_CONFIG.ids.length - 1; i >= 0; i--) {
    const sectionId = SECTIONS_CONFIG.ids[i];
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element && scrollPosition >= element.offsetTop) {
        return darkSections.includes(sectionId);
      }
    }
  }
  
  // Par défaut, thème clair pour 'accueil' et 'contact'
  return false;
}, []);
```

#### **❌ Pattern défaillant - À éviter absolument**
```typescript
// ❌ PROBLÈME : Thème sombre permanent après presentation
const calculateTheme = useCallback((scrollTop: number, windowHeight: number): boolean => {
  const presentationSection = document.getElementById('presentation');
  return presentationSection !== null && 
         scrollTop > presentationSection.offsetTop - windowHeight * SECTIONS_CONFIG.thresholds.theme;
}, []);
```

#### **Problèmes résolus par le pattern correct**
- ✅ **Contact section** : Correctement détectée comme light theme
- ✅ **Transitions fluides** : Entre dark (portfolio) et light (contact)  
- ✅ **Visibilité texte** : Plus de texte blanc sur fond blanc
- ✅ **Logique robuste** : Basée sur section active réelle, pas position absolue
- ✅ **Maintenabilité** : Ajout facile de nouvelles sections dark/light

#### **Configuration des sections par thème**
```typescript
// Dans constants.ts
export const SECTIONS_CONFIG = {
  ids: ['accueil', 'presentation', 'experience', 'portfolio', 'contact'],
  themes: {
    light: ['accueil', 'contact'],          // Fond clair, texte sombre
    dark: ['presentation', 'experience', 'portfolio']  // Fond sombre, texte clair
  }
};
```

---

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Optimisations
- **Minification** : CSS et JS minifiés
- **Compression** : Gzip activé
- **Cache** : Headers de cache optimisés
- **CDN** : Distribution des assets

### Monitoring
- **Performance** : Core Web Vitals
- **Erreurs** : Error boundary et logging
- **Analytics** : Tracking des interactions
- **Uptime** : Monitoring de disponibilité

---

## 📈 Métriques et KPIs

### Performance
- **FCP** : First Contentful Paint < 1.5s
- **LCP** : Largest Contentful Paint < 2.5s
- **CLS** : Cumulative Layout Shift < 0.1
- **FID** : First Input Delay < 100ms

### Qualité code
- **Test coverage** : Objectif 80%+
- **TypeScript** : Migration progressive
- **ESLint** : Zéro erreur
- **Bundle size** : Monitoring continu

### Accessibilité
- **WCAG 2.1** : Conformité niveau AA
- **Keyboard navigation** : 100% accessible
- **Screen readers** : Support complet
- **Color contrast** : Ratio 4.5:1 minimum

---

*Cette documentation est un document vivant qui évolue avec le projet. Dernière mise à jour : Janvier 2025*