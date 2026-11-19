/* ==========================================================================
   静态电子相册 · script.js
   --------------------------------------------------------------------------
   使用说明：
   · 新增图片时，只需在下面的 photos 数组里追加一项，并把图片放进 images/
     （缩略图放进 images/thumbs/，可选；不填 thumb 时直接用原图）。
   · 每一项的格式：{ src, thumb, title, desc }
       src   必填，原图路径（相对 index.html）
       thumb 选填，缩略图路径；建议使用同比例的较小图片，加快网格加载
       title 选填，照片标题，显示在卡片与灯箱底部
       desc  选填，照片描述，显示在灯箱底部
   · 图片为任意宽高比都可以，页面会用 object-fit: contain 完整展示，不裁剪。
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   1. 图片数据配置（唯一需要修改的地方）
   -------------------------------------------------------------------------- */
const photos = [
  //添加照片模板
  // {
  //   src: 'images/图片名称.jpg',
  //   thumb: 'images/thumbs/缩略图名称.jpg',
  //   title: '照片标题',
  //   desc: '照片描述'
  // },

  {
    src: 'images/01-candlelight.jpg',
    thumb: 'images/thumbs/01-candlelight.jpg',
    title: '烛光里的愿望',
    desc: '灯关掉的那一刻，世界只剩下奶油香、烛火，和你悄悄许下的心愿。愿它们都被听见。'
  },
  {
    src: 'images/02-rose-dusk.jpg',
    thumb: 'images/thumbs/02-rose-dusk.jpg',
    title: '玫瑰色的黄昏',
    desc: '天色慢慢软下来，像被谁轻轻盖上一层玫瑰色的纱。这样的傍晚，适合什么都不做，只发呆。'
  },
  {
    src: 'images/03-garden.jpg',
    thumb: 'images/thumbs/03-garden.jpg',
    title: '花园里的一整个春天',
    desc: '风经过的时候，叶子替我们鼓了掌。愿你的日子，也这样生机勃勃、绿意盎然。'
  },
  {
    src: 'images/04-golden-hour.jpg',
    thumb: 'images/thumbs/04-golden-hour.jpg',
    title: '金色时刻',
    desc: '光落在肩上，暖得像一句迟到的祝福。愿你走过的每一段路，都有这样的金色时刻。'
  },
  {
    src: 'images/05-midnight-sea.jpg',
    thumb: 'images/thumbs/05-midnight-sea.jpg',
    title: '午夜的海',
    desc: '海浪把白天的心事都带走，只留下很轻很轻的呼吸声。新的一岁，愿你心里始终有一片辽阔。'
  },
  {
    src: 'images/06-starlight.jpg',
    thumb: 'images/thumbs/06-starlight.jpg',
    title: '星光落下来',
    desc: '星星是很旧的远方，愿望是很新的此刻。抬头的时候，记得你也是被光选中的人。'
  },
  {
    src: 'images/07-peach-morning.jpg',
    thumb: 'images/thumbs/07-peach-morning.jpg',
    title: '蜜桃色的清晨',
    desc: '太阳刚醒，天空是甜甜的蜜桃色。愿你的每个早晨，都值得被温柔地期待。'
  },
  {
    src: 'images/08-birthday-ribbon.jpg',
    thumb: 'images/thumbs/08-birthday-ribbon.jpg',
    title: '为你系上的丝带',
    desc: '有些祝福要系成蝴蝶结，才显得郑重。愿你被爱包裹，也永远有拆礼物的心情。'
  },
  {
    src: 'images/09-champagne.jpg',
    thumb: 'images/thumbs/09-champagne.jpg',
    title: '举杯，敬这一年',
    desc: '敬那些好好吃饭、好好睡觉、好好爱自己的日子。敬你，也敬接下来闪闪发亮的一年。'
  }
];

/* --------------------------------------------------------------------------
   2. 常量与工具函数
   -------------------------------------------------------------------------- */
const PLACEHOLDER = 'images/placeholder.svg'; // 图片加载失败时显示的占位图

const pad2 = (n) => String(n).padStart(2, '0');
const isWrapIndex = (i, len) => ((i % len) + len) % len;
const isPlaceholder = (src) => typeof src === 'string' && src.indexOf('placeholder.svg') !== -1;

/* --------------------------------------------------------------------------
   3. 渲染相册网格
   -------------------------------------------------------------------------- */
const grid = document.getElementById('gallery-grid');
const photoCount = document.getElementById('photo-count');

const fragment = document.createDocumentFragment();
const cardImages = [];

