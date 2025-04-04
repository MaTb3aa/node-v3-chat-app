# CI/CD Pipeline Plan for Chat App

## Stages
1. **Build**
   - Git checkout
   - `npm install`
   - `docker build -t chat-app .`

2. **Test**
   - `npm test`
   - `npm audit` (security check)
   - `docker scan chat-app` (Docker security scan)

3. **Deploy**
   - Push to Docker Hub: `docker push yourname/chat-app`
   - Deploy to server using Ansible playbook.