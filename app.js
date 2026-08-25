const PRODUCTS=[
{name:"Prada Figure Tee",price:400,image:"assets/product-prada.jpg",tag:"Best Seller"},
{name:"BALMIN Drip Tee",price:400,image:"assets/product-BALMIN.jpg",tag:"New"}
];

let cart=0,wishlist=new Set();

const $=id=>document.getElementById(id);

function renderProducts(list=PRODUCTS){
  $("products").innerHTML=list.map((p,i)=>`
  <article class="product" data-index="${i}">
    <span class="tag ${p.tag==="New"?"new":""}">${p.tag}</span>
    <button class="wish" data-wish="${i}">${wishlist.has(i)?"♥":"♡"}</button>
    <img class="productImage" src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="productInfo">
      <h3>${p.name}</h3>
      <div class="price">EGP ${p.price}</div>
      <div class="swatches"><i></i><i class="white"></i></div>
      <div class="sizes">M　 L　 XL　 XXL</div>
      <button class="buyButton" data-buy="${i}">🛍 BUY NOW</button>
    </div>
  </article>`).join("");

  document.querySelectorAll(".product").forEach(card=>{
    card.addEventListener("click",e=>{
      if(e.target.closest(".wish,.buyButton")) return;
      openProduct(PRODUCTS[Number(card.dataset.index)]);
    });
  });
  document.querySelectorAll("[data-wish]").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.stopPropagation();
      const i=Number(btn.dataset.wish);
      wishlist.has(i)?wishlist.delete(i):wishlist.add(i);
      renderProducts(list);
    });
  });
  document.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.stopPropagation();
      openProduct(PRODUCTS[Number(btn.dataset.buy)]);
    });
  });
}

function openProduct(p){
  $("modalImg").src=p.image;
  $("modalImg").alt=p.name;
  $("modalTitle").textContent=p.name;
  $("modalPrice").textContent="EGP "+p.price;
  $("productModal").classList.add("open");
}

function closeDrawer(){
  $("drawer").classList.remove("open");
  $("overlay").classList.remove("open");
}

$("menuBtn").onclick=()=>{
  $("drawer").classList.add("open");
  $("overlay").classList.add("open");
};
$("closeMenu").onclick=closeDrawer;
$("overlay").onclick=closeDrawer;

document.querySelectorAll("#drawer a").forEach(a=>a.onclick=closeDrawer);

$("searchBtn").onclick=()=>{
  $("searchBar").classList.toggle("open");
  if($("searchBar").classList.contains("open")){
    $("searchInput").focus();
  }
};

$("searchInput").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  const list=q?PRODUCTS.filter(p=>
    p.name.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q)
  ):PRODUCTS;
  renderProducts(list);
});

$("wishBtn").onclick=()=>{
  renderProducts(PRODUCTS.filter((_,i)=>wishlist.has(i)));
  location.hash="bestsellers";
};

$("cartBtn").onclick=()=>{
  alert(cart?`Your cart has ${cart} item(s).`:"Your cart is empty.");
};

$("modalClose").onclick=()=>$("productModal").classList.remove("open");

$("modalBuy").onclick=()=>{
  cart++;
  $("cartCount").textContent=cart;
  $("productModal").classList.remove("open");
  location.hash="track";
};

$("trackButton").onclick=()=>{
  const n=$("orderInput").value.trim();
  $("trackMessage").textContent=n
    ? `Order #${n} — Your order is being prepared.`
    : "Please enter your order number.";
};

$("accountButton").onclick=()=>{
  alert("Account / Guest checkout");
};

renderProducts();
