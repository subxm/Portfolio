# Portfolio

Personal portfolio showcasing my projects and technical skills.

## Features

- Fully static site (no backend, no database)
- Smooth scroll animations with Framer Motion
- Responsive design
- Working contact form via Web3Forms
- Custom cursor effects

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Adding Projects

Edit the `PROJECTS` array in `src/App.tsx`:

```typescript
const PROJECTS = [
  {
    id: 1,
    title: "Project Name",
    description: "Brief description",
    tech_stack: ["React", "Node.js"],
    url: "https://www.subxm.me/",
    github_url: "https://github.com/subxm/Portfolio",
  },
];
```

## Contact Form Setup

The contact form uses [Web3Forms](https://web3forms.com/). To set it up:

1. Get your free access key from Web3Forms
2. Replace the key in `src/App.tsx` (line 423)

## License

MIT
