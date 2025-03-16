# CLAUDE.md - Agent Instructions

## Build & Test Commands
- **Install dependencies**: `npm install`
- **Run local server**: `npm start`
- **Build site**: `npm run build`
- **Clean build**: `npm run clean`

## Site Structure
- Static 11ty site hosted on GitHub Pages via GitHub Actions
- Main branch: `main`
- Content is written in Markdown, HTML, and Nunjucks templates (.njk)
- Uses Nunjucks layouts in `src/_includes` directory
- CSS in `src/css/style.css` with skiidata theme (dark gray/orange)

## Code Style Guidelines
- **HTML/CSS**: Follow consistent indentation (2 spaces)
- **CSS**: Use custom properties/variables defined in `:root`
- **Colors**: Dark gray background (#1a1a1a), pale white text (#f0f0f0), orange accents (#ff6a00)
- **Nunjucks**: Use standard Nunjucks template syntax and includes
- **Assets**: Store images in `src/assets` folder
- **JavaScript**: Follow ES6+ standards for any JS components

## Deployment
- Automatic deployment via GitHub Actions workflow
- Push to `main` branch to trigger deployment
- CNAME file maintains custom domain
- Uses GitHub Pages with custom domain diminishing.org