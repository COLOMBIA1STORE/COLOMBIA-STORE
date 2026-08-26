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

const $ = id => document.getElementById(id);

let wishlist = new Set();
let currentProduct = null;
let currentImage = 0;
let selectedSize = "";

let cart = JSON.parse(localStorage.getItem("colombiaCart") || "[]");

function saveCart(){
  localStorage.setItem("colombiaCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  $("cartCount").textContent = cart.reduce((sum,item)=>sum + item.qty,0);
}

function productCard(p,index){

  return `
  <article class="product" data-index="${index}">

    <span class="tag ${p.tag==="Best Seller"?"best":""}">
      ${p.tag}
    </span>

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
        🛍 BUY NOW
      </button>

    </div>

  </article>`;
}

function render(list,id){

  const box = $(id);

  if(!box) return;

  box.innerHTML = list
    .map(p => productCard(p,PRODUCTS.indexOf(p)))
    .join("");

  box.querySelectorAll(".product").forEach(card=>{

    card.addEventListener("click",e=>{

      if(e.target.closest(".wish,.buyButton")) return;

      const index = Number(card.dataset.index);

      openProduct(PRODUCTS[index]);

    });

  });

  box.querySelectorAll("[data-wish]").forEach(btn=>{

    btn.onclick = e=>{

      e.stopPropagation();

      const i = Number(btn.dataset.wish);

      if(wishlist.has(i)){
        wishlist.delete(i);
      }else{
        wishlist.add(i);
      }

      render(list,id);

    };

  });

  box.querySelectorAll("[data-buy]").forEach(btn=>{

    btn.onclick = e=>{

      e.stopPropagation();

      const i = Number(btn.dataset.buy);

      openProduct(PRODUCTS[i]);

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
  $("productModal").setAttribute("aria-hidden","false");

  $("modalTitle").textContent = p.name;
  $("modalPrice").textContent = "EGP " + p.price;

  if($("modalTag")){
    $("modalTag").textContent = p.tag;
  }

  updateGallery();

  document
    .querySelectorAll(".sizePicker button")
    .forEach(b=>b.classList.remove("active"));
}

function updateGallery(){

  if(!currentProduct) return;

  $("modalImg").src =
    currentProduct.images[currentImage];

  $("modalImg").alt =
    currentProduct.name;

  if($("thumbs")){

    $("thumbs").innerHTML =
      currentProduct.images
      .map((src,i)=>`
        <img
          src="${src}"
          data-thumb="${i}"
          alt="${currentProduct.name}"
        >
      `)
      .join("");

    $("thumbs")
      .querySelectorAll("[data-thumb]")
      .forEach(t=>{

        t.onclick = ()=>{

          currentImage =
            Number(t.dataset.thumb);

          updateGallery();

        };

      });

  }
}

function closeModal(){

  $("productModal").classList.remove("open");

  $("productModal")
    .setAttribute("aria-hidden","true");
}

function closeDrawer(){

  $("drawer").classList.remove("open");

  $("overlay").classList.remove("open");
}

/* MENU */

$("menuBtn").onclick = ()=>{

  $("drawer").classList.add("open");

  $("overlay").classList.add("open");

};

$("closeMenu").onclick = closeDrawer;

$("overlay").onclick = closeDrawer;

document
  .querySelectorAll("#drawer a")
  .forEach(a=>a.onclick=closeDrawer);


/* SEARCH */

$("searchBtn").onclick = ()=>{

  $("searchBar").classList.toggle("open");

  if(
    $("searchBar")
    .classList
    .contains("open")
  ){

    $("searchInput").focus();

  }

};

$("searchInput").addEventListener("input",e=>{

  const q =
    e.target.value
    .trim()
    .toLowerCase();

  const list = q
    ? PRODUCTS.filter(p=>
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
      )
    : PRODUCTS;

  render(list,"bestProducts");

  location.hash = "bestsellers";

});


/* WISHLIST */

$("wishBtn").onclick = ()=>{

  const list =
    PRODUCTS.filter(
      (_,i)=>wishlist.has(i)
    );

  render(list,"bestProducts");

  location.hash = "bestsellers";

};


/* CART */

function openCart(){

  let old = document.getElementById("cartPanel");

  if(old) old.remove();

  const panel =
    document.createElement("div");

  panel.id = "cartPanel";

  panel.innerHTML = `

    <div class="cartOverlay"></div>

    <div class="cartDrawer">

      <button class="cartClose">×</button>

      <h2>YOUR CART</h2>

      <div class="cartItems"></div>

      <div class="cartTotal"></div>

      <button class="checkoutButton">
        CONTINUE TO CHECKOUT →
      </button>

    </div>
  `;

  document.body.appendChild(panel);

  renderCart();

  panel
    .querySelector(".cartClose")
    .onclick = ()=>panel.remove();

  panel
    .querySelector(".cartOverlay")
    .onclick = ()=>panel.remove();

  panel
    .querySelector(".checkoutButton")
    .onclick = openCheckout;

}

function renderCart(){

  const panel =
    document.getElementById("cartPanel");

  if(!panel) return;

  const itemsBox =
    panel.querySelector(".cartItems");

  const totalBox =
    panel.querySelector(".cartTotal");

  if(cart.length === 0){

    itemsBox.innerHTML =
      `<p>Your cart is empty.</p>`;

    totalBox.textContent = "";

    panel
      .querySelector(".checkoutButton")
      .style.display = "none";

    return;
  }

  itemsBox.innerHTML =
    cart.map((item,index)=>`

      <div class="cartItem">

        <img src="${item.image}">

        <div>

          <strong>${item.name}</strong>

          <p>Size: ${item.size}</p>

          <p>EGP ${item.price}</p>

          <button data-remove="${index}">
            Remove
          </button>

        </div>

      </div>

    `).join("");

  const total =
    cart.reduce(
      (sum,item)=>
        sum + item.price * item.qty,
      0
    );

  totalBox.textContent =
    "TOTAL: EGP " + total;

  panel
    .querySelectorAll("[data-remove]")
    .forEach(btn=>{

      btn.onclick = ()=>{

        cart.splice(
          Number(btn.dataset.remove),
          1
        );

        saveCart();

        renderCart();

      };

    });

}


/* CART BUTTON */

$("cartBtn").onclick = openCart;


/* PRODUCT MODAL */

$("modalClose").onclick = closeModal;

$("productModal").addEventListener(
  "click",
  e=>{
    if(e.target === $("productModal")){
      closeModal();
    }
  }
);


/* GALLERY */

if($("prevImg")){

  $("prevImg").onclick = ()=>{

    currentImage =
      (currentImage - 1 +
      currentProduct.images.length)
      %
      currentProduct.images.length;

    updateGallery();

  };

}

if($("nextImg")){

  $("nextImg").onclick = ()=>{

    currentImage =
      (currentImage + 1)
      %
      currentProduct.images.length;

    updateGallery();

  };

}


/* SIZE */

document
  .querySelectorAll(".sizePicker button")
  .forEach(btn=>{

    btn.onclick = ()=>{

      selectedSize =
        btn.dataset.size;

      document
        .querySelectorAll(".sizePicker button")
        .forEach(b=>
          b.classList.remove("active")
        );

      btn.classList.add("active");

    };

  });


/* BUY NOW */

$("modalBuy").onclick = ()=>{

  if(!selectedSize){

    alert("Please choose a size first.");

    return;

  }

  const existing =
    cart.find(item=>
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

  openCart();

};


/* CHECKOUT */

function openCheckout(){

  if(cart.length === 0){

    alert("Your cart is empty.");

    return;

  }

  const panel =
    document.getElementById("cartPanel");

  if(panel) panel.remove();

  const checkout =
    document.createElement("div");

  checkout.id = "checkoutPanel";

  checkout.innerHTML = `

    <div class="checkoutOverlay"></div>

    <div class="checkoutBox">

      <button class="checkoutClose">×</button>

      <h2>CHECKOUT</h2>

      <p>Enter your information to complete your order.</p>

      <input
        id="customerName"
        placeholder="Full name"
      >

      <input
        id="customerPhone"
        type="tel"
        placeholder="Phone number"
      >

      <select id="customerGovernorate">

        <option value="">
          Select Governorate
        </option>

        <option>Cairo</option>
        <option>Giza</option>
        <option>Alexandria</option>
        <option>Qalyubia</option>
        <option>Ain Sokhna</option>

      </select>

      <textarea
        id="customerAddress"
        placeholder="Full address"
      ></textarea>

      <div class="checkoutSummary">
        ${cart.map(item=>`
          <p>
            ${item.name}
            — ${item.size}
            — EGP ${item.price}
          </p>
        `).join("")}
      </div>

      <button id="sendOrder">
        CONFIRM ORDER →
      </button>

    </div>
  `;

  document.body.appendChild(checkout);

  checkout
    .querySelector(".checkoutClose")
    .onclick = ()=>checkout.remove();

  checkout
    .querySelector(".checkoutOverlay")
    .onclick = ()=>checkout.remove();

  checkout
    .querySelector("#sendOrder")
    .onclick = sendOrderToWhatsApp;

}


/* SEND ORDER */

function sendOrderToWhatsApp(){

  const name =
    $("customerName").value.trim();

  const phone =
    $("customerPhone").value.trim();

  const governorate =
    $("customerGovernorate").value;

  const address =
    $("customerAddress").value.trim();

  if(!name || !phone || !governorate || !address){

    alert("Please complete all information.");

    return;

  }

  const orderCode =
    "COL-" +
    Date.now()
    .toString()
    .slice(-6);

  const items =
    cart.map(item=>
      `• ${item.name} | Size ${item.size} | EGP ${item.price}`
    ).join("\n");

  const total =
    cart.reduce(
      (sum,item)=>
        sum + item.price * item.qty,
      0
    );

  const message =

`COLOMBIA STORE — NEW ORDER

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
${items}

Total:
EGP ${total}`;

  const whatsappNumber =
    "201145839208";

  const url =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(url,"_blank");

  cart = [];

  saveCart();

  $("checkoutPanel")?.remove();

  alert(
    "Your order code is: " +
    orderCode +
    "\n\nKeep this code to track your order."
  );

}


/* TRACK ORDER */

$("trackButton").onclick = ()=>{

  const n =
    $("orderInput").value.trim();

  $("trackMessage").textContent =
    n
      ? `Order #${n} — Your order is being prepared.`
      : "Please enter your order number.";

};


/* ACCOUNT */

$("accountButton").onclick = ()=>{

  alert("Account / Guest checkout");

};


/* START */

renderAll();

updateCartCount();
