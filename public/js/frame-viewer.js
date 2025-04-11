// URL 입력 필드에서 페이지 로드
// URL을 입력하고 로드 버튼을 클릭하면 해당 페이지를 iframe에 표시
function loadURL() {
    const url = document.getElementById('urlInput').value;
    loadPage(url);
}

// 페이지 로드 함수
// 지정된 URL의 페이지를 iframe에 로드
function loadPage(url) {
    const iframe = document.getElementById('viewerFrame');
    iframe.src = url;
}

// 페이지 초기화
// 페이지 로드 시 기본 계약서 페이지를 표시
window.onload = function() {
    const defaultPage = '/contract-employment.html';
    loadPage(defaultPage);
}; 