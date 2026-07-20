// 全局变量
var selectedRole = 'admin';
var countdown = 60;
var timer = null;

// 初始化
function init() {
    setupFormValidation();
}

// 选择角色
function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-option').forEach(function(option) {
        option.classList.remove('selected');
    });
    document.querySelector('[data-role="' + role + '"]').classList.add('selected');
}

// 发送验证码
function sendVerifyCode() {
    var phone = document.getElementById('phone').value.trim();
    var phoneError = document.getElementById('phoneError');
    
    // 验证手机号
    if (!phone) {
        showError('phoneError', '请输入手机号');
        return;
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
        showError('phoneError', '请输入正确的手机号');
        return;
    } else {
        hideError('phoneError');
    }
    
    // 生成验证码
    var verifyCode = generateVerifyCode();
    console.log('验证码：' + verifyCode);
    
    // 显示提示
    alert('验证码已发送，请注意查收\n\n验证码：' + verifyCode);
    
    // 开始倒计时
    startCountdown();
}

// 生成随机验证码
function generateVerifyCode() {
    var code = '';
    var chars = '0123456789';
    for (var i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 开始倒计时
function startCountdown() {
    var sendCodeBtn = document.getElementById('sendCodeBtn');
    sendCodeBtn.disabled = true;
    
    timer = setInterval(function() {
        countdown--;
        sendCodeBtn.textContent = countdown + '秒后重新发送';
        
        if (countdown <= 0) {
            clearInterval(timer);
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '获取验证码';
            countdown = 60;
        }
    }, 1000);
}

// 设置表单验证
function setupFormValidation() {
    var form = document.getElementById('phoneLoginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var phone = document.getElementById('phone').value.trim();
        var verifyCode = document.getElementById('verifyCode').value.trim();
        
        var isValid = true;
        
        // 验证手机号
        if (!phone) {
            showError('phoneError', '请输入手机号');
            isValid = false;
        } else if (!/^1[3-9]\d{9}$/.test(phone)) {
            showError('phoneError', '请输入正确的手机号');
            isValid = false;
        } else {
            hideError('phoneError');
        }
        
        // 验证验证码
        if (!verifyCode) {
            showError('verifyCodeError', '请输入验证码');
            isValid = false;
        } else if (verifyCode.length !== 6) {
            showError('verifyCodeError', '请输入6位验证码');
            isValid = false;
        } else {
            hideError('verifyCodeError');
        }
        
        // 验证通过，模拟登录
        if (isValid) {
            // 保存用户角色到本地存储
            localStorage.setItem('userRole', selectedRole);
            localStorage.setItem('username', phone);
            // 登录成功
            showSuccessAnimation();
        }
    });
}

// 显示错误信息
function showError(elementId, message) {
    var errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// 隐藏错误信息
function hideError(elementId) {
    var errorElement = document.getElementById(elementId);
    errorElement.classList.remove('show');
}

// 显示登录成功动画
function showSuccessAnimation() {
    var successElement = document.getElementById('loginSuccess');
    successElement.classList.add('show');
    
    // 1.5秒后跳转到监测页面
    setTimeout(function() {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// 返回账号密码登录
function goToAccountLogin() {
    window.location.href = 'index.html';
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);