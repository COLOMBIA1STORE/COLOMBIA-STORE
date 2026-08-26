const PRODUCTS = [
  {
    name:"BALMIN Drip Tee",
    price:400,
    tag:"New",
    category:"new",
    images:[
      "assets/IMG_8433.jpeg",
      "assets/IMG_8427.jpeg",
      "assets/IMG_8421.jpeg",
      "assets/IMG_8435.jpeg"
    ]
  },
  {
    name:"Prada Classic Tee",
    price:400,
    tag:"Classic",
    category:"classic",
    images:[
      "assets/IMG_8376.jpeg",
      "assets/IMG_8373.jpeg",
      "assets/IMG_8370.jpeg",
      "assets/IMG_8372.jpeg"
    ]
  },
  {
    name:"MIU Black Classic",
    price:400,
    tag:"Classic",
    category:"classic",
    images:[
      "assets/IMG_8257.jpeg",
      "assets/IMG_8243.jpeg",
      "assets/IMG_8240.jpeg",
      "assets/IMG_8238.jpeg"
    ]
  },
  {
    name:"Classic Black Tee",
    price:400,
    tag:"Classic",
    category:"classic",
    images:[
      "assets/IMG_8378.jpeg",
      "assets/IMG_8379.jpeg",
      "assets/IMG_8381.jpeg"
    ]
  }
];

const WHATSAPP = "201145839208";

const SHIPPING = {
  "Cairo":50,
  "Giza":50,
  "Alexandria":150,
  "Qalyubia":150,
  "Ain Sokhna":150,
  "Other":150
};

const $ = id => document.getElementById(id);

let cart = JSON.parse(localStorage.getItem("colombia_cart") || "[]");
let wishlist = new Set(
  JSON.parse(localStorage.getItem("colombia_wishlist") || "[]")
);

let currentProduct = null;
let currentImage = 0;
let selectedSize = "";

function saveCart(){
  localStorage.setItem("colombia_cart", JSON.stringify(cart));
  updateCartCount();
}

function saveWishlist(){
  localStorage.setItem(
    "colombia_wishlist",
    JSON.stringify([...wishlist])
  );
}

function updateCartCount(){
  const count = cart.reduce((sum,item)=>sum + item.qty,0);

  if($("cartCount")){
    $("cartCount").textContent = count;
  }
}

function productCard(p,index){
  return `
    <article class="product" data-index="${index}">

      <span class="tag">${p.tag}</span>

      <button class="wish" data-wish="${index}">
        ${wishlist.has(index) ? "♥" : "♡"}
      </button>

      <img
        class="productImage"
        src="${p.images[0]}"
        alt="${p.name}"
        loading="lazy"
      >

      <div class="productInfo">
        <h3>${p.name}</h3>

        <div class="price">
          EGP ${p.price}
        </div>

        <div class="swatches">
          <i></i>
          <i class="white"></i>
        </div>

        <div class="sizes">
          M　 L　 XL　 XXL
        </div>

        <button class="buyButton" data-buy="${index}">
          🛍️ BUY NOW
        </button>
      </div>

    </article>
  `;
}

function render(list,id){
  const box = $(id);
  if(!box) return;

  box.innerHTML = list
    .map(p => productCard(p,PRODUCTS.indexOf(p)))
    .join("");

  box.querySelectorAll(".product").forEach(card => {

    card.addEventListener("click",e => {

      if(e.target.closest(".wish,.buyButton")) return;

      openProduct(
        PRODUCTS[Number(card.dataset.index)]
      );

    });

  });

  box.querySelectorAll("[data-wish]").forEach(btn => {

    btn.onclick = e => {

      e.stopPropagation();

      const i = Number(btn.dataset.wish);

      if(wishlist.has(i)){
        wishlist.delete(i);
      }else{
        wishlist.add(i);
      }

      saveWishlist();
      render(list,id);

    };

  });

  box.querySelectorAll("[data-buy]").forEach(btn => {

    btn.onclick = e => {

      e.stopPropagation();

      openProduct(
        PRODUCTS[Number(btn.dataset.buy)]
      );

    };

  });
}

