# Qualify Landing Page
![https://astro.build/](https://img.shields.io/badge/astro-5.15.0-orange?style=flat&logo=astro&logoColor=orange&link=https%3A%2F%2Fastro.build%2F)
![https://www.typescriptlang.org/](https://img.shields.io/badge/typescript-5.6.3-blue?style=flat&logo=typescript&link=https%3A%2F%2Fwww.typescriptlang.org%2F)
![https://tailwindcss.com/](https://img.shields.io/badge/tailwind-3.4.1-cyan?style=flat&logo=tailwindcss&link=https%3A%2F%2Ftailwindcss.com%2F)


## 🎨 Theme Customization

The starter comes with a default theme that you can customize to fit your needs.
There's 3 files involved in the theme customization:

```bash
/
├── src/
│   └── styles/
│       └── theme.css    # The main theme file, where you can define your colors.
│   └── config/
│       └── theme.json    # A JSON file used for theme domain names and font settings. Define your theme color names and font settings here.
├── tailwind.config.js   # The tailwind configuration file, you know what it is, the other two files are used here.
```
 


## 🧞 Commands (by Astro)

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
