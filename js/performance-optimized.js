/**
 * 性能优化的JavaScript代码
 * 合并滚动事件监听器，优化DOM查询，提升整体性能
 */

class PerformanceOptimizer {
    constructor() {
        // 缓存DOM元素
        this.cachedElements = new Map();
        
        // 节流函数缓存
        this.throttledFunctions = new Map();
        
        // 滚动相关状态
        this.scrollState = {
            lastScrollY: 0,
            isScrolling: false,
            scrollDirection: 'down'
        };
        
        // 性能监控
        this.performanceMetrics = {
            scrollEvents: 0,
            domQueries: 0,
            animationFrames: 0
        };
    }

    /**
     * 初始化性能优化
     */
    init() {
        this.cacheCommonElements();
        this.setupOptimizedScrollHandler();
        this.setupIntersectionObserver();
        this.optimizeExistingEventListeners();
        this.setupPerformanceMonitoring();
        
        console.log('🚀 性能优化器已启动');
    }

    /**
     * 缓存常用DOM元素
     */
    cacheCommonElements() {
        const selectors = [
            'nav',
            '#back-to-top',
            '.hero-pattern',
            '#scroll-progress',
            '.fade-in-up',
            '.stat-pulse',
            '.ai-workflow-step'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 1) {
                this.cachedElements.set(selector, elements[0]);
            } else if (elements.length > 1) {
                this.cachedElements.set(selector, elements);
            }
        });

        this.performanceMetrics.domQueries += selectors.length;
    }

    /**
     * 获取缓存的元素
     */
    getCachedElement(selector) {
        if (!this.cachedElements.has(selector)) {
            const element = document.querySelector(selector);
            this.cachedElements.set(selector, element);
            this.performanceMetrics.domQueries++;
        }
        return this.cachedElements.get(selector);
    }

    /**
     * 节流函数
     */
    throttle(func, delay, key) {
        if (this.throttledFunctions.has(key)) {
            return this.throttledFunctions.get(key);
        }

        let timeoutId;
        let lastExecTime = 0;
        
        const throttledFunction = (...args) => {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };

        this.throttledFunctions.set(key, throttledFunction);
        return throttledFunction;
    }

    /**
     * 防抖函数
     */
    debounce(func, delay, key) {
        if (this.throttledFunctions.has(key)) {
            return this.throttledFunctions.get(key);
        }

        let timeoutId;
        const debouncedFunction = (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };

        this.throttledFunctions.set(key, debouncedFunction);
        return debouncedFunction;
    }

    /**
     * 设置优化的滚动处理器
     */
    setupOptimizedScrollHandler() {
        // 合并所有滚动相关功能到一个监听器中
        const optimizedScrollHandler = this.throttle(() => {
            this.performanceMetrics.scrollEvents++;
            
            const scrollY = window.pageYOffset;
            const scrollDirection = scrollY > this.scrollState.lastScrollY ? 'down' : 'up';
            
            // 使用requestAnimationFrame优化DOM操作
            requestAnimationFrame(() => {
                this.performanceMetrics.animationFrames++;
                
                // 更新滚动进度条
                this.updateScrollProgress(scrollY);
                
                // 更新导航栏状态
                this.updateNavigation(scrollY);
                
                // 更新返回顶部按钮
                this.updateBackToTop(scrollY);
                
                // 视差效果（如果需要）
                this.updateParallax(scrollY);
                
                // 更新滚动状态
                this.scrollState.lastScrollY = scrollY;
                this.scrollState.scrollDirection = scrollDirection;
            });
        }, 16, 'scroll'); // 60fps

        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }

    /**
     * 更新滚动进度条
     */
    updateScrollProgress(scrollY) {
        const progressBar = this.getCachedElement('#scroll-progress') || 
                           this.createProgressBar();
        
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollY / scrollHeight) * 100, 100);
            progressBar.style.width = scrollPercent + '%';
        }
    }

    /**
     * 创建滚动进度条
     */
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #0EA5E9, #6366F1);
            z-index: 9999;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);
        this.cachedElements.set('#scroll-progress', progressBar);
        return progressBar;
    }

    /**
     * 更新导航栏状态
     */
    updateNavigation(scrollY) {
        const nav = this.getCachedElement('nav');
        if (nav) {
            if (scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }
    }

    /**
     * 更新返回顶部按钮
     */
    updateBackToTop(scrollY) {
        const backToTopBtn = this.getCachedElement('#back-to-top');
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    /**
     * 更新视差效果
     */
    updateParallax(scrollY) {
        const heroSection = this.getCachedElement('.hero-pattern');
        if (heroSection && heroSection.style && scrollY < window.innerHeight) {
            // 只在hero区域可见时应用视差效果
            heroSection.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }

    /**
     * 设置交叉观察器
     */
    setupIntersectionObserver() {
        // 观察器用于淡入动画
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // 观察所有淡入元素
        const fadeInElements = this.cachedElements.get('.fade-in-up') || 
                              document.querySelectorAll('.fade-in-up');
        
        if (fadeInElements) {
            const elements = fadeInElements.length ? fadeInElements : [fadeInElements];
            elements.forEach(element => fadeInObserver.observe(element));
        }

        // 统计数字动画观察器
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatNumber(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statElements = document.querySelectorAll('.stat-pulse');
        statElements.forEach(element => statsObserver.observe(element));
    }

    /**
     * 动画统计数字
     */
    animateStatNumber(element) {
        const finalValue = element.textContent;
        const isPercentage = finalValue.includes('%');
        const isTime = finalValue.includes('分钟');
        const isPlus = finalValue.includes('+');
        
        let numericValue = parseInt(finalValue);
        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const increment = numericValue / 60; // 1秒内完成动画
        
        const animate = () => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
            }
            
            let displayValue = Math.floor(currentValue);
            if (isPercentage) displayValue += '%';
            if (isTime) displayValue += '分钟';
            if (isPlus) displayValue += '+';
            
            element.textContent = displayValue;
            
            if (currentValue < numericValue) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * 优化现有事件监听器
     */
    optimizeExistingEventListeners() {
        // 移动端菜单优化
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', this.debounce(() => {
                mobileMenu.classList.toggle('hidden');
            }, 100, 'mobile-menu'));
        }

        // 返回顶部按钮点击优化
        const backToTopBtn = this.getCachedElement('#back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', this.debounce((e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 300, 'back-to-top'));
        }

        // 键盘导航优化
        document.addEventListener('keydown', this.throttle((e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        }, 100, 'keyboard-nav'));

        document.addEventListener('mousedown', this.debounce(() => {
            document.body.classList.remove('keyboard-navigation');
        }, 100, 'mouse-nav'));
    }

    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        // 每5秒输出性能指标
        setInterval(() => {
            if (this.performanceMetrics.scrollEvents > 100) {
                console.warn('⚠️ 滚动事件过多:', this.performanceMetrics);
            }
        }, 5000);

        // 页面可见性变化时暂停不必要的操作
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏时暂停动画
                document.body.classList.add('page-hidden');
            } else {
                // 页面显示时恢复动画
                document.body.classList.remove('page-hidden');
            }
        });
    }

    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        return {
            ...this.performanceMetrics,
            cachedElements: this.cachedElements.size,
            throttledFunctions: this.throttledFunctions.size,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
            } : 'N/A'
        };
    }

    /**
     * 清理资源
     */
    destroy() {
        this.cachedElements.clear();
        this.throttledFunctions.clear();
        console.log('🧹 性能优化器已清理');
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    const initOptimizer = () => {
        const optimizer = new PerformanceOptimizer();
        optimizer.init();
        
        // 暴露到全局供调试使用
        window.performanceOptimizer = optimizer;
        
        // 5秒后输出性能报告
        setTimeout(() => {
            console.log('📊 性能优化报告:', optimizer.getPerformanceReport());
        }, 5000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOptimizer);
    } else {
        initOptimizer();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
