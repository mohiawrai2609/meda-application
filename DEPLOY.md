
# 🛠️ HOW TO DEPLOY MEDA

To get a link you can share with anyone, follow these steps:

### 1. Push Code to GitHub
1. Go to [github.com](https://github.com) and create a NEW repository called `meda-demo`.
2. Run these commands in your terminal here:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 2. Deploy the Backend (API & DB)
We recommend **Render.com** (it's free):
1. Create a **New Blueprints** on Render.
2. Connect your GitHub repo.
3. Render will auto-detect your `docker-compose` or `apps/api`.
4. Add your Environment Variables (like `DATABASE_URL`).

### 3. Deploy the Dashboard & Portal
We recommend **Vercel.com**:
1. Go to Vercel and click **"Add New Project"**.
2. Connect your GitHub repo.
3. For the **Dashboard**: Set the `Root Directory` to `apps/web`. Add Environment Variable `VITE_API_URL` = (Your Render API URL).
4. For the **Portal**: Set the `Root Directory` to `apps/portal`. Add Environment Variable `VITE_API_URL` = (Your Render API URL).

---

### 🚀 QUICK DEMO LINK (Tunneling)
If you want a link **RIGHT NOW** just for a few minutes (while your computer is on), run this in your terminal:

**To share the Dashboard:**
```bash
npx localtunnel --port 5173
```
*(Note: They will also need to be able to reach your API, which is more complex with localtunnel).*

**I recommend the GitHub + Vercel route for a professional link!**
