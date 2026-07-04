let rm = {};

rm.showRightMenu = function (isTrue, x = 0, y = 0) {
    const rightMenu = document.getElementById('rightMenu');
    rightMenu.style.top = x + 'px';
    rightMenu.style.left = y + 'px';

    if (isTrue) {
        stopMaskScroll();
        rightMenu.style.display = 'block';
        setTimeout(() => {
            rightMenu.style.opacity = 1;
            rightMenu.style.transform = 'translateY(0) scale(1)';
        }, 10); // 让动画平滑启动
    } else {
        rightMenu.style.opacity = 0;
        rightMenu.style.transform = 'translateY(40px) scale(0.95)';
        rightMenu.style.display = 'none';
    }
};



var lastMessageTime = 0;
function showMessageOnceInFiveMinutes() {
    var currentTime = Date.now();
    if (currentTime - lastMessageTime >= 5 * 60 * 1000) {
        btf.snackbarShow('按住ctrl再右键点击可以恢复原菜单哦！');
        lastMessageTime = currentTime;
    }
}

window.oncontextmenu = function (event) {
    if (event.ctrlKey) {
        return true; // 如果按下了Ctrl键，则显示原生右键菜单
    }

    let rmWidth = 176;
    let rmHeight = 361;

    showMessageOnceInFiveMinutes();

    const MenuText = document.querySelector('#menu-text');
    const copyBtn = document.querySelector('#menu-text #copy');
    const replyBtn = document.querySelector('#menu-text #reply');
    const selection = document.getSelection().toString();

    // 隐藏默认
    MenuText.style.display = 'none';
    copyBtn.style.display = 'none';
    replyBtn.style.display = 'none';

    // 如果选中文字则显示 copy
    if (selection) {
        MenuText.style.display = 'block';
        copyBtn.style.display = 'block';
        rmHeight = 419;
        
    }

    const currentPath = window.location.pathname;
    if (selection && currentPath.startsWith('/posts/')) {
        if (!document.getElementById('popup')) {
            replyBtn.style.display = 'block';
            rmHeight = 461;
        }
    }

    if (document.body.clientWidth > 600) {
        let pageX = event.clientX;
        let pageY = event.clientY;

        const rightMenuNormal = document.querySelector('.rightMenuNormal');
        const rightMenuOther = document.querySelector('.rightMenuOther');
        // const readmode = document.getElementById('menu-readmode');

        if (rightMenuNormal) rightMenuNormal.style.display = 'block';
        if (rightMenuOther) rightMenuOther.style.display = 'block';

        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth;
        }
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= rmHeight;
        }


        rm.showRightMenu(true, pageY, pageX);

        const mask = document.getElementById('rightmenu-mask');
        mask.style.display = 'flex';

        return false; // 禁用原生右键菜单
    }
};

function removeRightMenu() {
    rm.showRightMenu(false);
    const mask = document.getElementById('rightmenu-mask');
    mask.style.display = 'none';
}

function stopMaskScroll() {
    if (document.getElementById("rightmenu-mask")) {
        let xscroll = document.getElementById("rightmenu-mask");
        xscroll.addEventListener("mousewheel", function (e) {
            removeRightMenu();
        }, false);
    };
    if (document.getElementById("rightMenu")) {
        let xscroll = document.getElementById("rightMenu");
        xscroll.addEventListener("mousewheel", function (e) {
            removeRightMenu();
        }, false);
    }
}

const translate = GLOBAL_CONFIG.translate;
const snackbarData = GLOBAL_CONFIG.Snackbar;
const isSnackbar = GLOBAL_CONFIG.Snackbar !== undefined;

// 设置小猫的显示和隐藏
function toggleLive2dVisibility() {
    removeRightMenu(); // 移除菜单
    const live2dContainer = document.getElementById('live2d-widget');
    if (!live2dContainer) return;
    if (live2dContainer.style.display === 'block' || live2dContainer.style.display === '') {
        live2dContainer.style.display = 'none'; // 显示Live2D模型
    } else {
        live2dContainer.style.display = 'block'; // 隐藏Live2D模型
    }
}

