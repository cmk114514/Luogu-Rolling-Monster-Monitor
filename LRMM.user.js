// ==UserScript==
// @name         Luogu Rolling-Monster Monitor
// @namespace    http://tampermonkey.net/
// @version      114.514.1919.810
// @description  Monitor who you followed passed a certain problem
// @author       C(m, k)
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// ==/UserScript==

const LRMM_special = {
    127949: 'brown',
    169574: 'blackred',
}

const LRMM_style = `
.username {font-weight: bold; display: inline-block}
.LRMM_brown {color: #996600 !important}
.LRMM_gray {color: #bbb !important}
.LRMM_red, .LRMM_blackred {color: #e74c3c !important}
.LRMM_blackred:first-letter {color: #34495e !important}
.LRMM_yellow {color: #f1c40f !important}
.LRMM_orange {color: #e67e22 !important}
.LRMM_purple {color: #8e44ad !important}
.LRMM_green {color: #5eb95e !important}
.LRMM_blue {color: #0e90d2 !important}
`

const LRMM_click = (h, div) => {
    const uid = 173951, cnt = 20, pid = location.href.split('/')[location.href.split('/').length - 1]
    $.get(`https://www.luogu.com.cn/user/${uid}`, e => {
        const n = JSON.parse(decodeURIComponent(/(?<=JSON\.parse\(decodeURIComponent\(").*(?=")/.exec(e)[0])).currentData.user.followingCount
        var para = document.createElement('p'), num = document.createElement('span'); num.innerText = '0'; h.appendChild(num); h.appendChild(document.createTextNode('/' + n))
        var style = document.createElement('style'); style.innerHTML = LRMM_style; para.appendChild(style); div.insertBefore(para, h.nextSibling)
        const A = i => {$.ajax({
            'url': `https://www.luogu.com.cn/api/user/followings?user=${uid}&page=${i}`,
            'success': (e, _) => {
                const B = (id, name, col) => {$.ajax({
                    'async': false,
                    'url': `https://www.luogu.com.cn/record/list?user=${id}&pid=${pid}&page=1&status=12&_contentOnly=1`,
                    'success': (d) => {
                        if(d.currentData.records.count > 0){
                            var span = document.createElement('span')
                            span.innerHTML = `<a href=https://www.luogu.com.cn/record/list?user=${id}&pid=${pid}&page=1&status=12 class="username LRMM_${id in LRMM_special? LRMM_special[id]: col}">${name}</a>, `
                            para.appendChild(span)
                        }
                        num.innerText++
                    },
                    'error': () => {setTimeout(() => {B(id, name, col)}, 1000)}
                })}
                for(var j in e.users.result) B(e.users.result[j].uid, e.users.result[j].name, e.users.result[j].color.toLowerCase())
            },
            'error': () => {setTimeout(() => {A(i)}, 1000)}
        })}
        for(var i = 1; i * cnt < n + cnt - 1; i++) A(i)
    })
}

const main = () => {
    if(!/^https:\/\/www.luogu.com.cn\/problem\/[0-9a-zA-Z_]*$/.test(location.href)) return
    var div = document.querySelector("#app > div.main-container > main > div.full-container > section.main > section > div > div:nth-child(2)")
    var h = document.createElement('h2'); h.innerText = '卷怪监视 '; h.dataset={'v-16db0c63': ''}; h.className = 'lfe-h2';
    h.appendChild(document.createTextNode('Click'))
    div.insertBefore(h, div.firstChild); h.onclick = () => {h.onclick = null; h.removeChild(h.lastChild); LRMM_click(h, div)}
}

setTimeout(main, 500)