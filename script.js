// 全局变量
var currentUser = '';
var userRole = '';

// 初始化
function init() {
    // 检查用户是否登录
    checkLoginStatus();
    // 加载用户信息
    loadUserInfo();
    // 初始化模块
    initModules();
    // 启动时间更新
    startTimeUpdate();
    // 加载模拟数据
    loadMockData();
}

// 检查用户登录状态
function checkLoginStatus() {
    var username = localStorage.getItem('username');
    var role = localStorage.getItem('userRole');
    
    if (!username || !role) {
        // 未登录，跳转到登录页面
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = username;
    userRole = role;
}

// 加载用户信息
function loadUserInfo() {
    document.getElementById('current-user').textContent = currentUser;
    document.getElementById('user-role-badge').textContent = userRole === 'admin' ? '管理员' : '用户';
    
    // 显示管理员专属内容
    if (userRole === 'admin') {
        document.querySelectorAll('.admin-only').forEach(function(element) {
            element.classList.add('visible');
        });
        // 管理员直接显示设备管理界面
        switchModule('device');
    } else {
        // 显示用户专属内容
        document.querySelectorAll('.user-only').forEach(function(element) {
            element.classList.add('visible');
        });
        // 普通用户直接显示行为监测界面
        switchModule('behavior');
    }
}

// 初始化模块
function initModules() {
    // 模块切换
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var moduleId = this.getAttribute('data-module');
            switchModule(moduleId);
        });
    });
    
    // 紧急呼叫按钮
    document.querySelector('.emergency-btn').addEventListener('click', showEmergencyModal);
    
    // 保存联系人信息
    document.getElementById('save-contacts').addEventListener('click', saveContacts);
}

// 切换模块
function switchModule(moduleId) {
    // 检查权限
    if (moduleId === 'device' && userRole !== 'admin') {
        showPermissionModal();
        return;
    }
    
    // 管理员只能访问设备管理界面
    if (userRole === 'admin' && moduleId !== 'device') {
        return;
    }
    
    // 用户只能访问行为监测和系统设置界面
    if (userRole === 'user' && (moduleId === 'device' || moduleId === 'overview' || moduleId === 'location' || moduleId === 'history')) {
        return;
    }
    
    // 更新导航项状态
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
    });
    var navItem = document.querySelector('[data-module="' + moduleId + '"]');
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // 更新模块显示
    document.querySelectorAll('.module').forEach(function(module) {
        module.classList.remove('active');
    });
    var module = document.getElementById(moduleId);
    if (module) {
        module.classList.add('active');
    }
    
    // 加载模块数据
    loadModuleData(moduleId);
}