function renderAll(){

  render(
    PRODUCTS.filter(p=>p.category==="new"),
    "newProducts"
  );

  render(
    PRODUCTS.filter(p=>p.category==="summer"),
    "summerProducts"
  );

  render(
    PRODUCTS.filter(p=>p.category==="classic"),
    "classicProducts"
  );

  render(
    PRODUCTS,
    "bestProducts"
  );

  render(
    PRODUCTS.filter(p=>p.category==="limited"),
    "limitedProducts"
  );

}

function openProduct(p){

  currentProduct = p;
  currentImage = 0;
  selectedSize = "";

  $("productModal").classList.add("open");

  $("productModal").setAttribute(
    "aria-hidden",
    "false"
  );

  $("modalTitle").textContent = p.name;
  $("modalPrice").textContent = "EGP " + p.price;
  $("modalTag").textContent = p.tag;

  updateGallery();

  document
    .querySelectorAll(".sizePicker button")
    .forEach(b => b.classList.remove("active"));

}

function updateGallery(){

  if(!currentProduct) return;

  $("modalImg").src =
    currentProduct.images[currentImage];

  $("modalImg").alt =
    currentProduct.name;

  $("thumbs").innerHTML =
    currentProduct.images.map((src,i)=>`
      <img
        src="${src}"
        data-thumb="${i}"
        alt="${currentProduct.name}"
      >
    `).join("");

  $("thumbs")
    .querySelectorAll("[data-thumb]")
    .forEach(t=>{

      t.onclick = () => {

        currentImage =
          Number(t.dataset.thumb);

        updateGallery();

      };

    });

}

function closeModal(){

  $("productModal").classList.remove("open");

  $("productModal").setAttribute(
    "aria-hidden",
    "true"
  );

}

function closeDrawer(){

  $("drawer").classList.remove("open");
  $("overlay").classList.remove("open");

}

if($("menuBtn")){
  $("menuBtn").onclick = () => {

    $("drawer").classList.add("open");
    $("overlay").classList.add("open");

  };
}

if($("closeMenu")){
  $("closeMenu").onclick = closeDrawer;
}

if($("overlay")){
  $("overlay").onclick = closeDrawer;
}

document
  .querySelectorAll("#drawer a")
  .forEach(a => {

    a.onclick = () => {

      closeDrawer();

      setTimeout(()=>{
        const target =
          document.querySelector(a.getAttribute("href"));

        if(target){
          target.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });
        }
      },100);

    };

  });

if($("searchBtn")){

  $("searchBtn").onclick = () => {

    $("searchBar").classList.toggle("open");

    if(
      $("searchBar").classList.contains("open")
    ){
      $("searchInput").focus();
    }

  };

}

if($("searchInput")){

  $("searchInput").addEventListener(
    "input",
    e => {

      const q =
        e.target.value
          .trim()
          .toLowerCase();

      const list =
        q
          ? PRODUCTS.filter(p =>
              p.name.toLowerCase().includes(q) ||
              p.tag.toLowerCase().includes(q)
            )
          : PRODUCTS;

      render(list,"bestProducts");

      location.hash = "bestsellers";

    }
  );

}

if($("wishBtn")){

  $("wishBtn").onclick = () => {

    const list =
      PRODUCTS.filter(
        (_,i)=>wishlist.has(i)
      );

    render(list,"bestProducts");

    location.hash =
      "bestsellers";

  };

}

