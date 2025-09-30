// 纯JavaScript实现
function scrollToHashAfterLoad() {
    const hash = window.location.hash;
    if (hash) {
        // 等待动态内容加载（例如评论），设置适当的延迟或使用回调
        setTimeout(() => {
            const element = document.getElementById(hash.substring(1)); // 移除#符号
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000); // 延迟时间根据实际加载速度调整
    }
}

// 在页面初始加载完成后执行
window.addEventListener('load', scrollToHashAfterLoad);