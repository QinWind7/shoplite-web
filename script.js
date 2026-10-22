/**
 * ShopLite · 交互脚本
 * 原生 JavaScript（无任何框架）
 * 功能：商品数据渲染 / 分类筛选 / 搜索 / 轮播图 / 商品详情弹窗 / 购物车计数
 */

/* ============================================================
 * 一、商品数据
 * ============================================================ */

// 商品图片统一使用占位图服务生成，参数中避免出现空格等特殊字符
const IMG_BASE = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';

/**
 * 拼接商品图片地址
 * @param {string} prompt 已做 URL 编码的图片描述
 * @param {'square'|'landscape_16_9'} size 图片尺寸
 * @returns {string} 完整的图片地址
 */
const buildImage = (prompt, size) =>
  `${IMG_BASE}?prompt=${prompt}&image_size=${size}`;

/**
 * 商品列表（共 12 个，与商品网格每行 4 个的布局对齐，正好排满 3 行）
 * @typedef {Object} Product
 * @property {number} id       商品唯一标识
 * @property {string} name     商品名称
 * @property {number} price    商品价格（元）
 * @property {string} image    商品图片地址
 * @property {string} category 商品所属分类
 * @property {string} desc     商品简介（用于详情弹窗）
 */
const products = [
  {
    id: 1,
    name: '星焰 X9 旗舰智能手机',
    price: 3999,
    image: buildImage('modern%20flagship%20smartphone%20product%20photo%20on%20clean%20white%20background', 'square'),
    category: '手机',
    desc: '6.7 英寸 2K 曲面屏，搭载全新一代旗舰芯片，5000mAh 大电池支持 120W 快充。'
  },
  {
    id: 2,
    name: '轻羽 Pro 主动降噪耳机',
    price: 899,
    image: buildImage('wireless%20over-ear%20headphones%20product%20photo%20studio%20white%20background', 'square'),
    category: '耳机',
    desc: '42dB 深度主动降噪，单次续航 40 小时，支持多设备无缝切换与空间音频。'
  },
  {
    id: 3,
    name: '极影 Air 轻薄笔记本',
    price: 6499,
    image: buildImage('slim%20silver%20laptop%20product%20photo%20white%20background', 'square'),
    category: '笔记本',
    desc: '14 英寸 2.8K 护眼屏，机身重量仅 1.19kg，满血性能释放续航可达 18 小时。'
  },
  {
    id: 4,
    name: '云墨 12 英寸平板电脑',
    price: 2799,
    image: buildImage('tablet%20computer%20with%20stylus%20product%20photo%20white%20background', 'square'),
    category: '平板',
    desc: '12 英寸 144Hz 高刷屏，支持手写笔与磁吸键盘，多任务分屏办公更高效。'
  },
  {
    id: 5,
    name: '脉动 S 运动智能手表',
    price: 1299,
    image: buildImage('smart%20watch%20product%20photo%20white%20background', 'square'),
    category: '手表',
    desc: '1.43 英寸 AMOLED 常亮屏，支持心率 / 血氧监测与 120 种运动模式。'
  },
  {
    id: 6,
    name: '回响 Mini 便携蓝牙音箱',
    price: 399,
    image: buildImage('portable%20bluetooth%20speaker%20product%20photo%20white%20background', 'square'),
    category: '音箱',
    desc: '双单元立体声设计，IPX7 级防水，续航 24 小时，户外随身好伴侣。'
  },
  {
    id: 7,
    name: '青轴 87 键机械键盘',
    price: 499,
    image: buildImage('mechanical%20keyboard%20product%20photo%20white%20background', 'square'),
    category: '键盘',
    desc: '87 键紧凑布局，全键热插拔，Gasket 结构手感柔和，支持三模连接。'
  },
  {
    id: 8,
    name: '追光 M2 微单相机',
    price: 5299,
    image: buildImage('mirrorless%20camera%20product%20photo%20white%20background', 'square'),
    category: '相机',
    desc: '2420 万像素全画幅传感器，五轴防抖，支持 4K 60 帧视频录制。'
  },
  {
    id: 9,
    name: '星焰 X9 Pro 影像手机',
    price: 4999,
    image: buildImage('premium%20smartphone%20with%20triple%20camera%20product%20photo%20white%20background', 'square'),
    category: '手机',
    desc: '一英寸大底主摄 + 潜望长焦，专业影像调校，随手拍出大片质感。'
  },
  {
    id: 10,
    name: '轻羽 Air 真无线耳机',
    price: 699,
    image: buildImage('true%20wireless%20earbuds%20product%20photo%20white%20background', 'square'),
    category: '耳机',
    desc: '半入耳舒适佩戴，蓝牙 5.4 低延迟连接，双麦克风通话降噪。'
  },
  {
    id: 11,
    name: '疾风 14 英寸游戏笔记本',
    price: 7599,
    image: buildImage('gaming%20laptop%20with%20backlit%20keyboard%20product%20photo%20white%20background', 'square'),
    category: '笔记本',
    desc: '14 英寸 165Hz 高刷屏，满血独立显卡，双风扇散热，兼顾性能与便携。'
  },
  {
    id: 12,
    name: '云墨 11 英寸轻薄平板',
    price: 1999,
    image: buildImage('lightweight%20tablet%20product%20photo%20white%20background', 'square'),
    category: '平板',
    desc: '11 英寸 120Hz 屏幕，机身仅 6.2mm，续航 12 小时，追剧办公两相宜。'
  }
];

