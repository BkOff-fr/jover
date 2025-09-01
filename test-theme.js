// Script de test pour vérifier le système de thème
console.log('=== TEST THÈME ADAPTATIF ===');

// Fonction pour vérifier l'état actuel du thème
function checkThemeStatus() {
    const body = document.body;
    const isDarkTheme = body.classList.contains('dark-theme');
    
    console.log('🎨 État du thème:');
    console.log('- Classes du body:', body.className);
    console.log('- Thème sombre actif:', isDarkTheme);
    
    // Vérifier les variables CSS
    const computedStyle = getComputedStyle(document.documentElement);
    console.log('📊 Variables CSS:');
    console.log('- --color-text-primary:', computedStyle.getPropertyValue('--color-text-primary').trim());
    console.log('- --color-text-light:', computedStyle.getPropertyValue('--color-text-light').trim());
    console.log('- --h2-color:', computedStyle.getPropertyValue('--h2-color').trim());
    
    // Vérifier les éléments de texte
    const title = document.querySelector('.presentation-title');
    const locationText = document.querySelector('.location-text');
    const textContent = document.querySelector('.text-content');
    
    if (title) {
        const titleColor = getComputedStyle(title).color;
        console.log('🎯 Couleur calculée du titre:', titleColor);
    }
    
    if (locationText) {
        const locationColor = getComputedStyle(locationText).color;
        console.log('🎯 Couleur calculée du lieu:', locationColor);
    }
    
    if (textContent) {
        const contentColor = getComputedStyle(textContent).color;
        console.log('🎯 Couleur calculée du contenu:', contentColor);
    }
    
    console.log('---');
}

// Test de changement de thème manuel
function testThemeToggle() {
    console.log('🔄 Test de changement de thème...');
    const body = document.body;
    
    console.log('AVANT:');
    checkThemeStatus();
    
    // Toggle le thème
    body.classList.toggle('dark-theme');
    
    setTimeout(() => {
        console.log('APRÈS:');
        checkThemeStatus();
    }, 100);
}

// Surveillance des changements de thème
let themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            console.log('🔔 Changement de thème détecté!');
            checkThemeStatus();
        }
    });
});

// Observer les changements sur le body
if (document.body) {
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Lancer le test initial
checkThemeStatus();

// Ajouter des fonctions globales pour les tests manuels
window.testTheme = testThemeToggle;
window.checkTheme = checkThemeStatus;

console.log('✅ Script de test chargé. Utilisez testTheme() pour tester le changement de thème.');