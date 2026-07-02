const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const parallaxItems = document.querySelectorAll('.parallax-soft');
function setHeaderState(){ header?.classList.toggle('scrolled', window.scrollY > 10); }
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive:true });
menuToggle?.addEventListener('click',()=>{
  const open = nav.classList.toggle('open');
  document.body.classList.toggle('nav-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  menuToggle?.setAttribute('aria-expanded','false');
}));
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
},{ threshold:.13, rootMargin:'0px 0px -60px 0px' });
document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right,.stagger').forEach(el=>revealObserver.observe(el));
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const navObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link=>link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  });
},{ threshold:.38 });
sections.forEach(s=>navObserver.observe(s));
let ticking = false;
function runParallax(){
  parallaxItems.forEach((item,index)=>{
    const rect = item.getBoundingClientRect();
    const center = rect.top + rect.height/2 - window.innerHeight/2;
    const offset = Math.max(Math.min(center * -0.025, 16), -16);
    item.style.transform = `translateY(${offset + index*2}px)`;
  });
  ticking = false;
}
window.addEventListener('scroll',()=>{ if(!ticking){ requestAnimationFrame(runParallax); ticking = true; } },{ passive:true });
runParallax();
const reviewCarousel = document.querySelector('[data-review-carousel]');
const reviewPrev = document.querySelector('[data-review-prev]');
const reviewNext = document.querySelector('[data-review-next]');
let reviewAutoplay;
let reviewPaused = false;
function scrollReview(direction=1){
  if(!reviewCarousel) return;
  const card = reviewCarousel.querySelector('.review-card');
  const step = card ? card.getBoundingClientRect().width + 18 : 320;
  const max = reviewCarousel.scrollWidth - reviewCarousel.clientWidth - 4;
  if(direction > 0 && reviewCarousel.scrollLeft >= max){ reviewCarousel.scrollTo({ left:0, behavior:'smooth' }); }
  else if(direction < 0 && reviewCarousel.scrollLeft <= 4){ reviewCarousel.scrollTo({ left:reviewCarousel.scrollWidth, behavior:'smooth' }); }
  else { reviewCarousel.scrollBy({ left:step*direction, behavior:'smooth' }); }
}
function pauseReview(){ reviewPaused = true; clearInterval(reviewAutoplay); }
reviewPrev?.addEventListener('click',()=>{ pauseReview(); scrollReview(-1); });
reviewNext?.addEventListener('click',()=>{ pauseReview(); scrollReview(1); });
reviewCarousel?.addEventListener('pointerdown', pauseReview);
reviewCarousel?.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowRight'){ e.preventDefault(); pauseReview(); scrollReview(1); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); pauseReview(); scrollReview(-1); }
});
if(reviewCarousel && matchMedia('(prefers-reduced-motion: no-preference)').matches){
  reviewAutoplay = setInterval(()=>{ if(!reviewPaused) scrollReview(1); }, 4800);
}