/* ============================================================
 * 二、轮播数据
 * ============================================================ */
// 轮播图使用「无文字、浅色背景」的商品实拍风格素材：
// 避免图片自带文字与页面文案互相干扰，也不需要靠深色蒙版压住图片才看得清文字
const slides = [
  {
    id: 1,
    title: '秋季数码焕新季',
    subtitle: '旗舰手机 / 耳机 立减 800 元',
    image: buildImage('smartphone%20and%20earbuds%20product%20lineup%20on%20clean%20white%20background%20studio%20lighting%20no%20text', 'square')
  },
  {
    id: 2,
    title: '轻薄本专场',
    subtitle: '高性能办公本 低至 5 折起',
    image: buildImage('slim%20silver%20laptop%20on%20clean%20white%20desk%20studio%20lighting%20no%20text', 'square')
  },
  {
    id: 3,
    title: '影像创作季',
    subtitle: '微单相机套装 赠配件礼包',
    image: buildImage('mirrorless%20camera%20with%20lens%20on%20clean%20white%20background%20studio%20lighting%20no%20text', 'square')
  }
];

/* ============================================================
 * 三、全局状态
 * ============================================================ */
const state = {
  activeCategory: '全部', // 当前选中的分类
  keyword: '',            // 当前搜索关键词
  trackIndex: 1,          // 轮播当前轨道下标（1 表示第一张真实幻灯片，详见第十节）
  cartCount: 0            // 购物车商品数量
};

const AUTOPLAY_INTERVAL = 3000; // 轮播自动切换间隔：3 秒

/* ============================================================
 * 四、DOM 引用
 * ============================================================ */
const categoryListEl = document.getElementById('categoryList');
const productGridEl = document.getElementById('productGrid');
const sectionTitleEl = document.getElementById('sectionTitle');
const resultCountEl = document.getElementById('resultCount');
const emptyTipEl = document.getElementById('emptyTip');
const searchInputEl = document.getElementById('searchInput');
const searchBtnEl = document.getElementById('searchBtn');
const cartCountEl = document.getElementById('cartCount');
const cartBtnEl = document.getElementById('cartBtn');

const carouselTrackEl = document.getElementById('carouselTrack');
const carouselDotsEl = document.getElementById('carouselDots');
const prevBtnEl = document.getElementById('prevBtn');
const nextBtnEl = document.getElementById('nextBtn');

