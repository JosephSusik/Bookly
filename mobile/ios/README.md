# Bookly iOS App

An iOS app for managing your book collection with barcode scanning capabilities.

## Features

- **Login**: Email and password authentication
- **My Books**: View your book collection
- **Add Book**: Scan book barcodes (ISBN) using the camera and add books to your collection
- **Profile**: View your profile information and logout

## Setup Instructions

### 1. Configure API URL

Update the `baseURL` in `bookly/Services/APIService.swift`:

```swift
private let baseURL = "http://localhost:3000" // Change to your backend URL
```

For a physical device, use your computer's IP address instead of `localhost`:
```swift
private let baseURL = "http://192.168.1.XXX:3000" // Replace with your IP
```

### 2. Add Camera Permissions

The app requires camera access for barcode scanning. Add the following to your `Info.plist`:

1. Open your Xcode project
2. Select the project in the navigator
3. Select the target "bookly"
4. Go to the "Info" tab
5. Add a new key: `Privacy - Camera Usage Description` (or `NSCameraUsageDescription`)
6. Set the value to: `"We need access to your camera to scan book barcodes"`

Alternatively, if you have an `Info.plist` file, add:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to scan book barcodes</string>
```

### 3. Network Security (for HTTP connections)

If your backend uses HTTP (not HTTPS), you need to allow arbitrary loads:

1. In Xcode, select the project
2. Select the target "bookly"
3. Go to the "Info" tab
4. Add `App Transport Security Settings` dictionary
5. Add `Allow Arbitrary Loads` and set it to `YES`

Or in `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### 4. Build and Run

1. Open `bookly.xcodeproj` in Xcode
2. Select your target device or simulator
3. Build and run (⌘R)

## Project Structure

```
bookly/
├── Models/
│   ├── User.swift          # User model
│   └── Book.swift           # Book models
├── Services/
│   ├── APIService.swift     # API communication
│   └── AuthManager.swift    # Authentication state management
├── Views/
│   ├── LoginView.swift      # Login screen
│   ├── MainTabView.swift    # Main tab navigation
│   ├── BooksListView.swift  # Books list (Tab 1)
│   ├── AddBookView.swift    # Add book with scanner (Tab 2)
│   ├── AddBookFormView.swift # Book form
│   ├── BarcodeScannerView.swift # Camera barcode scanner
│   └── ProfileView.swift    # Profile screen (Tab 3)
└── booklyApp.swift          # App entry point
```

## API Endpoints Used

- `POST /users/login` - User login
- `GET /users/me` - Get current user
- `GET /books/:userId` - Get user's books
- `POST /books/search-by-isbn` - Search book by ISBN
- `POST /books` - Create a new book

## Testing

The app pre-fills login credentials in debug mode:
- Email: `admin@bookly.com`
- Password: `Test1234.`

Make sure your backend is running and accessible from your device/simulator.

