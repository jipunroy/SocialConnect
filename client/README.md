SocialConnect --- Social Development & Community Events Platform SocialConnect is a community-driven platform that helps people discover, organize, and participate in social development and community service events. Users can create events, join activities in their local areas, manage their own events, and track their community contributions. Live Application

Live Website: ADD_YOUR_NETLIFY_URL_HERE
Backend API: https://socialconnect-api-ro63.onrender.com
GitHub Repository: https://github.com/jipunroy/SocialConnect Replace ADD_YOUR_NETLIFY_URL_HERE with your deployed Netlify frontend URL.
Key Features

Authentication: Register and log in using email and password or Google OAuth.
Secure Access: Protected pages and API endpoints for authenticated users, with JWT support through Better Auth.
Explore Upcoming Events: Browse community events that are scheduled for future dates.
Create Events: Authenticated users can publish events with a title, description, category, image, location, and date.
Join Events: Logged-in users can join community activities and save their participation.
Manage Events: Event creators can update or delete only the events they own.
Joined Events: View joined activities, organized by event date.
Profile Management: Update profile details and profile picture.
Community Impact Dashboard: Review participation and community contribution statistics.
Responsive Interface: Designed for mobile, tablet, and desktop screens.
Theme Toggle: Switch between light and dark themes.
User Feedback: Toast notifications provide success and error messages. Technology Stack Frontend
Next.js App Router
React
TypeScript
Tailwind CSS
shadcn/ui
Better Auth React client
Sonner Backend
Node.js
Express.js
TypeScript
Better Auth
Better Auth MongoDB Adapter
Better Auth JWT plugin Database and Services
MongoDB / MongoDB Atlas
Cloudinary for image uploads Deployment
Netlify --- Frontend
Render --- Backend Project Structure SocialConnect/ ├── client/ # Next.js frontend application │ ├── public/ │ ├── src/ │ └── package.json ├── server/ # Express.js backend API │ ├── src/ │ └── package.json └── README.md Getting Started Prerequisites Make sure you have the following:
Node.js (LTS version recommended)
npm
A MongoDB database or MongoDB Atlas account
Google OAuth credentials (for Google sign-in)
A Cloudinary account (for profile image uploads)
Clone the repository git clone https://github.com/jipunroy/SocialConnect.git cd SocialConnect
Install dependencies Install the frontend dependencies: cd client npm install Install the backend dependencies: cd ../server npm install
Configure environment variables Create the following local environment files. Use your own credentials and never commit real secrets. Backend: server/.env PORT=5000 CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:5000 BETTER_AUTH_SECRET=your_long_random_secret

MONGODB_URI=your_mongodb_connection_string DB_NAME=SocialConnect

GOOGLE_CLIENT_ID=your_google_oauth_client_id GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name CLOUDINARY_API_KEY=your_cloudinary_api_key CLOUDINARY_API_SECRET=your_cloudinary_api_secret Frontend: client/.env.local NEXT_PUBLIC_API_URL=http://localhost:5000 Environment variable names must match the names used by the application source code. If your local configuration uses different MongoDB or Cloudinary variable names, use those exact names.

Start the backend From the project root: cd server npm run dev The backend runs at http://localhost:5000 (unless you configure a different port).
Start the frontend Open a second terminal from the project root: cd client npm run dev Visit http://localhost:3000 in your browser. Google OAuth Setup
Open the Google Cloud Console and create OAuth 2.0 credentials.
Add your local frontend origin (http://localhost:3000) and deployed frontend origin to Authorized JavaScript origins.
Add the following callback URL to Authorized redirect URIs: Local http://localhost:5000/api/auth/callback/google Production https://socialconnect-api-ro63.onrender.com/api/auth/callback/google
Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the backend environment.
Restart the backend locally or redeploy it after changing environment variables. Never expose or commit your Google client secret. Deployment Configuration Backend --- Render Configure the production environment variables in your Render service:
CLIENT_URL --- the exact deployed Netlify frontend origin
BETTER_AUTH_URL --- https://socialconnect-api-ro63.onrender.com
BETTER_AUTH_SECRET --- a strong private secret
MONGODB_URI and DB_NAME
GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
Cloudinary credentials Frontend --- Netlify Set the following environment variable: NEXT_PUBLIC_API_URL=https://socialconnect-api-ro63.onrender.com Redeploy the frontend after changing environment variables. Available Scripts Run commands from the relevant application directory. Client npm run dev npm run build npm run start npm run lint Server npm run dev npm run build npm run start The available commands depend on the scripts configured in each package.json. Security Notes
Do not commit .env, .env.local, API keys, OAuth secrets, database credentials, or Cloudinary secrets.
Use environment variables for all production secrets.
Configure CORS and Better Auth trusted origins with the exact frontend domain.
Use HTTPS for deployed applications.
Event update and delete operations should be restricted to the event owner. Future Improvements
Event search, category filters, and pagination
Event reminders and notifications
Event attendance tracking and certificates
Admin moderation and reporting tools
Automated tests and continuous integration Author Jipun Roy License This project was developed for educational and portfolio purposes. No open-source license has been assigned yet