const modalEl = document.getElementById('modal');
const modalImageEl = document.getElementById('modalImage');
const modalNameEl = document.getElementById('modalName');
const modalCategoryEl = document.getElementById('modalCategory');
const modalPriceEl = document.getElementById('modalPrice');
const modalDescEl = document.getElementById('modalDesc');
const modalAddEl = document.getElementById('modalAdd');

/* ============================================================
 * 五、工具函数
 * ============================================================ */

/**
 * 价格格式化
 * @param {number} price 商品价格（元）
 * @returns {string} 带千分位和两位小数的价格字符串，如 3999 -> "¥3,999.00"
 */
function formatPrice(price) {
  return '¥' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 转义 HTML 特殊字符，防止商品名等文本破坏页面结构（XSS 防护）
 * @param {string} str 原始文本
 * @returns {string} 转义后的安全文本
 */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[ch]);
}

/**
 * 按当前筛选条件获取商品列表
 * 需同时满足：分类匹配 + 关键词匹配（名称或分类）
 * @returns {Product[]} 过滤后的商品数组，无匹配时返回空数组
 */
function getFilteredProducts() {
  const keyword = state.keyword.trim().toLowerCase();

  return products.filter((product) => {
    // 1. 分类筛选：选中的是“全部”时不过滤
    const matchCategory =
      state.activeCategory === '全部' || product.category === state.activeCategory;

    // 2. 关键词筛选：空关键词时不过滤
    const matchKeyword =
      keyword === '' ||
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);

    return matchCategory && matchKeyword;
  });
}

/* ============================================================
 * 六、分类导航渲染与交互
 * ============================================================ */

/**
 * 从商品数据中提取分类
 * @returns {string[]} 去重后的分类列表，首项固定为“全部”
 */
function getCategories() {
  // 使用 Set 去重，保持商品数据的原始顺序
  const unique = [...new Set(products.map((item) => item.category))];
  return ['全部', ...unique];
}

/** 渲染分类导航（依据 state.activeCategory 标记选中态） */
function renderCategories() {
  const categories = getCategories();

  categoryListEl.innerHTML = categories
    .map((category) => {
      // 选中分类追加 BEM 修饰符 --active
      const activeClass = category === state.activeCategory ? ' category__item--active' : '';
      return `<li class="category__item${activeClass}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</li>`;
    })
    .join('');
}

/**
 * 分类点击：切换选中分类并重新渲染商品列表（事件委托）
 * @param {MouseEvent} event 分类导航上的点击事件
 */
function handleCategoryClick(event) {
  const item = event.target.closest('.category__item');
  if (!item) return;

  const category = item.dataset.category;
  if (category === state.activeCategory) return;

  state.activeCategory = category;
  renderCategories();   // 更新选中态
  renderProducts();     // 按新分类过滤商品
}

/* ============================================================
 * 七、商品网格渲染
 * ============================================================ */

/** 渲染商品卡片网格（包含标题、结果数量与空状态提示） */
function renderProducts() {
  const list = getFilteredProducts();

  // 更新标题与结果数量
  sectionTitleEl.textContent =
    state.activeCategory === '全部' ? '全部商品' : state.activeCategory;
  resultCountEl.textContent = `共 ${list.length} 件商品`;

  // 无结果时显示空状态提示
  emptyTipEl.classList.toggle('main__empty--visible', list.length === 0);

  // 生成商品卡片 HTML（商品卡片 -> .card，图片 -> .img-cover，价格 -> .text-primary）
  productGridEl.innerHTML = list
    .map(
      (product) => `
      <article class="product-card card" data-id="${product.id}">
        <div class="product-card__media">
          <img class="product-card__image img-cover" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
          <div class="product-card__footer">
            <span class="product-card__price text-primary">${formatPrice(product.price)}</span>
            <span class="product-card__tag badge">${escapeHtml(product.category)}</span>
          </div>
        </div>
      </article>`
    )
    .join('');
}

/**
 * 商品卡片点击：打开对应的详情弹窗（事件委托）
 * @param {MouseEvent} event 商品网格上的点击事件
 */
