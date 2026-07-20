// 简单的图表库
class Chart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        // 设置canvas分辨率，提高清晰度
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // 设置canvas实际尺寸为容器尺寸的2倍，提高清晰度
        this.canvas.width = rect.width * 2;
        this.canvas.height = rect.height * 2;
        
        // 设置CSS尺寸为容器尺寸
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx = this.canvas.getContext('2d');
        // 缩放上下文，确保绘制的内容清晰
        this.ctx.scale(2, 2);
        
        this.width = rect.width;
        this.height = rect.height;
        this.data = [20, 10, 60, 80, 40, 30];
        this.labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        this.animationFrame = null;
        
        // 监听窗口大小变化，重新调整canvas尺寸
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    // 调整canvas尺寸
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width * 2;
        this.canvas.height = rect.height * 2;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(2, 2);
        this.width = rect.width;
        this.height = rect.height;
        
        this.drawBehaviorChart();
    }

    // 绘制行为趋势图表
    drawBehaviorChart() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制数据线
        this.drawLine(this.data, this.labels);
        
        // 绘制数据点
        this.drawDataPoints(this.data);
        
        // 绘制标签
        this.drawLabels(this.labels);
    }

    // 更新数据并重新绘制
    updateData(newData) {
        this.data = newData;
        this.drawBehaviorChart();
    }

    // 开始实时更新
    startRealTimeUpdate() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        const update = () => {
            // 模拟实时数据变化
            const newData = this.data.map(value => {
                const change = (Math.random() - 0.5) * 10;
                return Math.max(0, Math.min(100, value + change));
            });
            this.updateData(newData);
            this.animationFrame = requestAnimationFrame(update);
        };
        
        // 每2秒更新一次
        setInterval(() => {
            const newData = this.data.map(value => {
                const change = (Math.random() - 0.5) * 10;
                return Math.max(0, Math.min(100, value + change));
            });
            this.updateData(newData);
        }, 2000);
    }

    // 绘制网格
    drawGrid() {
        this.ctx.strokeStyle = '#e8eaed';
        this.ctx.lineWidth = 1;
        
        // 水平网格线
        for (let i = 0; i <= 5; i++) {
            const y = (this.height - 60) * (i / 5) + 30;
            this.ctx.beginPath();
            this.ctx.moveTo(60, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();
        }
        
        // 垂直网格线
        for (let i = 0; i <= 5; i++) {
            const x = 60 + (this.width - 100) * (i / 5);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 30);
            this.ctx.lineTo(x, this.height - 30);
            this.ctx.stroke();
        }
    }

    // 绘制数据线
    drawLine(data, labels) {
        this.ctx.strokeStyle = '#1a73e8';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // 计算数据点坐标
        const points = [];
        for (let i = 0; i < data.length; i++) {
            const x = 60 + (this.width - 100) * (i / (data.length - 1));
            const y = this.height - 30 - (data[i] / 100) * (this.height - 60);
            points.push({ x, y });
        }
        
        // 绘制连续平滑的曲线
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        // 使用三次贝塞尔曲线绘制更加平滑的曲线
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i - 1];
            const currPoint = points[i];
            
            // 计算控制点，使曲线更加平滑自然
            const controlPoint1 = {
                x: prevPoint.x + (currPoint.x - prevPoint.x) * 0.3,
                y: prevPoint.y
            };
            
            const controlPoint2 = {
                x: currPoint.x - (currPoint.x - prevPoint.x) * 0.3,
                y: currPoint.y
            };
            
            // 绘制三次贝塞尔曲线
            this.ctx.bezierCurveTo(
                controlPoint1.x, controlPoint1.y,
                controlPoint2.x, controlPoint2.y,
                currPoint.x, currPoint.y
            );
        }
        
        this.ctx.stroke();
        
        // 添加浅蓝色渐变填充，使曲线更加美观
        const gradient = this.ctx.createLinearGradient(0, 30, 0, this.height - 30);
        gradient.addColorStop(0, 'rgba(26, 115, 232, 0.3)');
        gradient.addColorStop(1, 'rgba(26, 115, 232, 0.05)');
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        // 填充路径也使用相同的平滑曲线
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i - 1];
            const currPoint = points[i];
            
            const controlPoint1 = {
                x: prevPoint.x + (currPoint.x - prevPoint.x) * 0.3,
                y: prevPoint.y
            };
            
            const controlPoint2 = {
                x: currPoint.x - (currPoint.x - prevPoint.x) * 0.3,
                y: currPoint.y
            };
            
            this.ctx.bezierCurveTo(
                controlPoint1.x, controlPoint1.y,
                controlPoint2.x, controlPoint2.y,
                currPoint.x, currPoint.y
            );
        }
        
        this.ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        this.ctx.lineTo(this.width - 40, this.height - 30);
        this.ctx.lineTo(60, this.height - 30);
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    // 绘制数据点 - 不绘制圆点，保持曲线美观
    drawDataPoints(data) {
        // 不绘制数据点，只保留曲线
    }

    // 绘制标签
    drawLabels(labels) {
        this.ctx.fillStyle = '#5f6368';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        
        for (let i = 0; i < labels.length; i++) {
            const x = 60 + (this.width - 100) * (i / (labels.length - 1));
            const y = this.height - 10;
            this.ctx.fillText(labels[i], x, y);
        }
        
        // 绘制Y轴标签
        this.ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = (this.height - 60) * (i / 5) + 30;
            const value = 100 - (i * 20);
            this.ctx.fillText(value + '%', 55, y + 5);
        }
        
        // 绘制图表标题
        this.ctx.textAlign = 'center';
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillText('行为趋势分析', this.width / 2, 20);
    }

    // 绘制3D行为模型
    drawBehaviorModel() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制简单的3D模型
        this.ctx.fillStyle = '#e8f0fe';
        this.ctx.strokeStyle = '#1a73e8';
        this.ctx.lineWidth = 2;
        
        // 绘制头部
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 3, 20, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // 绘制身体
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 3 + 20);
        this.ctx.lineTo(this.width / 2, this.height / 3 + 60);
        this.ctx.stroke();
        
        // 绘制手臂
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 3 + 30);
        this.ctx.lineTo(this.width / 2 - 30, this.height / 3 + 50);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 3 + 30);
        this.ctx.lineTo(this.width / 2 + 30, this.height / 3 + 50);
        this.ctx.stroke();
        
        // 绘制腿部
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 3 + 60);
        this.ctx.lineTo(this.width / 2 - 20, this.height / 3 + 100);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 3 + 60);
        this.ctx.lineTo(this.width / 2 + 20, this.height / 3 + 100);
        this.ctx.stroke();
        
        // 绘制地面
        this.ctx.beginPath();
        this.ctx.moveTo(50, this.height / 3 + 100);
        this.ctx.lineTo(this.width - 50, this.height / 3 + 100);
        this.ctx.stroke();
        
        // 绘制标签
        this.ctx.fillStyle = '#5f6368';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('行走姿势', this.width / 2, this.height - 20);
    }
}