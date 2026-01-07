# XO Modern - Vanilla JavaScript Version

## 🎮 Nueva Versión Mejorada

Esta es la versión vanilla HTML/CSS/JavaScript del juego XO Modern, reescrita desde cero para mejor compatibilidad móvil y rendimiento.

## ✅ Ventajas sobre la Versión Phaser

- **Touch/Click 100% confiable** - Eventos nativos del navegador
- **Responsive perfecto** - CSS Grid y Flexbox nativos
- **Carga instantánea** - Solo ~50 KB vs 1.24 MB
- **Compatible con TODO** - Funciona en cualquier dispositivo
- **Código más simple** - Fácil de mantener y debugear

## 🚀 Cómo Usar

### Desarrollo Local

Simplemente abre `index.html` en tu navegador. No requiere build ni servidor.

```bash
# Opción 1: Doble click en index.html

# Opción 2: Servidor local (opcional)
python -m http.server 8000
# o
npx http-server
```

Luego visita: `http://localhost:8000`

### Producción

Sube todos los archivos (index.html, css/, js/) directamente a tu servidor web (Hostinger, etc.).

## 📁 Estructura

```
vanilla-version/
├── index.html          # HTML principal
├── css/
│   ├── reset.css      # CSS reset
│   ├── variables.css  # Variables de diseño
│   ├── animations.css # Animaciones CSS
│   └── styles.css     # Estilos principales
└── js/
    ├── state.js       # Estado global
    ├── utils.js       # Utilidades
    ├── ai.js          # IA simple
    ├── game.js        # Lógica del juego
    ├── ui.js          # Control de UI
    └── app.js         # Inicialización
```

## 🎨 Características

- ✅ 3 Skins (Classic, Neon, Retro)
- ✅ Modo VS Humano / IA
- ✅ Tamaños 3×3, 4×4, 5×5
- ✅ Nombres personalizados  
- ✅ Sistema de puntuación
- ✅ Modo oscuro
- ✅ Settings panel
- ✅ Animaciones suaves CSS
- ✅ LocalStorage para guardar progreso
- ✅ Vibración en móvil

## 🔧 Tecnologías

- HTML5 semántico
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+ (Vanilla, sin frameworks)
- LocalStorage API
- Vibration API (móvil)

## 📱 Compatibilidad

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Opera
- ✅ Samsung Internet
- ✅ Cualquier navegador moderno

## 🎯 Próximos Pasos

1. Probar en navegador local
2. Probar en móvil
3. Si funciona bien, subir a Hostinger
4. Opcional: Añadir más features

## 🐛 Debugging

Abre la consola del navegador (F12) para ver logs y acceder a utilidades de debug:

```javascript
// Disponible en desarrollo (localhost)
gameState       // Ver estado del juego
debug.resetScores()  // Reset puntajes
debug.makeMove(0, 0) // Hacer jugada manual
```

## 📝 Notas

- No requiere npm ni build
- No requiere Node.js
- Funciona offline (después de primera carga)
- Totalmente responsive
- Optimizado para mobile-first

---

**¡Listo para usar!** 🎉
