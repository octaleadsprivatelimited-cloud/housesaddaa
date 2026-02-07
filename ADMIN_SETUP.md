# Admin Panel Login Setup

Admin login uses **Firebase Authentication** (email/password) and **Firestore** (admin list). Both must be set up for the account to work.

## Step 1: Create the user in Firebase Authentication

1. Open [Firebase Console](https://console.firebase.google.com/) and select project **housessadda**.
2. Go to **Build → Authentication**.
3. Under **Sign-in method**, ensure **Email/Password** is **Enabled**.
4. Open the **Users** tab.
5. Click **Add user**.
   - Email: `housesaddadigital@gmail.com`
   - Password: your chosen password (e.g. `admin123`).
6. Click **Add user** and leave this tab open—you will need the **User UID** in the next step (e.g. `abc123xyz...`).

## Step 2: Add the user to the Firestore admin list

The app only allows sign-in if the user’s UID exists in the `admins` collection.

1. In Firebase Console, go to **Build → Firestore Database**.
2. If there is no **admins** collection, create it:
   - Click **Start collection** (or **Add collection**).
   - Collection ID: `admins`
   - Click **Next**.
3. Add a document that represents this admin:
   - **Document ID**: paste the **User UID** from Step 1 (the UID of `housesaddadigital@gmail.com`).  
     **Important:** The document ID must be exactly the UID from Authentication, not the email.
   - Add fields:
     - `role` (string): `admin` or `super-admin`
     - `name` (string, optional): e.g. `Admin`
4. Click **Save**.

## Step 3: Sign in

1. Go to your site’s admin login page (e.g. `/admin/login`).
2. Sign in with:
   - Email: `housesaddadigital@gmail.com`
   - Password: the password you set in Step 1.

## Common issues

| What you see | What to do |
|--------------|------------|
| **Invalid email or password** | User doesn’t exist or wrong password. Create the user in Authentication (Step 1) or use **Forgot password?** on the login page. |
| **You don't have admin access** | User exists in Authentication but there is no document in `admins` with document ID = that user’s **UID**. Do Step 2 and use the UID from Authentication as the document ID. |
| **Forgot password** | Use the **Forgot password?** link on the login page (entering the same email you use to log in). |

## Quick checklist

- [ ] Email/Password is enabled in Authentication.
- [ ] User `housesaddadigital@gmail.com` exists in Authentication → Users.
- [ ] You know that user’s **UID** (click the user in the Users list to see it).
- [ ] Firestore has an **admins** collection.
- [ ] There is a document in **admins** whose **document ID** is that UID (not the email).
- [ ] That document has a `role` field set to `admin` or `super-admin`.

After this, login with your email and password should work.

## Blog (optional)

To use the **Blog** feature (Admin → Blog):

1. **Firestore indexes**: When you first load the blog list or a post, Firestore may ask you to create composite indexes. Use the link in the error message to create them, or in Firestore go to **Indexes** and add:
   - Collection: `blogs` — fields: `isPublished` (Asc), `publishedAt` (Desc).
   - Collection: `blogs` — fields: `slug` (Asc), `isPublished` (Asc).
2. **Pagination**: The public blog and admin list load 10 posts per page and use “Load more” to reduce Firebase reads.