photos.forEach((photo, index) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.dataset.index = String(index);
  card.style.setProperty('--i', String(index));
  card.setAttribute('aria-label', `查看大图：${photo.title || `第 ${index + 1} 张照片`}`);

  /* --- 缩略图画框 --- */
  const media = document.createElement('span');
  media.className = 'card__media';

  const img = document.createElement('img');
  img.className = 'card__img';
  img.src = photo.thumb || photo.src;
  img.alt = photo.title || `第 ${index + 1} 张照片`;
  img.loading = 'lazy'; // 原生懒加载，首屏不被大图阻塞
  img.decoding = 'async';
  img.draggable = false;

  const badge = document.createElement('span');
  badge.className = 'card__badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.textContent = pad2(index + 1);

  media.append(img, badge);

  /* --- 标题栏 --- */
  const info = document.createElement('span');
  info.className = 'card__info';

  const title = document.createElement('span');
  title.className = 'card__title';
  title.textContent = photo.title || `第 ${index + 1} 张照片`;

  const more = document.createElement('span');
  more.className = 'card__more';
  more.setAttribute('aria-hidden', 'true');
  more.innerHTML =
    '查看' +
    '<svg viewBox="0 0 16 16" width="12" height="12" fill="none">' +
    '<path d="M3 8h9M9 4.5L12.5 8 9 11.5" stroke="currentColor" stroke-width="1.3" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  info.append(title, more);
  card.append(media, info);
  fragment.append(card);
  cardImages.push({ card, img });
});

grid.appendChild(fragment);

/* 图片加载状态：成功淡入；失败换成占位图，不破坏网格布局 */
cardImages.forEach(({ card, img }) => {
  let settled = false;

  const markLoaded = () => {
    if (settled) return;
    settled = true;
    card.classList.add('is-loaded');
  };

  img.addEventListener('load', markLoaded);

  img.addEventListener('error', () => {
    // 占位图本身也失败时，至少结束加载态，避免一直闪 skeleton
    if (img.dataset.fallback === '1') {
      markLoaded();
      return;
    }
    img.dataset.fallback = '1';
    card.classList.add('is-error');
    img.src = PLACEHOLDER;
    if (img.complete && img.naturalWidth > 0) markLoaded();
  });

  // 命中浏览器缓存时 load 可能已经结束
  if (img.complete && img.naturalWidth > 0) markLoaded();
});

/* 更新页头照片数量 */
if (photoCount) {
  photoCount.textContent = photos.length
    ? `共 ${photos.length} 张照片`
    : '相册还是空的';
}

if (!photos.length) {
  const empty = document.createElement('p');
  empty.className = 'notice';
  empty.textContent = '相册里还没有照片，请在 script.js 的 photos 数组中添加。';
  grid.appendChild(empty);
}

/* --------------------------------------------------------------------------
   4. 灯箱（大图查看）
   -------------------------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lbScrim = lightbox.querySelector('[data-close]');
const lbGlow = document.getElementById('lb-glow');
const lbCounter = document.getElementById('lb-counter');
const lbImg = document.getElementById('lb-img');
const lbFrame = document.getElementById('lb-frame');
const lbStage = document.getElementById('lb-stage');
const lbTitle = document.getElementById('lb-title');
const lbDesc = document.getElementById('lb-desc');
const lbLive = document.getElementById('lb-live');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

const total = photos.length;
let current = 0;         // 当前照片索引
let isOpen = false;      // 灯箱是否打开
let lastFocused = null;  // 关闭后归还焦点
let imageToken = 0;      // 防止快速切换时旧图覆盖新图
let preloadTimer = 0;

/* 打开灯箱 */
function openLightbox(index) {
  if (!total) return;
  lastFocused = document.activeElement;
  current = isWrapIndex(index, total);
  isOpen = true;

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('no-scroll');

  showSlide(current, 0);
  lightbox.focus({ preventScroll: true });
}

/* 关闭灯箱 */
function closeLightbox() {
  if (!isOpen) return;
  isOpen = false;

  // 先把焦点还给触发元素，再隐藏对话框，避免焦点停留在 aria-hidden 区域内
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus({ preventScroll: true });
  }
  lastFocused = null;

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');
}

/* 上一张 / 下一张 */
function goTo(delta) {
  if (!isOpen || total < 2) return;
  current = isWrapIndex(current + delta, total);
  showSlide(current, delta);
}

/* 渲染某一张照片 */
function showSlide(index, direction) {
  const photo = photos[index];
  if (!photo) return;

  /* 文案与计数 */
  lbTitle.textContent = photo.title || '';
  lbDesc.textContent = photo.desc || '';
  lbCounter.textContent = `${pad2(index + 1)} / ${pad2(total)}`;
  lbLive.textContent = `第 ${index + 1} 张，共 ${total} 张：${photo.title || ''}`;

  /* 切换方向的小动画 */
  lbFrame.classList.remove('anim-next', 'anim-prev');
  if (direction !== 0) {
    void lbFrame.offsetWidth; // 强制重排，让动画可以重复触发
    lbFrame.classList.add(direction > 0 ? 'anim-next' : 'anim-prev');
  }

  /* 模糊氛围底图（用缩略图，立即出现） */
  const glowSrc = photo.thumb || photo.src;
  lbGlow.src = glowSrc;
  lightbox.classList.add('has-glow');

  /* 大图加载 */
  loadFullImage(photo);

  /* 预加载左右相邻的大图 */
  window.clearTimeout(preloadTimer);
  preloadTimer = window.setTimeout(() => preloadNeighbors(index), 350);
}

