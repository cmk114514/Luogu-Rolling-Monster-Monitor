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

const special = {
    127949: 'Brown',
}

const color = {
    'Brown': 'color: #996600 !important',
    'Gray': 'color: #bbb !important',
    'Red': 'color: #e74c3c !important',
    'Yellow': 'color: #f1c40f !important',
    'Orange': 'color: #e67e22 !important',
    'Purple': 'color: #8e44ad !important',
    'Green': 'color: #5eb95e !important',
    'Blue': 'color: #0e90d2 !important',
}

const LRMM_click = (h, div) => {
    const uid = 173951, cnt = 20, pid = location.href.split('/')[location.href.split('/').length - 1]
    $.get(`https://www.luogu.com.cn/user/${uid}`, e => {
        const n = JSON.parse(decodeURIComponent(/(?<=JSON\.parse\(decodeURIComponent\(").*(?=")/.exec(e)[0])).currentData.user.followingCount
        var para = document.createElement('p'), num = document.createElement('span'); num.innerText = '0'; h.appendChild(num); h.appendChild(document.createTextNode('/' + n))
        div.insertBefore(para, h.nextSibling)
        const A = i => {$.ajax({'url': `https://www.luogu.com.cn/api/user/followings?user=${uid}&page=${i}`, 'success': (e, _) => {
            const B = (id, name, col) => {$.ajax({'async': false, 'url': `https://www.luogu.com.cn/record/list?user=${id}&pid=${pid}&page=1&status=12&_contentOnly=1`, 'success': (d) => {
                if(d.currentData.records.count > 0){
                    var span = document.createElement('span')
                    var link = document.createElement('a')
                    link.setAttribute('class', 'username')
                    link.setAttribute('href', '/user/' + id)
                    link.innerText = e.users.result[j].name
                    link.setAttribute('style', 'font-weight: bold;' + color[id in special? special[id]: col])
                    span.appendChild(link)
                    span.appendChild(document.createTextNode(', '))
                    para.appendChild(span)
                }
                num.innerText++
            }, 'error': () => {setTimeout(() => {B(id, name, col)}, 1000)}})}
            for(var j in e.users.result) B(e.users.result[j].uid, e.users.result[j].name, e.users.result[j].color)
        }, 'error': () => {setTimeout(() => {A(i)}, 1000)}})}
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