// Smooth scroll to top
console.log("JS loaded")
function scrollToTop(e){
  e.preventDefault();
  window.scrollTo({ top:0, behavior:'smooth' });
}

// Cookie banner
const banner = document.getElementById('cookieBanner');
const accept = document.getElementById('acceptCookies');
const reject = document.getElementById('rejectCookies');
if(accept) accept.onclick = () => banner.style.display = 'none';
if(reject) reject.onclick = () => banner.style.display = 'none';

// Hero staggered reveal
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 200 + i * 180);
  });
});

// Scroll reveal via IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('reveal--visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section .container').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Lightbox modal
const modal = document.getElementById('lightbox');
const modalImg = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-modal');
    if(!src) return;
    modalImg.src = src;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
}
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Contact form success (no preventDefault → backend handles submission)
const form = document.querySelector('.form');
const success = document.getElementById('formSuccess');

if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 👈 stop default redirect

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if(res.ok){
        success.style.display = 'block';
        setTimeout(() => success.style.display = 'none', 3000);
        form.reset();
      } else {
        alert("Error sending message");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Network error");
    }
  });
}


// Minimal WebGL-style canvas animation
const canvas = document.getElementById('heroCanvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = Array.from({length: 60}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*2 + 0.8,
      a: Math.random()*Math.PI*2,
      s: Math.random()*0.6 + 0.2
    }));
  };
  const step = () => {
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += Math.cos(p.a) * p.s;
      p.y += Math.sin(p.a) * p.s;
      p.a += (Math.random()-0.5)*0.02;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,106,0,0.25)';
      ctx.fill();
    });
    requestAnimationFrame(step);
  };
  window.addEventListener('resize', resize);
  resize(); step();
}