function createCheckoutStyles(){

  if($("checkoutStyles")) return;

  const style =
    document.createElement("style");

  style.id = "checkoutStyles";

  style.textContent = `

    #checkoutPanel{
      position:fixed;
      inset:0;
      z-index:200;
      background:#050505;
      color:#fff;
      overflow:auto;
      display:none;
    }

    #checkoutPanel.open{
      display:block;
    }

    .checkoutInner{
      width:min(650px,100%);
      margin:auto;
      padding:22px 18px 110px;
    }

    .checkoutHeader{
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:20px;
    }

    .checkoutHeader h2{
      margin:0;
      font-size:25px;
    }

    .checkoutClose{
      width:40px;
      height:40px;
      border:1px solid #444;
      border-radius:50%;
      background:#111;
      color:#fff;
      font-size:26px;
    }

    .checkoutCard{
      background:#101010;
      border:1px solid #333;
      border-radius:17px;
      padding:15px;
      margin-bottom:13px;
    }

    .checkoutProduct{
      display:flex;
      gap:12px;
      align-items:center;
    }

    .checkoutProduct img{
      width:78px;
      height:90px;
      object-fit:cover;
      border-radius:10px;
    }

    .checkoutProduct h3{
      margin:0 0 5px;
      font-size:16px;
    }

    .checkoutProduct p{
      margin:3px 0;
      color:#aaa;
      font-size:13px;
    }

    .qtyControls{
      display:flex;
      align-items:center;
      gap:12px;
      margin-top:9px;
    }

    .qtyControls button{
      width:30px;
      height:30px;
      border:1px solid #555;
      border-radius:8px;
      background:#191919;
      color:#fff;
      font-size:18px;
    }

    .checkoutField{
      margin-bottom:13px;
    }

    .checkoutField label{
      display:block;
      margin-bottom:6px;
      font-size:13px;
      color:#bbb;
    }

    .checkoutField input,
    .checkoutField select{
      width:100%;
      height:46px;
      background:#171717;
      color:#fff;
      border:1px solid #444;
      border-radius:10px;
      padding:0 12px;
      outline:none;
    }

    .summaryRow{
      display:flex;
      justify-content:space-between;
      margin:11px 0;
      color:#ccc;
    }

    .summaryTotal{
      border-top:1px solid #333;
      padding-top:14px;
      margin-top:14px;
      font-size:20px;
      font-weight:900;
      color:#f7c400;
    }

    .confirmOrder{
      width:100%;
      height:52px;
      border:0;
      border-radius:12px;
      background:#f7c400;
      color:#000;
      font-weight:900;
      font-size:16px;
      margin-top:10px;
    }

    #orderSuccess{
      display:none;
      text-align:center;
      padding-top:30px;
    }

    #orderSuccess.open{
      display:block;
    }

    .orderCode{
      font-size:28px;
      font-weight:900;
      color:#f7c400;
      margin:15px 0;
    }

    .whatsappOrder{
      display:block;
      width:100%;
      padding:15px;
      border-radius:12px;
      background:#25D366;
      color:#fff;
      text-decoration:none;
      font-weight:900;
      margin-top:15px;
    }

    .emptyCart{
      text-align:center;
      padding:50px 15px;
      color:#aaa;
    }

  `;

  document.head.appendChild(style);

}

function createCheckout(){

  createCheckoutStyles();

  if($("checkoutPanel")) return;

  const panel =
    document.createElement("div");

  panel.id = "checkoutPanel";

  panel.innerHTML = `

    <div class="checkoutInner">

      <div class="checkoutHeader">
        <h2>🛍️ YOUR ORDER</h2>
        <button
          class="checkoutClose"
          id="checkoutClose"
        >×</button>
      </div>

      <div id="checkoutContent">

        <div id="checkoutItems"></div>

        <div class="checkoutCard">

          <div class="checkoutField">
            <label>Full Name</label>
            <input
              id="customerName"
              placeholder="Your full name"
            >
          </div>

          <div class="checkoutField">
            <label>Phone Number</label>
            <input
              id="customerPhone"
              type="tel"
              placeholder="01xxxxxxxxx"
            >
          </div>

          <div class="checkoutField">
            <label>Governorate</label>

            <select id="customerGovernorate">

              <option value="">
                Select governorate
              </option>

              <option>Cairo</option>
              <option>Giza</option>
              <option>Alexandria</option>
              <option>Qalyubia</option>
              <option>Ain Sokhna</option>
              <option>Other</option>

            </select>

          </div>

          <div class="checkoutField">
            <label>Address</label>

            <input
              id="customerAddress"
              placeholder="Full delivery address"
            >

          </div>

        </div>

        <div class="checkoutCard">

          <div class="summaryRow">
            <span>Subtotal</span>
            <strong id="checkoutSubtotal">
              EGP 0
            </strong>
          </div>

          <div class="summaryRow">
            <span>Shipping</span>
            <strong id="checkoutShipping">
              EGP 0
            </strong>
          </div>

          <div class="summaryRow summaryTotal">
            <span>Total</span>
            <strong id="checkoutTotal">
              EGP 0
            </strong>
          </div>

          <button
            class="confirmOrder"
            id="confirmOrder"
          >
            CONFIRM ORDER
          </button>

        </div>

      </div>

      <div id="orderSuccess">

        <div style="font-size:55px">
          ✅
        </div>

        <h2>ORDER CONFIRMED</h2>

        <p>
          Your order has been created successfully.
        </p>

        <div
          class="orderCode"
          id="successOrderCode"
        ></div>

        <p>
          Save this code to track your order.
        </p>

        <a
          id="whatsappOrder"
          class="whatsappOrder"
          target="_blank"
          rel="noopener"
        >
          💬 SEND ORDER TO WHATSAPP
        </a>

      </div>

    </div>
  `;

  document.body.appendChild(panel);

  $("checkoutClose").onclick =
    closeCheckout;

  $("customerGovernorate").onchange =
    updateCheckoutTotals;

  $("confirmOrder").onclick =
    confirmOrder;

}

