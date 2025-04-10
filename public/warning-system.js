/**
 * 글로벌 경고 시스템
 * 이 파일은 모든 계약 페이지에서 사용할 수 있는 중앙 집중식 경고 시스템을 제공합니다.
 */

// 전역 경고 시스템 객체 생성
const WarningSystem = {
    // 경고 시스템 초기화
    init: function() {
        // 경고 컨테이너가 없으면 생성
        // 화면 상단에 고정된 위치에 경고 메시지를 표시할 컨테이너를 생성합니다.
        if (!document.getElementById('warning-container')) {
            const warningContainer = document.createElement('div');
            warningContainer.id = 'warning-container';
            warningContainer.style.position = 'fixed';
            warningContainer.style.top = '20px';
            warningContainer.style.left = '50%';
            warningContainer.style.transform = 'translateX(-50%)';
            warningContainer.style.zIndex = '9999';
            document.body.appendChild(warningContainer);
        }

        // 오디오 요소가 없으면 생성
        // 경고음과 성공음을 재생하기 위한 오디오 요소를 추가합니다.
        if (!document.getElementById('warning-sound')) {
            const warningSound = document.createElement('audio');
            warningSound.id = 'warning-sound';
            warningSound.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
            document.body.appendChild(warningSound);
        }

        if (!document.getElementById('success-sound')) {
            const successSound = document.createElement('audio');
            successSound.id = 'success-sound';
            successSound.src = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
            document.body.appendChild(successSound);
        }

        // 경고 스타일 CSS 추가
        // 경고 메시지의 시각적 스타일을 정의합니다.
        if (!document.getElementById('warning-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'warning-styles';
            styleElement.textContent = `
                /* 상단에 표시되는 경고 배너 스타일 */
                .warning-banner {
                    background-color: #ffebee;
                    color: #c62828;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: fadeInDown 0.5s ease-out;
                    max-width: 500px;
                }
                
                /* 경고 아이콘 스타일 */
                .warning-banner i {
                    font-size: 20px;
                }
                
                /* 인라인 경고 메시지 스타일 */
                .warning-inline {
                    color: #c62828;
                    font-size: 14px;
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    animation: fadeIn 0.3s ease-out;
                }
                
                /* 경고 강조 효과 스타일 */
                .warning-highlight {
                    border: 2px solid #c62828 !important;
                    background-color: #ffebee !important;
                    box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.2) !important;
                    animation: shake 0.5s ease-in-out;
                }
                
                /* 페이드인 애니메이션 */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* 위에서 아래로 페이드인 애니메이션 */
                @keyframes fadeInDown {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px) translateX(-50%);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) translateX(-50%);
                    }
                }
                
                /* 흔들림 애니메이션 효과 */
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(styleElement);
        }
    },

    // 경고 메시지 표시 함수
    // message: 표시할 경고 메시지
    // selector: 경고를 표시할 요소의 CSS 선택자 (선택사항)
    showWarning: function(message, selector = null) {
        // 시스템 초기화
        this.init();
        
        // 기존 경고 메시지 제거
        this.removeWarnings();
        
        // 경고음 재생
        this.playWarningSound();
        
        // 경고 배너 추가
        const warningContainer = document.getElementById('warning-container');
        const warningBanner = document.createElement('div');
        warningBanner.className = 'warning-banner';
        warningBanner.innerHTML = `
            <i>⚠️</i>
            <span>${message}</span>
        `;
        warningContainer.appendChild(warningBanner);
        
        // 선택자가 제공된 경우 해당 요소에 인라인 경고 추가
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                // 강조 효과 추가
                element.classList.add('warning-highlight');
                
                // 인라인 경고 메시지 생성
                const inlineWarning = document.createElement('div');
                inlineWarning.className = 'warning-inline';
                inlineWarning.innerHTML = `<i>⚠️</i> <span>${message}</span>`;
                
                // 요소 다음에 경고 메시지 삽입
                element.parentNode.insertBefore(inlineWarning, element.nextSibling);
                
                // 해당 요소로 스크롤
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 애니메이션 종료 후 강조 효과 제거
                setTimeout(() => {
                    element.classList.remove('warning-highlight');
                }, 500);
            }
        }
        
        // 3초 후 자동으로 경고 메시지 제거
        setTimeout(() => {
            this.removeWarnings();
        }, 3000);
    },
    
    // 모든 경고 메시지 제거
    removeWarnings: function() {
        const warningContainer = document.getElementById('warning-container');
        if (warningContainer) {
            warningContainer.innerHTML = '';
        }
        
        // 인라인 경고 메시지 제거
        const inlineWarnings = document.querySelectorAll('.warning-inline');
        inlineWarnings.forEach(warning => warning.remove());
        
        // 강조 효과 제거
        const highlightedElements = document.querySelectorAll('.warning-highlight');
        highlightedElements.forEach(element => element.classList.remove('warning-highlight'));
    },
    
    // 경고음 재생
    playWarningSound: function() {
        const warningSound = document.getElementById('warning-sound');
        if (warningSound) {
            warningSound.currentTime = 0;
            warningSound.play().catch(e => console.log('오디오 재생 실패:', e));
        }
    },
    
    // 성공음 재생
    playSuccessSound: function() {
        const successSound = document.getElementById('success-sound');
        if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.log('오디오 재생 실패:', e));
        }
    }
};

// iframe으로부터의 메시지 수신 처리
// 다른 페이지에서 경고 시스템을 사용할 수 있도록 메시지 이벤트를 처리합니다.
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'showWarning') {
        WarningSystem.showWarning(event.data.message, event.data.selector);
    }
});

// 경고 시스템을 전역으로 사용 가능하게 설정
window.WarningSystem = WarningSystem; 