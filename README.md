# Astro Forge Holdings

A modern, responsive corporate website built with React, TypeScript, and Tailwind CSS. Features a comprehensive admin dashboard, blog system, careers portal, and contact management.

## 🚀 Live Demo

- **Frontend**: [Your deployed URL here]
- **Admin Dashboard**: [Your deployed URL here]/admin
- **Demo Credentials**: admin@astroforge.com / AstroForge2024!

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Custom admin system
- **Deployment**: Netlify, GoDaddy, Hostinger

## 📋 Features

### Public Pages
- ✅ Responsive homepage with hero section
- ✅ About us with company information
- ✅ Services showcase with detailed pages
- ✅ Projects portfolio with filtering
- ✅ Blog system with categories
- ✅ Careers portal with job applications
- ✅ Contact form with message management
- ✅ FAQ section
- ✅ Privacy Policy & Terms of Service

### Admin Dashboard
- ✅ Content management (Blog, Projects, Services)
- ✅ Team member management
- ✅ User management system
- ✅ Contact message handling
- ✅ Site settings configuration
- ✅ Analytics dashboard
- ✅ Theme customization
- ✅ Career portal management

## 🚀 Deployment Options

### Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### GoDaddy
1. Build the project: `npm run build:prod`
2. Upload the `dist` folder to your GoDaddy hosting
3. Configure domain settings in GoDaddy control panel

### Hostinger
1. Build the project: `npm run build:prod`
2. Upload the `dist` folder via File Manager
3. Set up domain and SSL in Hostinger control panel

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- MySQL database
- Git

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd astro-forge-front

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start backend server
npm start
```

### Database Setup
1. Create MySQL database: `astro_forge_db`
2. Import schema: `docs/astro_forge_db.sql`
3. Update database credentials in server configuration

## 📁 Project Structure

```
astro-forge-front/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── admin/              # Admin dashboard
│   ├── integrations/       # API and database
│   └── hooks/              # Custom React hooks
├── server/                 # Backend API
├── public/                 # Static assets
├── docs/                   # Database schema
└── dist/                   # Production build
```

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_TITLE=Astro Forge Holdings
NODE_ENV=development
```

### Production Deployment
Update environment variables for production:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
NODE_ENV=production
```

## 📊 Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔒 Security Features

- ✅ Admin authentication system
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection headers
- ✅ Secure file uploads

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop enhancement
- ✅ Touch-friendly interfaces
- ✅ Cross-browser compatibility

## 🚀 Performance

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Gzip compression
- ✅ CDN-ready assets
- ✅ SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

For support and questions:
- Email: support@astroforge.com
- Documentation: [Your docs URL]
- Issues: [GitHub Issues]

---

**Built with ❤️ by Astro Forge Holdings Team**
