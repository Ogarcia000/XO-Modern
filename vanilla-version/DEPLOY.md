# 🚀 Guía de Deployment - XO Modern Vanilla

## 📦 Para Hostinger (Manual)

### Archivos Listos
Los archivos para subir están en: `vanilla-version/dist/`

```
dist/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── animations.css
│   └── styles.css
└── js/
    ├── state.js
    ├── utils.js
    ├── ai.js
    ├── game.js
    ├── ui.js
    └── app.js
```

### Pasos para Subir a Hostinger

1. **Accede a Hostinger**
   - Ve a tu panel de Hostinger
   - Entra al Administrador de Archivos

2. **Localiza la carpeta de tu sitio**
   - Busca `public_html/` o la carpeta de tu dominio

3. **Sube los archivos**
   - Opción A: Sube TODO el contenido de `dist/` directamente a `public_html/`
   - Opción B: Crea una subcarpeta `xo-modern/` y sube ahí

4. **Verifica**
   - Visita: `https://modernxo.ogptechcode.com/`
   - Debería cargar el juego

### Estructura en Hostinger

```
public_html/
├── index.html          ← Archivo principal
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── animations.css
│   └── styles.css
└── js/
    ├── state.js
    ├── utils.js
    ├── ai.js
    ├── game.js
    ├── ui.js
    └── app.js
```

---

## 🔧 Para GitHub

### 1. Hacer Commit de la Versión Vanilla

```bash
# Agregar todos los archivos vanilla
git add vanilla-version/

# Commit
git commit -m "feat: Add vanilla JS version with optimized performance"

# Push a GitHub
git push origin main
```

### 2. Actualizar README (Opcional)

Puedes mencionar que ahora tienes dos versiones:
- Versión Phaser (legacy)
- Versión Vanilla (recomendada)

---

## ✅ Checklist de Deployment

### GitHub
- [ ] Commit de vanilla-version
- [ ] Push a origin main
- [ ] Verificar en GitHub que se subió

### Hostinger
- [ ] Acceder a panel de Hostinger
- [ ] Subir archivos de `dist/`
- [ ] Probar en navegador desktop
- [ ] Probar en móvil
- [ ] Verificar que touch funciona
- [ ] Verificar nombres de jugadores

---

## 🔄 Para Futuras Actualizaciones

Cuando hagas cambios en `vanilla-version/`:

1. **Actualizar dist/**
   ```bash
   # Desde c:\Proyects\XO-Modern
   Copy-Item vanilla-version\index.html vanilla-version\dist\ -Force
   Copy-Item vanilla-version\css vanilla-version\dist\ -Recurse -Force
   Copy-Item vanilla-version\js vanilla-version\dist\ -Recurse -Force
   ```

2. **Subir a GitHub**
   ```bash
   git add .
   git commit -m "update: [descripción del cambio]"
   git push
   ```

3. **Subir a Hostinger**
   - Reemplaza los archivos modificados en Hostinger

---

## ⚡ Ventajas de la Versión Vanilla

- **~50 KB** vs 1.24 MB (Phaser)
- Touch/clicks 100% confiables
- Compatible con todo
- Sin dependencias
- Carga instantánea
- Fácil de mantener

---

## 🐛 Troubleshooting

**El juego no carga en Hostinger:**
- Verifica que `index.html` esté en la raíz correcta
- Revisa la consola del navegador (F12)
- Verifica que las rutas de CSS/JS sean relativas

**Los clicks no funcionan:**
- Limpia caché del navegador (Ctrl+Shift+R)
- Verifica que subiste todos los archivos JS

**Los estilos no se cargan:**
- Verifica que la carpeta `css/` esté completa
- Revisa las rutas en `index.html`

---

¡Listo para deployment! 🎉
