/*
* 一些自定义的其他 JS 函数
**/

// 随机跳转到博客中的一篇文章

console.log(' %c Hexo Theme %c ' + (GLOBAL_CONFIG_SITE?.title || 'Blog'), 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px; color: #fff', 'background:#ff9a9a ; padding: 1px; border-radius: 0 3px 3px 0; color: #fff')

const ShowPost = {

    /** 是否为移动端 */
    isMobile: 'ontouchstart' in document.documentElement,

    /** 缓存 */
    _cache: {
        winCode: 0
    },
    /**
     * 在右上角弹出悬浮窗
     * @param {{text: string, time:number?, left:boolean?, bottom:boolean?}|string} optional
     *      配置项（text: 要显示的内容，time: 持续时间，left: 是否靠左显示，bottom: 是否靠下显示
     * @param button {?{icon:string?, text:string, desc:string?, onclick:function?}}
     *      传入null表示没有按钮（icon: 图标，text: 按钮文本，desc: 描述文本， onclick: 点击按钮时触发的回调）
     * @return {{close:function, onclose:function}} 一个对象，其中有两个函数对象，调用`close`可手动关闭悬浮窗，添加`onclose`可监听悬浮窗的关闭
     */
    pushInfo: (optional, button = null) => {
        let { text, time, left, bottom } = optional
        if (typeof optional === 'string') text = optional
        if (!time) time = 3500
        const externalApi = {}  // 对外部暴露的接口
        const id = ShowPost._cache.winCode++
        const cardID = `float-win-${id}`
        const actionID = `float-action-${id}`
        const exitID = `float-exit-${id}`
        /**
         * 关闭指定悬浮窗
         * @param id {string} 悬浮窗ID
         */
        const closeWin = id => {
            const div = document.getElementById(id)
            if (div) {
                const { classList, style } = div
                if (classList.contains('close')) return
                if (externalApi.onclose) externalApi.onclose()
                style.maxHeight = `${div.clientHeight + 10}px`
                classList.add('close')
                setTimeout(() => div.remove(), 1000)
                setTimeout(() => {
                    style.maxHeight = style.marginBottom = '0'
                    classList.remove('show')
                }, 25)
            }
        }
        /** 关闭多余的悬浮窗 */
        const closeRedundantWin = className => {
            // noinspection SpellCheckingInspection
            const list = document.querySelector(`.float-box${className}`).children
            const count = list.length - 3
            for (let k = 0, i = 0; k < count && i !== list.length; ++i) {
                closeWin(list[i].id)
                ++k
            }
        }
        /** 构建html代码 */
        const buildHTML = id => {
            const buttonDesc = (button && button.desc) ? `<div class="descr"><p ${ShowPost.isMobile ? 'class="open"' : ''}>${button.desc}</p></div>` : ''
            // noinspection HtmlUnknownAttribute
            return `<div class="float-win ${left ? 'left' : 'right'} ${bottom ? 'bottom' : 'top'} ${button ? 'click' : ''
                }" id="${cardID}" move="0" style="z-index:${id};"><button class="exit" id="${exitID}"><i class="fa-solid fa-xmark"></i></button><div class="text">${text}</div>${button ?
                    '<div class="select"><button class="action" id="' + actionID + '">' + (button.icon ? '<i class="' + button.icon + '">' : '') +
                    '</i><p class="text">' + button.text + `</p></button>${buttonDesc}` : ''}</div></div>`
        }
        const className = `${left ? '.left' : '.right'}${bottom ? '.bottom' : '.top'}`
        // noinspection SpellCheckingInspection
        document.querySelector(`.float-box${className}`).insertAdjacentHTML('beforeend', buildHTML(id))
        const cardDiv = document.getElementById(cardID)
        const actionButton = document.getElementById(actionID)
        const exitButton = document.getElementById(exitID)
        if (actionButton) {
            actionButton.onclick = () => {
                if (button.onclick) button.onclick()
                closeWin(cardID)
            }
        }
        exitButton.onclick = () => closeWin(cardID)
        cardDiv.onmouseover = () => cardDiv.setAttribute('over', '1')
        cardDiv.onmouseleave = () => cardDiv.removeAttribute('over')
        closeRedundantWin(className)
        setTimeout(() => cardDiv.classList.add('show'), 25)
        let age = 0
        const task = setInterval(() => {
            const win = document.getElementById(cardID)
            if (win) {
                if (win.hasAttribute('over')) return age = 0
                age += 100
                if (age < time) return
            }
            clearInterval(task)
            closeWin(cardID)
        }, 100)
        externalApi.close = () => closeWin(cardID)
        return externalApi
    }
}


const liuMusic = {
    musicPlaying: false,
    isMusicBind: false,

    musicToggle(isMeting = true) {
        if (!this.isMusicBind) {
            this.musicBind();
        }

        const $music = document.querySelector("#nav-music");
        const $meting = document.querySelector("meting-js");
        const $console = document.getElementById("consoleMusic");

        this.musicPlaying = !this.musicPlaying;
        $music?.classList.toggle("playing", this.musicPlaying);
        $music?.classList.toggle("stretch", this.musicPlaying);
        $console?.classList.toggle("on", this.musicPlaying);

        if (isMeting) {
            this.musicPlaying ? $meting?.aplayer?.play() : $meting?.aplayer?.pause();
        }
    },

    musicBind() {
        const $music = document.querySelector("#nav-music");
        const $name = document.querySelector("#nav-music .aplayer-music");
        const $button = document.querySelector("#nav-music .aplayer-button");

        $name?.addEventListener("click", () => {
            $music?.classList.toggle("stretch");
        });

        $button?.addEventListener("click", () => {
            this.musicToggle(false);
        });

        this.isMusicBind = true;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const zoomBox = document.createElement('div');
    zoomBox.id = 'owo-big';
    document.body.appendChild(zoomBox);

    let fadeTimer = null;
    let currentItem = null;

    document.body.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.atk-item');
        if (item && item.querySelector('img')) {
            if (currentItem === item) return; // 避免重复显示
            currentItem = item;

            // 取消可能存在的隐藏延时器
            clearTimeout(fadeTimer);
            fadeTimer = null;

            const img = item.querySelector('img');
            const rect = item.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

            zoomBox.innerHTML = `<img src="${img.src}">`;
            zoomBox.style.display = 'block';
            zoomBox.style.opacity = '0'; // 初始透明

            requestAnimationFrame(() => {
                const boxHeight = zoomBox.offsetHeight;
                const boxWidth = zoomBox.offsetWidth;

                const top = rect.top + scrollTop - boxHeight - 8;
                const left = rect.left + scrollLeft + (rect.width / 2) - boxWidth / 2;

                const maxLeft = document.body.clientWidth - boxWidth - 10;
                const adjustedLeft = Math.max(10, Math.min(left, maxLeft));
                const adjustedTop = Math.max(10, top);

                zoomBox.style.left = `${adjustedLeft}px`;
                zoomBox.style.top = `${adjustedTop}px`;
                zoomBox.style.opacity = '1';
            });
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        const fromItem = e.target.closest('.atk-item');
        const toItem = e.relatedTarget?.closest('.atk-item');

        if (fromItem && fromItem !== toItem) {
            currentItem = null;

            // 先淡出，再隐藏
            zoomBox.style.opacity = '0';
            fadeTimer = setTimeout(() => {
                zoomBox.style.display = 'none';
            }, 200);
        }
    });
});