function handleProductClick(event) {
  const card = event.target.closest('.product-card');
  if (!card) return;

  const id = Number(card.dataset.id);
  const product = products.find((item) => item.id === id);
  if (product) openModal(product);
}

/* ============================================================
 * 八、商品详情弹窗
 * ============================================================ */
// 记录当前弹窗展示的商品，供底部“加入购物车”按钮使用
let currentProduct = null;

/**
 * 打开商品详情弹窗
 * @param {Product} product 需要展示的商品对象
 */
function openModal(product) {
  currentProduct = product;

  modalImageEl.src = product.image;
  modalImageEl.alt = product.name;
  modalNameEl.textContent = product.name;
  modalCategoryEl.textContent = product.category;
  modalPriceEl.textContent = formatPrice(product.price);
  modalDescEl.textContent = product.desc;

  modalEl.classList.add('modal--open');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // 打开时禁止背景滚动
}

/** 关闭商品详情弹窗，并恢复背景滚动 */
function closeModal() {
  modalEl.classList.remove('modal--open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // 恢复背景滚动
  currentProduct = null;
}

/** 绑定弹窗相关的关闭事件：遮罩层 / 关闭按钮 / Esc 键 / 加入购物车 */
function initModalEvents() {
  // 遮罩层与关闭按钮都带有 data-close 属性，统一处理
  modalEl.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true') closeModal();
  });

  // 按 Esc 关闭
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalEl.classList.contains('modal--open')) {
      closeModal();
    }
  });

  // 弹窗内“加入购物车”
  modalAddEl.addEventListener('click', () => {
    addToCart();
  });
}

/* ============================================================
 * 九、购物车计数
 * ============================================================ */
/** 购物车商品数量 +1，并同步导航栏角标 */
function addToCart() {
  state.cartCount += 1;
  cartCountEl.textContent = state.cartCount;
}

/* ============================================================
 * 十、轮播图（3 秒自动切换 + 手动左右箭头）
 * ============================================================ */
// 自动播放定时器（null 表示当前未在自动播放）
let autoplayTimer = null;

/**
 * 轨道数据与下标约定
 * 为了让每次切换都「只平滑移动一张」，轨道首尾各复制一张幻灯片兜底：
 *   轨道下标 0                   = 末张幻灯片的克隆（视觉等同最后一张）
 *   轨道下标 1 ~ slides.length   = 真实幻灯片（第 2 张真实幻灯片的轨道下标是 2）
 *   轨道下标 slides.length + 1   = 首张幻灯片的克隆（视觉等同第一张）
 */
const trackSlides = [slides[slides.length - 1], ...slides, slides[0]];
const FIRST_TRACK_INDEX = 1;                 // 第一张真实幻灯片所在的轨道下标
const LAST_TRACK_INDEX = slides.length;      // 最后一张真实幻灯片所在的轨道下标
const HEAD_CLONE_INDEX = 0;                  // 开头克隆位
const TAIL_CLONE_INDEX = slides.length + 1;  // 末尾克隆位

/** 渲染幻灯片与指示点 */
function renderCarousel() {
  // 文案与图片分成两列：文字落在自己的面板里，不会与图片内容叠在一起
  carouselTrackEl.innerHTML = trackSlides
    .map(
      (slide) => `
      <div class="carousel__slide">
        <div class="carousel__content">
          <h3 class="carousel__title">${escapeHtml(slide.title)}</h3>
          <p class="carousel__subtitle">${escapeHtml(slide.subtitle)}</p>
          <button class="carousel__btn btn-primary" type="button">立即查看</button>
        </div>
        <div class="carousel__media">
          <img class="carousel__image img-cover" src="${slide.image}" alt="${escapeHtml(slide.title)}">
        </div>
      </div>`
    )
    .join('');

  // 指示点只对应真实幻灯片，不包含首尾两张克隆
  carouselDotsEl.innerHTML = slides
    .map((slide, index) => {
      const activeClass = index === 0 ? ' carousel__dot--active' : '';
      return `<button class="carousel__dot btn-icon${activeClass}" type="button" data-index="${index}" aria-label="第 ${index + 1} 张"></button>`;
    })
    .join('');
}

