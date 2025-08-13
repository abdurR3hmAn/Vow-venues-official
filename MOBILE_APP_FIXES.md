# Vow Venues Mobile App Issues & Solutions

## Architecture Overview
- **Main Server**: Node.js backend (port 3000) serving both web client and API
- **Mobile Server**: Redundant Express server (port 3001) - **SHOULD BE REMOVED**
- **Database**: Shared MongoDB instance between both servers
- **Mobile App**: React Native app with navigation, auth, and venue booking features

## Critical Issues Found

### 1. Memory Issues (Critical Priority)
**Problem**: Java OutOfMemoryError during Android builds
**Root Cause**: Insufficient heap space allocation

**Solutions**:

#### A. Fix Gradle Memory Settings
Create/update `mobile/android/gradle.properties`:
```properties
# Increase heap size
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true

# Enable build cache
android.enableBuildCache=true
android.useAndroidX=true
android.enableJetifier=true
```

#### B. Update Android App-Level build.gradle
In `mobile/android/app/build.gradle`:
```gradle
android {
    dexOptions {
        javaMaxHeapSize "4g"
    }
    
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "arm64-v8a", "x86_64"
        }
    }
}
```

#### C. Clean Build Environment
```bash
cd mobile
# Clean everything
npx react-native clean
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
```

### 2. Test Configuration Issues
**Problem**: Jest cannot find React Native internal modules

**Solution**: Update `mobile/jest.setup.js`:
```javascript
// Remove problematic mock
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Replace with safer animation mock
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      spring: jest.fn(() => ({
        start: jest.fn(),
      })),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        interpolate: jest.fn(),
      })),
    },
  };
});
```

### 3. Remove Redundant Mobile Server
**Problem**: Duplicate backend server causing confusion and potential conflicts

**Recommended Solution**:
1. **Remove mobile server directory** entirely
2. Update mobile app to use main server (port 3000)
3. Consolidate API endpoints

**Steps**:
```bash
# Remove mobile server
rm -rf mobile/server

# Update mobile app configuration
# In mobile/src/utils/environment.ts, ensure:
const API_BASE_URL = 'http://localhost:3000/api'; // Use main server
```

### 4. Dependency Version Issues
**Problem**: Outdated React Native version and conflicting dependencies

**Solution**: Update React Native and dependencies
```bash
cd mobile
npx react-native upgrade
npm update
```

**Update key packages in mobile/package.json**:
```json
{
  "dependencies": {
    "react-native": "0.73.0",
    "react": "18.3.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.9.26"
  }
}
```

### 5. Network Configuration Issues
**Problem**: Mobile app might not connect properly to backend

**Solution**: Update network configuration
In `mobile/src/utils/environment.ts`:
```typescript
// For development
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://your-production-url.com/api';

// For iOS simulator use 'http://localhost:3000/api'
```

## Recommended Architecture Changes

### 1. Simplified Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile App     │    │     Admin       │
│   (React)       │    │ (React Native)  │    │    Panel        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Main Server    │
                    │ (Node.js/Express│
                    │    Port 3000)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    └─────────────────┘
```

### 2. API Endpoint Consolidation
Update main server to handle both web and mobile requests:

```typescript
// In server/routes.ts - Add mobile-specific endpoints
app.get('/api/mobile/venues', async (req, res) => {
  // Mobile-optimized venue data
});

app.post('/api/mobile/auth/login', async (req, res) => {
  // Mobile authentication
});
```

## Step-by-Step Fix Implementation

### Step 1: Fix Memory Issues
```bash
# Update gradle properties
echo 'org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m' >> mobile/android/gradle.properties

# Clean build
cd mobile/android && ./gradlew clean
```

### Step 2: Fix Test Configuration
```bash
cd mobile
# Update jest.setup.js with safer mocks
# Run tests to verify
npm test
```

### Step 3: Consolidate Backend
```bash
# Remove redundant mobile server
rm -rf mobile/server

# Update mobile app to use main server
# Update API base URL in mobile app configuration
```

### Step 4: Update Dependencies
```bash
cd mobile
npm update
npx react-native upgrade
```

### Step 5: Test Everything
```bash
# Test main server
npm run dev

# Test mobile app (in separate terminal)
cd mobile
npx react-native start
npx react-native run-android
```

## Database Relationship
**Current State**: Both servers use the SAME MongoDB database
- Connection string: `mongodb+srv://rehansaqib:Cusit%4012926@cluster0.koi0z.mongodb.net/...`
- This means web app and mobile app share the same data
- No separate mobile database needed

## Priority Order for Fixes

1. **Critical**: Fix memory issues (Gradle settings)
2. **High**: Remove redundant mobile server  
3. **Medium**: Fix test configuration
4. **Medium**: Update dependencies
5. **Low**: Optimize mobile app performance

## Expected Outcomes After Fixes

✅ Mobile app builds successfully  
✅ Tests run without errors  
✅ Single, consolidated backend  
✅ Improved performance and maintainability  
✅ Consistent API endpoints  
✅ Shared database working properly  

## Monitoring & Verification

After implementing fixes:
1. Monitor build times and memory usage
2. Run all tests to ensure functionality
3. Test mobile app on both Android and iOS
4. Verify API calls work correctly
5. Check database operations are consistent
