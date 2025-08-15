document.addEventListener("DOMContentLoaded", () => {
  // 为每个代码块添加复制按钮
  document.querySelectorAll("pre > code").forEach((codeBlock) => {
    const preBlock = codeBlock.parentNode;

    // 创建复制按钮
    const copyBtn = document.createElement("button");
    copyBtn.className = "prism-copy-btn";
    copyBtn.textContent = "Copy";

    // 添加到代码块
    preBlock.appendChild(copyBtn);

    // 添加点击事件
    let id = null;
    copyBtn.addEventListener("click", () => {
      const textToCopy = codeBlock.innerText;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          copyBtn.textContent = "Copied!";
          clearTimeout(id);
          id = setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
        })
        .catch((err) => {
          console.error("copy failed:", err);
          copyBtn.textContent = "Error";
          clearTimeout(id);
          id = setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
        });
    });

    // 确保 pre 元素有相对定位
    preBlock.style.position = "relative";
  });
});