/**
 * 同步指示点选中态
 * @param {number} trackIndex 当前轨道下标；首尾克隆位会按取余映射回对应的真实幻灯片
 */
function syncDots(trackIndex) {
  const activeIndex = (trackIndex - FIRST_TRACK_INDEX + slides.length) % slides.length;
  carouselDotsEl.querySelectorAll('.carousel__dot').forEach((dot, i) => {
    dot.classList.toggle('carousel__dot--active', i === activeIndex);
  });
}

/**
 * 把轨道整体平移到指定下标
 * 位移就是需求里的 transform: translateX(-index * 100%)：索引只做纯乘法算出百分比，
 * 字符串是交给 CSS 的载体（CSS 属性只能接收字符串）。100% 正好是一张幻灯片的宽度，
 * 所以任意相邻下标之间的移动距离都严格等于一张，不会出现「滑过头」或「倒着滑两张」。
 * @param {number} trackIndex 目标轨道下标
 * @param {boolean} [withTransition=true] false 表示关闭过渡立即归位（用于回环后的静默复位）
 */
function moveTrack(trackIndex, withTransition = true) {
  if (withTransition) {
    carouselTrackEl.style.transform = `translateX(${-trackIndex * 100}%)`;
  } else {
    // 先关过渡 -> 立即定位 -> 强制重排让新位置生效 -> 恢复样式表里的过渡
    carouselTrackEl.style.transition = 'none';
    carouselTrackEl.style.transform = `translateX(${-trackIndex * 100}%)`;
    void carouselTrackEl.offsetHeight;
    carouselTrackEl.style.transition = '';
  }

  state.trackIndex = trackIndex;
  syncDots(trackIndex);

  // 滑到首/尾克隆位后，等这段过渡结束再静默换成对应的真实幻灯片
  if (trackIndex === TAIL_CLONE_INDEX || trackIndex === HEAD_CLONE_INDEX) {
    resetAfterLoop(trackIndex);
  }
}

/**
 * 无缝回环复位：克隆位与对应的真实幻灯片画面完全一致，静默切换看不出跳变
 * @param {number} cloneIndex 本次滑到的克隆下标
 */
function resetAfterLoop(cloneIndex) {
  const onTransitionEnd = (event) => {
    if (event.propertyName !== 'transform') return; // 只认 transform 的过渡结束
    carouselTrackEl.removeEventListener('transitionend', onTransitionEnd);

    // 仍停在克隆位时才归位；若用户已经再次操作则放弃，避免打断后续切换
    if (state.trackIndex !== cloneIndex) return;
    moveTrack(cloneIndex === TAIL_CLONE_INDEX ? FIRST_TRACK_INDEX : LAST_TRACK_INDEX, false);
  };
  carouselTrackEl.addEventListener('transitionend', onTransitionEnd);
}

/** 下一张：平滑前进一张；滑到末尾克隆后由 resetAfterLoop 静默回到第一张 */
function nextSlide() {
  // 快速连点把下标停在克隆位时，先静默归位，避免继续前进导致滑出轨道出现空白
  if (state.trackIndex >= TAIL_CLONE_INDEX) moveTrack(FIRST_TRACK_INDEX, false);
  moveTrack(state.trackIndex + 1);
}

/** 上一张：平滑后退一张；滑到开头克隆后由 resetAfterLoop 静默跳到末张 */
function prevSlide() {
  if (state.trackIndex <= HEAD_CLONE_INDEX) moveTrack(LAST_TRACK_INDEX, false);
  moveTrack(state.trackIndex - 1);
}

/** 启动自动播放：每 3 秒切到下一张（重复调用会先清掉旧定时器，避免叠加） */
function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
}

/** 停止自动播放并释放定时器 */
function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