// 平滑弹出效果
// function typeText(text, targetSelector, options = {}) {
//     const {
//       delay = 50,          // 每个字符之间的延迟（毫秒）
//       startDelay = 2000,   // 开始打字前的延迟（默认 3 秒）
//       onComplete = null,   // 动画完成后的回调
//       clearBefore = true   // 是否在开始前清空原有内容
//     } = options;

//     const targetEl = document.querySelector(targetSelector);
//     if (!targetEl || typeof text !== "string") return;

//     // if (clearBefore) targetEl.textContent = "";

//     let index = 0;
//     let frameId = null;

//     function renderChar() {
//       if (index < text.length) {
//         const span = document.createElement("span");
//         span.textContent = text[index++];
//         span.className = "char";
//         targetEl.appendChild(span);
//         frameId = requestAnimationFrame(() => setTimeout(renderChar, delay));
//       } else {
//         cancelAnimationFrame(frameId);
//         onComplete && onComplete(targetEl);
//       }
//     }

//     setTimeout(() => {
//         if (clearBefore) targetEl.textContent = "";
//         renderChar();
//     }, startDelay);
// }

// 打字机效果
function typeTextMachineStyle(text, targetSelector, options = {}) {
    const {
        delay = 10,
        startDelay = 500,
        onComplete = null,
        clearBefore = true,
        eraseBefore = true, // 新增：是否以打字机方式清除原文本
        eraseDelay = 5,    // 新增：删除每个字符的间隔
    } = options;

    const el = document.querySelector(targetSelector);
    if (!el || typeof text !== "string") return;

    setTimeout(() => {
        const startTyping = () => {
            let index = 0;
            function renderChar() {
                if (index <= text.length) {
                    el.textContent = text.slice(0, index++);
                    setTimeout(renderChar, delay);
                } else {
                    onComplete && onComplete(el);
                }
            }
            renderChar();
        };

        if (clearBefore) {
            if (eraseBefore && el.textContent.length > 0) {
                let currentText = el.textContent;
                let eraseIndex = currentText.length;

                function eraseChar() {
                    if (eraseIndex > 0) {
                        el.textContent = currentText.slice(0, --eraseIndex);
                        setTimeout(eraseChar, eraseDelay);
                    } else {
                        startTyping(); // 删除完毕后开始打字
                    }
                }

                eraseChar();
            } else {
                el.textContent = "";
                startTyping();
            }
        } else {
            startTyping();
        }
    }, startDelay);
}

