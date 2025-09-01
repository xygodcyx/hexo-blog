document.addEventListener("DOMContentLoaded", () => {
  // 仅文章页面执行
  console.log("post-content");
  if (!document.querySelector("#post")) return;

  // 创建侧边栏HTML结构
  const createSidebarStructure = () => {
    const sidebarContainer = document.createElement('aside');
    sidebarContainer.id = 'anchor-sidebar-container';
    
    const sidebar = document.createElement('div');
    sidebar.id = 'anchor-sidebar';
    
    const anchorList = document.createElement('ul');
    anchorList.className = 'anchor-list';
    
    sidebar.appendChild(anchorList);
    sidebarContainer.appendChild(sidebar);
    
    // 将侧边栏插入到页面中
    document.body.appendChild(sidebarContainer);
    
    return {
      sidebar,
      anchorList
    };
  };

  const generateAnchorSidebar = () => {
    // 创建侧边栏结构
    const { sidebar, anchorList } = createSidebarStructure();

    // 添加激活类
    setTimeout(() => sidebar.classList.add("active"));

    const content = document.querySelector("#post");
    const headings = content.querySelectorAll("h1, h2, h3, h4");

    // 没有标题则隐藏整个侧边栏
    if (headings.length === 0) {
      sidebar.style.display = "none";
      return;
    }

    // 生成目录结构
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));

      // 跳过h1（通常作为标题）
      if (level === 1) return;

      // 确保标题有ID
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const listItem = document.createElement("li");
      listItem.className = `anchor-item level-${level}`;
      listItem.dataset.target = heading.id;

      const anchorLink = document.createElement("a");
      anchorLink.href = `#${heading.id}`;
      anchorLink.textContent = heading.textContent;

      // 添加点击事件
      anchorLink.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToHeading(heading.id);
      });

      listItem.appendChild(anchorLink);
      anchorList.appendChild(listItem);
    });

    // 初始化滚动监听
    initScrollTracking(anchorList);
  };

  // 滚动到指定标题位置
  const scrollToHeading = (id) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const offsetPosition = targetElement.offsetTop;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // 更新URL（避免页面跳转）
      history.pushState(null, null, `#${id}`);
    }
  };

  // 初始化滚动跟踪
  const initScrollTracking = (anchorList) => {
    const sidebar = document.getElementById("anchor-sidebar");
    const anchorItems = document.querySelectorAll(".anchor-item");

    let ticking = false;

    // 滚动监听函数
    const updateActiveAnchor = () => {
      const scrollPosition = window.scrollY ;

      // 找到当前活动的标题
      let currentActive = null;
      anchorItems.forEach((item) => {
        item.classList.remove("active");
        const target = document.getElementById(item.dataset.target);
        if (target) {
          const targetOffset = target.offsetTop;
          if (scrollPosition >= targetOffset) {
            currentActive = item;
          }
        }
      });

      // 设置活动项
      if (currentActive) {
        currentActive.classList.add("active");

        // // 确保活动项在侧边栏中可见
        // const listRect = anchorList.getBoundingClientRect();
        // const itemRect = currentActive.getBoundingClientRect();

        // if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
        //   currentActive.scrollIntoView({ behavior: "smooth", block: "center" });
        // }
      }

      ticking = false;
    };

    // 滚动监听（带节流）
    window.addEventListener("scroll", () => {
      console.log("scroll")
      if (!ticking) {
        window.requestAnimationFrame(updateActiveAnchor);
        ticking = true;
      }
    });

    // 初始更新
    updateActiveAnchor();
  };

  // 初始化
  generateAnchorSidebar()
});