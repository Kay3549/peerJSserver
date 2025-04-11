// 현재 페이지와 전체 페이지 수 설정
let currentPage = 1;
const totalPages = 6;

// 계약 완료 처리 함수
function completeContract() {
    const finalCheckbox = document.querySelector(`#agree${totalPages}`);
    if (!finalCheckbox || !finalCheckbox.checked) {
        WarningSystem.showWarning(
            'Please check the final agreement box before completing.',
            `#agree-box-${totalPages}`
        );
        return;
    }
    // 계약 완료 처리 로직
    alert('Contract completed successfully!');
}

// 페이지 이동 함수
function navigate(direction) {
    // 현재 페이지의 체크박스 확인
    const checkbox = document.querySelector(`#agree${currentPage}`);
    if (direction === 'next' && (!checkbox || !checkbox.checked)) {
        // 체크박스가 선택되지 않은 경우 경고 표시
        WarningSystem.showWarning(
            'Please check the agreement box before proceeding.', 
            `#agree-box-${currentPage}`
        );
        return;
    }

    // 현재 섹션 비활성화
    document.querySelector(`#section${currentPage}`).classList.remove('active');
    
    // 페이지 이동 처리
    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }
    
    // 새로운 섹션 활성화 및 상태 업데이트
    document.querySelector(`#section${currentPage}`).classList.add('active');
    updateProgress();
    updateNavigation();
}

// 진행 상태 바 업데이트
function updateProgress() {
    const progress = (currentPage / totalPages) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Section ${currentPage} of ${totalPages}`;
    document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
    updateSectionIndicator();
}

// 네비게이션 버튼 상태 업데이트
function updateNavigation() {
    document.getElementById('prevBtn').disabled = currentPage === 1;
    
    // 마지막 페이지에서는 Next 버튼 대신 Complete 버튼 표시
    const nextBtn = document.getElementById('nextBtn');
    const completeBtn = document.getElementById('completeBtn');
    
    if (currentPage === totalPages) {
        nextBtn.style.display = 'none';
        completeBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        completeBtn.style.display = 'none';
    }
}

// 섹션 인디케이터 업데이트
function updateSectionIndicator() {
    const indicator = document.getElementById('sectionIndicator');
    indicator.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `indicator-dot${i === currentPage ? ' active' : ''}`;
        indicator.appendChild(dot);
    }
}

// 체크박스 이벤트 리스너 추가
// 체크박스 선택 시 성공 효과음 재생
document.querySelectorAll('.agreement-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            WarningSystem.playSuccessSound();
        }
    });
});

// 페이지 로드 시 초기화
window.onload = function() {
    updateProgress();
    updateNavigation();
    updateSectionIndicator();
}; 