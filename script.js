/* ==========================================
   LK CINEMA SCRIPT (CLEAN VERSION)
   ========================================== */

// --- 1. SETTINGAN ---
// Kosongkan agar script bisa jalan di SEMUA domain
const ALLOWED_DOMAIN = ""; 

const API_KEY = '0f2913b40997f6246619cf6517c8109f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const EMBED_URL = 'https://vidsrc.icu/embed/movie/';
const SHOPEE_URL = 'https://s.shopee.co.id/BMyEOJaI7'; 
const BANNER_IMG_PLAYER = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjso_ROPofa-PurnwuLft47YyYvLOJafe22psMSb56ZfurS72_PSxKm9uclnsZNQrkSDLFqVet4OwGXqOamPJSE6e3ql2rfUpE_UfH4ecMvLlGZ0w5AsLZ7o5kMCHKgFPBAXESBnvQLlDQcPZ5Se_46pH9rocP6YzIPLUc6bh8QczQN5mYcVl4xEfTZJVh5/s1365/Made_for_300_202512091047.jpeg'; 

// --- 2. LOGIKA UTAMA ---
async function fetchMovies(){
  try {
      const res = await fetch(BASE_URL + '/movie/popular?api_key=' + API_KEY + '&language=id-ID&page=1');
      const data = await res.json();
      displayMovies(data.results);
  } catch(e) {
      console.error(e);
      const c = document.getElementById('movie-container');
      if(c) c.innerHTML = '<div class="col-12 text-center text-danger">Gagal memuat film (Cek Console).</div>';
  }
}

function displayMovies(movies){
  const container = document.getElementById('movie-container');
  if(!container) return;
  
  container.innerHTML = movies.map(v => {
      let poster = v.poster_path ? IMG_URL + v.poster_path : 'https://via.placeholder.com/300x450?text=No+Img';
      let year = v.release_date ? v.release_date.split('-')[0] : 'N/A';
      return `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="movie-card" onclick="handleClick(${v.id})">
            <img src="${poster}" loading="lazy" alt="${v.title}">
            <h6 class="movie-title">${v.title}</h6>
            <div class="movie-meta">
              <span>${year}</span>
              <span class="text-warning">&#9733; ${v.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      `;
  }).join('');
}

function handleClick(id){
    window.open(SHOPEE_URL, '_blank');
    playMovie(id);
}

async function playMovie(id){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const wrapper = document.getElementById('player-wrapper');
    wrapper.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-danger"></div></div>';

    try {
        const r = await fetch(BASE_URL + '/movie/' + id + '?api_key=' + API_KEY + '&language=id-ID');
        const m = await r.json();

        const adHtml = `
            <div class="ad-banner">
                <a href="${SHOPEE_URL}" target="_blank"><img src="${BANNER_IMG_PLAYER}" alt="Ads"></a>
            </div>`;

        wrapper.innerHTML = `
            <div class="player-container">
                <div class="player-header">
                    <span class="fw-bold text-white text-truncate">${m.title}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="document.getElementById('player-wrapper').innerHTML=''">Tutup</button>
                </div>
                ${adHtml}
                <iframe src="${EMBED_URL + id}" allowfullscreen="true"></iframe>
                ${adHtml}
                <div class="p-3 text-secondary small bg-dark">
                    <p class="mb-0">${m.overview || 'Tidak ada deskripsi.'}</p>
                </div>
            </div>
        `;
        startTimer();
    } catch(e) {
        wrapper.innerHTML = '<p class="text-danger text-center">Gagal memuat player.</p>';
    }
}

let watchTimer = null;
let watchSeconds = 0;
let redirect30 = false;
let redirect60 = false;

function startTimer(){
    if(watchTimer) clearInterval(watchTimer);
    watchSeconds = 0; redirect30 = false; redirect60 = false;
    watchTimer = setInterval(() => {
        watchSeconds++;
        if(watchSeconds >= 30 && !redirect30) { redirect30 = true; window.open(SHOPEE_URL, '_blank'); }
        if(watchSeconds >= 60 && !redirect60) { redirect60 = true; window.open(SHOPEE_URL, '_blank'); clearInterval(watchTimer); }
    }, 1000);
}

// Jalankan saat halaman siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchMovies);
} else {
    fetchMovies();
}