function renderAISummary() {
    const summaryEl = document.querySelector('.ai-summary .ai-explanation');
    if (!summaryEl) return;

    const summaryText = summaryEl.getAttribute('data-summary');
    if (summaryText) {
        typeTextMachineStyle(summaryText, ".ai-summary .ai-explanation"); // 如果需要切换，在这里调用另一个函数即可
    }
}

document.addEventListener('pjax:complete', renderAISummary);
document.addEventListener('DOMContentLoaded', renderAISummary);

function randomPost() {
    fetch('/post-sitemap.xml')
        .then(res => {
            if (!res.ok) throw new Error('sitemap not found');
            return res.text();
        })
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const locList = Array.from(data.getElementsByTagName('loc'));
            if (locList.length === 0) throw new Error('empty sitemap');
            const randomLoc = locList[Math.floor(Math.random() * locList.length)];
            const absoluteUrl = randomLoc.textContent.trim();
            const relativeUrl = new URL(absoluteUrl).pathname;
            pjax.loadUrl(relativeUrl);  // 使用 PJAX 跳转
        })
        .catch(() => {
            btf.snackbarShow("😭无法找到sitemap.xml文件，没法跳转页面");
        });
}

// 顶部导航栏的显示与隐藏
document.addEventListener('pjax:complete', tonav);
document.addEventListener('DOMContentLoaded', tonav);
//响应pjax
function tonav() {
    var nameContainer = document.querySelector("#nav #name-container");
    var menusItems = document.querySelector("#nav .menus_items");
    let position = document.documentElement.scrollTop || document.body.scrollTop || 0;

    window.addEventListener("scroll", function () {
        const scroll = document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (scroll > position + 5) {
            nameContainer.classList.add("visible");
            menusItems.classList.remove("visible");
        } else if (scroll < position - 5) {
            nameContainer.classList.remove("visible");
            menusItems.classList.add("visible");
        }

        position = scroll;
    });

    // 初始化 page-name
    const pageName = document.getElementById("page-name");
    if (pageName) pageName.innerText = GLOBAL_CONFIG_SITE?.title || document.title.split(" | ")[0];
}