document.getElementById('menu-backward').addEventListener('click', function () {
    window.history.back();
});

document.getElementById('menu-forward').addEventListener('click', function () {
    window.history.forward();
});

document.getElementById('menu-refresh').addEventListener('click', function () {
    window.location.reload();
});

document.getElementById('menu-home').addEventListener('click', function () {
    window.location.href = window.location.origin;
});

// 小猫隐藏的绑定事件
document.getElementById('menu-live2dvisibility').addEventListener('click', function () {
    toggleLive2dVisibility();
});

/* 简体繁体切换 */
document.getElementById('menu-translate').addEventListener('click', function () {
    removeRightMenu();
    // translateInitialization();
    window.translateFn.translatePage()

});

const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
    link.addEventListener('click', function () {
        removeRightMenu();
    });
});

document.getElementById('menu-print').addEventListener('click', function () {
    removeRightMenu();
    window.print();
});

document.getElementById('rightmenu-mask').addEventListener('click', function () {
    removeRightMenu();
});

document.getElementById('rightmenu-mask').addEventListener('contextmenu', function () {
    removeRightMenu();
    return false;
});


//复制选中文字
rm.copySelect = function(){
	removeRightMenu();

    var selectedText = document.getSelection().toString().trim();

    if (selectedText) {
        navigator.clipboard.writeText(selectedText).then(
            () => {
                btf.snackbarShow('复制啦！请注意版权信息哦！');
            }
        ).catch((err) => {
            console.error('复制失败:', err);
        });
    }
}

// 显示带评论的弹窗
function showPopupWithComments() {
    const popupConfig = GLOBAL_CONFIG?.commentPopup || {};
    if (!popupConfig.enabled || !popupConfig.artalk?.server || !popupConfig.artalk?.site) {
        btf.snackbarShow('Comment service is not configured');
        return;
    }

    const overlay = createOverlay();
    const popup = createPopup();
    const commentSection = document.createElement('div');
    commentSection.id = 'artalk-wrap';
    popup.appendChild(commentSection);
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    Artalk.init({
        el: commentSection,
        server: popupConfig.artalk.server,
        site: popupConfig.artalk.site,
        darkMode: document.documentElement.getAttribute('data-theme') === 'dark',
        pageKey: window.location.pathname,
        ...(popupConfig.artalk.option || {})
    });

    btf.snackbarShow('点击弹窗外任意部分即可退出');

    setTimeout(() => {
        overlay.style.opacity = 1;
        popup.style.opacity = 1;
    }, 0);
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.classList.add('overlay');
    document.addEventListener('click', handleClickOutsidePopup);
    return overlay;
}

function createPopup() {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.classList.add('popup');
    return popup;
}

function closePopup(popup, overlay) {
    overlay.style.opacity = 0;
    popup.style.opacity = 0;
    setTimeout(() => {
        document.body.removeChild(popup);
        document.body.removeChild(overlay);
        document.removeEventListener('click', handleClickOutsidePopup);
    }, 300);
}

function handleClickOutsidePopup(event) {
    const popup = document.getElementById('popup');
    if (popup && !popup.contains(event.target)) {
        closePopup(popup, document.getElementById('overlay'));
    }
}

async function replySelect() {
    removeRightMenu();
    var selectedText = document.getSelection().toString().trim();
    if (selectedText.includes('\n')) {
        selectedText = selectedText.split('\n')[0].trim();
    }
    try {
        showPopupWithComments();
    } catch (error) {
        console.error(error);
    }
    setTimeout(() => {
        const commentBox = document.querySelector("#popup textarea");
        if (commentBox) {
            commentBox.value = `> ${selectedText}\n\n`;
        }
    }, 500);
}

rm.replySelect = replySelect;
