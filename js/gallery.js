'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');
  var imageFilterButtons = document.querySelectorAll('.img-filters__button');
  var basicFilter = document.querySelector('#filter-default');
  var randomFilter = document.querySelector('#filter-random');
  var discussedFilter = document.querySelector('#filter-discussed');
  var pictures;

  var bigPictureOpenHandler = function (evt) {
    if (evt.target.classList.contains('picture')) {
      var clickedPhoto = evt.target;
    } else if (evt.target.classList.contains('picture__img')) {
      clickedPhoto = evt.target.parentElement;
    } else if (evt.target.classList.contains('picture__info')) {
      clickedPhoto = evt.target.parentElement;
    } else if (evt.target.parentElement.classList.contains('picture__info')) {
      clickedPhoto = evt.target.parentElement.parentElement;
    }

    if (clickedPhoto) {
      var id = Number(clickedPhoto.querySelector('img').dataset.id);
      var targetPicture = pictures.find(function (picture) {
        return picture.id === id;
      });

      window.bigPicture.create(targetPicture);
    }
  };

  var successHandler = function (data) {
    pictures = data;

    data.forEach(function (picture, index) {
      picture.id = index;
    });

    imageFilters.classList.remove('img-filters--inactive');
    window.filter.setBasic(pictures);

    picturesContainer.addEventListener('click', bigPictureOpenHandler);
    picturesContainer.addEventListener('keydown', function (evt) {
      if (window.utils.isKeyPressed.enter(evt)) {
        bigPictureOpenHandler(evt);
      }
    });
  };

  var errorHandler = function (errorMessage) {
    var errorPopup = document.createElement('div');
    errorPopup.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    errorPopup.style.position = 'absolute';
    errorPopup.style.left = 0;
    errorPopup.style.right = 0;
    errorPopup.style.fontSize = '30px';

    errorPopup.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorPopup);
  };

  window.backend.load(successHandler, errorHandler);

  var setFilter = function (filter, evt) {
    window.debounce(function () {
      filter(pictures);
    });

    Array.from(imageFilterButtons).forEach(function (button) {
      if (button.classList.contains('img-filters__button--active')) {
        button.classList.remove('img-filters__button--active');
      }
    });
    evt.target.classList.add('img-filters__button--active');
  };

  // обработчики кнопок фильтрации объявлений
  basicFilter.addEventListener('click', function (evt) {
    if (!evt.target.classList.contains('img-filters__button--active')) {
      setFilter(window.filter.setBasic, evt);
    }
  });

  randomFilter.addEventListener('click', function (evt) {
    setFilter(window.filter.setRandom, evt);
  });

  discussedFilter.addEventListener('click', function (evt) {
    if (!evt.target.classList.contains('img-filters__button--active')) {
      setFilter(window.filter.setDiscussed, evt);
    }
  });
})();
