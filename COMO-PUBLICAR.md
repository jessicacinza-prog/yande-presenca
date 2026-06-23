# Como publicar o site de presença do Yandê Transpará

Esse projeto está pronto para ir ao ar com link único, banco de dados real e relatório protegido por senha. Siga os passos abaixo.

## 1. Criar conta no Netlify (se ainda não tiver)

Acesse netlify.com e crie uma conta com Google ou GitHub.

## 2. Fazer o deploy do site

A forma mais simples, sem precisar instalar nada no computador:

1. Entre no painel do Netlify (app.netlify.com)
2. Procure a opção "Add new site" → "Deploy manually" (ou "Deploy without Git")
3. Arraste a pasta inteira deste projeto (a pasta `yande-presenca`) para a área de upload
4. Aguarde o deploy finalizar — você vai receber um link tipo `nome-aleatorio.netlify.app`

## 3. Criar o banco de dados (Netlify Database)

1. Dentro do site recém-criado, vá em **Project settings → Database** (ou procure por "Netlify DB" no menu)
2. Clique em "Create database" — é automático, leva poucos segundos
3. Isso cria uma variável de ambiente chamada `NETLIFY_DATABASE_URL` automaticamente. Não precisa configurar nada manualmente.

## 4. Configurar a senha do relatório

1. Vá em **Project settings → Environment variables**
2. Clique em "Add a variable"
3. Nome: `RELATORIO_SENHA`
4. Valor: escolha uma senha só sua (não use uma senha de exemplo pública)
5. Salve

## 5. Re-publicar (trigger deploy)

Depois de criar o banco e a variável de senha, vá em **Deploys** e clique em "Trigger deploy" → "Deploy site", para que as funções reconheçam essas configurações novas.

## 6. Testar

- Link de registro: `https://seu-site.netlify.app/`
- Peça para 2-3 pessoas testarem em celulares diferentes
- Depois abra o mesmo link, clique em "Relatório", digite a senha, e confira se os registros aparecem

## 7. (Opcional) Usar seu próprio domínio

Se quiser usar algo como `presenca.jessicacinza.com`:

1. No Netlify, vá em **Domain settings → Add a domain**
2. Digite o subdomínio desejado
3. O Netlify vai te dar um registro CNAME para adicionar no painel de DNS do seu domínio (onde está seu WordPress)
4. Isso não afeta o site WordPress existente, é apenas um subdomínio separado apontando para este novo site

---

**Importante:** escolha no passo 4 uma senha só sua e guarde-a — é ela que protege o relatório. Nunca coloque a senha real neste arquivo (o repositório pode ser público).