/* 加载当前大图：显示 spinner，成功淡入，失败换占位图 */
function loadFullImage(photo) {
  const token = ++imageToken;

  lbStage.classList.add('is-loading');
  lbImg.classList.remove('is-ready', 'is-error');
  lbImg.alt = photo.title || '';

  lbImg.onload = () => {
    if (token !== imageToken) return;
    lbStage.classList.remove('is-loading');
    lbImg.classList.add('is-ready');
    if (isPlaceholder(lbImg.getAttribute('src'))) {
      lbImg.classList.add('is-error');
    }
  };

  lbImg.onerror = () => {
    if (token !== imageToken) return;
    if (!isPlaceholder(lbImg.getAttribute('src'))) {
      lbImg.src = PLACEHOLDER; // 触发 load 后走上面的成功分支
    } else {
      lbStage.classList.remove('is-loading');
      lbImg.classList.add('is-ready', 'is-error');
    }
  };

  lbImg.src = photo.src;

  // 图片已在缓存中时，load 可能不会再次触发
  if (lbImg.complete && lbImg.naturalWidth > 0) {
    lbImg.onload();
  }
}

/* 预加载相邻图片，让左右切换更顺畅 */
function preloadNeighbors(index) {
  if (!isOpen || total < 2) return;
  [1, -1].forEach((offset) => {
    const photo = photos[isWrapIndex(index + offset, total)];
    if (!photo) return;
    const preloader = new Image();
    preloader.decoding = 'async';
    preloader.src = photo.src;
  });
}

/* 点击缩略图打开 */
grid.addEventListener('click', (event) => {
  const card = event.target.closest('.card');
  if (!card) return;
  openLightbox(Number(card.dataset.index));
});

/* 关闭 / 切换按钮 */
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => goTo(-1));
lbNext.addEventListener('click', () => goTo(1));

/* 点击遮罩空白处关闭（stage 本身 pointer-events: none，空白处事件会落到 scrim） */
lbScrim.addEventListener('click', closeLightbox);

/* 只有一张图时隐藏切换按钮 */
if (total < 2) {
  lbPrev.hidden = true;
  lbNext.hidden = true;
}

/* --------------------------------------------------------------------------
   5. 键盘操作：← / → 切换，Esc 关闭，Tab 焦点锁定
   -------------------------------------------------------------------------- */
function trapFocus(event) {
  const focusables = [lbClose, lbPrev, lbNext].filter(
    (el) => el && !el.hidden && !el.disabled
  );
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey) {
    if (
      document.activeElement === first ||
      document.activeElement === lightbox ||
      !lightbox.contains(document.activeElement)
    ) {
      event.preventDefault();
      last.focus();
    }
  } else if (document.activeElement === last || !lightbox.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('keydown', (event) => {
  if (!isOpen) return;

  switch (event.key) {
    case 'Escape':
    case 'Esc':
      event.preventDefault();
      closeLightbox();
      break;
    case 'ArrowRight':
      event.preventDefault();
      goTo(1);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      goTo(-1);
      break;
    case 'Home':
      event.preventDefault();
      if (total) {
        current = 0;
        showSlide(current, -1);
      }
      break;
    case 'End':
      event.preventDefault();
      if (total) {
        current = total - 1;
        showSlide(current, 1);
      }
      break;
    case 'Tab':
      trapFocus(event);
      break;
    default:
      break;
  }
});

/* --------------------------------------------------------------------------
   6. 移动端触摸滑动：左右切换，下滑关闭
   -------------------------------------------------------------------------- */
const SWIPE_MIN_X = 45;   // 横向滑动触发阈值（px）
const SWIPE_MIN_Y = 110;  // 下滑关闭触发阈值（px）

let touchStartX = null;
let touchStartY = null;
let touchAxis = null;

lightbox.addEventListener(
  'touchstart',
  (event) => {
    if (!isOpen || event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchAxis = null;
  },
  { passive: true }
);

/* 判定为横向滑动后阻止浏览器默认的横向手势（如前进/后退），但不影响双指缩放 */
lightbox.addEventListener(
  'touchmove',
  (event) => {
    if (!isOpen || touchStartX === null || event.touches.length !== 1) return;

    const dx = event.touches[0].clientX - touchStartX;
    const dy = event.touches[0].clientY - touchStartY;

    if (touchAxis === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (touchAxis === 'x' && event.cancelable) {
      event.preventDefault();
    }
  },
  { passive: false }
);

lightbox.addEventListener(
  'touchend',
  (event) => {
    if (!isOpen || touchStartX === null) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    touchStartX = null;
    touchStartY = null;
    touchAxis = null;

    // 横向滑动优先：左滑下一张，右滑上一张
    if (Math.abs(dx) > SWIPE_MIN_X && Math.abs(dx) > Math.abs(dy) * 1.2) {
      goTo(dx < 0 ? 1 : -1);
      return;
    }

    // 向下滑动关闭（仅在纵向位移明显大于横向时）
    if (dy > SWIPE_MIN_Y && Math.abs(dy) > Math.abs(dx) * 1.2) {
      closeLightbox();
    }
  },
  { passive: true }
);
