// D-Day 계산
function calculateDday() {
    const weddingDate = new Date('2026-10-31');
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

// 갤러리 이미지 선택
let currentGalleryIndex = 0;

function selectGalleryImage(index) {
    currentGalleryIndex = index;

    // 모든 썸네일에서 active 클래스 제거
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.classList.remove('active');
    });

    // 선택된 썸네일에 active 클래스 추가
    const selectedThumb = document.querySelector(`.gallery-thumb[data-index="${index}"]`);
    if (selectedThumb) {
        selectedThumb.classList.add('active');

        // 선택된 썸네일이 보이도록 스크롤
        selectedThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // 메인 이미지 업데이트
    const mainImage = document.getElementById('mainGalleryImage');
    if (mainImage) {
        mainImage.innerHTML = `📸<br>사진 ${index + 1}`;
    }
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

// 스크롤 인디케이터 클릭 시 greeting 섹션으로 이동
function scrollToGreeting() {
    const greetingSection = document.querySelector('.greeting-section');
    if (greetingSection) {
        greetingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 배경음악 컨트롤
let isMusicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicIcon.textContent = '🔊';
            isMusicPlaying = true;
        }).catch(() => {
            showNotification('음악 재생에 실패했습니다');
        });
    }
}

// 페이지 로드 시 음악 자동 재생 시도
window.addEventListener('load', () => {
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicIcon.textContent = '🔊';
    }).catch(() => {
        // 자동 재생 실패 (브라우저 정책)
        isMusicPlaying = false;
        musicIcon.textContent = '🔇';
    });
});

// 참석의사 모달 열기
function openAttendanceForm() {
    const modal = document.getElementById('attendanceModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// 참석의사 모달 닫기
function closeAttendanceForm() {
    const modal = document.getElementById('attendanceModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('attendanceModal');
    if (e.target === modal) {
        closeAttendanceForm();
    }
});

// 참석의사 제출
function submitAttendance(event) {
    event.preventDefault();

    const name = document.getElementById('attendanceName').value;
    const phone = document.getElementById('attendancePhone').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const count = document.getElementById('attendanceCount').value;
    const meal = document.querySelector('input[name="meal"]:checked').value;
    const message = document.getElementById('attendanceMessage').value;

    // 여기서 실제로는 서버로 데이터를 전송해야 합니다
    console.log({
        name, phone, attendance, count, meal, message
    });

    showNotification('참석 의사가 전달되었습니다 ✓');
    closeAttendanceForm();

    // 폼 초기화
    event.target.reset();
}
