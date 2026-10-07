/* ==========================================================================
   CẤN HỒNG NHUNG - PERSONAL BIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Toast Notification Helper ---
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimeout = null;

    function showToast(message, isSuccess = true) {
        if (toastTimeout) clearTimeout(toastTimeout);
        toastMsg.textContent = message;
        toast.style.background = isSuccess 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)';
        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- 2. Share Profile Feature & Official URL ---
    const OFFICIAL_PROFILE_URL = 'https://nhunnhunprofile.vercel.app/';
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeShareBtn = document.getElementById('closeShareBtn');
    const modalCopyBtn = document.getElementById('modalCopyBtn');
    const copyProfileBtn = document.getElementById('copyProfileBtn');
    const shareUrlInput = document.getElementById('shareUrlInput');

    const shareFbBtn = document.getElementById('shareFbBtn');
    const shareMessengerBtn = document.getElementById('shareMessengerBtn');
    const shareTelegramBtn = document.getElementById('shareTelegramBtn');
    const shareTwitterBtn = document.getElementById('shareTwitterBtn');

    // Initialize Share Channels Links
    if (shareFbBtn) {
        shareFbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(OFFICIAL_PROFILE_URL)}`;
    }
    if (shareMessengerBtn) {
        shareMessengerBtn.href = `fb-messenger://share/?link=${encodeURIComponent(OFFICIAL_PROFILE_URL)}`;
        shareMessengerBtn.addEventListener('click', (e) => {
            // Fallback for desktop browsers to Web Share or Copy
            if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                e.preventDefault();
                copyToClipboard(OFFICIAL_PROFILE_URL);
                showToast('Đã sao chép link gửi qua Messenger! 💬✨');
            }
        });
    }
    if (shareTelegramBtn) {
        shareTelegramBtn.href = `https://t.me/share/url?url=${encodeURIComponent(OFFICIAL_PROFILE_URL)}&text=${encodeURIComponent('Ghé thăm trang giới thiệu của Cấn Hồng Nhung (@colacold_) nè! ✨')}`;
    }
    if (shareTwitterBtn) {
        shareTwitterBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(OFFICIAL_PROFILE_URL)}&text=${encodeURIComponent('Khám phá trang bio cá nhân của Cấn Hồng Nhung (@colacold_) 🌸')}`;
    }

    function openShareModal() {
        if (shareModal) {
            shareModal.classList.add('active');
        }
    }

    function closeShareModal() {
        if (shareModal) {
            shareModal.classList.remove('active');
        }
    }

    function copyToClipboard(url = OFFICIAL_PROFILE_URL) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => {
                showToast('Đã sao chép liên kết hồ sơ của Nhung! 📋✨');
            }).catch(() => {
                fallbackCopy(url);
            });
        } else {
            fallbackCopy(url);
        }
    }

    function fallbackCopy(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showToast('Đã sao chép liên kết hồ sơ của Nhung! 📋✨');
        } catch (e) {
            showToast('Không thể tự động sao chép, bạn hãy copy link trên ô nhập nhé!', false);
        }
        document.body.removeChild(tempInput);
    }

    if (shareBtn) shareBtn.addEventListener('click', openShareModal);
    if (closeShareBtn) closeShareBtn.addEventListener('click', closeShareModal);
    if (modalCopyBtn) modalCopyBtn.addEventListener('click', () => copyToClipboard(OFFICIAL_PROFILE_URL));
    if (copyProfileBtn) copyProfileBtn.addEventListener('click', () => copyToClipboard(OFFICIAL_PROFILE_URL));

    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                closeShareModal();
            }
        });
    }

    // --- 3. QR Code Modal ---
    const qrBtn = document.getElementById('qrBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrBtn = document.getElementById('closeQrBtn');
    const qrImage = document.getElementById('qrImage');

    if (qrBtn && qrModal) {
        qrBtn.addEventListener('click', () => {
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(OFFICIAL_PROFILE_URL)}`;
            qrModal.classList.add('active');
        });

        closeQrBtn.addEventListener('click', () => {
            qrModal.classList.remove('active');
        });

        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.classList.remove('active');
            }
        });
    }


    // --- 4. Lightbox Photo Viewer ---
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');

    window.openLightbox = function(imageSrc) {
        if (lightboxModal && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightboxModal.classList.add('active');
        }
    };

    window.closeLightbox = function() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    };

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (shareModal && shareModal.classList.contains('active')) closeShareModal();
            if (qrModal && qrModal.classList.contains('active')) qrModal.classList.remove('active');
            if (lightboxModal && lightboxModal.classList.contains('active')) lightboxModal.classList.remove('active');
        }
    });

    // --- 5. Interactive 3D Card Tilt Effect ---
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Skip on mobile touch
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 25;
            const rotateY = (x - centerX) / 25;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });
});
