const PRODUCTS = [
  {
    name:"BALMIN Drip Tee", price:400, tag:"New", category:"new",
    images:["assets/IMG_8433.jpeg","assets/IMG_8427.jpeg","assets/IMG_8421.jpeg","assets/IMG_8435.jpeg"]
  },
  {
    name:"Prada Classic Tee", price:400, tag:"Classic", category:"classic",
    images:["assets/IMG_8376.jpeg","assets/IMG_8373.jpeg","assets/IMG_8370.jpeg","assets/IMG_8372.jpeg"]
  },
  {
    name:"MIU Black Classic", price:400, tag:"Classic", category:"classic",
    images:["assets/IMG_8257.jpeg","assets/IMG_8243.jpeg","assets/IMG_8240.jpeg","assets/IMG_8238.jpeg"]
  },
  {
    name:"Classic Black Tee", price:400, tag:"Classic", category:"classic",
    images:["assets/IMG_8378.jpeg","assets/IMG_8379.jpeg","assets/IMG_8381.jpeg"]
  }
];

const $ = id => document.getElementById(id);
let cart = 0;
let wishlist = new Set();
let currentProduct = null;
let currentImage = 0;
let selectedSize = "";

function productCard(p, index){
  return `<article class="product" data-index="${index}">
    <span class="tag ${p.tag==="Best Seller"?"best":""}">${p.tag}</span>
    <button class="wish" data-wish="${index}">${wishlist.has(index)?"♥":"♡"}</button>
    <img class="productImage" src="${p.images[0]}" alt="${p.name}" loading="lazy">
    <div class="productInfo">
      <h3>${p.name}</h3>
      <div class="price">EGP ${p.price}</div>
      <div class="swatches"><i></i><i class="white"></i></div>
      <div class="sizes">M　 L　 XL　 XXL</div>
      <button class="buyButton" data-buy="${index}">🛍 BUY NOW</button>
    </div>
  </article>`;
}

function render(list, id){
  const box=$(id);
  box.innerHTML=list.map(p=>productCard(p, PRODUCTS.indexOf(p))).join("");
  box.querySelectorAll(".product").forEach(card=>{
    card.addEventListener("click",e=>{
      if(e.target.closest(".wish,.buyButton")) return;
      openProduct(PRODUCTS[Number(card.dataset.index)]);
    });
  });
  box.querySelectorAll("[data-wish]").forEach(btn=>{
    btn.onclick=e=>{
      e.stopPropagation();
      const i=Number(btn.dataset.wish);
      wishlist.has(i)?wishlist.delete(i):wishlist.add(i);
      render(list,id);
    };
  });
  box.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.onclick=e=>{
      e.stopPropagation();
      openProduct(PRODUCTS[Number(btn.dataset.buy)]);
    };
  });
}

function renderAll(){
  render(PRODUCTS.filter(p=>p.category==="new"),"newProducts");
  render(PRODUCTS.filter(p=>p.category==="summer"),"summerProducts");
  render(PRODUCTS.filter(p=>p.category==="classic"),"classicProducts");
  render(PRODUCTS,"bestProducts");
  render(PRODUCTS.filter(p=>p.category==="limited"),"limitedProducts");
}
function openProduct(p){
  currentProduct=p; currentImage=0; selectedSize="";
  $("productModal").classList.add("open");
  $("productModal").setAttribute("aria-hidden","false");
  $("modalTitle").textContent=p.name;
  $("modalPrice").textContent="EGP "+p.price;
  $("modalTag").textContent=p.tag;
  updateGallery();
  document.querySelectorAll(".sizePicker button").forEach(b=>b.classList.remove("active"));
}
function updateGallery(){
  $("modalImg").src=currentProduct.images[currentImage];
  $("modalImg").alt=currentProduct.name;
  $("thumbs").innerHTML=currentProduct.images.map((src,i)=>
    `<img src="${src}" data-thumb="${i}" alt="">`).join("");
  $("thumbs").querySelectorAll("[data-thumb]").forEach(t=>{
    t.onclick=()=>{currentImage=Number(t.dataset.thumb);updateGallery();}
  });
}
function closeModal(){
  $("productModal").classList.remove("open");
  $("productModal").setAttribute("aria-hidden","true");
}
function closeDrawer(){
  $("drawer").classList.remove("open");
  $("overlay").classList.remove("open");
}
$("menuBtn").onclick=()=>{$("drawer").classList.add("open");$("overlay").classList.add("open");};
$("closeMenu").onclick=closeDrawer;
$("overlay").onclick=closeDrawer;
document.querySelectorAll("#drawer a").forEach(a=>a.onclick=closeDrawer);

$("searchBtn").onclick=()=>{
  $("searchBar").classList.toggle("open");
  if($("searchBar").classList.contains("open")) $("searchInput").focus();
};
$("searchInput").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  const list=q?PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.tag.toLowerCase().includes(q)):PRODUCTS;
  render(list,"bestProducts");
  location.hash="bestsellers";
});
$("wishBtn").onclick=()=>{
  const list=PRODUCTS.filter((_,i)=>wishlist.has(i));
  render(list,"bestProducts");
  location.hash="bestsellers";
};
$("cartBtn").onclick=()=>alert(cart?`Your cart has ${cart} item(s).`:"Your cart is empty.");
$("modalClose").onclick=closeModal;
$("productModal").addEventListener("click",e=>{if(e.target===$("productModal"))closeModal();});
$("prevImg").onclick=()=>{currentImage=(currentImage-1+currentProduct.images.length)%currentProduct.images.length;updateGallery();};
$("nextImg").onclick=()=>{currentImage=(currentImage+1)%currentProduct.images.length;updateGallery();};
document.querySelectorAll(".sizePicker button").forEach(btn=>btn.onclick=()=>{
  selectedSize=btn.dataset.size;
  document.querySelectorAll(".sizePicker button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
});
$("modalBuy").onclick=()=>{
  if(!selectedSize){alert("Please choose a size first.");return;}
  cart++; $("cartCount").textContent=cart; closeModal();
  location.hash="track";
  alert(`Added ${currentProduct.name} — Size ${selectedSize}. Checkout will be connected in the next step.`);
};
$("trackButton").onclick=()=>{
  const n=$("orderInput").value.trim();
  $("trackMessage").textContent=n?`Order #${n} — Your order is being prepared.`:"Please enter your order number.";
};
$("accountButton").onclick=()=>alert("Account / Guest checkout");

renderAll();
