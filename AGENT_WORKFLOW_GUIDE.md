# Guide de Workflow pour Agent - Projet Jover Portfolio

## 🎯 **OBJECTIF**
Ce guide permet à l'agent de travailler efficacement sur le projet Jover en utilisant toutes les ressources disponibles et en maintenant une documentation professionnelle.

---

## 📋 **ÉTAPE 1 : ANALYSE INITIALE OBLIGATOIRE**

### **Avant toute tâche, TOUJOURS :**

1. **📖 Lire les ressources projet (dans l'ordre) :**
   ```bash
   # Ordre de lecture obligatoire :
   1. CLAUDE.md              # Contexte projet et historique
   2. PROJECT_DOCUMENTATION.md # Documentation technique complète
   3. IMPROVEMENT_NOTES.md    # État des améliorations et priorités
   4. PHOTOGRAPHY_DESIGN_SUGGESTIONS.md # Guidelines design (si applicable)
   ```

2. **🔍 Comprendre l'état actuel :**
   - Architecture technique (React 19, TypeScript, GSAP, Lenis)
   - Système de couleurs (`--color-text-dark` / `--color-text-light`)
   - Structure des composants (Hero, Presentation, Experience, Portfolio, Contact)
   - État des améliorations (✅ terminé, 🔄 en cours, ❌ à faire)

3. **📊 Vérifier le contexte git :**
   ```bash
   git status        # État des modifications
   git log --oneline -5  # Derniers commits
   ```

4. Vérifier qu'une modifications que nous voulons apporter ne vas pas juste rentrer en conflit avec un systême déjà
---

## 📝 **ÉTAPE 2 : PLANIFICATION AVEC TODOWRITE**

### **Toujours utiliser TodoWrite pour :**

1. **Décomposer la tâche :**
   ```javascript
   // Template de base
   [
     {"id": "task-analysis", "content": "Analyze task requirements", "status": "in_progress", "priority": "high"},
     {"id": "task-planning", "content": "Plan implementation steps", "status": "pending", "priority": "high"},
     {"id": "task-execution", "content": "Execute main task", "status": "pending", "priority": "medium"},
     {"id": "task-documentation", "content": "Update documentation", "status": "pending", "priority": "medium"},
     {"id": "task-testing", "content": "Test and verify results", "status": "pending", "priority": "low"}
   ]
   ```

2. **Mettre à jour en temps réel :**
   - Marquer "completed" IMMÉDIATEMENT après chaque étape
   - Ne jamais avoir plus d'une tâche "in_progress"
   - Ajouter des sous-tâches si nécessaire

---

## 🛠️ **ÉTAPE 3 : EXÉCUTION PROFESSIONNELLE**

### **Standards de qualité obligatoires :**

#### **A. Code Quality**
- ✅ **TypeScript First** : Préférer .tsx/.ts aux .js/.jsx
- ✅ **Système de couleurs unifié** : Utiliser `--color-text-dark` / `--color-text-light`
- ✅ **Thème adaptatif** : Toujours inclure règles `body.dark-theme`
- ✅ **Variables CSS** : Utiliser variables du système unifié
- ✅ **Cleanup approprié** : GSAP animations, event listeners

#### **B. Architecture Consistency**
- ✅ **Hooks personnalisés** : useScroll, useMouse, useTheme, useClickAnimation
- ✅ **Context API** : AppContext pour état global
- ✅ **Structure modulaire** : Composants séparés avec styles dédiés
- ✅ **Performance** : Mémoisation, cleanup, optimisations

#### **C. Design System**
- ✅ **Monochrome first** : Base en niveaux de gris
- ✅ **Vert stratégique** : `--color-accent-primary` uniquement pour sélections
- ✅ **Typographie cohérente** : H1 > H2 > H3 > P hiérarchie
- ✅ **Espacements harmonisés** : Variables `--spacing-*`

---

## 📚 **ÉTAPE 4 : DOCUMENTATION SYSTÉMATIQUE**

### **Toujours documenter dans l'ordre :**

#### **1. IMPROVEMENT_NOTES.md** (Obligatoire)
```markdown
# Mise à jour des statuts d'amélioration
- Changer ❌ → 🔄 → ✅ selon l'avancement
- Ajouter détails techniques de la solution
- Documenter l'impact et les métriques
```

#### **2. PROJECT_DOCUMENTATION.md** (Si changements architecturaux)
```markdown
# Mettre à jour si :
- Nouveaux composants créés
- Modification du système de couleurs
- Changements dans la structure CSS
- Nouveaux hooks ou patterns
```

#### **3. CLAUDE.md** (Si nouvelles fonctionnalités majeures)
```markdown
# Mettre à jour si :
- Nouvelles fonctionnalités importantes
- Changements majeurs d'architecture
- Résolution de problèmes critiques
```

---

## 🔧 **ÉTAPE 5 : PATTERNS TECHNIQUES ÉPROUVÉS**

### **A. Système de Couleurs (CRUCIAL)**
```css
/* TOUJOURS utiliser ce pattern */
.element {
  color: var(--color-text-dark);  /* Thème clair */
  transition: color var(--duration-slowest) var(--easing-ease);
}

body.dark-theme .element {
  color: var(--color-text-light);  /* Thème sombre */
}
```

### **B. Composants React (Pattern)**
```typescript
// Structure standard pour nouveaux composants
const ComponentName: React.FC<CommonSectionProps> = ({ id, scrollManagerRef }) => {
  // 1. Refs et état
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState(initialValue);
  
  // 2. Hooks personnalisés
  const { contextValue } = useAppContext();
  
  // 3. Effets avec cleanup
  useEffect(() => {
    // Logic
    return () => {
      // Cleanup obligatoire
    };
  }, [dependencies]);
  
  // 4. Render avec classes cohérentes
  return (
    <section id={id} className="component-section" ref={ref}>
      {/* Contenu */}
    </section>
  );
};
```

### **C. Animations GSAP (Cleanup obligatoire)**
```javascript
useEffect(() => {
  const animations = [];
  const scrollTriggers = [];
  
  // Créer animations
  const tl = gsap.timeline();
  animations.push(tl);
  
  const st = ScrollTrigger.create({});
  scrollTriggers.push(st);
  
  // Cleanup OBLIGATOIRE
  return () => {
    animations.forEach(anim => anim.kill());
    scrollTriggers.forEach(trigger => trigger.kill());
  };
}, []);
```

---

## 🎯 **ÉTAPE 6 : PATTERNS DE DEBUGGING**

### **Problèmes fréquents et solutions :**

#### **A. Thème adaptatif ne fonctionne pas**
```bash
# Checklist de debugging :
1. Vérifier variables définies dans variables.css
2. Vérifier règles body.dark-theme présentes
3. Vérifier sélecteurs CSS (.App.dark-theme vs body.dark-theme)
4. Vérifier imports CSS dans index.css
5. ⚠️ CRITIQUE : Vérifier logique calculateTheme dans useScroll.ts
6. Vérifier que section active correspond au thème attendu
```

#### **A.1. Problème spécifique : Texte blanc sur fond blanc**
```bash
# Root cause fréquente : Logique thème défaillante
1. Inspecter calculateTheme() dans useScroll.ts
2. Vérifier si darkSections array inclut section problématique
3. Tester activeSection detection en console
4. S'assurer que Contact/Accueil ne sont PAS dans darkSections
5. Vérifier backgroundStates dans GlobalBackground correspond
```

#### **A.2. Pattern correct détection thème**
```typescript
// ✅ UTILISER ce pattern dans useScroll.ts
const darkSections = ['presentation', 'experience', 'portfolio'];
const isCurrentSectionDark = darkSections.includes(currentActiveSection);
return isCurrentSectionDark; // Contact = false = light theme

// ❌ ÉVITER position absolue défaillante
// return scrollTop > someSection.offsetTop; // Garde thème permanent
```

#### **B. Images ne s'affichent pas**
```bash
# Checklist :
1. Vérifier imports des images dans composants
2. Vérifier classes CSS existent et sont appliquées
3. Vérifier background-image syntax correcte
4. Préférer background-image à <img> pour photos
```

#### **C. Animations ne fonctionnent pas**
```bash
# Checklist :
1. Vérifier imports GSAP et plugins
2. Vérifier cleanup dans useEffect
3. Vérifier références DOM valides
4. Tester sans ScrollTrigger d'abord
```

---

## 📊 **ÉTAPE 7 : CRITÈRES DE QUALITÉ**

### **Avant de considérer une tâche terminée :**

#### **✅ Checklist Technique**
- [ ] Code fonctionne sans erreurs console
- [ ] Thème adaptatif fonctionne (light + dark)
- [ ] Responsive design testé
- [ ] Performance optimisée (pas de memory leaks)
- [ ] TypeScript sans erreurs
- [ ] Styles cohérents avec le design system

#### **✅ Checklist Documentation**
- [ ] IMPROVEMENT_NOTES.md mis à jour
- [ ] TodoWrite tasks marquées completed
- [ ] Changements architecturaux documentés
- [ ] Code commenté si nécessaire

#### **✅ Checklist Professionnel**
- [ ] Résultat visuellement cohérent
- [ ] UX fluide et intuitive
- [ ] Accessibilité de base respectée
- [ ] Code maintenable et évolutif

---

## 🚀 **ÉTAPE 8 : COMMUNICATION EFFICACE**

### **Format de réponse optimisé :**

```markdown
## ✅ **TÂCHE ACCOMPLIE**

### 🎯 **Résumé**
[Description concise de ce qui a été fait]

### 🔧 **Modifications apportées**
- ✅ [Changement 1 avec détail technique]
- ✅ [Changement 2 avec détail technique]
- ✅ [Changement 3 avec détail technique]

### 📊 **Impact**
- **Performance** : [Amélioration mesurable]
- **UX** : [Amélioration utilisateur]
- **Code** : [Amélioration technique]

### 📝 **Documentation mise à jour**
- ✅ IMPROVEMENT_NOTES.md
- ✅ PROJECT_DOCUMENTATION.md (si applicable)
```

---

## 🎨 **ANNEXES : RESSOURCES RAPIDES**

### **A. Variables CSS Essentielles**
```css
/* Couleurs */
--color-text-dark: var(--color-gray-800);
--color-text-light: var(--color-white);
--color-accent-primary: #1EB900;

/* Typographie */
--h2-font-size: clamp(2rem, 4vw, 3.5rem);
--h3-font-size: clamp(1.25rem, 2.5vw, 1.875rem);

/* Animations */
--duration-slowest: 1.2s;
--easing-ease: cubic-bezier(0.23, 1, 0.32, 1);
```

### **B. Structure Fichiers CSS**
```
src/styles/
├── variables.css      # Variables centralisées
├── base.css          # Reset et éléments de base
├── hero-presentation.css  # Hero + Presentation
├── experience-new.css     # Experience
├── portfolio.css          # Portfolio
├── contact.css           # Contact
├── header.css            # Header navigation
├── cursor.css            # Curseur personnalisé
└── global-background.css # Arrière-plans
```

### **C. Commandes Utiles**
```bash
# Développement
npm start              # Serveur dev
npm run build         # Build production
npm run typecheck     # Vérification TypeScript

# Git
git status            # État modifications
git diff              # Différences
git log --oneline -5  # Derniers commits

# Recherche
grep -r "pattern" src/  # Recherche dans code
find src/ -name "*.css" # Trouver fichiers CSS
```

---

## 🎯 **RÈGLES D'OR**

1. **📖 TOUJOURS lire les ressources .md avant de commencer**
2. **📋 TOUJOURS utiliser TodoWrite pour planifier**
3. **🎨 TOUJOURS respecter le design system monochrome**
4. **🌓 TOUJOURS inclure le thème adaptatif**
5. **📝 TOUJOURS documenter les changements**
6. **✅ TOUJOURS tester le résultat**
7. **🔄 TOUJOURS marquer les todos comme completed**
8. **TOUJOURS ajouter une impovement notes dans le cas de détection d'une issue lorsque cela nécessite la modification d'une fonctionnalitée**

---

**Ce guide garantit un workflow professionnel et des résultats de qualité constante.** 🎉