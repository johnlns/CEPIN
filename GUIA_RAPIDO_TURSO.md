# 🗄️ Obter Valores do Turso

## Passo a Passo:

1. **Acesse**: https://turso.tech
2. **Login**: Faça login na sua conta
3. **Selecione**: Seu database (provavelmente `cepindb`)
4. **Clique**: Em **"Connect"**
5. **Procure**: Por "Turso CLI" na página
6. **Copie**:
   - A URL que começa com `libsql://` → **DATABASE_URL**
   - O token que aparece embaixo → **DATABASE_AUTH_TOKEN**

---

## Se não encontrar:

1. Procure por um botão **"Show Token"** ou **"Generate Token"**
2. Ou vá em **Settings** → **Tokens**
3. Crie um novo token se necessário

---

## 📝 Exemplo de como deve ficar:

```
DATABASE_URL = libsql://cepindb-lenno.turso.io
DATABASE_AUTH_TOKEN = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzNCIsImV4cCI6MTYxNjIzOTAyMi45ODI1OTY3fQ...
```

