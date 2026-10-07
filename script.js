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

    // --- 2. Share Profile Feature (Web Share API or Clipboard) ---
    const shareBtn = document.getElementById('shareBtn');
    const copyProfileBtn = document.getElementById('copyProfileBtn');

    async function handleShare() {
        const shareData = {
            title: 'Cấn Hồng Nhung (@colacold_) • Profile & Bio',
            text: 'Ghé thăm trang giới thiệu cá nhân chính thức của Cấn Hồng Nhung nè! ✨',
            url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    }

    function copyToClipboard() {
        const urlToCopy = window.location.href;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(urlToCopy).then(() => {
                showToast('Đã sao chép liên kết hồ sơ của Nhung! 📋✨');
            }).catch(() => {
                fallbackCopy(urlToCopy);
            });
        } else {
            fallbackCopy(urlToCopy);
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
            showToast('Không thể tự động sao chép, bạn hãy copy link trên trình duyệt nhé!', false);
        }
        document.body.removeChild(tempInput);
    }

    if (shareBtn) shareBtn.addEventListener('click', handleShare);
    if (copyProfileBtn) copyProfileBtn.addEventListener('click', copyToClipboard);


    // --- 3. QR Code Modal ---
    const qrBtn = document.getElementById('qrBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrBtn = document.getElementById('closeQrBtn');
    const qrImage = document.getElementById('qrImage');

    if (qrBtn && qrModal) {
        qrBtn.addEventListener('click', () => {
            // Generate QR for current page URL or fallback to Facebook profile
            const currentUrl = window.location.href.startsWith('http') 
                ? window.location.href 
                : 'https://www.facebook.com/duwasnef?locale=vi_VN';
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}`;
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
