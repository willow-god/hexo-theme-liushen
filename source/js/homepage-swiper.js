(() => {
  const state = window.__liushenHomepageSwiper || (window.__liushenHomepageSwiper = {
    instance: null,
    element: null,
    retryTimer: null,
    retryCount: 0,
    bound: false,
    stopAutoplay: null,
    startAutoplay: null
  })

  const MAX_RETRIES = 20
  const RETRY_DELAY = 120
  const isHomePage = () => window.GLOBAL_CONFIG_SITE?.isHome === true

  const clearRetry = () => {
    if (state.retryTimer) {
      window.clearTimeout(state.retryTimer)
      state.retryTimer = null
    }
    state.retryCount = 0
  }

  const cleanupHomepageSwiper = () => {
    clearRetry()

    if (state.element && state.stopAutoplay && state.startAutoplay) {
      state.element.removeEventListener('mouseenter', state.stopAutoplay)
      state.element.removeEventListener('mouseleave', state.startAutoplay)
    }

    state.stopAutoplay = null
    state.startAutoplay = null

    if (state.instance && !state.instance.destroyed) {
      state.instance.destroy(true, true)
    }

    state.instance = null
    state.element = null
  }

  const scheduleRetry = () => {
    if (state.retryCount >= MAX_RETRIES) return

    state.retryCount += 1
    state.retryTimer = window.setTimeout(() => {
      state.retryTimer = null
      initHomepageSwiper()
    }, RETRY_DELAY)
  }

  const initHomepageSwiper = () => {
    const swiperElement = document.getElementById('homepage-swiper')

    if (!swiperElement) {
      cleanupHomepageSwiper()
      if (isHomePage()) scheduleRetry()
      return
    }

    if (typeof Swiper !== 'function') {
      scheduleRetry()
      return
    }

    clearRetry()

    const slideCount = swiperElement.querySelectorAll('.swiper-slide').length
    const paginationElement = swiperElement.querySelector('.homepage-swiper__pagination')
    const mousewheelEnabled = swiperElement.dataset.mousewheel !== 'false'
    const transitionSpeed = Number.parseInt(swiperElement.dataset.speed || '550', 10)
    const autoplayDelay = Number.parseInt(swiperElement.dataset.delay || '3200', 10)

    cleanupHomepageSwiper()

    swiperElement.classList.toggle('is-static', slideCount <= 1)
    state.element = swiperElement

    if (slideCount <= 0) {
      if (isHomePage()) scheduleRetry()
      return
    }

    if (slideCount === 1) return

    state.instance = new Swiper(swiperElement, {
      passiveListeners: true,
      effect: 'fade',
      loop: true,
      speed: Number.isNaN(transitionSpeed) ? 550 : transitionSpeed,
      autoHeight: false,
      observer: true,
      observeParents: true,
      spaceBetween: 24,
      mousewheel: mousewheelEnabled,
      autoplay: {
        delay: Number.isNaN(autoplayDelay) ? 3200 : autoplayDelay,
        disableOnInteraction: false
      },
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: paginationElement,
        clickable: true
      }
    })

    state.stopAutoplay = () => state.instance?.autoplay && state.instance.autoplay.stop()
    state.startAutoplay = () => state.instance?.autoplay && state.instance.autoplay.start()

    swiperElement.addEventListener('mouseenter', state.stopAutoplay)
    swiperElement.addEventListener('mouseleave', state.startAutoplay)
  }

  const bootHomepageSwiper = () => {
    initHomepageSwiper()
  }

  if (!state.bound) {
    document.addEventListener('pjax:send', cleanupHomepageSwiper)
    document.addEventListener('pjax:complete', bootHomepageSwiper)
    state.bound = true
  }

  document.addEventListener('DOMContentLoaded', bootHomepageSwiper)

  if (window.btf?.addGlobalFn) {
    btf.addGlobalFn('pjaxSendOnce', cleanupHomepageSwiper, 'homepageSwiperDestroy')
    btf.addGlobalFn('pjaxComplete', bootHomepageSwiper, 'initHomepageSwiper')
  }
})()
