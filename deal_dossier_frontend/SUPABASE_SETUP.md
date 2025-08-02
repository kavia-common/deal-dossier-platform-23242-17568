# Supabase Setup Guide for Deal Dossier

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Note your project URL and anon public key

## Step 1: Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```bash
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_KEY=your-anon-public-key
   REACT_APP_SITE_URL=http://localhost:3000
   ```

## Step 2: Database Setup

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the complete SQL script from `assets/supabase.md`
4. Execute the script to create all tables, policies, and triggers

## Step 3: Authentication Configuration

1. In your Supabase dashboard, go to **Authentication > URL Configuration**
2. Set the Site URL to: `http://localhost:3000` (for development)
3. Add these Redirect URLs:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`

## Step 4: Storage Setup

1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:
   - `project-files` (private)
   - `exports` (private)
3. Apply the storage policies from the SQL script

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to `http://localhost:3000`
3. Try creating an account
4. Verify email confirmation works
5. Test file upload functionality

## Production Deployment

For production deployment:

1. Update environment variables:
   ```bash
   REACT_APP_SITE_URL=https://your-production-domain.com
   ```

2. Update Supabase authentication settings:
   - Site URL: `https://your-production-domain.com`
   - Redirect URLs: `https://your-production-domain.com/**`

3. Test all authentication flows in production

## Features Enabled

- ✅ Email/password authentication
- ✅ Email confirmation
- ✅ Password reset
- ✅ Magic link sign-in
- ✅ OAuth providers (optional)
- ✅ Row Level Security (RLS)
- ✅ File storage with user isolation
- ✅ Real-time subscriptions ready
- ✅ Audit logging

## Security Features

- All tables protected with Row Level Security
- Users can only access their own projects and data
- File storage isolated by user
- Authentication state managed securely
- Environment variables for sensitive configuration

## Next Steps

1. Customize email templates in Supabase dashboard
2. Configure OAuth providers if needed
3. Set up monitoring and alerts
4. Review and adjust RLS policies as needed
5. Configure backup and recovery procedures

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that `.env` file exists and contains correct values
   - Restart development server after changing environment variables

2. **Authentication redirect errors**
   - Verify redirect URLs are correctly configured in Supabase dashboard
   - Check that Site URL matches your domain

3. **Database connection errors**
   - Verify Supabase URL and key are correct
   - Check that your Supabase project is active

4. **File upload failures**
   - Ensure storage buckets are created
   - Verify storage policies are applied correctly

For more detailed troubleshooting, see the main `assets/supabase.md` file.
