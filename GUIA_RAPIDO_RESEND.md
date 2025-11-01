# 📧 Obter API Key do Resend

## Passo a Passo:

1. **Acesse**: https://resend.com
2. **Login**: Faça login na sua conta
3. **Clique**: Em **"API Keys"** no menu lateral
4. **Clique**: Em **"Create API Key"**
5. **Nome**: Digite `CEPIN Production`
6. **Permissões**: Marque as opções disponíveis
7. **Clique**: Em **"Create"**
8. **COPIE IMEDIATAMENTE**: A chave que aparece (ela não aparece de novo!)

---

## ⚠️ IMPORTANTE:
- A chave começa com `re_`
- Copie e guarde em lugar seguro
- Use como valor de **SMTP_PASS**

---

## 📝 Exemplo de como deve ficar:

```
SMTP_HOST = smtp.resend.com
SMTP_PORT = 465
SMTP_USER = resend
SMTP_PASS = re_AbCdEf1234567890GhIjKlMnOpQrStUvWxYz
```

