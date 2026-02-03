// 全新设计的菜单交互功能

// 为所有一级菜单项添加点击事件
function addFirstLevelMenuEvents() {
    document.querySelectorAll('.nav-item > .nav-link').forEach(navLink => {
        // 移除已存在的事件监听器，避免重复绑定
        navLink.removeEventListener('click', firstLevelMenuClickHandler);
        navLink.addEventListener('click', firstLevelMenuClickHandler);
    });
}

// 一级菜单点击事件处理函数
function firstLevelMenuClickHandler(e) {
    const navItem = this.closest('.nav-item');
    const isDropdown = navItem.classList.contains('dropdown');
    
    // 处理一级菜单点击（下拉菜单）
    if (isDropdown) {
        e.preventDefault();
        
        const subNav = navItem.querySelector('.sub-nav');
        const isExpanded = navItem.classList.contains('active');
        
        // 关闭所有其他一级菜单
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        dropdownItems.forEach(item => {
            if (item !== navItem) {
                const otherSubNav = item.querySelector('.sub-nav');
                if (otherSubNav) {
                    otherSubNav.classList.remove('show');
                }
                item.classList.remove('active');
            }
        });
        
        // 切换当前菜单的展开/收缩状态
        if (subNav) {
            if (isExpanded) {
                subNav.classList.remove('show');
                navItem.classList.remove('active');
            } else {
                subNav.classList.add('show');
                navItem.classList.add('active');
            }
        }
    }
}

// 为所有二级菜单项添加点击事件
function addSecondLevelMenuEvents() {
    document.querySelectorAll('.sub-nav .nav-link').forEach(navLink => {
        // 移除已存在的事件监听器，避免重复绑定
        navLink.removeEventListener('click', secondLevelMenuClickHandler);
        navLink.addEventListener('click', secondLevelMenuClickHandler);
    });
}

// 二级菜单点击事件处理函数
function secondLevelMenuClickHandler(e) {
    const subNavItem = this.closest('.nav-item');
    const parentDropdown = subNavItem.closest('.nav-item.dropdown');
    
    // 防止事件冒泡到一级菜单
    e.stopPropagation();
    
    // 保存是否为外部链接的状态
    const isExternalLink = this.getAttribute('href') && this.getAttribute('href') !== '#';
    
    // 专门处理智能委托菜单项
    const navText = this.querySelector('.nav-text');
    if (navText && navText.textContent.trim() === '智能委托') {
        // 确保智能委托菜单项总是跳转到create-delegation.html
        window.location.href = 'create-delegation.html';
        return;
    }
    
    // 对于外部链接，只执行必要的状态更新，然后执行跳转
    if (isExternalLink) {
        // 执行跳转，状态更新将在新页面加载时处理
        return;
    }
    
    // 对于非外部链接，阻止默认行为并执行完整逻辑
    e.preventDefault();
    
    // 移除所有二级菜单的激活状态
    document.querySelectorAll('.sub-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加当前二级菜单的激活状态
    subNavItem.classList.add('active');
    
    // 确保父级一级菜单处于激活状态
    if (parentDropdown) {
        // 关闭所有其他一级菜单
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        dropdownItems.forEach(item => {
            if (item !== parentDropdown) {
                const otherSubNav = item.querySelector('.sub-nav');
                if (otherSubNav) {
                    otherSubNav.classList.remove('show');
                }
                item.classList.remove('active');
            }
        });
        
        // 激活当前一级菜单
        parentDropdown.classList.add('active');
        
        // 确保子菜单显示
        const subNav = parentDropdown.querySelector('.sub-nav');
        if (subNav) {
            subNav.classList.add('show');
        }
    }
}

// 个人中心下拉菜单功能
function initializeUserDropdown() {
    const userInfoDropdown = document.querySelector('.user-info-dropdown');
    if (userInfoDropdown) {
        const userAvatar = userInfoDropdown.querySelector('.user-avatar');
        const dropdownMenu = userInfoDropdown.querySelector('.user-dropdown-menu');
        
        if (userAvatar && dropdownMenu) {
            // 移除已存在的事件监听器，避免重复绑定
            userAvatar.removeEventListener('click', userAvatarClickHandler);
            userAvatar.addEventListener('click', userAvatarClickHandler);
            
            // 点击页面其他地方关闭下拉菜单
            document.removeEventListener('click', closeUserDropdownHandler);
            document.addEventListener('click', closeUserDropdownHandler);
        }
    }
}

// 个人中心头像点击事件处理函数
function userAvatarClickHandler(e) {
    e.stopPropagation();
    const userInfoDropdown = this.closest('.user-info-dropdown');
    const dropdownMenu = userInfoDropdown.querySelector('.user-dropdown-menu');
    const isVisible = dropdownMenu.style.display === 'block';
    dropdownMenu.style.display = isVisible ? 'none' : 'block';
}

// 关闭个人中心下拉菜单的事件处理函数
function closeUserDropdownHandler(e) {
    const userInfoDropdown = document.querySelector('.user-info-dropdown');
    if (userInfoDropdown) {
        const dropdownMenu = userInfoDropdown.querySelector('.user-dropdown-menu');
        if (!userInfoDropdown.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    }
}

// 初始化所有菜单交互
function initializeMenu() {
    // 添加一级菜单点击事件
    addFirstLevelMenuEvents();
    
    // 添加二级菜单点击事件
    addSecondLevelMenuEvents();
    
    // 初始化个人中心下拉菜单
    initializeUserDropdown();
    
    // 获取当前页面的文件名
    const currentPage = window.location.pathname.split('/').pop();
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移除所有激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 为当前页面的导航项添加激活状态
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // 提取href的路径部分，忽略查询参数
            const hrefPath = href.split('?')[0];
            
            // 提取hrefPath的文件名部分，用于与currentPage比较
            const hrefFileName = hrefPath.split('/').pop();
            
            // 处理特殊页面情况
            const isSpecialPage = 
                (currentPage === 'create-delegation.html' && hrefFileName === 'create-delegation.html') ||
                (currentPage === 'create-case-collection.html' && hrefFileName === 'activities.html') ||
                (currentPage === 'case-collection-detail.html' && hrefFileName === 'activities.html');
            
            if (hrefFileName === currentPage || isSpecialPage) {
                // 激活当前二级菜单
                const navItem = link.closest('.nav-item');
                navItem.classList.add('active');
                
                // 激活父级一级菜单（如果有）
                const parentDropdown = navItem.closest('.nav-item.dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.add('active');
                    // 显示子菜单
                    const subNav = parentDropdown.querySelector('.sub-nav');
                    if (subNav) {
                        subNav.classList.add('show');
                    }
                }
            } else if (href === 'index.html' && currentPage === 'index.html') {
                // 处理首页的特殊情况
                const navItem = link.closest('.nav-item');
                navItem.classList.add('active');
            }
        }
    });
}

// 页面加载完成后执行初始化
// 注意：主初始化逻辑已移至layout.html中的loadComponents函数
// 这里保留此事件监听器以确保兼容性
window.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
});