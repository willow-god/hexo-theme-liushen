function getRootDomain(url) {
  const hostname = new URL(url).hostname;
  const domainParts = hostname.split('.').reverse();
  if (domainParts.length > 1) return domainParts[1] + '.' + domainParts[0];
  return hostname;
}

function tagLink(args) {
  args = args.join(' ').split(',');
  const title = args[0];
  const sitename = args[1];
  const link = args[2];
  const linkTagConfig = hexo.theme.config.link_tag || {};
  const avatarUrls = linkTagConfig.domain_avatars || {};
  const whitelistDomains = linkTagConfig.whitelist || [];

  function getAvatarUrl(url) {
    const rootDomain = getRootDomain(url);
    for (const domain in avatarUrls) {
      if (domain.endsWith(rootDomain)) return avatarUrls[domain];
    }
    return linkTagConfig.default_avatar || hexo.theme.config.avatar?.img || '';
  }

  function isWhitelisted(url) {
    const rootDomain = getRootDomain(url);
    return whitelistDomains.some(domain => rootDomain.endsWith(domain));
  }

  const imgUrl = getAvatarUrl(link);
  const tipMessage = isWhitelisted(link)
    ? (linkTagConfig.internal_tip || 'Internal link')
    : (linkTagConfig.external_tip || 'External link');

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

hexo.extend.tag.register('link', tagLink, { ends: false });
