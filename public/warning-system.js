// 공통 경고 시스템 스타일 정의
const warningStyles = `
    .warning-system {
        position: relative; // 경고 시스템의 상대적 위치 설정
    }

    .warning-message {
        display: none; // 기본적으로 경고 메시지를 숨김
        position: absolute; // 절대 위치로 설정하여 부모 요소 기준으로 위치 지정
        top: -40px; // 부모 요소 위쪽에 위치
        left: 50%; // 부모 요소의 가로 중앙에 위치
        transform: translateX(-50%); // 가로 중앙 정렬
        background: #ff0000; // 배경색을 빨간색으로 설정
        color: white; // 글자색을 흰색으로 설정
        padding: 8px 16px; // 안쪽 여백 설정
        border-radius: 5px; // 모서리를 둥글게 설정
        font-weight: bold; // 글자 굵게 설정
        animation: fadeInDown 0.3s ease-out; // 애니메이션 효과 적용
        z-index: 1000; // 다른 요소보다 위에 표시
    }

    .warning-message::before {
        content: '⚠️'; // 경고 아이콘 추가
        margin-right: 8px; // 아이콘과 텍스트 사이의 간격 설정
    }

    .warning {
        animation: shakeBox 0.5s ease-in-out; // 흔들림 애니메이션 효과 적용
        background: #ffebee !important; // 배경색을 연한 빨간색으로 설정
        border: 3px solid #ff0000 !important; // 테두리를 빨간색으로 설정
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.3); // 그림자 효과 추가
    }

    @keyframes fadeInDown {
        from {
            opacity: 0; // 시작 시 투명
            transform: translate(-50%, -20px); // 시작 위치
        }
        to {
            opacity: 1; // 끝날 때 불투명
            transform: translate(-50%, 0); // 끝 위치
        }
    }

    @keyframes shakeBox {
        0%, 100% { transform: translateX(0); } // 시작과 끝 위치
        20%, 60% { transform: translateX(-15px); } // 왼쪽으로 이동
        40%, 80% { transform: translateX(15px); } // 오른쪽으로 이동
    }
`;

class WarningSystem {
    constructor() {
        // 스타일을 문서에 추가
        if (!document.getElementById('warning-system-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'warning-system-styles';
            styleSheet.textContent = warningStyles;
            document.head.appendChild(styleSheet);
        }
    }

    // 특정 요소에 경고 표시
    showWarning(element, message = 'Please check this box before proceeding') {
        // warning-system 클래스 추가
        element.classList.add('warning-system');

        // 기존 경고 제거
        this.removeWarning(element);

        // 경고 메시지 생성 및 추가
        const warningMsg = document.createElement('div');
        warningMsg.className = 'warning-message';
        warningMsg.textContent = message;
        element.appendChild(warningMsg);

        // 시각적 효과를 위한 warning 클래스 추가
        element.classList.add('warning');

        // 경고음 재생
        this.playWarningSound();

        // 요소를 화면 중앙으로 스크롤
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 3초 후 경고 자동 제거
        setTimeout(() => {
            this.removeWarning(element);
        }, 3000);
    }

    // 요소에서 경고 제거
    removeWarning(element) {
        const existingWarning = element.querySelector('.warning-message');
        if (existingWarning) {
            existingWarning.remove();
        }
        element.classList.remove('warning');
    }

    // 경고음 재생
    playWarningSound() {
        const audio = document.getElementById('agreeAlert');
        if (audio) {
            audio.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }
}

// 전역 인스턴스 생성
window.warningSystem = new WarningSystem();

// 계약 페이지에서의 사용 예시:
/*
// 계약 페이지에서:
function navigate(direction) {
    const currentCheckbox = document.getElementById(`agree${currentSection}`);
    const container = currentCheckbox.closest('.agree-box');
    
    if (direction === 'next' && !currentCheckbox.checked) {
        warningSystem.showWarning(container);
        return;
    }
    // ... 나머지 네비게이션 코드
}
*/ 