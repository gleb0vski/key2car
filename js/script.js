// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== SWIPER =====
const swiper = new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1.2,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 24,
        },
    },
});

// ===== MOBILE MENU =====
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    burgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

burgerBtn.addEventListener('click', toggleMenu);
mobileOverlay.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
        toggleMenu();
    }
});

// ===== МАСКА ДЛЯ ТЕЛЕФОНА =====
const phoneInput = document.getElementById('phoneInput');

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length === 0) {
            this.value = '+7 (';
            return;
        }
        
        if (value.length === 1 && value !== '7') {
            this.value = '+7 (' + value;
            return;
        }
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        let formatted = '+7 (';
        
        if (value.length > 1) {
            formatted += value.slice(1, 4);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.slice(4, 7);
        }
        if (value.length >= 7) {
            formatted += '-' + value.slice(7, 9);
        }
        if (value.length >= 9) {
            formatted += '-' + value.slice(9, 11);
        }
        
        this.value = formatted;
    });
    
    phoneInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.value = '+7 (';
        }
    });
    
    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length <= 4) {
            this.value = '';
        }
    });
}

// ===== ОТПРАВКА ФОРМЫ =====
const form = document.getElementById('mainForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        fetch('mail.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('✅ ' + data.message);
                form.reset();
                const phoneInput = document.getElementById('phoneInput');
                if (phoneInput) phoneInput.value = '+7 (';
            } else {
                alert('❌ ' + data.message);
            }
        })
        .catch(error => {
            alert('❌ Ошибка отправки. Проверьте соединение.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    });
}

// ============================================================
// ДИНАМИЧЕСКАЯ ЗАМЕНА ПО ПАРАМЕТРУ ?brand=
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметр brand из URL
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');

    // Если параметр brand есть
    if (brand) {
        const brandName = brand.charAt(0).toUpperCase() + brand.slice(1); // Zeekr

        // === МЕНЯЕМ КАРТИНКУ ХИРО ===
        const heroCar = document.querySelector('.hero-bg-car');
        if (heroCar) {
            heroCar.style.backgroundImage = 'url("img/1-2.png")';
        }

        // === МЕНЯЕМ ЗАГОЛОВОК H1 ===
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            // Сохраняем первую часть "Ремонт электромобилей" и добавляем бренд
            const baseText = 'Ремонт электромобилей';
            heroTitle.innerHTML = `
                ${baseText} <br>
                <span class="highlight">${brandName} в Москве</span>
            `;
        }

        // === МЕНЯЕМ META TITLE ===
        document.title = `KEY2CAR — Ремонт электромобилей ${brandName} в Москве`;

        // === МЕНЯЕМ HERO BADGE (добавляем бренд) ===
        const heroBadge = document.querySelector('.hero-badge');
        if (heroBadge) {
            const existingText = heroBadge.textContent.trim();
            // Добавляем бренд в бейдж, если его там нет
            if (!existingText.includes(brandName)) {
                const link = heroBadge.querySelector('a');
                if (link) {
                    link.textContent = `4.6 на Яндекс Картах · 351 отзыв · ${brandName}`;
                }
            }
        }

        // === МЕНЯЕМ URL В БРАУЗЕРЕ (без перезагрузки) ===
        // Убираем параметр из адресной строки, чтобы не было дублей при переходе
        if (window.history && window.history.replaceState) {
            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
});