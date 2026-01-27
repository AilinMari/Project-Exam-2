# API Key Setup Instructions

The profile page error is occurring because you need to set up your Noroff API key.

## How to Get Your API Key:

1. **Make sure you're registered** at the Noroff API (you already did this when you registered in the app)

2. **Create an API Key:**
   - You need to make a POST request to create an API key
   - You can do this using the browser console or a tool like Postman

### Option 1: Using Browser Console (Easiest)

1. Open your browser's Developer Console (F12)
2. Go to the Console tab
3. Paste this code (replace with your actual login credentials):

```javascript
fetch("https://v2.api.noroff.dev/auth/create-api-key", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_ACCESS_TOKEN", // Use your access token from login
  },
  body: JSON.stringify({
    name: "Holidaze App Key",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Your API Key:", data))
  .catch((err) => console.error("Error:", err));
```

4. Copy the API key from the response

### Option 2: Get it from localStorage

After you log in, run this in the console:

```javascript
const token = localStorage.getItem("accessToken");
console.log("Your token:", token);
```

Then use that token in the fetch request above.

### Option 3: Create via Login Flow

1. Log in to your app
2. Open Developer Console
3. Run this code:

```javascript
const token = localStorage.getItem("accessToken");

fetch("https://v2.api.noroff.dev/auth/create-api-key", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Holidaze App Key",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("=== YOUR API KEY ===");
    console.log(data.data.key);
    console.log("Copy this key and paste it in src/config/api.ts");
  })
  .catch((err) => console.error("Error:", err));
```

## Update Your Code:

Once you have your API key, open `src/config/api.ts` and replace:

```typescript
export const API_KEY = "YOUR_API_KEY_HERE";
```

with:

```typescript
export const API_KEY = "your-actual-api-key-here";
```

## Important Notes:

- The API key is required for all authenticated requests
- Keep your API key secure and don't commit it to public repositories
- You only need to create the API key once
- If you lose it, you can create a new one using the same method

## Still Having Issues?

Make sure:

1. You're logged in with a valid account
2. Your access token is stored in localStorage
3. The API key is correctly set in `src/config/api.ts`
4. You're using a @stud.noroff.no email address
