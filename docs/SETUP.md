# TEAZ — configuração e próximos passos

## Rodar localmente

1. Instale Node.js 20 ou superior.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Execute `npm run dev` e abra http://localhost:3000.

## O que esta primeira versão já oferece

- Página responsiva com identidade visual TEAZ.
- Navegação por seções, busca textual e filtros de estilo, categoria, loja e preço.
- Catálogo inicial de demonstração; os links de loja são páginas gerais e não representam ofertas verificadas.
- Detalhes de produto, links externos, favoritos persistidos no navegador.
- Painel demonstrativo para cadastrar e remover produtos localmente.
- Interface de conversa TEAZ AI. Com `OPENAI_API_KEY`, a rota do servidor envia o catálogo atual para a API; sem a chave, responde em modo demonstrativo.

## Importante antes de publicar

Esta versão é um MVP de interface e fluxo. Ela ainda **não** tem banco de dados, contas reais, autorização de administradora, armazenamento de imagens, sincronização de estoque/preços, cupons verificados, analytics de afiliados, envio de newsletter ou integração oficial com marketplaces.

O painel local usa a senha de demonstração `TEAZ-DEMO` e localStorage. Isso não é segurança e não deve ser usado como proteção em produção. Não coloque credenciais privadas no navegador.

## Arquitetura recomendada para a próxima etapa

- **Supabase:** PostgreSQL, Auth, Storage e políticas RLS para perfis, produtos, looks, categorias, cupons e preferências.
- **Admin:** validar o papel `admin` no servidor em todas as rotas de escrita; nunca confiar em esconder botões no cliente.
- **TEAZ AI:** manter a chave OpenAI exclusivamente no servidor, recuperar produtos do banco por filtros e enviar apenas resultados reais ao modelo. Validar uploads e limitar tamanho/tipo de imagem.
- **Afiliados:** guardar URL original, URL afiliada, origem e data de verificação; registrar cliques com consentimento e respeitar os termos de cada parceiro.
- **Preços e cupons:** manter `last_checked_at`, fonte e validade; ocultar promoções vencidas ou não verificadas.
- **Deploy:** Vercel ou outro host compatível com Next.js; configurar as variáveis de ambiente no painel do host.

## Modelo de dados sugerido

- `profiles(id, display_name, role, created_at)`
- `products(id, name, description, price, old_price, currency, store, product_url, affiliate_url, image_url, category_id, style, sizes, verified_at, active)`
- `categories(id, name, audience, slug, image_url, sort_order)`
- `looks(id, title, style, occasion, image_url, published)`
- `look_items(look_id, product_id, sort_order)`
- `coupons(id, code, store, valid_from, valid_until, verified_at, active)`
- `favorites(user_id, product_id, created_at)`
- `click_events(id, product_id, user_id, created_at)`

Não há API pública universal para importar automaticamente o catálogo de todos os marketplaces. Até existir uma integração oficial e autorizada, cadastre os produtos manualmente e confira preços e links.
