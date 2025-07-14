/**
 * 动画优化脚本
 * 用于分析和优化页面中的动画性能
 */

class AnimationOptimizer {
    constructor() {
        this.animationRegistry = new Map();
        this.performanceMetrics = {
            fps: 0,
            animationCount: 0,
            heavyAnimations: [],
            recommendations: []
        };
        this.observer = null;
        this.isMonitoring = false;
    }

    /**
     * 初始化动画优化器
     */
    init() {
        this.setupIntersectionObserver();
        this.optimizeExistingAnimations();
        this.addPerformanceMonitoring();
        console.log('🚀 动画优化器已启动');
    }

    /**
     * 设置交叉观察器，只对可见元素启用动画
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    // 元素进入视口，启用动画
                    element.classList.add('animate-enabled');
                    element.style.animationPlayState = 'running';
                } else {
                    // 元素离开视口，暂停动画
                    element.classList.remove('animate-enabled');
                    element.style.animationPlayState = 'paused';
                }
            });
        }, {
            rootMargin: '50px', // 提前50px开始加载
            threshold: 0.1
        });

        // 观察所有动画元素
        this.observeAnimatedElements();
    }

    /**
     * 观察所有动画元素
     */
    observeAnimatedElements() {
        const animatedSelectors = [
            '.floating-animation',
            '.pulse-animation',
            '.glow-animation',
            '.particle',
            '.workflow-arrow',
            '.card-enhanced',
            '.btn-enhanced',
            '.stat-number',
            '.floating-particle',
            '.tech-grid',
            '.tech-particles'
        ];

        animatedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.observer.observe(element);
                // 初始状态暂停动画
                element.style.animationPlayState = 'paused';
            });
        });
    }

    /**
     * 优化现有动画
     */
    optimizeExistingAnimations() {
        // 移除重度动画
        this.removeHeavyAnimations();
        
        // 优化粒子系统
        this.optimizeParticleSystem();
        
        // 合并相似动画
        this.mergeSimilarAnimations();
        
        // 添加GPU加速
        this.enableGPUAcceleration();
    }

    /**
     * 移除重度动画（超过10秒的动画）
     */
    removeHeavyAnimations() {
        const heavyAnimationSelectors = [
            '.tech-hexagon-pattern',
            '.tech-beams',
            '.tech-data-stream',
            '.prerequisites-pattern-animate'
        ];

        heavyAnimationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 移除动画，保留静态样式
                element.style.animation = 'none';
                element.classList.add('static-optimized');
                this.performanceMetrics.recommendations.push(
                    `移除了重度动画: ${selector}`
                );
            });
        });
    }

    /**
     * 优化粒子系统
     */
    optimizeParticleSystem() {
        const particles = document.querySelectorAll('.particle');
        const maxParticles = window.innerWidth < 768 ? 3 : 5; // 移动端减少粒子数量

        particles.forEach((particle, index) => {
            if (index >= maxParticles) {
                particle.style.display = 'none';
                return;
            }

            // 优化粒子动画
            particle.style.willChange = 'transform';
            particle.style.transform = 'translateZ(0)'; // 启用GPU加速
            
            // 减少动画复杂度
            const duration = window.innerWidth < 768 ? '12s' : '15s';
            particle.style.animationDuration = duration;
        });

        this.performanceMetrics.recommendations.push(
            `优化粒子系统: 限制为${maxParticles}个粒子`
        );
    }

    /**
     * 合并相似动画
     */
    mergeSimilarAnimations() {
        // 统一浮动动画
        const floatingElements = document.querySelectorAll(
            '.floating-animation, .floating-particle, .prerequisites-orb-float'
        );
        
        floatingElements.forEach(element => {
            element.classList.remove('floating-particle', 'prerequisites-orb-float');
            element.classList.add('floating-animation');
        });

        // 统一脉冲动画
        const pulseElements = document.querySelectorAll(
            '.stat-pulse, .pulse-animation, .prerequisites-badge-enhanced'
        );
        
        pulseElements.forEach(element => {
            element.classList.remove('stat-pulse', 'prerequisites-badge-enhanced');
            element.classList.add('pulse-animation');
        });

        this.performanceMetrics.recommendations.push('合并了相似的动画效果');
    }

    /**
     * 启用GPU加速
     */
    enableGPUAcceleration() {
        const animatedElements = document.querySelectorAll(
            '.floating-animation, .pulse-animation, .glow-animation, .card-enhanced, .btn-enhanced'
        );

        animatedElements.forEach(element => {
            element.style.willChange = 'transform';
            element.style.transform = 'translateZ(0)';
            element.classList.add('gpu-accelerated');
        });

        this.performanceMetrics.recommendations.push('为动画元素启用了GPU加速');
    }

    /**
     * 添加性能监控
     */
    addPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        const monitorFrame = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // 如果FPS过低，进一步优化
                if (this.performanceMetrics.fps < 30) {
                    this.emergencyOptimization();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(monitorFrame);
            }
        };

        this.isMonitoring = true;
        requestAnimationFrame(monitorFrame);
    }

    /**
     * 紧急优化（当FPS过低时）
     */
    emergencyOptimization() {
        console.warn('⚠️ 检测到低FPS，启动紧急优化');
        
        // 暂停所有非关键动画
        const nonCriticalAnimations = document.querySelectorAll(
            '.particle, .tech-grid, .floating-animation'
        );
        
        nonCriticalAnimations.forEach(element => {
            element.style.animationPlayState = 'paused';
        });

        // 减少动画持续时间
        const allAnimatedElements = document.querySelectorAll('[style*="animation"]');
        allAnimatedElements.forEach(element => {
            const currentDuration = element.style.animationDuration;
            if (currentDuration) {
                const duration = parseFloat(currentDuration);
                element.style.animationDuration = (duration * 0.5) + 's';
            }
        });

        this.performanceMetrics.recommendations.push('执行了紧急性能优化');
    }

    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        const animatedElements = document.querySelectorAll('[style*="animation"]:not([style*="none"])');
        this.performanceMetrics.animationCount = animatedElements.length;

        // 检测重度动画
        animatedElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const duration = parseFloat(computedStyle.animationDuration);
            
            if (duration > 10) {
                this.performanceMetrics.heavyAnimations.push({
                    element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
                    duration: duration + 's'
                });
            }
        });

        return this.performanceMetrics;
    }

    /**
     * 应用减少动画偏好
     */
    applyReducedMotionPreference() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('🎯 检测到减少动画偏好，禁用所有动画');
            
            const allAnimatedElements = document.querySelectorAll('*');
            allAnimatedElements.forEach(element => {
                element.style.animation = 'none';
                element.style.transition = 'none';
            });

            this.performanceMetrics.recommendations.push('应用了减少动画偏好设置');
        }
    }

    /**
     * 清理资源
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.isMonitoring = false;
        console.log('🧹 动画优化器已清理');
    }

    /**
     * 动态调整动画质量
     */
    adjustAnimationQuality(quality = 'auto') {
        const qualities = {
            high: { particles: 10, duration: 1, complexity: 1 },
            medium: { particles: 5, duration: 0.7, complexity: 0.8 },
            low: { particles: 3, duration: 0.5, complexity: 0.6 },
            auto: null // 根据设备性能自动调整
        };

        if (quality === 'auto') {
            // 根据设备性能自动选择
            const deviceMemory = navigator.deviceMemory || 4;
            const hardwareConcurrency = navigator.hardwareConcurrency || 4;
            
            if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
                quality = 'high';
            } else if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
                quality = 'medium';
            } else {
                quality = 'low';
            }
        }

        const settings = qualities[quality];
        if (!settings) return;

        // 调整粒子数量
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.display = index < settings.particles ? 'block' : 'none';
        });

        // 调整动画持续时间
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            const currentDuration = element.style.animationDuration;
            if (currentDuration) {
                const duration = parseFloat(currentDuration);
                element.style.animationDuration = (duration * settings.duration) + 's';
            }
        });

        console.log(`🎨 动画质量已调整为: ${quality}`);
        this.performanceMetrics.recommendations.push(`动画质量调整为: ${quality}`);
    }
}

// 导出优化器类
window.AnimationOptimizer = AnimationOptimizer;

// 自动初始化（如果在浏览器环境中）
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const optimizer = new AnimationOptimizer();
        optimizer.init();
        optimizer.applyReducedMotionPreference();
        
        // 根据设备性能自动调整
        optimizer.adjustAnimationQuality('auto');
        
        // 将优化器实例暴露到全局，方便调试
        window.animationOptimizer = optimizer;
        
        // 5秒后输出性能报告
        setTimeout(() => {
            console.log('📊 动画性能报告:', optimizer.getPerformanceReport());
        }, 5000);
    });
} else if (typeof window !== 'undefined') {
    // 如果DOM已经加载完成
    const optimizer = new AnimationOptimizer();
    optimizer.init();
    optimizer.applyReducedMotionPreference();
    optimizer.adjustAnimationQuality('auto');
    window.animationOptimizer = optimizer;
}
