# CLAUDE.md - Agent Instructions

## Build & Test Commands
- **Install dependencies**: `npm install`
- **Run local server**: `npm start`
- **Build site**: `npm run build`
- **Clean build**: `npm run clean`

## Site Structure
- Minimalist static single-page site built with 11ty
- Hosted on GitHub Pages via GitHub Actions
- Main branch: `main`
- Content is written in Nunjucks templates (.njk)
- Minimal layout in `src/_includes/base.njk`

## Design Guidelines
- **Simplicity**: Single page design with minimal elements
- **Colors**: Dark gray background (#1a1a1a), pale white text (#f0f0f0), orange accents (#ff6a00)
- **Typography**: Clean font stack with good readability
- **Spacing**: Generous whitespace between sections
- **Social Icons**: FontAwesome for GitHub, LinkedIn, and Mastodon links

## Code Style Guidelines
- **HTML/CSS**: Follow consistent indentation (2 spaces)
- **CSS**: Use custom properties/variables defined in `:root`
- **Container**: Single column, centered content with max-width: 650px
- **Nunjucks**: Use standard Nunjucks template syntax
- **JavaScript**: Minimal JS, only for FontAwesome icons

## Deployment
- Automatic deployment via GitHub Actions workflow
- Push to `main` branch to trigger deployment
- CNAME file maintains custom domain diminishing.org