function openCheckout(){

  createCheckout();

  $("checkoutPanel").classList.add("open");

  $("checkoutContent").style.display =
    "block";

  $("orderSuccess").classList.remove("open");

  renderCheckoutItems();

  updateCheckoutTotals();

}

function closeCheckout(){

  if($("checkoutPanel")){
    $("checkoutPanel")
      .classList.remove("open");
  }

}

function renderCheckoutItems(){

  const box =
    $("checkoutItems");

  if(!cart.length){

    box.innerHTML = `
      <div class="checkoutCard emptyCart">
        Your cart is empty 🛍️
      </div>
    `;

    return;

  }

  box.innerHTML = cart.map((item,index)=>`

    <div class="checkoutCard">

      <div class="checkoutProduct">

        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div style="flex:1">

          <h3>
            ${item.name}
          </h3>

          <p>
            Size: ${item.size}
          </p>

          <p>
            EGP ${item.price}
          </p>

          <div class="qtyControls">

            <button
              data-minus="${index}"
            >−</button>

            <strong>
              ${item.qty}
            </strong>

            <button
              data-plus="${index}"
            >+</button>

            <button
              data-remove="${index}"
              style="margin-left:auto"
            >🗑️</button>

          </div>

        </div>

      </div>

    </div>

  `).join("");

  box.querySelectorAll("[data-minus]")
    .forEach(btn=>{

      btn.onclick = ()=>{

        const i =
          Number(btn.dataset.minus);

        cart[i].qty--;

        if(cart[i].qty <= 0){
          cart.splice(i,1);
        }

        saveCart();
        renderCheckoutItems();
        updateCheckoutTotals();

      };

    });

  box.querySelectorAll("[data-plus]")
    .forEach(btn=>{

      btn.onclick = ()=>{

        const i =
          Number(btn.dataset.plus);

        cart[i].qty++;

        saveCart();
        renderCheckoutItems();
        updateCheckoutTotals();

      };

    });

  box.querySelectorAll("[data-remove]")
    .forEach(btn=>{

      btn.onclick = ()=>{

        const i =
          Number(btn.dataset.remove);

        cart.splice(i,1);

        saveCart();
        renderCheckoutItems();
        updateCheckoutTotals();

      };

    });

}

function getSubtotal(){

  return cart.reduce(
    (sum,item)=>
      sum + item.price * item.qty,
    0
  );

}

function getShipping(){

  const governorate =
    $("customerGovernorate")?.value;

  if(!governorate) return 0;

  return SHIPPING[governorate] || 150;

}

function updateCheckoutTotals(){

  const subtotal =
    getSubtotal();

  const shipping =
    getShipping();

  const total =
    subtotal + shipping;

  if($("checkoutSubtotal"))
    $("checkoutSubtotal").textContent =
      "EGP " + subtotal;

  if($("checkoutShipping"))
    $("checkoutShipping").textContent =
      "EGP " + shipping;

  if($("checkoutTotal"))
    $("checkoutTotal").textContent =
      "EGP " + total;

}

function generateOrderCode(){

  const random =
    Math.floor(
      10000 + Math.random()*90000
    );

  return "COL-" + random;

}

