/**
 * DataBridge 시스템
 * iframe 컨텐츠와 외부 애플리케이션 간의 통신을 처리합니다.
 * 계약서 데이터, 폼 데이터, 사용자 액션 등을 주고받을 수 있습니다.
 */

const DataBridge = {
    // 이벤트 리스너들을 저장하는 객체
    // 각 메시지 타입별로 콜백 함수들을 관리합니다
    listeners: {},
    
    // WebSocket 연결
    ws: null,
    connectionId: null,
    
    // 브릿지 초기화
    // 페이지 로드 시 자동으로 실행되며, 메시지 리스너를 설정합니다
    init: function() {
        // WebSocket 연결 설정
        this.connectWebSocket();
        
        // 기존 postMessage 리스너도 유지
        window.addEventListener('message', this.handleMessage.bind(this));
        
        // 연결 상태 초기화
        this.isConnected = false;
        
        console.log('DataBridge가 초기화되었습니다');
    },

    // WebSocket 연결 설정
    connectWebSocket: function() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('WebSocket 연결이 설정되었습니다');
        };
        
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            } catch (error) {
                console.error('WebSocket 메시지 처리 중 오류:', error);
            }
        };
        
        this.ws.onclose = () => {
            console.log('WebSocket 연결이 종료되었습니다');
            // 재연결 시도
            setTimeout(() => this.connectWebSocket(), 5000);
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket 오류:', error);
        };
    },

    // WebSocket 메시지 처리
    handleWebSocketMessage: function(data) {
        switch (data.type) {
            case 'CONNECTION_ESTABLISHED':
                this.connectionId = data.connectionId;
                break;
            case 'RESPONSE':
                this.notifyListeners(data.requestId, data.data);
                break;
            case 'ERROR':
                console.error('서버 오류:', data.message);
                break;
            default:
                this.notifyListeners(data.type, data);
        }
    },

    // 수신된 메시지 처리
    // 메시지 타입에 따라 적절한 핸들러로 라우팅합니다
    handleMessage: function(event) {
        const data = event.data;
        
        // 메시지 형식이 올바르지 않으면 무시
        if (!data || !data.type || !data.action) return;
        
        // WebSocket을 통해 서버로 전송
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                ...data,
                connectionId: this.connectionId,
                timestamp: new Date().toISOString()
            }));
        }
        
        // 등록된 리스너들에게 메시지 전달
        this.notifyListeners(data.type, data);
    },

    // 부모 창으로 데이터 전송
    // iframe 내부에서 부모 창으로 데이터를 보낼 때 사용
    sendToParent: function(data) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                source: 'DATA_BRIDGE',
                timestamp: new Date().toISOString(),
                ...data
            }, '*');
        }
    },

    // iframe으로 데이터 전송
    // 부모 창에서 iframe으로 데이터를 보낼 때 사용
    sendToIframe: function(data, iframeId = 'viewerFrame') {
        const iframe = document.getElementById(iframeId);
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                source: 'DATA_BRIDGE',
                timestamp: new Date().toISOString(),
                ...data
            }, '*');
        }
    },

    // 계약서 데이터 처리
    // 계약서의 저장, 업데이트, 검증 등을 처리
    handleContractData: function(data) {
        const { action, payload } = data;
        
        switch (action) {
            case 'SAVE':      // 계약서 저장
                this.saveContractData(payload);
                break;
            case 'UPDATE':    // 계약서 업데이트
                this.updateContractData(payload);
                break;
            case 'VALIDATE':  // 계약서 유효성 검사
                this.validateContractData(payload);
                break;
        }
    },

    // 폼 데이터 처리
    // 폼 제출, 유효성 검사 등을 처리
    handleFormData: function(data) {
        const { action, payload } = data;
        
        switch (action) {
            case 'SUBMIT':    // 폼 제출
                this.submitFormData(payload);
                break;
            case 'VALIDATE':  // 폼 유효성 검사
                this.validateFormData(payload);
                break;
        }
    },

    // 사용자 액션 처리
    // 서명, 승인 등의 사용자 액션을 처리
    handleUserAction: function(data) {
        const { action, payload } = data;
        
        switch (action) {
            case 'SIGN':      // 서명 처리
                this.processSignature(payload);
                break;
            case 'APPROVE':   // 승인 처리
                this.processApproval(payload);
                break;
        }
    },

    // 데이터 처리 메서드들
    // 실제 구현 시에는 API 호출이나 데이터베이스 저장 등의 로직이 들어갑니다
    saveContractData: function(data) {
        // 계약서 데이터 저장 구현
        console.log('계약서 데이터 저장:', data);
        // 외부 API 호출, localStorage 저장 등을 구현할 수 있습니다
    },

    updateContractData: function(data) {
        // 계약서 데이터 업데이트 구현
        console.log('계약서 데이터 업데이트:', data);
    },

    validateContractData: function(data) {
        // 계약서 데이터 유효성 검사 구현
        console.log('계약서 데이터 검증:', data);
        return true; // 검증 결과 반환
    },

    submitFormData: function(data) {
        // 폼 제출 구현
        console.log('폼 데이터 제출:', data);
    },

    validateFormData: function(data) {
        // 폼 유효성 검사 구현
        console.log('폼 데이터 검증:', data);
        return true;
    },

    processSignature: function(data) {
        // 서명 처리 구현
        console.log('서명 처리:', data);
    },

    processApproval: function(data) {
        // 승인 처리 구현
        console.log('승인 처리:', data);
    },

    // 이벤트 리스너 관리 메서드들
    // 특정 타입의 메시지에 대한 콜백 함수를 등록하고 관리합니다
    addEventListener: function(type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    },

    removeEventListener: function(type, callback) {
        if (!this.listeners[type]) return;
        this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    },

    notifyListeners: function(type, data) {
        if (!this.listeners[type]) return;
        this.listeners[type].forEach(callback => callback(data));
    }
};

// 스크립트 로드 시 브릿지 초기화
DataBridge.init();

// 전역에서 사용할 수 있도록 설정
window.DataBridge = DataBridge; 