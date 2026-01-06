#!/bin/bash

echo "🏗️  Restructuring React folder..."

# 1. Create the new directory structure inside src
mkdir -p src/assets
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/dashboard
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/stores
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/config

# 2. Create the placeholder files (will not overwrite existing files if they exist)
# UI Components
touch src/components/ui/Button.jsx src/components/ui/Input.jsx src/components/ui/Card.jsx src/components/ui/Modal.jsx

# Layout Components
touch src/components/layout/Navbar.jsx src/components/layout/Footer.jsx src/components/layout/ProtectedRoute.jsx

# Dashboard Components
touch src/components/dashboard/BalanceCard.jsx src/components/dashboard/TransactionList.jsx src/components/dashboard/QuickActions.jsx src/components/dashboard/StatsCard.jsx

# Pages
touch src/pages/Landing.jsx src/pages/SignIn.jsx src/pages/SignUp.jsx src/pages/Dashboard.jsx src/pages/Transfer.jsx src/pages/NotFound.jsx

# Services & Logic
touch src/services/api.js src/services/auth.service.js src/services/account.service.js
touch src/stores/authStore.js
touch src/hooks/useAuth.js src/hooks/useAccount.js
touch src/utils/formatters.js src/utils/validators.js
touch src/config/constants.js

# 3. Create Root Config Files
touch .env.development .env.production

echo "✅ Folders and files created!"
echo "⚠️  Note: To generate 'tailwind.config.js' properly, run: npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p"