function confirmOrder(){

  if(!cart.length){

    alert("Your cart is empty.");

    return;

  }

  const name =
    $("customerName").value.trim();

  const phone =
    $("customerPhone").value.trim();

  const governorate =
    $("customerGovernorate").value;

  const address =
    $("customerAddress").value.trim();

  if(!name ||
     !phone ||
     !governorate ||
     !address){

    alert(
      "Please complete all delivery information."
    );

    return;

  }

  const orderCode =
    generateOrderCode();

  const subtotal =
    getSubtotal();

  const shipping =
    getShipping();

  const total =
    subtotal + shipping;

  const itemsText =
    cart.map(item =>
      `• ${item.name} | Size ${item.size} | Qty ${item.qty}`
    ).join("\n");

  const message =
`🛍️ NEW COLOMBIA STORE ORDER

Order Code: ${orderCode}

Customer:
${name}

Phone:
${phone}

Governorate:
${governorate}

Address:
${address}

Products:
${itemsText}

Subtotal:
EGP ${subtotal}

Shipping:
EGP ${shipping}

TOTAL:
EGP ${total}`;

  localStorage.setItem(
    "colombia_last_order",
    JSON.stringify({
      code:orderCode,
      name,
      phone,
      governorate,
      address,
      items:cart,
      subtotal,
      shipping,
      total,
      status:"Pending"
    })
  );

  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent(message);

  $("checkoutContent").style.display =
    "none";

  $("orderSuccess")
    .classList.add("open");

  $("successOrderCode")
    .textContent =
      orderCode;

  $("whatsappOrder").href =
    whatsappURL;

  cart = [];

  saveCart();

}

function addToCart(){

  if(!currentProduct) return;

  if(!selectedSize){

    alert(
      "Please choose a size first."
    );

    return;

  }

  const existing =
    cart.find(item =>
      item.name === currentProduct.name &&
      item.size === selectedSize
    );

  if(existing){

    existing.qty++;

  }else{

    cart.push({

      name:currentProduct.name,

      price:currentProduct.price,

      size:selectedSize,

      qty:1,

      image:currentProduct.images[0]

    });

  }

  saveCart();

  closeModal();

  openCheckout();

}

if($("cartBtn")){

  $("cartBtn").onclick = () => {

    openCheckout();

  };

}

if($("modalClose")){

  $("modalClose").onclick =
    closeModal;

}

if($("productModal")){

  $("productModal")
    .addEventListener("click",e=>{

      if(
        e.target === $("productModal")
      ){
        closeModal();
      }

    });

}

if($("prevImg")){

  $("prevImg").onclick = () => {

    if(!currentProduct) return;

    currentImage =
      (currentImage -
       1 +
       currentProduct.images.length)
      %
      currentProduct.images.length;

    updateGallery();

  };

}

if($("nextImg")){

  $("nextImg").onclick = () => {

    if(!currentProduct) return;

    currentImage =
      (currentImage + 1) %
      currentProduct.images.length;

    updateGallery();

  };

}

document
  .querySelectorAll(".sizePicker button")
  .forEach(btn=>{

    btn.onclick = () => {

      selectedSize =
        btn.dataset.size;

      document
        .querySelectorAll(".sizePicker button")
        .forEach(b =>
          b.classList.remove("active")
        );

      btn.classList.add("active");

    };

  });

if($("modalBuy")){

  $("modalBuy").textContent =
    "🛍️ ADD TO CART";

  $("modalBuy").onclick =
    addToCart;

}

if($("trackButton")){

  $("trackButton").onclick = () => {

    const code =
      $("orderInput")
        .value
        .trim()
        .toUpperCase();

    const lastOrder =
      JSON.parse(
        localStorage.getItem(
          "colombia_last_order"
        ) || "null"
      );

    if(!code){

      $("trackMessage").textContent =
        "Please enter your order number.";

      return;

    }

    if(
      lastOrder &&
      lastOrder.code === code
    ){

      $("trackMessage").textContent =
        `Order #${code} — Status: ${lastOrder.status}.`;

    }else{

      $("trackMessage").textContent =
        `Order #${code} — Please contact us on WhatsApp for an update.`;

    }

  };

}

if($("accountButton")){

  $("accountButton").onclick = () => {

    openCheckout();

  };

}

createCheckout();
renderAll();
updateCartCount();