// 切换表格的显示模式，夜间和白天模式
function switchPostChart() {
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
        try {
            let postsOptionNew = postsOption
            postsOptionNew.title.textStyle.color = color
            postsOptionNew.xAxis.nameTextStyle.color = color
            postsOptionNew.yAxis.nameTextStyle.color = color
            postsOptionNew.xAxis.axisLabel.color = color
            postsOptionNew.yAxis.axisLabel.color = color
            postsOptionNew.xAxis.axisLine.lineStyle.color = color
            postsOptionNew.yAxis.axisLine.lineStyle.color = color
            postsOptionNew.series[0].markLine.data[0].label.color = color
            postsChart.setOption(postsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
        try {
            let tagsOptionNew = tagsOption
            tagsOptionNew.title.textStyle.color = color
            tagsOptionNew.xAxis.nameTextStyle.color = color
            tagsOptionNew.yAxis.nameTextStyle.color = color
            tagsOptionNew.xAxis.axisLabel.color = color
            tagsOptionNew.yAxis.axisLabel.color = color
            tagsOptionNew.xAxis.axisLine.lineStyle.color = color
            tagsOptionNew.yAxis.axisLine.lineStyle.color = color
            tagsOptionNew.series[0].markLine.data[0].label.color = color
            tagsChart.setOption(tagsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
        try {
            let categoriesOptionNew = categoriesOption
            categoriesOptionNew.title.textStyle.color = color
            categoriesOptionNew.legend.textStyle.color = color
            if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
            categoriesChart.setOption(categoriesOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
}

// // 切换夜间模式和白天模式
// function switchNightMode() {
//     const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
//     if (nowMode === 'light') {
//         btf.activateDarkMode()
//     } else {
//         btf.activateLightMode()
//     }
//     switchPostChart()
// }

// 切换全屏状态的函数
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((error) => {
            console.error(`Error attempting to enable full-screen mode: ${error.message} (${error.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch((error) => {
                console.error(`Error attempting to exit full-screen mode: ${error.message} (${error.name})`);
            });
        }
    }
}

// 小猫的显示和隐藏
function toggleLive2dVisibility() {
    const live2dContainer = document.getElementById('live2d-widget');
    if (!live2dContainer) return;
    if (live2dContainer.style.display === 'block' || live2dContainer.style.display === '') {
        live2dContainer.style.display = 'none'; // 显示Live2D模型
    } else {
        live2dContainer.style.display = 'block'; // 隐藏Live2D模型
    }
}

// 动态标题
//var OriginTitile = document.title;
//var titleTime;
//document.addEventListener('visibilitychange', function () {
//    if (document.hidden) {
//        离开当前页面时标签显示内容
//        document.title = '👀跑哪里去了~';
//        clearTimeout(titleTime);
//    } else {
//        返回当前页面时标签显示内容
//        document.title = '🐖抓到你啦～';
//        两秒后变回正常标题
//        titleTime = setTimeout(function () {
//            document.title = OriginTitile;
//        }, 2000);
//    }
//});

// 计算两点之间的距离
function getDistance(e1, n1, e2, n2) {
    const R = 6371;
    const { sin, cos, asin, PI, hypot } = Math;
    let getPoint = (e, n) => {
        e *= PI / 180;
        n *= PI / 180;
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) };
    };

    let a = getPoint(e1, n1);
    let b = getPoint(e2, n2);
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    let r = asin(c / 2) * 2 * R;
    return Math.round(r);
}

function normalizeLocation(raw) {
    const data = raw?.data || raw || {};
    return {
        ip: data.ip || raw?.ip || '',
        country: data.country || '',
        prov: data.prov || data.province || '',
        city: data.city || '',
        lng: Number(data.lng ?? data.longitude),
        lat: Number(data.lat ?? data.latitude)
    };
}

function getWelcomeLocationConfig() {
    return GLOBAL_CONFIG?.welcome?.location || {};
}

function getLocationApiConfig() {
    const welcomeLocation = getWelcomeLocationConfig();
    const locationApi = GLOBAL_CONFIG?.locationApi || {};
    return {
        api: locationApi.api || welcomeLocation.api,
        api_key: locationApi.api_key || welcomeLocation.api_key,
        cache_hours: locationApi.cache_hours || welcomeLocation.cache_hours || 24
    };
}

// Fetch IP 地址信息
function fetchIpLocation() {
    const welcomeConfig = getWelcomeLocationConfig();
    const locationApi = getLocationApiConfig();
    if (!welcomeConfig.enable || !locationApi.api) return Promise.resolve(null);

    const cachedData = localStorage.getItem('ipLocation');
    const cachedTime = localStorage.getItem('ipLocationTime');
    const now = Date.now();
    const cacheDuration = Number(locationApi.cache_hours || 24) * 60 * 60 * 1000;

    if (cachedData && cachedTime && (now - Number(cachedTime) < cacheDuration)) {
        return Promise.resolve(JSON.parse(cachedData));
    }

    const api = locationApi.api_key
        ? `${locationApi.api}${locationApi.api.includes('?') ? '&' : '?'}key=${encodeURIComponent(locationApi.api_key)}`
        : locationApi.api;

    return fetch(api)
        .then(res => res.json())
        .then(raw => {
            const mapped = normalizeLocation(raw);
            localStorage.setItem('ipLocation', JSON.stringify(mapped));
            localStorage.setItem('ipLocationTime', now.toString());
            return mapped;
        })
        .catch(err => {
            console.error("Error:", err);
            return null;
        });
}

// 显示欢迎信息
function showWelcome(ipLocation) {
    const welcomeConfig = getWelcomeLocationConfig();
    if (!welcomeConfig.enable || !ipLocation) {
        console.error('ipLocation data is not available.');
        return;
    }

    const baseLng = Number(welcomeConfig.base_lng);
    const baseLat = Number(welcomeConfig.base_lat);
    const hasDistance = Number.isFinite(baseLng) && Number.isFinite(baseLat) && Number.isFinite(ipLocation.lng) && Number.isFinite(ipLocation.lat);
    let dist = hasDistance ? getDistance(baseLng, baseLat, ipLocation.lng, ipLocation.lat) : null;
    let ip = ipLocation.ip;
    let pos = [ipLocation.country, ipLocation.prov, ipLocation.city].filter(Boolean).join(' ');
    let welcomeInfoElement = document.getElementById("welcome-info");

    if (welcomeInfoElement) {
        const distanceText = dist === null ? '' : `<br>Distance to ${welcomeConfig.distance_label || 'site owner'}: <b><span style="color: var(--default-bg-color)">${dist}</span></b> km`;
        welcomeInfoElement.innerHTML = `Welcome from<br><b><span style="color: var(--default-bg-color)">${pos || 'Unknown'}</span></b>${distanceText}<br>Your IP: <b><span class="ip-address" style="font-size: 15px;">${ip || 'Unknown'}</span></b><br>`;
    } else {
        console.log("Pjax无法获取元素");
    }
}

// =======================
// Pjax 相关
// =======================
function isWelcomeInfoAvailable() {
    return document.getElementById("welcome-info") !== null;
}

function handlePjaxComplete(ipLocation) {
    if (isWelcomeInfoAvailable()) showWelcome(ipLocation);
}

// =======================
// 初始化
// =======================
function onLoad() {
    if (!getWelcomeLocationConfig().enable) return;
    fetchIpLocation().then(ipLocation => {
        if (isWelcomeInfoAvailable()) showWelcome(ipLocation);
        document.addEventListener("pjax:complete", () => handlePjaxComplete(ipLocation));
    });
}

window.onload = onLoad;
