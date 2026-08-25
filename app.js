const PRODUCTS=[
{name:"Prada Classic Tee",price:400,images:["assets/IMG_8376.jpeg","assets/IMG_8373.jpeg","assets/IMG_8370.jpeg","assets/IMG_8372.jpeg"],tag:"Best Seller"},
{name:"BALMIN Drip Tee",price:400,images:["assets/IMG_8433.jpeg","assets/IMG_8427.jpeg","assets/IMG_8421.jpeg","assets/IMG_8435.jpeg"],tag:"New"},
{name:"MIU Black Classic Tee",price:400,images:["assets/IMG_8257.jpeg","assets/IMG_8243.jpeg","assets/IMG_8240.jpeg","assets/IMG_8238.jpeg"],tag:"Classic"},
{name:"Black Classic Tee",price:400,images:["assets/IMG_8378.jpeg","assets/IMG_8379.jpeg","assets/IMG_8381.jpeg"],tag:"Classic"}
];
let cart=0,wishlist=new Set(),currentProduct=null,currentImage=0;
const $=id=>document.getElementById(id);

function renderProducts(list=PRODUCTS){
 $("products").innerHTML=list.map((p,i)=>`<article class="product" data-index="${i}">
 <span class="tag ${p.tag==="New"?"new":""}">${p.tag}</span>
 <button class="wish" data-wish="${i}">${wishlist.has(i)?"♥":"♡"}</button>
 <img class="productImage" src="${p.images[0]}" alt="${p.name}" loading="lazy">
 <div class="productInfo"><h3>${p.name}</h3><div class="price">EGP ${p.price}</div>
 <div class="swatches"><i></i><i class="white"></i></div><div class="sizes">M　 L　 XL　 XXL</div>
 <button class="buyButton" data-buy="${i}">🛍 BUY NOW</button></div></article>`).join("");

 document.querySelectorAll(".product").forEach(card=>card.onclick=e=>{
   if(e.target.closest(".wish,.buyButton"))return; openProduct(PRODUCTS[+card.dataset.index]);
 });
 document.querySelectorAll("[data-wish]").forEach(b=>b.onclick=e=>{
   e.stopPropagation();let i=+b.dataset.wish;wishlist.has(i)?wishlist.delete(i):wishlist.add(i);renderProducts(list);
 });
 document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=e=>{
   e.stopPropagation();openProduct(PRODUCTS[+b.dataset.buy]);
 });
}

function openProduct(p){currentProduct=p;currentImage=0;$("productModal").classList.add("open");$("modalTitle").textContent=p.name;$("modalPrice").textContent="EGP "+p.price;renderGallery();}
function renderGallery(){
 $("modalImg").src=currentProduct.images[currentImage];$("modalImg").alt=currentProduct.name;
 $("modalThumbs").innerHTML=currentProduct.images.map((s,i)=>`<button class="modalThumb ${i===currentImage?"active":""}" data-thumb="${i}"><img src="${s}" alt=""></button>`).join("");
 document.querySelectorAll("[data-thumb]").forEach(b=>b.onclick=()=>{currentImage=+b.dataset.thumb;renderGallery();});
}
function nextImage(){currentImage=(currentImage+1)%currentProduct.images.length;renderGallery();}
function prevImage(){currentImage=(currentImage-1+currentProduct.images.length)%currentProduct.images.length;renderGallery();}
function closeDrawer(){$("drawer").classList.remove("open");$("overlay").classList.remove("open");}

$("menuBtn").onclick=()=>{$("drawer").classList.add("open");$("overlay").classList.add("open");};
$("closeMenu").onclick=closeDrawer;$("overlay").onclick=closeDrawer;
document.querySelectorAll("#drawer a").forEach(a=>a.onclick=closeDrawer);
$("searchBtn").onclick=()=>{$("searchBar").classList.toggle("open");if($("searchBar").classList.contains("open"))$("searchInput").focus();};
$("searchInput").oninput=e=>{let q=e.target.value.toLowerCase().trim();renderProducts(q?PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.tag.toLowerCase().includes(q)):PRODUCTS);};
$("wishBtn").onclick=()=>{renderProducts(PRODUCTS.filter((_,i)=>wishlist.has(i)));location.hash="bestsellers";};
$("cartBtn").onclick=()=>alert(cart?`Your cart has ${cart} item(s).`:"Your cart is empty.");
$("modalClose").onclick=()=>$("productModal").classList.remove("open");
$("modalNext").onclick=nextImage;$("modalPrev").onclick=prevImage;
$("productModal").onclick=e=>{if(e.target===$("productModal"))$("productModal").classList.remove("open");};
$("modalBuy").onclick=()=>{cart++;$("cartCount").textContent=cart;$("productModal").classList.remove("open");location.hash="track";};
$("trackButton").onclick=()=>{let n=$("orderInput").value.trim();$("trackMessage").textContent=n?`Order #${n} — Your order is being prepared.`:"Please enter your order number.";};
$("accountButton").onclick=()=>alert("Account / Guest checkout");
renderProducts();