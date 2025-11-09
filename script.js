// Inicia o carousel automaticamente e pausa ao passar o mouse
$(document).ready(function () {
  $('#bannerCarousel').carousel({
    interval: 4000,
    pause: 'hover'
  });
});


// Script de filtro
const products = document.querySelectorAll('.product-card');
const brandRadios = document.querySelectorAll('input[name="brand"]');
const categoryRadios = document.querySelectorAll('input[name="category"]');
const maxPriceInput = document.getElementById('maxPrice');

let selectedBrand = 'all';
let selectedCategory = 'all';
let maxPrice = Infinity;

// Função principal de filtro
function applyFilters() {
  const selectedBrand = document.querySelector('input[name="brand"]:checked').value;
  const selectedCategory = document.querySelector('input[name="category"]:checked').value;
  const maxPriceInput = document.getElementById('maxPrice').value.trim();

  const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : Infinity;

  let filtrando = false;

  products.forEach(product => {
    const productBrand = product.getAttribute('data-brand');
    const productCategory = product.getAttribute('data-category');
    const productPriceAttr = product.getAttribute('data-price');
    const productPrice = productPriceAttr ? parseFloat(productPriceAttr) : null;

    let show = true;

    if (selectedBrand !== 'all' && productBrand !== selectedBrand) {
      show = false;
    }

    if (selectedCategory !== 'all' && productCategory !== selectedCategory) {
      show = false;
    }

    if (maxPrice !== Infinity) {
      if (productPrice === null || isNaN(productPrice) || productPrice > maxPrice) {
        show = false;
      }
    }

    if (!show) filtrando = true;

    product.style.display = show ? '' : 'none';
  });

  // Controle da rolagem infinita:
  const temFiltroDePreco = maxPrice !== Infinity;

  if (temFiltroDePreco || selectedCategory !== 'all' || selectedBrand !== 'all') {
    removerRolagemInfinita();
  } else {
    // Caso contrário, ativa
    iniciarRolagemInfinita();
  }
}




// Corrige clique nos labels do Bootstrap 4
document.querySelectorAll('.sidebar label').forEach(label => {
  label.addEventListener('click', () => {
    const input = label.querySelector('input');
    if (input && input.type === 'radio') {
      input.checked = true;
      if (input.name === 'brand') {
        selectedBrand = input.value;
      } else if (input.name === 'category') {
        selectedCategory = input.value;
      }
      applyFilters();
    }
  });
});

// Campo de preço (corrigido: aceita número simples, ponto ou vírgula, e produtos sem preço)
if (maxPriceInput) {
  ['input', 'change', 'keyup'].forEach(eventType => {
    maxPriceInput.addEventListener(eventType, () => {
      let raw = maxPriceInput.value.trim().replace(',', '.');

      if (raw === '' || isNaN(raw)) {
        maxPrice = Infinity; // mostra todos se campo vazio
      } else {
        maxPrice = parseFloat(raw);
      }

      applyFilters();
    });
  });
}


// --- Rolagem infinita (produtos) ---
let scrollHandlerAtivo = false;
let visibleCount = 0;

function iniciarRolagemInfinita() {
  const products = document.querySelectorAll("#productGrid .col-lg-4, #productGrid .col-md-6, #productGrid .col-sm-6");
  if (!products.length) return;

  // Mostra os primeiros produtos
  visibleCount = 6;
  products.forEach((p, i) => {
    p.style.display = (i < visibleCount) ? "block" : "none";
  });

  // Evita registrar o evento duas vezes
  if (scrollHandlerAtivo) return;
  scrollHandlerAtivo = true;

  window.addEventListener("scroll", scrollHandler);
}

function removerRolagemInfinita() {
  window.removeEventListener("scroll", scrollHandler);
  scrollHandlerAtivo = false;
}

function scrollHandler() {
  const products = document.querySelectorAll("#productGrid .col-lg-4, #productGrid .col-md-6, #productGrid .col-sm-6");
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 900) {
    const nextBatch = Array.from(products).slice(visibleCount, visibleCount + 6);
    nextBatch.forEach(p => {
      p.style.display = "block";
      p.style.opacity = 0;
      p.style.transition = "opacity 0.6s ease";
      setTimeout(() => (p.style.opacity = 1), 100);
    });
    visibleCount += 6;
  }
}

// Ativa rolagem infinita assim que carregar a página de produtos
document.addEventListener("DOMContentLoaded", iniciarRolagemInfinita);


// --- Troca da imagem principal + Lightbox ---
document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.getElementById("mainImage");
  if (!mainImage) return;

  const thumbs = document.querySelectorAll(".thumb");
  const lightbox = document.createElement("div");

  lightbox.id = "lightbox"; 
  lightbox.innerHTML = `
    <span class="close">&times;</span>
    <img src="" alt="Imagem ampliada">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".close");

  mainImage.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = mainImage.src;
  });

  closeBtn.addEventListener("click", () => (lightbox.style.display = "none"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.style.display = "none";
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelector(".thumb.active")?.classList.remove("active");
      thumb.classList.add("active");
      mainImage.src = thumb.src;
    });

    thumb.addEventListener("dblclick", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = thumb.src;
    });
  });
});


// FAQ
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  btn.addEventListener('click', () => {
    faqItems.forEach(i => {
      if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});


// Modal WhatsApp
function abrirModalWhats(nomeProduto) {
  document.querySelectorAll(".btn-whats").forEach(btn => {
    btn.onclick = () => {
      const numero = btn.getAttribute("data-number");
      const mensagem = `Olá! \nVi o produto *${nomeProduto}* no site e gostaria de mais informações.`;
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
      $("#whatsModal").modal("hide");
    };
  });
  $("#whatsModal").modal("show");
}

const produtos = document.querySelectorAll(".product-card");
if (produtos.length > 0) {
  produtos.forEach(produto => {
    const nomeProduto = produto.querySelector(".card-title").textContent.trim();
    const botaoComprar = produto.querySelector(".btn-success");
    botaoComprar.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalWhats(nomeProduto);
    });
  });
}

const botaoDetalhe = document.querySelector(".btn-comprar");
if (botaoDetalhe) {
  const nomeProduto = botaoDetalhe.getAttribute("data-product");
  botaoDetalhe.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModalWhats(nomeProduto);
  });
}







  






