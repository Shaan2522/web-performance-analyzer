# Web Performance Analyzer

This is a React application designed to analyze web performance metrics.

## Deployment

This application can be deployed to static hosting services like GitHub Pages and Netlify.

### GitHub Pages

1.  **Prerequisites:**
    *   Ensure you have `gh-pages` installed as a dev dependency. If not, run:
        ```bash
        npm install --save-dev gh-pages
        ```
2.  **Configure `package.json`:**
    *   The `homepage` field in `client/package.json` should be set to your GitHub Pages URL. For a project page, it typically looks like this:
        ```json
        "homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>",
        ```
    *   The `predeploy` and `deploy` scripts have been added to `client/package.json`:
        ```json
        "scripts": {
          "predeploy": "npm run build",
          "deploy": "gh-pages -d dist"
        }
        ```
3.  **Deploy:**
    *   Navigate to the `client` directory in your terminal:
        ```bash
        cd client
        ```
    *   Run the deploy script:
        ```bash
        npm run deploy
        ```
    *   This will build your application and push the `dist` folder content to the `gh-pages` branch of your repository.
4.  **GitHub Pages Settings:**
    *   Go to your GitHub repository settings.
    *   Under the "Pages" section, select the `gh-pages` branch as your source and `/ (root)` as the folder.
    *   Your application should now be live at the `homepage` URL you configured.

### Netlify

1.  **Prerequisites:**
    *   A Netlify account.
    *   Your project connected to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Deployment Steps:**
    *   **New Site from Git:** In your Netlify dashboard, click "Add new site" -> "Import an existing project" -> "Deploy with GitHub" (or your Git provider).
    *   **Select Repository:** Choose your project repository.
    *   **Build Settings:**
        *   **Base directory:** `client/` (or the directory containing your `package.json`)
        *   **Build command:** `npm run build`
        *   **Publish directory:** `client/dist`
    *   **Deploy Site:** Click "Deploy site". Netlify will automatically build and deploy your application.
3.  **Redirects for React Router:**
    *   A `_redirects` file has been created in `client/public/_redirects` with the content `/*    /index.html   200`. This ensures that all routes are handled correctly by React Router.

## Tips for Subpaths and Custom Domains

### Serving from a Subpath (e.g., `yourdomain.com/my-app/`)

*   **GitHub Pages:**
    *   Ensure your `homepage` in `client/package.json` is set to the full subpath, e.g., `"homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/my-app"`.
    *   In your React Router setup (e.g., `App.jsx`), you might need to set the `basename` prop on `BrowserRouter`:
        ```jsx
        <Router basename="/my-app">
          {/* Your routes */}
        </Router>
        ```
*   **Netlify:**
    *   Netlify handles subpaths automatically if your `BrowserRouter` is configured correctly. You generally don't need to set a `basename` unless you specifically want to deploy the app to a subpath *within* a Netlify site that already has content at its root.

### Custom Domains

*   **GitHub Pages:**
    *   In your GitHub repository settings, under "Pages", you can specify a custom domain.
    *   You'll need to configure your DNS records with your domain registrar (e.g., A record pointing to GitHub Pages IP addresses or a CNAME record pointing to your GitHub Pages URL).
*   **Netlify:**
    *   In your Netlify site settings, go to "Domain management" -> "Custom domains".
    *   Add your custom domain and follow the instructions to configure your DNS records with your domain registrar (usually by adding CNAME or A records).

## API Calls

This application is designed to work entirely client-side, utilizing IndexedDB for data storage. There are no external server API calls. All performance and memory data is collected and stored locally within your browser's IndexedDB.