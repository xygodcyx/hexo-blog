---
title: hexo博客的搜索功能
tags:
  - 'hexo'
categories:
  - ''
date: 2025-11-04 10:32:08
---

## 准备工作

### 安装hexo-generator-searchdb

``` bash
npm i hexo-generator-searchdb
```

### 在_config.yml里配置搜索

``` yml
search:
  path: search.json
  field: post
  format: html
  limit: 10000
```

这一步只是让hexo为我们在public的根目录创建出search.json文件，供我们或者其他搜索插件使用，这里我们不使用其它插件而是自己实现搜索功能

### 下载fuse.js

``` bash
https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs
```

## 实现代码

### 添加搜索按钮

html结构：

``` html
 <button class="search-btn" id="open-search" title="搜索 (Ctrl+Shift+K)">
    <!-- <span class="search-icon">🔍</span> -->
    <span class="search-text">搜索</span>
    <span class="shortcut-key">Ctrl Shift K</span>
</button>
```

样式：

``` css
/* 搜索按钮 */
.search-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.search-btn:hover {
    border-color: #007bff;
    /* color: #007bff; */
    box-shadow: 0 2px 6px rgba(0, 123, 255, 0.15);
}

.search-icon {
    font-size: 1rem;
    line-height: 1;
}

.search-text {
    font-weight: 500;
}

.shortcut-key {
    margin-left: 6px;
    font-size: 12px;
    font-family: "Consolas", monospace;
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 2px 6px;
    color: #555;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    user-select: none;
}

.search-btn:hover .shortcut-key {
    border-color: #007bff;
    color: #007bff;
}
```

### 添加搜索结果模态框

html结构：

``` html
<div id="search-modal" class="search-modal" role="dialog" aria-hidden="true">
  <div class="search-dialog" role="document">
    <div class="search-header">
      <input
        type="text"
        id="search-input"
        class="search-input"
        placeholder="搜索文章标题或内容..."
        autocomplete="off"
      />
      <button class="search-close" id="close-search" aria-label="关闭搜索">&times;</button>
    </div>
    <div id="search-results" class="search-results"></div>
  </div>
</div>

```

样式:

``` css
/* 模态背景层 */
.search-modal {
    display: none;
    position: fixed;
    z-index: 9999;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    animation: fadeInBg 0.3s;
}

.search-modal.active {
    display: flex;
}

/* 搜索对话框主体 */
.search-dialog {
    background: #fff;
    width: 90%;
    max-width: 680px;
    margin: 80px auto;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    padding: 20px 24px;
    animation: slideDown 0.3s ease-out;
    display: flex;
    flex-direction: column;
}

/* 头部输入与关闭按钮 */
.search-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.search-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    outline: none;
    transition: 0.2s;
}

.search-input:focus {
    border-color: var(--accent-color, #007bff);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.search-close {
    margin-left: 8px;
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #aaa;
    transition: 0.2s;
}

.search-close:hover {
    color: #555;
}

/* 搜索结果容器 */
.search-results {
    max-height: 65vh;
    overflow-y: auto;
    padding-left: 6px;
    padding-right: 6px;
}

.search-results::-webkit-scrollbar {
    width: 6px;
}

.search-results::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

/* 单项结果 */
.search-result-item {
    border-bottom: 1px solid #eee;
    padding: 12px 4px;
    transition: 0.2s;
}

.search-result-item:hover {
    background: #f9f9f9;
}

.search-result-item a {
    font-weight: 600;
    color: var(--accent-color, #007bff);
    font-size: 16px;
    text-decoration: none;
}

.search-result-item a:hover {
    text-decoration: underline;
}

.search-result-snippet {
    font-size: 13px;
    color: #666;
    margin-top: 4px;
}

/* 动画 */
@keyframes fadeInBg {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 禁止背景滚动 */
body.modal-open {
    overflow: hidden;
}

```

### 实现搜索逻辑

``` javascript
import Fuse from './fuse.js'

async function initSearch() {
  const res = await fetch('/search.json')
  const data = await res.json()

  const openBtn = document.getElementById('open-search')
  const closeBtn = document.getElementById('close-search')
  const modal = document.getElementById('search-modal')
  const input = document.getElementById('search-input')
  const resultsBox = document.getElementById(
    'search-results'
  )

  let lastFocusedElement = null

  // 初始化 Fuse.js
  const fuse = new Fuse(data, {
    keys: ['title', 'content'],
    includeScore: true,
    threshold: 0.8, // 模糊程度（越低越严格）
    useExtendedSearch: true,
    minMatchCharLength: 0,
  })

  readerResult(data)

  openBtn.addEventListener('click', () => {
    lastFocusedElement = document.activeElement
    openModal()
  })

  closeBtn.addEventListener('click', closeModal)

  function openModal() {
    modal.classList.add('active')
    document.body.classList.add('modal-open')
    input.focus()
  }

  function closeModal() {
    modal.classList.remove('active')
    document.body.classList.remove('modal-open')
    lastFocusedElement?.focus()
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal()
  })

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
      if (!modal.classList.contains('active')) {
        openModal()
      } else {
        input.focus()
      }
    }
    if (!modal.classList.contains('active')) return
    if (e.key === 'Escape') closeModal()

    const focusable = modal.querySelectorAll(
      'input, button, a'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (
        !e.shiftKey &&
        document.activeElement === last
      ) {
        e.preventDefault()
        first.focus()
      }
    }
  })

  function readerResult(results) {
    resultsBox.innerHTML = results
      .map(post => {
        const content = (post.content || '').slice(
          0,
          Math.max(
            120,
            parseInt(
              post.content.length *
                (1 - (results.length - 1) / data.length)
            )
          )
        )
        return `
          <div class="search-item">
            <a href="${
              post.url[1] === '\/'
                ? post.url.slice(1)
                : post.url
            }">${post.title}</a>
            <p>${content}${
          post.content.length === content.length
            ? ''
            : '...'
        }
            </p>
          </div>
        `
      })
      .join('')
  }

  // 高亮函数（支持多个关键词）
  function highlightKeyword(keywords) {
    if (!('CSS' in window) || !CSS.highlights) return
    CSS.highlights.clear()
    if (!keywords.length) return

    const ranges = []
    resultsBox
      .querySelectorAll('.search-item')
      .forEach(item => {
        const walker = document.createTreeWalker(
          item,
          NodeFilter.SHOW_TEXT
        )
        let node
        while ((node = walker.nextNode())) {
          const text = node.textContent
          for (const word of keywords) {
            if (!word) continue
            const regex = new RegExp(
              word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'gi'
            )
            let match
            while ((match = regex.exec(text))) {
              const range = new Range()
              range.setStart(node, match.index)
              range.setEnd(
                node,
                match.index + match[0].length
              )
              ranges.push(range)
            }
          }
        }
      })

    if (ranges.length) {
      const highlight = new Highlight(...ranges)
      CSS.highlights.set('search-highlight', highlight)
    }
  }

  // 搜索逻辑 + 模糊匹配 + 多关键词高亮
  input.addEventListener('input', e => {
    const keyword = e.target.value.trim().toLowerCase()
    resultsBox.innerHTML = ''

    if (!keyword) {
      readerResult(data)
      highlightKeyword([])
      return
    }

    const keywords = keyword.split(/\s+/).filter(Boolean)
    const results = fuse.search(keyword)
    const final = results.map(r => r.item)
    if (final.length === 0) {
      resultsBox.innerHTML = '<p>未找到相关文章</p>'
      highlightKeyword([])
      return
    }

    readerResult(final)
    highlightKeyword(keywords)
  })
}

initSearch()

```
