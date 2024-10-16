# rise-vest-mobile

## Overview

rise-vest-mobile is a React Native application that provides user authentication, profile management, and plan review functionality. This README provides an overview of the app's structure, key components, and setup instructions.

## Table of Contents

1. [Architecture](#architecture)
2. [Key Components](#key-components)
3. [State Management](#state-management)
4. [Navigation](#navigation)
5. [Authentication](#authentication)
6. [Screens](#screens)
7. [User Experience](#user-experience)
8. [Setup and Installation](#setup-and-installation)
9. [Contributing](#contributing)

## Architecture

The app follows a typical React Native architecture with the following structure:

- `App.tsx`: The main entry point of the application
- `src/`: Contains the main source code
  - `providers/`: Context providers for state management
  - `navigation/`: Navigation configuration
  - `screens/`: Individual screen components
  - `components/`: Reusable UI components (not visible in the provided file list, but likely exists)

## Key Components

- `AuthProvider`: Manages authentication state and related functions
- `Navigation`: Handles the app's navigation structure

## State Management

Following the principle of minimal Redux usage, this app utilizes React Context for state management. The main state provider is:

- `AuthProvider`: Manages global authentication state

This approach allows for efficient state management without the overhead of a full Redux implementation, making the app more lightweight and easier to maintain.

## Navigation

The app uses React Navigation for managing different screens and flow. The main navigation structure is defined in `src/navigation/index.tsx`.

## Authentication

Authentication is handled by the `AuthProvider` located in `src/providers/AuthProvider.tsx`. This provider manages user authentication state and provides related functions to the app.

## Screens

The app includes the following main screens:

- Auth:
  - `SignUp`: User registration screen
  - `TellUsMore`: Additional user information collection
- Dashboard:
  - `Home`: Main dashboard screen
  - `Profile`: User profile management
  - `PlanReview`: Review and manage plans
  - `PlanDetails`: Detailed view of a specific plan

## User Experience

To enhance user engagement and provide a polished look, the app features:

- **Animated Splash Screen**: A custom-designed splash screen created in Adobe After Effects greets users with smooth animations as soon as they open the app.
- **Multiple Animations**: Various animations throughout the app keep users engaged and provide visual feedback for actions and transitions.

These animations not only improve the aesthetic appeal of the app but also contribute to a more intuitive and enjoyable user experience.

## Setup and Installation

To set up and run this Expo-based React Native app, follow these steps:

1. **Prerequisites**:
   - Install Node.js (version 12 or newer)
   - Install npm (usually comes with Node.js) or Yarn

2. **Install Expo CLI**:
   ```
   npm install -g expo-cli
   ```
   or
   ```
   yarn global add expo-cli
   ```

3. **Clone the repository**:
   ```
   git clone https://github.com/risevest/rn-dev-test.git
   cd rise-vest-mobile
   ```

4. **Install dependencies**:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

5. **Start the Expo development server**:
   ```
   expo start
   ```

6. **Run the app**:
   - To run on an iOS simulator: Press `i` in the terminal or click "Run on iOS simulator" in the Expo DevTools browser window.
   - To run on an Android emulator: Press `a` in the terminal or click "Run on Android device/emulator" in the Expo DevTools browser window.
   - To run on a physical device: Install the Expo Go app on your device and scan the QR code displayed in the terminal or Expo DevTools browser window.

7. **Development**:
   - The app will reload automatically as you save changes to the code.
   - Shake your device or press `Cmd + D` in the iOS simulator (or `Ctrl + M` in the Android emulator) to open the developer menu.

Note: Make sure your development machine and mobile device/emulator are on the same Wi-Fi network for the best development experience.

## Contributing

(Include guidelines for contributing to the project, coding standards, and pull request process)
