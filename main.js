const API_PRODUCTS = [];
const productsEl = document.getElementById('products');
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const langSelect = document.getElementById('lang');

let cart = {}; // {id: qty}
let lang = 'fr';

langSelect.addEventListener('change', ()=>{ lang = langSelect.value; renderStaticText(); renderProducts(); renderCart(); });
function renderStaticText(){
  document.querySelectorAll('[data-fr]').forEach(el=>{
    el.textContent = el.getAttribute(`data-${lang}`);
  });
}


}

function formatPrice(cents){ return (cents/100).toFixed(2) + ' €'; }

function renderProducts(){
  productsEl.innerHTML = '';
  API_PRODUCTS.forEach(p=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name[lang]}"/>
      <h3>${p.name[lang]}</h3>
      <p>${p.desc[lang]}</p>
      <div class="price">${formatPrice(p.price_cents)}</div>
      <button data-id="${p.id}" data-action="add">${lang === 'fr' ? 'Ajouter' : 'Add to cart'}</button>
    `;
    productsEl.appendChild(div);
  });
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  const entries = Object.entries(cart);
  if(entries.length === 0){
    cartItemsEl.innerHTML = `<li>${lang === 'fr' ? 'Panier vide' : 'Cart is empty'}</li>`;
    checkoutBtn.disabled = true;
    totalEl.textContent = lang === 'fr' ? 'Total: 0,00 €' : 'Total: €0.00';
    return;
  }
  let total = 0;
  entries.forEach(([id, qty])=>{
    const p = API_PRODUCTS.find(x=>x.id===id);
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.name[lang]} × ${qty}</span><span>${formatPrice(p.price_cents * qty)}</span>`;
    cartItemsEl.appendChild(li);
    total += p.price_cents * qty;
  });
  totalEl.textContent = (lang === 'fr' ? 'Total: ' : 'Total: ') + formatPrice(total);
  checkoutBtn.disabled = false;
  checkoutBtn.textContent = lang === 'fr' ? 'Passer au paiement' : 'Checkout';
}

productsEl.addEventListener('click', (e)=>{
  if(e.target.tagName === 'BUTTON'){
    const id = e.target.dataset.id;
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
  }
});

checkoutBtn.addEventListener('click', async ()=>{
  const items = Object.entries(cart).map(([id, qty])=>({id, quantity: qty}));
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = lang === 'fr' ? 'Redirection...' : 'Redirecting...';
  try{
    const res = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    if(data.url){
      window.location = data.url;
    } else {
      alert('Erreur: ' + (data.error?.message || 'unknown'));
    }
  }catch(err){
    alert('Erreur réseau: ' + err.message);
  }finally{
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = lang === 'fr' ? 'Passer au paiement' : 'Checkout';
  }
});

// init
renderStaticText();

