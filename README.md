# LEGIT-ID - Digital Identity Verification Platform

A secure, blockchain-powered digital identity verification platform built with React, TypeScript, and Supabase.

## 📋 Project Status

Check out [MVP_STATUS.md](MVP_STATUS.md) for a detailed breakdown of implemented and pending features.

## 🚀 Features

### Core Features
- **Digital Identity Creation**: Multi-step identity creation process with document upload
- **Blockchain Integration**: Secure identity verification using blockchain technology
- **Multi-Role Support**: Individual users, institutions, and administrative roles
- **Document Verification**: Upload and verify identity documents with AI-powered validation
- **Real-time Notifications**: Email and SMS notifications for verification status updates
- **Admin Dashboard**: Comprehensive admin panel for user and verification management

### Security Features
- **Two-Factor Authentication**: Enhanced security with 2FA support
- **Encrypted Document Storage**: Secure file upload and storage
- **Blockchain Verification**: Immutable identity verification records
- **Role-Based Access Control**: Granular permissions for different user types
- **Session Management**: Secure session handling with timeout controls

### Technical Features
- **Responsive Design**: Mobile-first, desktop-optimized interface
- **Progressive Web App**: Installable web application
- **Real-time Updates**: Live notifications and status updates
- **Multi-language Support**: Internationalization ready
- **Accessibility**: WCAG 2.1 compliant design

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Relational database
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates
- **File Storage** - Secure document storage

### Blockchain Integration
- **Ethereum/Polygon** - Blockchain networks
- **Smart Contracts** - Identity verification contracts
- **Web3 Integration** - Blockchain interaction
- **IPFS** - Decentralized file storage

### Development Tools
- **Vitest** - Fast unit testing framework
- **Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prettier** - Code formatting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Setup
1. Clone the repository:
```bash
git clone https://github.com/neimasilk/legit-id.git
cd legit-id
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Settings
VITE_APP_NAME=LEGIT-ID
VITE_APP_URL=http://localhost:5173

# Blockchain Configuration (Optional)
VITE_ETHEREUM_RPC_URL=your_ethereum_rpc_url
VITE_CONTRACT_ADDRESS=your_contract_address
```

### Database Setup
1. Create a Supabase project
2. Run database migrations
3. Configure authentication settings
4. Set up storage buckets
5. Configure RLS policies

## 🧪 Testing

### Unit Tests
```bash
npm run test
# or
pnpm test
```

### Integration Tests
```bash
npm run test:integration
# or
pnpm test:integration
```

### Test Coverage
```bash
npm run test:coverage
# or
pnpm test:coverage
```

## 📱 User Roles

### Individual Users
- Create digital identity
- Upload verification documents
- Request identity verification
- Manage personal profile
- View verification status

### Institutions
- Institution verification
- Bulk user verification
- API access for verification
- Custom branding options
- Advanced reporting

### Administrators
- User management
- Verification review
- System configuration
- Analytics and reporting
- Content management

## 🎨 UI Components

### Design System
- **Color Palette**: Blue primary, gray neutrals, semantic colors
- **Typography**: Inter font family with consistent hierarchy
- **Spacing**: 4px grid system for consistent layouts
- **Components**: Reusable React components with TypeScript

### Key Components
- **Navigation**: Responsive header with user menu
- **Forms**: Multi-step forms with validation
- **Cards**: Information display cards
- **Tables**: Data tables with sorting and filtering
- **Modals**: Confirmation and information modals
- **Alerts**: Success, error, and warning messages

## 🔒 Security

### Authentication
- JWT-based authentication
- Session management
- Password requirements
- Account lockout protection
- Suspicious activity detection

### Data Protection
- Encryption at rest and in transit
- Secure file upload handling
- Personal data anonymization
- GDPR compliance features
- Regular security audits

### Blockchain Security
- Smart contract security
- Private key management
- Transaction verification
- Immutable audit trails

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Deployment
- **Vercel (Current)**: This repository is configured with `vercel.json` for SPA rewrites. Pushes to the default branch on GitHub trigger automatic deployments on Vercel.
- **Preview Locally**: `npm run preview` serves the production build locally for validation before pushing.

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser and CDN caching strategies
- **Progressive Enhancement**: Works without JavaScript

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Real-time error reporting
- **User Analytics**: Usage pattern analysis
- **Uptime Monitoring**: Service availability tracking

## 🌐 Internationalization

### Supported Languages
- English (default)
- Indonesian
- Spanish
- French
- German

### Localization Features
- Date and time formatting
- Currency formatting
- Number formatting
- RTL support
- Cultural adaptations

## 📚 Documentation

### User Documentation
- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api.md)
- [FAQ](docs/faq.md)

### Developer Documentation
- [Architecture Overview](docs/architecture.md)
- [Component Library](docs/components.md)
- [Testing Guide](docs/testing.md)
- [Contributing Guide](CONTRIBUTING.md)

### Testing Reports
- [MVP Playwright Report](TEST_REPORT_MVP.md)
- [Admin Playwright Report](TEST_REPORT_ADMIN.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Document your code
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- 📖 [Documentation](https://docs.legit-id.com)
- 🐛 [Issue Tracker](https://github.com/your-org/legit-id/issues)
- 💬 [Community Forum](https://community.legit-id.com)
- 📧 [Email Support](support@legit-id.com)

### Reporting Issues
Please use our issue tracker to report bugs or request features.

## 🏆 Acknowledgments

- Built with modern web technologies
- Inspired by digital identity initiatives worldwide
- Thanks to all contributors and supporters

## 📈 Roadmap

### Upcoming Features
- **Mobile App**: Native iOS and Android applications
- **Biometric Integration**: Fingerprint and facial recognition
- **Advanced Analytics**: Machine learning insights
- **Enterprise Features**: SSO and LDAP integration
- **Global Expansion**: Multi-region deployment

### Long-term Vision
- Become the leading digital identity platform
- Expand to emerging markets
- Integrate with government systems
- Support for IoT device identity
- Decentralized identity standards

---

**Made with ❤️ by the LEGIT-ID Team**

[Website](https://legit-id.com) • [Documentation](https://docs.legit-id.com) • [Support](support@legit-id.com)