// 加载模块数据
function loadModuleData(moduleId) {
    switch (moduleId) {
        case 'overview':
            loadOverviewData();
            break;
        case 'behavior':
            loadBehaviorData();
            break;
        case 'location':
            loadLocationData();
            break;
        case 'history':
            loadHistoryData();
            break;
        case 'device':
            loadDeviceData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// 启动时间更新
function startTimeUpdate() {
    function updateTime() {
        var now = new Date();
        var timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// 加载模拟数据
function loadMockData() {
    // 模拟数据加载
    setTimeout(function() {
        // 数据总览
        document.getElementById('latest-behavior').textContent = '行走';
        document.getElementById('status-time').textContent = new Date().toLocaleTimeString();
        
        // 信号质量
        document.getElementById('channel-quality').textContent = '-50dB';
        document.getElementById('phase-change').textContent = '2°';
        
        // 行为监测
        document.getElementById('current-behavior').textContent = '行走';
        document.getElementById('behavior-time').textContent = new Date().toLocaleTimeString();
        
        // 活动量统计
        document.getElementById('today-activity').textContent = '3200步';
        document.getElementById('steps-count').textContent = '3200步';
        document.getElementById('activity-duration').textContent = '45分钟';
        
        // 室内定位
        document.getElementById('indoor-position').textContent = '客厅';
        document.getElementById('indoor-accuracy').textContent = '1.2m';
        
        // 定位精度
        document.getElementById('location-precision').textContent = '5m';
        document.getElementById('location-time').textContent = new Date().toLocaleTimeString();
        
        // 设备状态
        document.getElementById('last-sync').textContent = '刚刚';
    }, 500);
}

// 加载总览数据
function loadOverviewData() {
    console.log('加载总览数据');
}

// 加载行为监测数据
function loadBehaviorData() {
    console.log('加载行为监测数据');
    
    // 初始化行为趋势图表
    setTimeout(function() {
        var behaviorChart = new Chart('behaviorChart');
        behaviorChart.drawBehaviorChart();
        // 启动实时更新
        behaviorChart.startRealTimeUpdate();
    }, 100);
    
    // 启动行为历史记录实时更新
    startBehaviorHistoryUpdate();
}

// 启动行为历史记录实时更新
function startBehaviorHistoryUpdate() {
    var behaviors = ['坐下', '静止', '躺下', '站立', '行走'];
    var statuses = ['正常', '正常', '正常', '正常', '正常'];
    
    setInterval(function() {
        // 模拟新行为记录
        var newBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
        var newStatus = Math.random() > 0.8 ? '异常' : 'normal';
        var now = new Date();
        var timeString = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + 
                       now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
        
        // 更新当前行为
        document.getElementById('current-behavior').textContent = newBehavior;
        document.getElementById('behavior-status').textContent = newStatus === 'normal' ? '正常' : '异常';
        document.getElementById('behavior-status').className = 'value status-' + newStatus;
        document.getElementById('behavior-time').textContent = now.toLocaleString();
        
        // 添加新的历史记录
        var historyGrid = document.getElementById('behavior-history');
        var newItem = document.createElement('div');
        newItem.className = 'behavior-history-item';
        newItem.innerHTML = `
            <span class="behavior-time">${timeString}</span>
            <div class="behavior-name">${newBehavior}</div>
            <span class="behavior-status ${newStatus}">${newStatus === 'normal' ? '正常' : '异常'}</span>
        `;
        
        // 插入到最前面
        if (historyGrid.firstChild) {
            historyGrid.insertBefore(newItem, historyGrid.firstChild);
        } else {
            historyGrid.appendChild(newItem);
        }
        
        // 保持最多12条记录
        while (historyGrid.children.length > 12) {
            historyGrid.removeChild(historyGrid.lastChild);
        }
    }, 3000);
}

// 加载定位数据
function loadLocationData() {
    console.log('加载定位数据');
}

// 加载历史记录数据
function loadHistoryData() {
    console.log('加载历史记录数据');
}

// 加载设备数据
function loadDeviceData() {
    console.log('加载设备数据');
}

// 加载设置数据
function loadSettingsData() {
    console.log('加载设置数据');
}

// 绑定设备
function bindDevice() {
    var deviceName = document.getElementById('device-name').value;
    var wifiSsid = document.getElementById('wifi-ssid').value;
    var wifiPassword = document.getElementById('wifi-password').value;
    var deviceMac = document.getElementById('device-mac').value;
    var deviceLocation = document.getElementById('device-location').value;
    
    if (!deviceName || !wifiSsid || !wifiPassword || !deviceMac) {
        alert('请填写完整的设备信息');
        return;
    }
    
    // 模拟设备绑定
    alert('设备绑定成功！');
    
    // 重置表单
    document.getElementById('device-name').value = '';
    document.getElementById('wifi-ssid').value = '';
    document.getElementById('wifi-password').value = '';
    document.getElementById('device-mac').value = '';
    document.getElementById('device-location').value = 'living-room';
    
    // 更新设备列表
    var deviceList = document.getElementById('device-list');
    var newDevice = document.createElement('div');
    newDevice.className = 'device-item';
    newDevice.innerHTML = `
        <div class="device-info">
            <span class="device-icon">📡</span>
            <div class="device-details">
                <span class="device-name">${deviceName}</span>
                <span class="device-status online">在线</span>
            </div>
        </div>
        <div class="device-actions">
            <button class="btn btn-secondary btn-sm" onclick="testDevice()">测试</button>
            <button class="btn btn-danger btn-sm" onclick="unbindDevice()">解绑</button>
        </div>
    `;
    deviceList.appendChild(newDevice);
}

// 测试设备
function testDevice() {
    alert('设备测试中...\n\n测试结果：设备正常');
}

// 解绑设备
function unbindDevice() {
    if (confirm('确定要解绑此设备吗？')) {
        alert('设备解绑成功！');
        // 移除设备项
        event.target.closest('.device-item').remove();
    }
}

// 旋转模型
function rotateModel() {
    console.log('旋转模型');
    // 这里可以添加模型旋转逻辑
}

// 重置模型
function resetModel() {
    console.log('重置模型');
    // 这里可以添加模型重置逻辑
}

// 显示紧急呼叫弹窗
function showEmergencyModal() {
    document.getElementById('emergencyModal').classList.add('show');
}

// 显示权限提示弹窗
function showPermissionModal() {
    document.getElementById('permissionModal').classList.add('show');
}

// 关闭弹窗
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// 确认紧急呼叫
function confirmEmergency() {
    alert('紧急呼叫已发送！\n\n联系人将收到通知。');
    closeModal('emergencyModal');
}

// 处理告警
function handleAlert() {
    alert('告警已标记为处理！');
    closeModal('alertModal');
}

// 保存联系人信息
function saveContacts() {
    var contactName = document.getElementById('contact-name').value;
    var contactRelation = document.getElementById('contact-relation').value;
    var contactPhone = document.getElementById('contact-phone').value;
    
    if (!contactName || !contactRelation || !contactPhone) {
        alert('请填写完整的联系人信息');
        return;
    }
    
    // 模拟保存
    alert('联系人信息保存成功！');
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除本地存储
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        // 跳转到登录页面
        window.location.href = 'index.html';
    }
}

// 显示告警设置
function showAlertSettings() {
    alert('告警设置功能开发中...');
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);