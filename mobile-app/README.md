# NexusVerse Mobile App

A React Native mobile application for the NexusVerse NFT marketplace, providing a native mobile experience for browsing, buying, and managing NFTs.

## Features

- **Home Dashboard**: Overview of marketplace stats, featured NFTs, and recent activity
- **Marketplace**: Browse and search NFTs with filters and categories
- **Profile Management**: View and manage user profile and owned NFTs
- **Wallet Integration**: Connect and manage cryptocurrency wallets
- **Real-time Updates**: Live updates for NFT prices and market activity
- **Push Notifications**: Get notified about price changes and new listings

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation between screens
- **Vector Icons**: Icon library for mobile UI
- **TypeScript**: Type safety and better development experience

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Install dependencies:**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on iOS:**
   ```bash
   npm run ios
   ```

4. **Run on Android:**
   ```bash
   npm run android
   ```

## Project Structure

```
mobile-app/
├── App.tsx                 # Main app component with navigation
├── screens/                # Screen components
│   ├── HomeScreen.tsx      # Home dashboard
│   ├── MarketplaceScreen.tsx # NFT marketplace
│   ├── ProfileScreen.tsx   # User profile
│   ├── NFTScreen.tsx      # Individual NFT details
│   └── WalletScreen.tsx   # Wallet management
├── components/             # Reusable components
├── utils/                  # Utility functions
├── assets/                 # Images and static files
└── package.json           # Dependencies and scripts
```

## Key Features

### Home Screen
- Market statistics overview
- Featured NFTs carousel
- Quick action buttons
- Recent activity feed

### Marketplace
- Grid/list view of NFTs
- Search and filtering
- Category browsing
- Price tracking

### Profile
- User information display
- Owned NFTs gallery
- Transaction history
- Settings management

### Wallet Integration
- Wallet connection
- Balance display
- Transaction management
- Network switching

## Development

### Adding New Screens

1. Create a new screen component in `screens/`
2. Add navigation route in `App.tsx`
3. Update tab navigator if needed

### Styling

The app uses React Native's StyleSheet API for styling. Follow the existing patterns for consistency.

### State Management

Currently using React's useState and useEffect. For larger apps, consider Redux or Context API.

## Deployment

### Building for Production

1. **iOS:**
   ```bash
   expo build:ios
   ```

2. **Android:**
   ```bash
   expo build:android
   ```

### Publishing to App Stores

1. Configure app.json with app store details
2. Build production versions
3. Submit to Apple App Store and Google Play Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.








