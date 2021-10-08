/* global Handlebars, dataSource, utils */

{
  'use strict';

  const select = {
    templateOf: {
      panelBook: '#template-book',
    },
    containerOf: {
      panel: '.books-list'
    },
    panelBook: {
      bookCover: '#book__image'
    }, 
    filterForm: {
      filters: '.filters'
    }
  };

  const classNames = {
    panelBook: {
      favoriteBook: 'favorite',
      hiddenBook: 'hidden'
    }
  };

  const templates = {
    panelBook: Handlebars.compile(document.querySelector(select.templateOf.panelBook).innerHTML),
  };

  const ratingStyles = {
    ratingLevelOne: 'background: linear-gradient(to bottom, #fefcea 0%, #f1da36 100%);',
    ratingLevelTwo: 'background: linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);', 
    ratingLevelThree: 'background: linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);',
    ratingLevelFour: 'background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);',
  };

  const favoriteBooks = [];
  const filters = [];   

  class Bookslist {
    constructor(data){
      const thisBook = this;

      thisBook.data = data;
      thisBook.renderInPanel();
      thisBook.getElements();
      thisBook.initActions();
    }

    renderInPanel() {
      const thisBook = this;

      const generatedHTML = templates.panelBook(thisBook.prepareRenderBook());
      const panelContainer = document.querySelector(select.containerOf.panel);
  
      panelContainer.appendChild(utils.createDOMFromHTML(generatedHTML)); 
    }

    prepareRenderBook() {
      const thisBook = this;

      const renderObj = {
        id: thisBook.data.id,
        name: thisBook.data.name,
        price: thisBook.data.price,
        image: thisBook.data.image,
        rating: thisBook.data.rating,
        background: thisBook.determineRatingBgc(thisBook.data.rating),
        width: thisBook.data.rating * 10,
      };
      return renderObj;
    }

    getElements(){
      const thisBook = this;

      thisBook.booksList = document.querySelector(select.containerOf.panel);
      thisBook.form = document.querySelector(select.filterForm.filters);
    }
    
    initActions() {
      const thisBook = this;
      
      thisBook.booksList.addEventListener('dblclick', function(event){
        event.preventDefault();
          
        if(event.target.offsetParent.classList.contains(classNames.panelBook.favoriteBook)){
          const index = favoriteBooks.indexOf(event.target.offsetParent.dataset.id);
          favoriteBooks.splice(index, index + 1);
        } else {
          favoriteBooks.push(event.target.offsetParent.dataset.id);
        }

        event.target.offsetParent.classList.toggle(classNames.panelBook.favoriteBook);
      });

      thisBook.form.addEventListener('click', function(event){
        if(event.target.tagName == 'INPUT' && event.target.type == 'checkbox' && event.target.name == 'filter'){
          if(event.target.checked){
            filters.push(event.target.value);
          } else {
            const index = filters.indexOf(event.target.value);
            filters.splice(index, index + 1);
          }
        }

        thisBook.filterBooks();
      });
    }

    filterBooks() {
      for(const book of dataSource.books){
        let shouldBeHidden = false;

        for(const filter of filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }

        if(shouldBeHidden){
          document.querySelector('.book__image[data-id="' + book.id + '"]').classList.toggle(classNames.panelBook.hiddenBook);
        } else {
          document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove(classNames.panelBook.hiddenBook);
        }
      }
    }

    determineRatingBgc(rating){
      let background = '';
      if(rating < 6){
        background = ratingStyles.ratingLevelOne;
      }
      if(rating > 6 && rating <= 8){
        background = ratingStyles.ratingLevelTwo;
      }
      if(rating > 8 && rating <= 9){
        background = ratingStyles.ratingLevelThree;
      }
      if(rating > 9){
        background = ratingStyles.ratingLevelFour;
      }

      return background;
    }
  }

  const app = {
    init: function(){
      for(const book of dataSource.books){
        new Bookslist(book);
      }
    }
  };

  app.init();
}
  