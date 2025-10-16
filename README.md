# Mini Logista

Aplicación móvil para formularios con generación de PDF formateado.

## 🚀 Características

- ✅ Formulario multi-sección con navegación
- ✅ Generación de PDF formateado
- ✅ Diseño responsive optimizado para móvil
- ✅ Configurado con TypeScript
- ✅ Despliegue automático en GitHub Pages

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## 🌐 Deploy a GitHub Pages

1. Actualiza el campo `homepage` en `package.json` con tu usuario de GitHub:
   ```json
   "homepage": "https://[tu-usuario].github.io/mini_logista"
   ```

2. Actualiza el `base` en `vite.config.ts` si usas un nombre diferente para el repositorio.

3. Crea un repositorio en GitHub llamado `mini_logista`

4. Sube el código al repositorio:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[tu-usuario]/mini_logista.git
   git push -u origin main
   ```

5. Despliega en GitHub Pages:
   ```bash
   npm run deploy
   ```

6. Ve a la configuración del repositorio en GitHub > Pages > y asegúrate de que la rama `gh-pages` esté seleccionada.

## 📱 Estructura del Proyecto

```
mini_logista/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── FormSection.tsx
│   │   └── PDFGenerator.tsx
│   ├── pages/           # Páginas de la aplicación
│   │   └── FormPage.tsx
│   ├── types/           # Definiciones de TypeScript
│   │   └── FormTypes.ts
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Tecnologías

- React 18
- TypeScript
- Vite
- React Router
- jsPDF
- GitHub Pages

## 📝 Licencia

MIT
