// D-Day 계산
function calculateDday() {
    const weddingDate = new Date('2025-06-14');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = weddingDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const ddayElement = document.getElementById('dday');
    if (ddayElement) {
        ddayElement.textContent = days > 0 ? days : 'D-DAY';
    }
}

// 계좌번호 복사
function copyAccount(accountNumber) {
    navigator.clipboard.writeText(accountNumber).then(() => {
        showNotification('계좌번호가 복사되었습니다 ✓');
    }).catch(() => {
        alert('복사에 실패했습니다. 다시 시도해주세요.');
    });
}

// 알림 표시 함수
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #d4a5a5, #e8b4b8);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 메시지 추가
function addMessage() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        showNotification('이름과 메시지를 모두 입력해주세요');
        return;
    }

    const messagesDiv = document.getElementById('messages');
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    const messageHTML = `
        <div class="message-card" style="animation: fadeInUp 0.5s ease-out;">
            <div class="message-header">
                <span class="message-name">${escapeHtml(name)}</span>
                <span class="message-date">${today}</span>
            </div>
            <p class="message-text">${escapeHtml(message)}</p>
        </div>
    `;

    messagesDiv.insertAdjacentHTML('afterbegin', messageHTML);

    // 입력 필드 초기화
    nameInput.value = '';
    messageInput.value = '';

    showNotification('축하 메시지가 등록되었습니다! ❤️');
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 지도 열기 함수들
function openKakaoMap() {
    showNotification('카카오맵으로 연결됩니다');
    // 실제 구현 시: window.open('카카오맵 URL');
}

function openNaverMap() {
    showNotification('네이버맵으로 연결됩니다');
    // 실제 구현 시: window.open('네이버맵 URL');
}

function openGoogleMap() {
    showNotification('구글맵으로 연결됩니다');
    // 실제 구현 시: window.open('구글맵 URL');
}

// 갤러리 열기
function openGallery(index) {
    showNotification('갤러리 기능 (이미지 ' + (index + 1) + ')');
    // 실제 구현 시: 이미지 모달 팝업 표시
}

// 스크롤 애니메이션
function handleScrollAnimation() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
}

// Enter 키로 메시지 전송
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('guestMessage');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addMessage();
            }
        });
    }

    // D-Day 계산 실행
    calculateDday();

    // 스크롤 애니메이션 초기화
    handleScrollAnimation();
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
