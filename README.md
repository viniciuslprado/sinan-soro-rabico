<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1657c8a2-54ea-4c56-a3df-381d60ca6ea4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

**Banco de dados:** O arquivo `sinan.db` não é versionado (está no `.gitignore`). Ele é **criado automaticamente** na primeira execução do servidor (`npm run dev`), com a tabela `notifications` já criada. Em outra máquina, após `git clone` e `npm install`, basta rodar o app.
