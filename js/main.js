document.addEventListener("DOMContentLoaded", () => {
  const themeCheckbox = document.querySelector('.theme-checkbox');
  const themeLink = document.querySelector('link[href="css/light-theme.css"]');

  // Проверка, была ли у пользователя ранее включена темная тема
  const savedThemePreference = localStorage.getItem('darkThemeEnabled');
  if (savedThemePreference === 'true') {
    themeCheckbox.checked = true;
    themeLink.href = "css/dark-theme.css"
  }

  themeCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      themeLink.href = "css/dark-theme.css";
      localStorage.setItem('darkThemeEnabled', 'true');
    } else {
      themeLink.href = "css/light-theme.css";
      localStorage.setItem('darkThemeEnabled', 'false');
    }
  });

  // Выбор фона сайта
  let backgroundChangeItem = document.querySelectorAll(".back-change__item");
  let wrapperBlock = document.querySelector(".wrapper");

  // Получить сохраненный класс из локального хранилища
  let savedClass = localStorage.getItem("wrapperBlockClass");
  if (savedClass) {
    wrapperBlock.classList.add(savedClass);
  }

  backgroundChangeItem.forEach((el) => {
    el.addEventListener("click", () => {
      wrapperBlock.className = "wrapper";
      switch (true) {
        case el.classList.contains("bg1"):
          wrapperBlock.classList.add("bg1");
          localStorage.setItem("wrapperBlockClass", "bg1");
          break;
        case el.classList.contains("bg2"):
          wrapperBlock.classList.add("bg2");
          localStorage.setItem("wrapperBlockClass", "bg2");
          break;
        case el.classList.contains("bg3"):
          wrapperBlock.classList.add("bg3");
          localStorage.setItem("wrapperBlockClass", "bg3");
          break;
        case el.classList.contains("bg4"):
          wrapperBlock.classList.add("bg4");
          localStorage.setItem("wrapperBlockClass", "bg4");
          break;
      }
    });
  });

  // Перенос элементов в другой блок
  function moveThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const headerBox = document.querySelector('.header__box');
    const tmenu = document.querySelector('.tmenu');

    if (window.matchMedia("(max-width: 375px)").matches) {
      // Переместить переключатель тем в tmenu
      tmenu.appendChild(themeSwitcher);
    } else {
      // Переместить переключатель тем обратно в поле заголовка
      headerBox.appendChild(themeSwitcher);
    }
  }
  // Вызов функции при загрузке страницы
  moveThemeSwitcher();
  // Прослушивание изменения размера окна и снова вызов функции
  window.addEventListener("resize", moveThemeSwitcher);


  // Код который отвечает за открытие аккордиона в accordion-nav
  const accordions = document.querySelectorAll(".accordion-nav__item");

  if (accordions.length) {
    const activeAccordion = document.querySelector(".accordion-nav__item .submenu__link_active").closest(".accordion-nav__item");

    const toggleAccordion = accordion => {
      const content = accordion.querySelector(".accordion-nav__body");
      const isActive = accordion.classList.contains("active");
      content.style.maxHeight = isActive ? null : `${content.scrollHeight}px`;
      accordion.classList.toggle("active", !isActive);
    };

    accordions.forEach(accordion => {
      const intro = accordion.querySelector(".accordion-nav__header");

      intro.addEventListener("click", () => toggleAccordion(accordion));
    });

    if (activeAccordion) {
      toggleAccordion(activeAccordion);
    }

  }

  // Появление блока с аккордионами на моб версии
  let overlayForPage = document.querySelector(".overlay");
  let navigationBlock = document.querySelector(".navigation");
  let navigationBlockOpenBtn = document.querySelector(".main-block__nav-open");

  if (!navigationBlock || !navigationBlockOpenBtn) {
    return;
  }

  navigationBlockOpenBtn.addEventListener("click", toggleNav);
  overlayForPage.addEventListener("click", toggleNav);

  function toggleNav() {
    navigationBlockOpenBtn.classList.toggle("open");
    navigationBlock.classList.toggle("open");
    overlayForPage.classList.toggle("active");
  }

  // Закрытие навигационного блока при свайпе
  let xDown, yDown;

  navigationBlock.addEventListener("touchstart", handleTouchStart);
  navigationBlock.addEventListener("touchmove", handleTouchMove);

  function handleTouchStart(event) {
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = event.touches[0].clientX;
    let yUp = event.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 10) {
        toggleNav();
      }
    }

    xDown = null;
    yDown = null;
  }

  // Функционал для блока navigation, чтобы фиксировать при скроле:
  function stickyNav() {
    let accordionNav = document.querySelector('.accordion-nav');
    let headerHeight = document.querySelector('.header').offsetHeight;
    let lastScrollPosition = parseInt(localStorage.getItem("lastScrollPosition")) || 0; //сохраняю сколько было проскроленно пикселей, конвертирую в integer для оптмизации
    let sticky = false;
    // проверяем есть ли блок accordion-nav на странице и проверяем разрешение экрана.
    if (!accordionNav || window.innerWidth <= 991) return;
    // сделал функцию в которую буду передавать свойства position и top блока accordionNav, чтобы не писать каждый раз по две строки кода
    function saveStyles(position, top) {
      localStorage.setItem('accordionNavPosition', position);
      localStorage.setItem('accordionNavTop', top);
    }
    // сохраняю положение и позиционирование блока на момент скролла, чтобы при перезагрузке не слетало ничего.
    if (localStorage.getItem('accordionNavTop') && localStorage.getItem('accordionNavPosition')) {
      accordionNav.style.top = localStorage.getItem('accordionNavTop');
      accordionNav.style.position = localStorage.getItem('accordionNavTop');
    }
    // фикс бага, когда перезагружаешь страницу в момент когда блок акардион стал стики, то он остается стики и дальше, из-за того что сохраняю значение в локалсторадже
    if (sticky !== true && window.scrollY > accordionNav.offsetHeight + 40 && localStorage.getItem('accordionNavPosition') == "sticky") {
      accordionNav.style.position = 'relative';
      accordionNav.style.top = lastScrollPosition - accordionNav.offsetHeight - 200 + "px";
    }
    //фиксит баг когда заходишь на страницу
    if (window.scrollY > lastScrollPosition) {
      accordionNav.style.position = 'relative';
      accordionNav.style.top = 0 + "px";
      saveStyles(accordionNav.style.position, accordionNav.style.top)
    }
    window.addEventListener('scroll', function () {
      // момент когда листаем вниз
      if (window.scrollY > lastScrollPosition) {
        // когда мы пролистываем страницу вниз и блока accordionNav не видно, то он скрывает наверху и едет за нами
        if (sticky !== true && window.scrollY > accordionNav.offsetHeight + 40) {
          if (accordionNav.getBoundingClientRect().top < window.innerHeight + accordionNav.offsetHeight && accordionNav.getBoundingClientRect().bottom <= 0) {
            accordionNav.style.position = 'relative';
            accordionNav.style.top = lastScrollPosition - accordionNav.offsetHeight - 150 + "px";
            saveStyles(accordionNav.style.position, accordionNav.style.top)
            sticky = false;
          }
          // иначе останавливает пока не прокрутим до верха блока accordionNav
        } else if (sticky == true) {
          accordionNav.style.top = accordionNav.offsetTop + "px";
          accordionNav.style.position = 'relative';
          saveStyles(accordionNav.style.position, accordionNav.style.top)
          if (window.scrollY > accordionNav.offsetTop + accordionNav.offsetHeight) {
            sticky = false;
          }
          // иначе закрепляет блок accordionNav в начальной его точке, тип просто в начале страницы
        } else {
          accordionNav.style.position = 'relative';
          accordionNav.style.top = 0 + "px";
          saveStyles(accordionNav.style.position, accordionNav.style.top)
        }
        // момент когда листаем вверх
      } else if (window.scrollY < lastScrollPosition) {
        // пока мы тянем вверх accordionNav будет sticky
        if (window.scrollY < accordionNav.offsetTop) {
          accordionNav.style.position = 'sticky';
          accordionNav.style.top = headerHeight + "px";
          saveStyles(accordionNav.style.position, accordionNav.style.top)
          sticky = true;
        }
      }
      lastScrollPosition = window.scrollY;
      localStorage.setItem("lastScrollPosition", lastScrollPosition);
    });
  }

  stickyNav()


  window.addEventListener('scroll', function () {
    // Появление кнопки для скролла вниз
    let arrowUp = document.querySelector(".arrow-up")
    if (window.pageYOffset > 400 || document.documentElement.scrollY > 400) {
      arrowUp.style.opacity = "0.5"
    } else {
      arrowUp.style.opacity = "0"
    }

  })


})