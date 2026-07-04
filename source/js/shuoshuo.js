(function () {
const shuoshuoConfig = GLOBAL_CONFIG?.shuoshuo || {};
if (!shuoshuoConfig.enable || !shuoshuoConfig.api) return;

const TALK_API_URL = shuoshuoConfig.api;
const TALK_CACHE_KEY = 'liushenEchoCacheV2';
const TALK_CACHE_TIME_KEY = 'liushenEchoCacheTimeV2';
const TALK_CACHE_DURATION = Number(shuoshuoConfig.cache_minutes || 30) * 60 * 1000;
const TALK_AVATAR = shuoshuoConfig.avatar || GLOBAL_CONFIG_SITE?.avatar || '';
const TALK_BASE_URL = (shuoshuoConfig.base_url || '').replace(/\/$/, '');
const shuoshuoState = window.__liushenShuoshuoState || (window.__liushenShuoshuoState = {
    resizeHandler: null,
    afterRenderTimer: null,
    listenersBound: false
});

function cleanupShuoshuo() {
    if (shuoshuoState.afterRenderTimer) {
        window.clearTimeout(shuoshuoState.afterRenderTimer);
        shuoshuoState.afterRenderTimer = null;
    }

    if (shuoshuoState.resizeHandler) {
        window.removeEventListener('resize', shuoshuoState.resizeHandler);
        shuoshuoState.resizeHandler = null;
    }
}

function renderTalks() {
    cleanupShuoshuo();

    const talkContainer = document.querySelector('#talk');
    if (!talkContainer) return;

    talkContainer.innerHTML = '';

    const generateIconSVG = () => {
        return '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="is-badge icon"><path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"></path></svg>';
    };

    const waterfall = (container) => {
        function getMargin(side, element) {
            const styles = window.getComputedStyle(element);
            return parseFloat(styles[`margin${side}`]) || 0;
        }

        function toPx(value) {
            return `${value}px`;
        }

        function getTop(element) {
            return parseFloat(element.style.top);
        }

        function getLeft(element) {
            return parseFloat(element.style.left);
        }

        function getWidth(element) {
            return element.clientWidth;
        }

        function getHeight(element) {
            return element.clientHeight;
        }

        function getBottom(element) {
            return getTop(element) + getHeight(element) + getMargin('Bottom', element);
        }

        function getRight(element) {
            return getLeft(element) + getWidth(element) + getMargin('Right', element);
        }

        function sortColumns(elements) {
            elements.sort((left, right) => {
                return getBottom(left) === getBottom(right)
                    ? getLeft(right) - getLeft(left)
                    : getBottom(right) - getBottom(left);
            });
        }

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }

        if (!container) return;

        const items = Array.from(container.children).map(item => {
            item.style.position = 'absolute';
            return item;
        });

        container.style.position = 'relative';

        const columns = [];
        if (items.length) {
            items[0].style.top = '0px';
            items[0].style.left = toPx(getMargin('Left', items[0]));
            columns.push(items[0]);
        }

        let index = 1;
        for (; index < items.length; index += 1) {
            const previous = items[index - 1];
            const current = items[index];
            const fits = getRight(previous) + getWidth(current) <= getWidth(container);

            if (!fits) break;

            current.style.top = previous.style.top;
            current.style.left = toPx(getRight(previous) + getMargin('Left', current));
            columns.push(current);
        }

        for (; index < items.length; index += 1) {
            sortColumns(columns);
            const current = items[index];
            const column = columns.pop();

            current.style.top = toPx(getBottom(column) + getMargin('Top', current));
            current.style.left = toPx(getLeft(column));
            columns.push(current);
        }

        sortColumns(columns);
        const tallestColumn = columns[0];
        container.style.height = tallestColumn ? toPx(getBottom(tallestColumn) + getMargin('Bottom', tallestColumn)) : '0px';

        const currentWidth = getWidth(container);
        shuoshuoState.resizeHandler = () => {
            const currentContainer = document.querySelector('#talk');
            if (!currentContainer || !document.body.contains(currentContainer)) {
                cleanupShuoshuo();
                return;
            }

            if (getWidth(currentContainer) !== currentWidth) {
                waterfall(currentContainer);
            }
        };

        window.addEventListener('resize', shuoshuoState.resizeHandler);
    };

    const parseMaybeJson = (value) => {
        return value && typeof value === 'object' ? value : null;
    };

    const getEchoExtension = (item) => {
        return parseMaybeJson(item?.extension);
    };

    const getEchoExtensionType = (item) => {
        return getEchoExtension(item)?.type || '';
    };

    const getEchoExtensionPayload = (item) => {
        const extension = getEchoExtension(item);
        return extension?.payload || null;
    };

    const getEchoImages = (item) => {
        if (!Array.isArray(item?.echo_files)) return [];

        return item.echo_files
            .map(entry => entry?.file || entry)
            .filter(file => {
                const category = String(file?.category || '').toLowerCase();
                const contentType = String(file?.content_type || '').toLowerCase();
                return category === 'image' || contentType.startsWith('image/');
            })
            .map(file => {
                let url = file?.url;
                if (!url) return null;
                
                if (TALK_BASE_URL && url.startsWith('/')) {
                    url = TALK_BASE_URL + url;
                } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = TALK_BASE_URL ? `${TALK_BASE_URL}/${url}` : url;
                }
                
                return url;
            })
            .filter(Boolean);
    };

    const getEchoTags = (item) => {
        if (!Array.isArray(item?.tags) || !item.tags.length) return ['无标签'];
        return item.tags.map(tag => tag?.name || tag).filter(Boolean);
    };

    const formatTime = (time) => {
        // 如果是 Unix 时间戳（秒），转换为毫秒
        const timestamp = time < 10000000000 ? time * 1000 : time;
        const date = new Date(timestamp);
        const pad = value => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const renderTextContent = (content) => {
        return (content || '')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="nofollow noopener">@$1</a>')
            .replace(/- \[ \]/g, '[]')
            .replace(/- \[x\]/gi, '[x]')
            .replace(/\n/g, '<br>');
    };

    const buildImageHtml = (images) => {
        if (!images.length) return '';

        const imageLinks = images.map(url => {
            const safeUrl = `${url}?fmt=webp&q=75`;
            return `<a href="${safeUrl}" data-fancybox="gallery" class="fancybox"><img src="${safeUrl}" loading="lazy"></a>`;
        }).join('');

        return `<div class="zone_imgbox">${imageLinks}</div>`;
    };

    const getGithubTitle = (repoUrl) => {
        if (!repoUrl) return '';

        const match = repoUrl.match(/^https?:\/\/github\.com\/[^/]+\/([^/?#]+)/i);
        if (match) return match[1];

        try {
            const parts = new URL(repoUrl).pathname.split('/').filter(Boolean);
            return parts.pop() || repoUrl;
        } catch (error) {
            return repoUrl;
        }
    };

    const buildExternalHtml = (type, payload) => {
        if (!payload) return '';

        let siteUrl = '';
        let title = '';
        let background = shuoshuoConfig.default_external_cover || '';

        if (type === 'WEBSITE') {
            siteUrl = payload.site || payload.url || '';
            title = payload.title || siteUrl;
        }

        if (type === 'GITHUBPROJ') {
            siteUrl = payload.repoUrl || payload.url || '';
            title = payload.title || getGithubTitle(siteUrl);
            background = shuoshuoConfig.github_external_cover || background;
        }

        if (!siteUrl) return '';

        return `
            <div class="shuoshuo-external-link">
                <a class="external-link" href="${siteUrl}" target="_blank" rel="nofollow noopener">
                    <div class="external-link-left" style="${background ? `background-image:url(${background})` : ''}"></div>
                    <div class="external-link-right">
                        <div class="external-link-title">${title}</div>
                        <div>点击跳转<i class="fa-solid fa-angle-right"></i></div>
                    </div>
                </a>
            </div>
        `;
    };

    const getMusicInfo = (payload) => {
        const link = payload?.url;
        if (!link) return null;

        let server = '';
        if (link.includes('music.163.com')) server = 'netease';
        if (link.includes('y.qq.com')) server = 'tencent';

        const idMatch = link.match(/id=(\d+)/);
        if (!server || !idMatch) return null;

        return { server, id: idMatch[1] };
    };

    const buildMusicHtml = (payload) => {
        const music = getMusicInfo(payload);
        if (!music) return '';

        const metingApi = shuoshuoConfig.meting_api ? ` api="${shuoshuoConfig.meting_api}"` : '';
        return `<meting-js server="${music.server}" type="song" id="${music.id}"${metingApi}></meting-js>`;
    };

    const getYoutubeVideoId = (value) => {
        if (!value) return '';
        if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

        try {
            const url = new URL(value);
            if (url.hostname.includes('youtu.be')) return url.pathname.replace('/', '');
            if (url.hostname.includes('youtube.com')) {
                return url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop() || '';
            }
        } catch (error) {
            return '';
        }

        return '';
    };

    const buildVideoHtml = (payload) => {
        const rawValue = payload?.videoId || payload?.url || '';

        if (!rawValue) return '';

        let embedUrl = '';

        if (/^BV[0-9A-Za-z]+$/i.test(rawValue)) {
            embedUrl = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${rawValue}&as_wide=1&high_quality=1&danmaku=0`;
        } else {
            const youtubeId = getYoutubeVideoId(rawValue);
            if (youtubeId) {
                embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
            }
        }

        if (!embedUrl) return '';

        return `
            <div style="position: relative; padding: 30% 45%; margin-top: 10px;">
                <iframe
                    style="position:absolute;width:100%;height:100%;left:0;top:0;border-radius:12px;"
                    src="${embedUrl}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
        `;
    };

    const normalizeTalk = (item) => {
        const extensionType = getEchoExtensionType(item);
        const extensionPayload = getEchoExtensionPayload(item);
        const textContent = item?.content || '';
        const images = getEchoImages(item);

        let content = `<div class="talk_content_text">${renderTextContent(textContent)}</div>`;
        content += buildImageHtml(images);

        if (extensionType === 'WEBSITE' || extensionType === 'GITHUBPROJ') {
            content += buildExternalHtml(extensionType, extensionPayload);
        }

        if (extensionType === 'MUSIC') {
            content += buildMusicHtml(extensionPayload);
        }

        if (extensionType === 'VIDEO') {
            content += buildVideoHtml(extensionPayload);
        }

        return {
            content,
            user: item?.username || '匿名',
            avatar: TALK_AVATAR,
            date: formatTime(item?.created_at),
            tags: getEchoTags(item),
            quoteText: textContent
        };
    };

    const generateTalkElement = (item) => {
        const talkItem = document.createElement('div');
        talkItem.className = 'talk_item';

        const talkMeta = document.createElement('div');
        talkMeta.className = 'talk_meta';

        const avatar = document.createElement('img');
        avatar.className = 'no-lightbox avatar';
        avatar.src = item.avatar;

        const info = document.createElement('div');
        info.className = 'info';

        const nick = document.createElement('span');
        nick.className = 'talk_nick';
        nick.innerHTML = `${item.user} ${generateIconSVG()}`;

        const date = document.createElement('span');
        date.className = 'talk_date';
        date.textContent = item.date;

        info.appendChild(nick);
        info.appendChild(date);
        talkMeta.appendChild(avatar);
        talkMeta.appendChild(info);

        const talkContent = document.createElement('div');
        talkContent.className = 'talk_content';
        talkContent.innerHTML = item.content;

        const talkBottom = document.createElement('div');
        talkBottom.className = 'talk_bottom';

        const tags = document.createElement('div');
        const tag = document.createElement('span');
        tag.className = 'talk_tag';
        tag.textContent = `# ${item.tags.join(' / ')}`;
        tags.appendChild(tag);

        const commentLink = document.createElement('a');
        commentLink.href = 'javascript:;';
        commentLink.addEventListener('click', () => goComment(item.quoteText));

        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.innerHTML = '<i class="fa-solid fa-message fa-fw"></i>';
        commentLink.appendChild(icon);

        talkBottom.appendChild(tags);
        talkBottom.appendChild(commentLink);

        talkItem.appendChild(talkMeta);
        talkItem.appendChild(talkContent);
        talkItem.appendChild(talkBottom);

        return talkItem;
    };

    const goComment = (text) => {
        const textarea = document.querySelector('.atk-textarea');
        if (!textarea) return;

        textarea.value = `> ${text || ''}\n\n`;
        textarea.focus();

        if (window.btf?.snackbarShow) {
            btf.snackbarShow('已为您引用该说说，删除空格效果更佳');
        }
    };

    const afterRender = () => {
        waterfall('#talk');

        if (window.btf?.loadLightbox) {
            btf.loadLightbox(document.querySelectorAll('#talk img:not(.no-lightbox)'));
        }

        if (window.lazyLoadInstance?.update) {
            lazyLoadInstance.update();
        }
    };

    const renderTalksList = (list) => {
        list.map(normalizeTalk).forEach(item => talkContainer.appendChild(generateTalkElement(item)));
        afterRender();

        const media = talkContainer.querySelectorAll('img, iframe, meting-js');
        media.forEach(element => {
            element.addEventListener('load', afterRender, { once: true });
        });

        shuoshuoState.afterRenderTimer = window.setTimeout(afterRender, 300);
    };

    const fetchTalks = () => {
        const cachedData = localStorage.getItem(TALK_CACHE_KEY);
        const cachedTime = Number(localStorage.getItem(TALK_CACHE_TIME_KEY));
        const now = Date.now();

        if (cachedData && cachedTime && now - cachedTime < TALK_CACHE_DURATION) {
            renderTalksList(JSON.parse(cachedData));
            return;
        }

        fetch(TALK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 1, pageSize: Number(shuoshuoConfig.page_size || 30), search: '' })
        })
            .then(response => response.json())
            .then(data => {
                if (data?.code !== 1 || !Array.isArray(data?.data?.items)) {
                    console.warn('Unexpected API response format:', data);
                    renderTalksList([]);
                    return;
                }

                localStorage.setItem(TALK_CACHE_KEY, JSON.stringify(data.data.items));
                localStorage.setItem(TALK_CACHE_TIME_KEY, now.toString());
                renderTalksList(data.data.items);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    fetchTalks();
}

function initShuoshuoPage() {
    renderTalks();
}

window.initShuoshuoPage = initShuoshuoPage;

if (!shuoshuoState.listenersBound) {
    document.addEventListener('pjax:send', cleanupShuoshuo);
    document.addEventListener('pjax:complete', initShuoshuoPage);
    shuoshuoState.listenersBound = true;
}

initShuoshuoPage();
})();
