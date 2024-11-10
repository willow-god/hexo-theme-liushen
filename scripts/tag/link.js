function link(args) {
    args = args.join(' ').split(',');
    let title = args[0];
    let sitename = args[1];
    let link = args[2];

    // 定义不同域名对应的头像URL
    const avatarUrls = {
        'github.com': 'https://cdn.qyliu.top/i/2024/07/27/66a461a3098aa.webp',
        'csdn.net': 'https://cdn.qyliu.top/i/2024/07/27/66a461b627dc2.webp',
        'gitee.com': 'https://cdn.qyliu.top/i/2024/07/27/66a461c3dea80.webp',
        'zhihu.com': 'https://cdn.qyliu.top/i/2024/07/27/66a461cc20eb4.webp',
        'stackoverflow.com': 'https://cdn.qyliu.top/i/2024/07/27/66a461d3be02e.webp',
        'wikipedia.org': 'https://cdn.qyliu.top/i/2024/07/27/66a461db48579.webp',
        'baidu.com': 'https://cdn.qyliu.top/i/2024/07/27/66a461e1ae5b5.webp',
        'qyliu.top': 'https://cdn.qyliu.top/i/2024/08/01/66aae601dbc9b.webp',
        'liushen.fun': 'https://cdn.qyliu.top/i/2024/08/01/66aae601dbc9b.webp',
        'lius.me': 'https://cdn.qyliu.top/i/2024/08/01/66aae601dbc9b.webp',
    };
    
    // 定义白名单域名
    const whitelistDomains = [
        'lius.me', 'qyliu.top', 'liushen.fun'
    ];

    // 获取URL的根域名
    function getRootDomain(url) {
        const hostname = new URL(url).hostname;
        const domainParts = hostname.split('.').reverse();
        if (domainParts.length > 1) {
            return domainParts[1] + '.' + domainParts[0];
        }
        return hostname;
    }

    // 根据URL获取对应的头像URL
    function getAvatarUrl(url) {
        const rootDomain = getRootDomain(url);
        for (const domain in avatarUrls) {
            if (domain.endsWith(rootDomain)) {
                return avatarUrls[domain];
            }
        }
        return 'https://cdn.qyliu.top/i/2024/07/27/66a4632bbf06e.webp';  // 默认头像URL
    }

    // 检查是否在白名单中
    function isWhitelisted(url) {
        const rootDomain = getRootDomain(url);
        for (const domain of whitelistDomains) {
            if (rootDomain.endsWith(domain)) {
                return true;
            }
        }
        return false;
    }

    // 获取对应的头像URL
    let imgUrl = getAvatarUrl(link);

    // 判断并生成提示信息
    // 判断并生成提示信息
    let tipMessage = isWhitelisted(link)
        ? "✅来自本站，本站可确保其安全性，请放心点击跳转"
        : "🪧引用站外地址，不保证站点的可用性和安全性";

    return `<div class='liushen-tag-link'><a class="tag-Link" target="_blank" href="${link}">
    <div class="tag-link-tips">${tipMessage}</div>
    <div class="tag-link-bottom">
        <div class="tag-link-left" style="background-image: url(${imgUrl});"></div>
        <div class="tag-link-right">
            <div class="tag-link-title">${title}</div>
            <div class="tag-link-sitename">${sitename}</div>
        </div>
        <i class="fa-solid fa-angle-right"></i>
    </div>
    </a></div>`;
}

hexo.extend.tag.register('link', link, { ends: false });