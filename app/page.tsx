"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown, Crown, Heart,
  Instagram, Menu, MessageCircle, Search, Send, ShoppingBag, SlidersHorizontal,
  Sparkles, Star, WandSparkles, X
} from "lucide-react";

type Product = {
  id: number; name: string; category: string; style: string; store: string;
  price: number; oldPrice?: number; image: string; tag?: string; url: string;
  description: string; sizes: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Blusa laço de cetim", category: "Blusas", style: "Coquette", store: "SHEIN", price: 59.90, oldPrice: 89.90, image: "https://images.unsplash.com/photo-1564257577-7a5c3e1a8b1a?w=700&q=85", tag: "QUERIDINHO", url: "https://br.shein.com/", description: "Blusa delicada com detalhe acetinado e acabamento romântico.", sizes: "P · M · G" },
  { id: 2, name: "Saia midi plissada", category: "Saias", style: "Old Money", store: "Shopee", price: 74.90, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=700&q=85", tag: "ELEGANTE", url: "https://shopee.com.br/", description: "Silhueta fluida para composições clássicas.", sizes: "P · M · G · GG" },
  { id: 3, name: "Bolsa estruturada nude", category: "Bolsas", style: "Elegante", store: "SHEIN", price: 96.00, oldPrice: 129.90, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85", tag: "ACHADINHO", url: "https://br.shein.com/", description: "Bolsa estruturada em tom neutro para acompanhar todos os dias.", sizes: "Único" },
  { id: 4, name: "Vestido floral romântico", category: "Vestidos", style: "Romântico", store: "Shopee", price: 119.90, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=85", tag: "NOVIDADE", url: "https://shopee.com.br/", description: "Estampa floral suave e movimento delicado.", sizes: "P · M · G" },
  { id: 5, name: "Trench coat clássico", category: "Casacos", style: "Old Money", store: "Renner", price: 229.90, oldPrice: 299.90, image: "https://images.unsplash.com/photo-1548624149-f2b7a4cd1f8b?w=700&q=85", tag: "CLÁSSICO", url: "https://www.lojasrenner.com.br/", description: "Uma terceira peça atemporal para dias amenos.", sizes: "P · M · G" },
  { id: 6, name: "Top minimalista", category: "Blusas", style: "Clean Girl", store: "SHEIN", price: 42.90, image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=700&q=85", tag: "ESSENCIAL", url: "https://br.shein.com/", description: "Básico versátil para construir diferentes camadas.", sizes: "PP · P · M · G" },
  { id: 7, name: "Jeans reto vintage", category: "Calças", style: "Vintage", store: "Shopee", price: 89.90, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&q=85", tag: "VERSÁTIL", url: "https://shopee.com.br/", description: "Modelagem reta com inspiração retrô.", sizes: "36 · 38 · 40 · 42" },
  { id: 8, name: "Sapatilha laço", category: "Sapatos", style: "Coquette", store: "SHEIN", price: 68.90, oldPrice: 99.90, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=85", tag: "EM OFERTA", url: "https://br.shein.com/", description: "Sapatilha delicada para looks leves e femininos.", sizes: "34 · 35 · 36 · 37 · 38" }
];

const styles = ["Old Money", "Coquette", "Clean Girl", "Romântico", "Minimalista", "Vintage", "Streetwear", "Dark Feminine", "Y2K", "Casual", "Elegante", "Grunge", "Soft Girl", "Social", "Praia", "Academia", "Festa", "Inverno", "Verão", "Básico"];
const categories = ["Blusas", "Calças", "Saias", "Vestidos", "Shorts", "Sapatos", "Bolsas", "Acessórios", "Joias", "Casacos"];
const looks = [
  { name: "Romance em Paris", style: "Coquette", note: "Um toque de delicadeza para todos os dias", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85", pieces: "Blusa com laço · saia midi · sapatilha" },
  { name: "Clássica sem esforço", style: "Old Money", note: "Neutros, alfaiataria e elegância atemporal", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85", pieces: "Camisa branca · calça reta · bolsa estruturada" },
  { name: "Leveza natural", style: "Clean Girl", note: "O essencial, com intenção", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85", pieces: "Top minimalista · jeans reto · acessórios dourados" }
];

function money(value: number) { return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [activeStyle, setActiveStyle] = useState("Todos");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState("500");
  const [storeFilter, setStoreFilter] = useState("Todas");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStore, setNewStore] = useState("Shopee");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Olá, seja bem-vinda ao seu closet! Sou sua assistente de estilo TEAZ. Vamos encontrar o look perfeito? ✨" }
  ]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("teaz-favorites");
      if (saved) setFavorites(JSON.parse(saved));
      const savedProducts = localStorage.getItem("teaz-products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch { /* ignore invalid local cache */ }
  }, []);

  const filtered = useMemo(() => products.filter(p =>
    (activeStyle === "Todos" || p.style === activeStyle) &&
    (activeCategory === "Todas" || p.category === activeCategory) &&
    (storeFilter === "Todas" || p.store === storeFilter) &&
    p.price <= Number(maxPrice || 99999) &&
    (query.trim() === "" || (p.name + " " + p.style + " " + p.category + " " + p.store).toLowerCase().includes(query.toLowerCase()))
  ), [products, activeStyle, activeCategory, storeFilter, maxPrice, query]);

  function notify(text: string) { setToast(text); window.setTimeout(() => setToast(""), 2600); }
  function toggleFavorite(id: number) {
    const next = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
    setFavorites(next); localStorage.setItem("teaz-favorites", JSON.stringify(next));
    notify(next.includes(id) ? "Adicionado aos seus favoritos" : "Removido dos favoritos");
  }
  function saveProducts(next: Product[]) {
    setProducts(next); localStorage.setItem("teaz-products", JSON.stringify(next));
  }
  function addProduct() {
    if (!newName.trim() || !newPrice || !newImage.trim() || !newUrl.trim()) { notify("Preencha nome, preço, imagem e link."); return; }
    const item: Product = { id: Date.now(), name: newName, category: "Blusas", style: "Casual", store: newStore, price: Number(newPrice), image: newImage, url: newUrl, description: "Produto cadastrado pela administração TEAZ.", sizes: "Consulte a loja" };
    saveProducts([item, ...products]); setNewName(""); setNewPrice(""); setNewImage(""); setNewUrl(""); notify("Produto adicionado ao catálogo.");
  }
  async function sendMessage(text = chatInput) {
    if (!text.trim() || chatBusy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next); setChatInput(""); setChatBusy(true);
    try {
      const response = await fetch("/api/stylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, catalog: products.map(({ name, price, store, style, category, url }) => ({ name, price, store, style, category, url })) }) });
      const data = await response.json();
      setMessages([...next, { role: "assistant", content: data.reply || "Não consegui responder agora." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Não consegui conectar à consultoria agora. Tente novamente." }]);
    } finally { setChatBusy(false); }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <article className="product-card">
      <div className="product-image-wrap" onClick={() => setModalProduct(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button className={`heart-button ${favorites.includes(product.id) ? "is-favorite" : ""}`} aria-label="Favoritar produto" onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}><Heart size={17} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button>
        <button className="quick-view" onClick={e => { e.stopPropagation(); setModalProduct(product); }}>VER PEÇA</button>
      </div>
      <div className="product-info">
        <span className="product-meta">{product.store} <i>·</i> {product.style}</span>
        <h3>{product.name}</h3>
        <div className="price-row"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
        <button className="text-link" onClick={() => setModalProduct(product)}>Descobrir peça <ArrowUpRight size={14} /></button>
      </div>
    </article>
  );

  return (
    <main>
      <div className="announcement"><span>✧</span> SEU NOVO DESTINO DE DESCOBERTAS DE MODA <span>✧</span></div>
      <header className="site-header">
        <button className="mobile-menu-button icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu"><Menu /></button>
        <a className="brand" href="#"><span className="brand-mark">T</span><span>TEAZ<small>THE EDIT OF YOU</small></span></a>
        <div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="O que você está procurando?" /><kbd>⌕</kbd></div>
        <div className="header-actions">
          <button className="icon-button" onClick={() => { setActiveStyle("Todos"); setActiveCategory("Todas"); setQuery(""); document.getElementById("descobertas")?.scrollIntoView({ behavior: "smooth" }); }} aria-label="Favoritos"><Heart /><span className="count">{favorites.length}</span></button>
          <button className="icon-button" onClick={() => setShowAdmin(true)} aria-label="Área da proprietária"><Bookmark /></button>
          <button className="bag-button" onClick={() => notify("Suas compras são finalizadas diretamente nas lojas parceiras.")}><ShoppingBag size={17} /> <span>MEU CLOSET</span></button>
        </div>
      </header>
      <nav className={`main-nav ${mobileMenu ? "nav-open" : ""}`}>
        <a href="#closet" onClick={() => setMobileMenu(false)}>SEU CLOSET</a><a href="#looks" onClick={() => setMobileMenu(false)}>LOOKS TEAZ</a><a href="#estilos" onClick={() => setMobileMenu(false)}>EXPLORE SEU ESTILO</a><a href="#descobertas" onClick={() => setMobileMenu(false)}>DESCOBERTAS</a><a href="#ofertas" onClick={() => setMobileMenu(false)}>ACHADINHOS & OFERTAS</a><a href="#teaz-ai" onClick={() => setMobileMenu(false)}>TEAZ AI <Sparkles size={12} /></a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> UM CLOSET, INFINITAS POSSIBILIDADES <span /></div>
          <h1>Seu estilo,<br /><em>seu universo.</em></h1>
          <p>Descubra peças, encontre combinações e transforme seu guarda-roupa em uma expressão de quem você é.</p>
          <a className="primary-button" href="#looks">EXPLORAR LOOKS <ArrowUpRight size={16} /></a>
          <div className="hero-note"><Crown size={16} /> CURADORIA COM UM TOQUE EXTRAORDINÁRIO</div>
        </div>
        <div className="hero-art">
          <div className="hero-frame"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1100&q=90" alt="Editorial de moda em tons neutros" /></div>
          <div className="hero-stamp"><span>THE ART OF</span><strong>DRESSING</strong><i>✧</i></div>
          <div className="hero-caption">A ELEGÂNCIA ESTÁ NOS DETALHES.</div>
        </div>
        <div className="hero-vertical">TEAZ · CURATED FOR YOUR EVERYDAY</div>
      </section>

      <section className="trust-strip"><div><span>✧</span> DESCOBERTAS DE VÁRIAS LOJAS</div><div><span>✧</span> SEU ESTILO EM PRIMEIRO LUGAR</div><div><span>✧</span> INSPIRAÇÃO SEM LIMITES</div></section>

      <section className="section closet-section" id="closet">
        <div className="section-heading"><div><span className="eyebrow">ABRA AS PORTAS</span><h2>Seu <em>closet</em></h2></div><p>Um espaço para explorar novas versões de você.</p></div>
        <div className="closet-grid">
          {[
            ["Roupas","https://images.unsplash.com/photo-1483985988355-763728e1935b?w=650&q=85","Peças para todos os dias"],
            ["Sapatos & bolsas","https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=650&q=85","Os detalhes fazem o look"],
            ["Acessórios","https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=650&q=85","Seu toque de assinatura"],
            ["Joias","https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=650&q=85","Pequenos tesouros"]
          ].map(([name, image, note]) => <button className="closet-tile" key={name} onClick={() => { setActiveCategory(name === "Roupas" ? "Todas" : name === "Sapatos & bolsas" ? "Sapatos" : name); document.getElementById("descobertas")?.scrollIntoView({ behavior: "smooth" }); }}><img src={image} alt="" loading="lazy" /><span className="tile-number">0{["Roupas","Sapatos & bolsas","Acessórios","Joias"].indexOf(name)+1}</span><span className="tile-label"><strong>{name}</strong><small>{note}</small></span><ArrowUpRight className="tile-arrow" /></button>)}
        </div>
      </section>

      <section className="looks-section" id="looks">
        <div className="section section-inner">
          <div className="section-heading"><div><span className="eyebrow">INSPIRAÇÃO PRONTA PARA USAR</span><h2>Looks <em>TEAZ</em></h2></div><a className="text-link" href="#descobertas">Explorar peças <ArrowRight size={15} /></a></div>
          <div className="looks-grid">{looks.map((look, i) => <article className="look-card" key={look.name}><div className="look-image"><img src={look.image} alt={look.name} loading="lazy" /><span>LOOK 0{i+1}</span><button onClick={() => { setActiveStyle(look.style); document.getElementById("descobertas")?.scrollIntoView({ behavior: "smooth" }); }}>ENCONTRAR PEÇAS <ArrowUpRight size={13} /></button></div><div className="look-copy"><span>{look.style}</span><h3>{look.name}</h3><p>{look.note}</p><small>{look.pieces}</small></div></article>)}</div>
        </div>
      </section>

      <section className="section style-section" id="estilos">
        <div className="section-heading"><div><span className="eyebrow">SUA IDENTIDADE, SEU JEITO</span><h2>Explore seu <em>estilo</em></h2></div><p>Encontre a estética que conversa com você — ou misture todas.</p></div>
        <div className="style-pills">{["Todos", ...styles].map(style => <button key={style} className={activeStyle === style ? "active" : ""} onClick={() => { setActiveStyle(style); document.getElementById("descobertas")?.scrollIntoView({ behavior: "smooth" }); }}>{style}</button>)}</div>
        <div className="style-quote"><span>“</span><p>A moda passa. O estilo é a maneira como você conta sua história.</p><small>— TEAZ EDIT</small></div>
      </section>

      <section className="section discovery-section" id="descobertas">
        <div className="section-heading"><div><span className="eyebrow">PEÇAS ESCOLHIDAS PARA VOCÊ</span><h2>Descobertas <em>do closet</em></h2></div><span className="result-count">{filtered.length} PEÇAS ENCONTRADAS</span></div>
        <div className="filters"><div className="filter-label"><SlidersHorizontal size={16} /> FILTRAR POR</div><select value={activeCategory} onChange={e => setActiveCategory(e.target.value)}><option value="Todas">Todas as categorias</option>{categories.map(c => <option key={c}>{c}</option>)}</select><select value={storeFilter} onChange={e => setStoreFilter(e.target.value)}><option value="Todas">Todas as lojas</option>{["Shopee","SHEIN","Renner","C&A","Zara"].map(s => <option key={s}>{s}</option>)}</select><select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="500">Até R$ 500</option><option value="50">Até R$ 50</option><option value="100">Até R$ 100</option><option value="150">Até R$ 150</option><option value="250">Até R$ 250</option></select><button className="clear-filters" onClick={() => { setActiveCategory("Todas"); setStoreFilter("Todas"); setMaxPrice("500"); setActiveStyle("Todos"); setQuery(""); }}>Limpar filtros</button></div>
        {activeStyle !== "Todos" && <div className="active-filter">Estilo: {activeStyle} <button onClick={() => setActiveStyle("Todos")}><X size={13} /></button></div>}
        {filtered.length ? <div className="products-grid">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="empty-state"><Sparkles /><h3>Nenhuma peça encontrada</h3><p>Tente ajustar os filtros ou buscar por outro estilo.</p><button className="outline-button" onClick={() => { setActiveCategory("Todas"); setStoreFilter("Todas"); setActiveStyle("Todos"); setQuery(""); }}>Ver todas as peças</button></div>}
      </section>

      <section className="offer-band" id="ofertas"><div className="offer-copy"><span className="eyebrow">PEQUENOS ACHADOS, GRANDES ENCANTOS</span><h2>O luxo de encontrar<br /><em>o inesperado.</em></h2><p>Achadinhos e ofertas selecionados para deixar seu closet ainda mais interessante.</p><a href="#descobertas" className="primary-button">DESCOBRIR OFERTAS <ArrowUpRight size={16} /></a><small>*Preços e disponibilidade devem ser confirmados na loja parceira.</small></div><div className="offer-image"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" alt="Seleção de peças de moda" /></div></section>

      <section className="ai-section" id="teaz-ai"><div className="ai-orb"><Sparkles size={30} /><span>TEAZ</span><small>AI STYLIST</small></div><div className="ai-copy"><span className="eyebrow">SUA CONSULTORA PARTICULAR</span><h2>Um closet inteiro.<br /><em>Uma ideia de distância.</em></h2><p>Conte o que você procura, a ocasião ou o orçamento. A TEAZ AI ajuda a explorar combinações com as peças cadastradas no nosso closet.</p><button className="primary-button" onClick={() => setChatOpen(true)}>CONVERSAR COM A TEAZ AI <ArrowUpRight size={16} /></button><div className="ai-suggestions"><span>EXPERIMENTE:</span>{["Look coquette até R$ 150","Algo elegante para a noite","Ideias para a faculdade"].map(s => <button key={s} onClick={() => { setChatOpen(true); sendMessage(s); }}>{s}</button>)}</div></div></section>

      <section className="newsletter"><span className="eyebrow">CARTAS DO CLOSET</span><h2>Um pouco de inspiração<br /><em>na sua caixa de entrada.</em></h2><p>Novidades, tendências e achados especiais — com curadoria TEAZ.</p><form onSubmit={e => { e.preventDefault(); notify("Inscrição demonstrativa recebida. Configure um serviço de e-mail para ativá-la."); }}><input type="email" required placeholder="Seu melhor e-mail" /><button type="submit">QUERO RECEBER <ArrowRight size={15} /></button></form><small>Ao se inscrever, você concorda em receber novidades da TEAZ.</small></section>

      <footer className="footer"><div className="footer-top"><a className="brand footer-brand" href="#"><span className="brand-mark">T</span><span>TEAZ<small>THE EDIT OF YOU</small></span></a><p>Descobrir. Combinar. Expressar.<br />Seu estilo começa aqui.</p><div className="social"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a><button onClick={() => setShowAdmin(true)}>ÁREA DA PROPRIETÁRIA</button></div></div><div className="footer-bottom"><span>© 2026 TEAZ. TODOS OS DIREITOS RESERVADOS.</span><span>FEITO COM ✧ PARA QUEM AMA SE EXPRESSAR.</span><a href="#top">VOLTAR AO TOPO ↑</a></div></footer>

      {modalProduct && <div className="modal-backdrop" onClick={() => setModalProduct(null)}><div className="product-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModalProduct(null)}><X /></button><img src={modalProduct.image} alt={modalProduct.name} /><div className="modal-details"><span className="eyebrow">{modalProduct.store} · {modalProduct.style}</span><h2>{modalProduct.name}</h2><p>{modalProduct.description}</p><div className="modal-price">{money(modalProduct.price)} {modalProduct.oldPrice && <del>{money(modalProduct.oldPrice)}</del>}</div><small>Tamanhos informados: {modalProduct.sizes}</small><p className="disclaimer">Preço, estoque, tamanhos e condições podem mudar. Confirme as informações no site da loja.</p><a className="primary-button" href={modalProduct.url} target="_blank" rel="noreferrer">COMPRAR NA LOJA <ArrowUpRight size={16} /></a><button className="save-button" onClick={() => toggleFavorite(modalProduct.id)}><Heart size={16} /> {favorites.includes(modalProduct.id) ? "REMOVER DOS FAVORITOS" : "SALVAR NOS FAVORITOS"}</button></div></div></div>}

      {showAdmin && <div className="modal-backdrop" onClick={() => { setShowAdmin(false); setAdminUnlocked(false); }}><div className="admin-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowAdmin(false)}><X /></button><span className="eyebrow">TEAZ · BACKSTAGE</span><h2>Painel da <em>proprietária</em></h2>{!adminUnlocked ? <><p>Área de demonstração para gerenciamento do catálogo.</p><label>Senha de demonstração<input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Digite TEAZ-DEMO" /></label><button className="primary-button" onClick={() => { if (adminPassword === "TEAZ-DEMO") setAdminUnlocked(true); else notify("Senha de demonstração incorreta."); }}>ENTRAR NO PAINEL</button><small>Esta tela não é uma autenticação segura. Configure autenticação real antes de publicar.</small></> : <><div className="admin-stats"><div><strong>{products.length}</strong><span>PRODUTOS</span></div><div><strong>{favorites.length}</strong><span>FAVORITOS NESTE NAVEGADOR</span></div><div><strong>{looks.length}</strong><span>LOOKS EDITORIAIS</span></div></div><h3>Adicionar produto ao catálogo</h3><div className="admin-form"><label>Nome<input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex.: Vestido midi" /></label><label>Preço (R$)<input type="number" min="0" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="99.90" /></label><label>Loja<select value={newStore} onChange={e => setNewStore(e.target.value)}><option>Shopee</option><option>SHEIN</option><option>Renner</option><option>C&A</option><option>Zara</option></select></label><label>URL da imagem<input value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="https://..." /></label><label>Link de compra<input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." /></label><button className="primary-button" onClick={addProduct}>ADICIONAR PRODUTO <ArrowUpRight size={15} /></button></div><h3>Produtos cadastrados</h3><div className="admin-list">{products.map(p => <div key={p.id}><span>{p.name} · {money(p.price)}</span><button onClick={() => { saveProducts(products.filter(x => x.id !== p.id)); notify("Produto removido."); }}>Excluir</button></div>)}</div><small>Os dados desta demonstração ficam salvos apenas neste navegador. Para administração multiusuário e persistente, conecte um banco de dados e autenticação.</small></>}</div></div>}

      {chatOpen && <div className="chat-panel"><div className="chat-header"><div><Sparkles size={17} /><span>TEAZ AI<small>SUA ASSISTENTE DE ESTILO</small></span></div><button onClick={() => setChatOpen(false)}><X /></button></div><div className="chat-messages">{messages.map((m,i) => <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>)}{chatBusy && <div className="chat-bubble assistant">Preparando suas ideias ✧</div>}</div><div className="chat-prompts">{["Look coquette até R$ 150","O que combina com saia preta?"].map(s => <button key={s} onClick={() => sendMessage(s)}>{s}</button>)}</div><form className="chat-input" onSubmit={e => { e.preventDefault(); sendMessage(); }}><input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Conte o que você está procurando..." /><button disabled={chatBusy || !chatInput.trim()} aria-label="Enviar mensagem"><Send size={17} /></button></form><small className="chat-footnote">As sugestões usam o catálogo atual. A IA real depende da configuração da API.</small></div>}

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      <button className="floating-ai" onClick={() => setChatOpen(true)} aria-label="Abrir TEAZ AI"><WandSparkles size={19} /><span>TEAZ AI</span></button>
    </main>
  );
}