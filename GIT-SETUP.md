# How to Push to GitHub and Clone on EC2

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in to your account.
2. Click **New** to create a new repository.
3. Name it (e.g., `kfc-integraciones`).
4. Do **NOT** initialize with README, .gitignore, or license (we have those).
5. Click **Create repository**.
6. Copy the HTTPS or SSH URL.

## Step 2: Push from Local Machine

```powershell
cd 'c:\Users\fdavi\Documents\proyecto cloud'
git remote add origin <YOUR_GITHUB_URL>
git branch -M main
git push -u origin main
```

Replace `<YOUR_GITHUB_URL>` with the URL from your GitHub repo (e.g., `https://github.com/fdavilaventuro/kfc-integraciones.git`).

## Step 3: Clone on EC2 Instance

1. SSH into your EC2 instance (Windows PowerShell, use `ssh -i <your-key.pem> ec2-user@<instance-ip>`).
2. Install git (if not already installed):
   ```bash
   sudo yum install git -y
   ```
3. Clone the repository:
   ```bash
   git clone <YOUR_GITHUB_URL>
   cd kfc-integraciones  # or whatever you named your repo
   ```

## Step 4: Deploy from EC2

On your EC2 instance, use the **bash** versions of the scripts (not PowerShell):

```bash
# Make scripts executable (if not already)
chmod +x scripts/deploy-all.sh scripts/smoke-test.sh

# Deploy all services
bash scripts/deploy-all.sh dev us-east-1

# Run the smoke test
bash scripts/smoke-test.sh dev us-east-1
```

If you're using **Windows EC2 with PowerShell**, use the `.ps1` scripts instead:
```powershell
.\scripts\deploy-all.ps1 -Stage dev -Region us-east-1
.\scripts\smoke-test.ps1 -Stage dev -Region us-east-1
```

**Before deploy**, ensure:
- AWS CLI is configured with credentials that can assume `LabRole`.
- Node.js and Python 3.9+ are installed on EC2.
- Serverless framework is installed: `npm install -g serverless`.

## Notes

- Edit `serverless.vars.yml` on EC2 if your account ID or role name is different.
- Store the `.env` file locally (not in git) with secrets like `NEXT_PUBLIC_API_URL`.
- Use `git pull` to update from main branch after any local changes are pushed.
