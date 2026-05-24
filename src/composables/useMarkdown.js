/**
 * 轻量 Markdown → HTML 转换，用于深度学习卡片内容渲染
 */
export function renderMarkdown(md) {
  if (!md) return ''

  let html = md

  // 1. Bold: **text** → <strong>text</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // 2. Table: special rendering for 君臣佐使, generic table otherwise
  html = html.replace(/((?:\|.+\|[\r\n]?)+)/g, (match) => {
    const lines = match.trim().split(/\r?\n/)
    const rows = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line.startsWith('|')) continue
      if (/^\|[\s\-:|]+\|$/.test(line)) continue
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
      rows.push(cells)
    }
    if (rows.length === 0) return ''

    // Detect 君臣佐使 table
    const isRoleTable = rows[0] && rows[0].some(c => c.includes('角色')) &&
                        rows[0].some(c => c.includes('药物')) &&
                        rows[0].some(c => c.includes('功用'))

    if (isRoleTable) {
      const roleClass = { '君': 'jun', '臣': 'chen', '佐': 'zuo', '使': 'shi' }
      let cards = '<div class="role-cards">'
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r]
        // Strip markdown bold and HTML tags to get plain role name
        const roleRaw = (row[0] || '').replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
        const drug = (row[1] || '').trim()
        const desc = (row[2] || '').trim()
        const cls = roleClass[roleRaw] || ''
        cards += `<div class="role-card role-${cls}">`
        cards += `<span class="role-badge role-${cls}-badge">${roleRaw}</span>`
        cards += `<span class="role-drug">${drug}</span>`
        cards += `<p class="role-desc">${desc}</p>`
        cards += `</div>`
      }
      cards += '</div>'
      return cards
    }

    // Generic table
    let table = '<table>'
    for (let r = 0; r < rows.length; r++) {
      const tag = r === 0 ? 'th' : 'td'
      table += '<tr>' + rows[r].map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>'
    }
    table += '</table>'
    return table
  })

  // 3. Numbered list: lines starting with "1. " "2. " etc → <ol>
  html = html.replace(/((?:^\d+\.\s.+(?:\r?\n|$))+)/gm, (match) => {
    const items = match.trim().split(/\r?\n/)
    const lis = items.map(line => {
      const text = line.replace(/^\d+\.\s/, '').trim()
      return text ? `<li>${text}</li>` : ''
    }).join('')
    return `<ol>${lis}</ol>`
  })

  // 4. Unordered list: lines starting with "- "
  html = html.replace(/((?:^-\s.+(?:\r?\n|$))+)/gm, (match) => {
    const items = match.trim().split(/\r?\n/)
    const lis = items.map(line => {
      const text = line.replace(/^-\s/, '').trim()
      return text ? `<li>${text}</li>` : ''
    }).join('')
    return `<ul>${lis}</ul>`
  })

  // 5. Horizontal rule: ---
  html = html.replace(/^---$/gm, '<hr>')

  // 6. Paragraph breaks: double newline → </p><p>
  html = html.replace(/\n\n+/g, '</p><p>')

  // 7. Single newline → <br> (within paragraphs)
  html = html.replace(/\n/g, '<br>')

  // Wrap in <p>
  html = '<p>' + html + '</p>'

  // Clean empty tags
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p><(ol|ul|table|hr|div)/g, '<$1')
  html = html.replace(/<\/(ol|ul|table|div)><\/p>/g, '</$1>')

  return html
}
