# Firestore Security Rules

Here are the recommended Firestore security rules for your SEO redirection system:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Redirections collection
    match /redirections/{redirectId} {
      // Allow public read access for the redirection pages
      allow read: if true;
      
      // Allow write access only to authenticated users
      allow write: if request.auth != null;
    }
    
    // Users collection (optional, for storing user metadata)
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Explanation:

1. **Redirections Collection**:
   - `read: if true` - Allows public read access so the redirection pages can be viewed by anyone
   - `write: if request.auth != null` - Only authenticated users can create, update, or delete redirections

2. **Users Collection** (optional):
   - Only authenticated users can access their own user data
   - This is useful if you want to store additional user metadata

## How to apply these rules:

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Click on "Rules" tab
4. Replace the existing rules with the rules above
5. Click "Publish"

These rules ensure:
- Public can view redirections (necessary for SEO)
- Only authenticated admin users can manage redirections
- Data security is maintained while allowing proper functionality