/** 绑定轮播相关事件：左右箭头 / 指示点 / 悬停暂停 / 标签页隐藏暂停 */
function initCarouselEvents() {
  // 点击“下一张”，并重置自动播放计时
  nextBtnEl.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  // 点击“上一张”，并重置自动播放计时
  prevBtnEl.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });

  // 点击指示点跳转到对应幻灯片（指示点下标 +1 即轨道下标）
  carouselDotsEl.addEventListener('click', (event) => {
    const dot = event.target.closest('.carousel__dot');
    if (!dot) return;
    moveTrack(Number(dot.dataset.index) + FIRST_TRACK_INDEX);
    startAutoplay();
  });

  // 点击幻灯片上的“立即查看”，平滑滚动到下方商品区域（事件委托，兼容动态生成的幻灯片）
  carouselTrackEl.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('.carousel__btn');
    if (!viewBtn) return;
    productGridEl.scrollIntoView({ behavior: 'smooth' });
  });

  // 鼠标移入暂停，移出继续
  const carouselEl = document.querySelector('.carousel');
  carouselEl.addEventListener('mouseenter', stopAutoplay);
  carouselEl.addEventListener('mouseleave', startAutoplay);

  // 浏览器标签页隐藏时暂停，避免无意义的切换
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
}

/* ============================================================
 * 十一、搜索
 * ============================================================ */

/** 使用搜索框内容重新筛选商品（搜索时重置分类为“全部”） */
function handleSearch() {
  state.keyword = searchInputEl.value;
  // 搜索时把分类重置为“全部”，避免两个筛选条件叠加导致空结果
  state.activeCategory = '全部';
  renderCategories();
  renderProducts();
}

/** 绑定搜索相关事件：按钮点击 / 回车提交 / 清空后自动恢复 */
function initSearchEvents() {
  // 点击搜索按钮
  searchBtnEl.addEventListener('click', handleSearch);

  // 回车触发搜索
  searchInputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleSearch();
  });

  // 清空输入框时自动恢复全部商品
  searchInputEl.addEventListener('input', () => {
    if (searchInputEl.value.trim() === '' && state.keyword !== '') {
      handleSearch();
    }
  });
}

/* ============================================================
 * 十二、页脚交互
 * ============================================================ */

/** 绑定页脚“购物指南 / 售后服务”条目的点击事件 */
function initFooterEvents() {
  // 这些条目本身是 <li>，不是链接，不存在页面跳动问题；
  // 用 data-action 属性标记而不用新增 class，避免引入任何样式变化
  const footerEl = document.querySelector('.footer');
  footerEl.addEventListener('click', (event) => {
    const item = event.target.closest('[data-action="coming-soon"]');
    if (!item) return;
    alert('功能开发中，敬请期待！');
  });
}

/* ============================================================
 * 十三、初始化
 * ============================================================ */
/** 页面初始化：按顺序完成各模块渲染、事件绑定与轮播启动 */
function init() {
  // 1. 分类导航：渲染分类项并绑定筛选事件
  renderCategories();
  categoryListEl.addEventListener('click', handleCategoryClick);

  // 2. 商品网格：渲染商品卡片并绑定弹窗打开事件
  renderProducts();
  productGridEl.addEventListener('click', handleProductClick);

  // 3. 弹窗：绑定关闭与加入购物车事件
  initModalEvents();

  // 4. 轮播：先渲染，再定位到第一张并启动自动播放
  renderCarousel();
  moveTrack(FIRST_TRACK_INDEX, false); // 首次定位关掉过渡，避免页面加载时出现滑入动画
  initCarouselEvents();
  startAutoplay();

  // 5. 搜索
  initSearchEvents();

  // 6. 页脚：点击“购物指南 / 售后服务”条目给出提示
  initFooterEvents();

  // 7. 购物车：演示用，点击后提示当前商品数量
  cartBtnEl.addEventListener('click', () => {
    alert(`购物车中共有 ${state.cartCount} 件商品`);
  });
}

// 页面加载完成后启动初始化
document.addEventListener('DOMContentLoaded', init);
