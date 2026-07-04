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