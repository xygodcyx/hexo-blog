const MarkdownIt = require('markdown-it')
const container = require('markdown-it-container')

/**
 * 自定义 Markdown 容器扩展
 * 例如：
 * ::: details 查看代码
 * 代码内容
 * :::
 */
hexo.extend.filter.register('markdown-it:renderer', md => {
  // 启用 <details> 折叠块
  md.use(container, 'details', {
    render(tokens, idx) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        // ::: details xxx
        const title = token.info
          .trim()
          .slice('details'.length)
          .trim()
        return `<details class="md-details"><summary>${
          title || '展开详情'
        }</summary>\n`
      } else {
        return '</details>\n'
      }
    },
  })

  // ::: tip 提示内容
  const createSimpleContainer = name => {
    md.use(container, name, {
      render(tokens, idx) {
        const token = tokens[idx]
        if (token.nesting === 1) {
          return `<div class="md-${name}">\n`
        } else {
          return '</div>\n'
        }
      },
    })
  }

  // 一些常用容器类型
  createSimpleContainer('tip')
  createSimpleContainer('warning')
  createSimpleContainer('danger')
})
