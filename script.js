// ============================================
// Firebase 설정 및 초기화
// ============================================
// Firebase 프로젝트 설정 (https://console.firebase.google.com 에서 생성)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase 초기화
let db = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('Firebase 초기화 성공');
    }
} catch (error) {
    console.error('Firebase 초기화 실패:', error);
}

// ============================================
// D-Day 계산
// ============================================
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

// ============================================
// 축하 메시지 기능 (Firebase 연동)
// ============================================

// 메시지 추가
async function addMessage() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        showNotification('이름과 메시지를 모두 입력해주세요');
        return;
    }

    if (!db) {
        showNotification('데이터베이스 연결이 필요합니다. Firebase 설정을 확인해주세요.');
        return;
    }

    try {
        // Firestore에 메시지 저장
        await db.collection('messages').add({
            name: name,
            message: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
        });

        // 입력 필드 초기화
        nameInput.value = '';
        messageInput.value = '';

        showNotification('축하 메시지가 등록되었습니다! ❤️');

        // 메시지 목록 새로고침
        loadMessages();
    } catch (error) {
        console.error('메시지 저장 실패:', error);
        showNotification('메시지 저장에 실패했습니다. 다시 시도해주세요.');
    }
}

// 메시지 불러오기
async function loadMessages() {
    if (!db) {
        // Firebase가 설정되지 않은 경우 샘플 메시지 표시
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = `
            <div class="message-card">
                <div class="message-header">
                    <span class="message-name">김철수</span>
                    <span class="message-date">2025.05.30</span>
                </div>
                <p class="message-text">결혼을 진심으로 축하합니다! 항상 행복하세요!</p>
            </div>
            <div class="message-card">
                <div class="message-header">
                    <span class="message-name">박영희</span>
                    <span class="message-date">2025.05.29</span>
                </div>
                <p class="message-text">두 분의 앞날에 축복이 가득하길 바랍니다 ❤️</p>
            </div>
            <div class="firebase-notice">
                <p>💡 Firebase 설정 필요</p>
                <p style="font-size: 0.85rem; color: #999;">script.js 파일의 firebaseConfig를 설정하면 실시간 메시지 기능을 사용할 수 있습니다.</p>
            </div>
        `;
        return;
    }

    try {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '<div class="loading-messages"><p>메시지를 불러오는 중...</p></div>';

        // Firestore에서 메시지 가져오기 (최신순)
        const snapshot = await db.collection('messages')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        messagesDiv.innerHTML = '';

        if (snapshot.empty) {
            messagesDiv.innerHTML = '<div class="no-messages"><p>첫 번째 축하 메시지를 남겨주세요! 💕</p></div>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const messageHTML = `
                <div class="message-card" style="animation: fadeInUp 0.5s ease-out;">
                    <div class="message-header">
                        <span class="message-name">${escapeHtml(data.name)}</span>
                        <span class="message-date">${data.date || '날짜 없음'}</span>
                    </div>
                    <p class="message-text">${escapeHtml(data.message)}</p>
                </div>
            `;
            messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
        });
    } catch (error) {
        console.error('메시지 불러오기 실패:', error);
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '<div class="error-messages"><p>메시지를 불러오는데 실패했습니다.</p></div>';
    }
}

// 실시간 메시지 업데이트 리스너
function setupRealtimeMessages() {
    if (!db) return;

    db.collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .onSnapshot((snapshot) => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';

            if (snapshot.empty) {
                messagesDiv.innerHTML = '<div class="no-messages"><p>첫 번째 축하 메시지를 남겨주세요! 💕</p></div>';
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                const messageHTML = `
                    <div class="message-card">
                        <div class="message-header">
                            <span class="message-name">${escapeHtml(data.name)}</span>
                            <span class="message-date">${data.date || '날짜 없음'}</span>
                        </div>
                        <p class="message-text">${escapeHtml(data.message)}</p>
                    </div>
                `;
                messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
            });
        }, (error) => {
            console.error('실시간 업데이트 오류:', error);
        });
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

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

    // 메시지 불러오기
    if (db) {
        // 실시간 리스너 설정
        setupRealtimeMessages();
    } else {
        // Firebase가 설정되지 않은 경우 샘플 메시지 표시
        loadMessages();
    }
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
