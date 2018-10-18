import $ from 'jquery';

export const renderNotValidInput = () => {
  $('#input').addClass('is-invalid');
  $('#feedbackElement').remove();
};

export const renderDuplicateError = () => {
  $('#input').addClass('is-invalid');
  $('#feedbackElement').remove();
  const elem = $('<div>').attr({
    class: 'text-left mt-3',
    id: 'feedbackElement',
  }).text('You are already have this feed.');
  $('#input').after(elem);
};

export const renderWaiting = () => {
  $('#feedbackElement').remove();
  const elem = $('<div>').attr({
    id: 'feedbackElement',
    class: 'text-left mt-3',
  }).text('Loading... Please wait.');
  $('#input').after(elem);
  $('#input').attr('disabled', true);
  $('#button').attr('disabled', true);
};

export const renderIsValid = () => {
  $('#input').removeClass('is-invalid');
};

export const renderClean = () => {
  $('#feedbackElement').remove();
  $('#input').removeClass('is-invalid').removeAttr('disabled', true).val('');
  $('#button').removeAttr('disabled', true);
};


export const renderNewFeed = ({ title, description }) => {
  $('#feeds').removeClass('d-none');
  $('#feeds-list').append('<div>').append(
    $('<h4>').append(title),
    $('<p>').append(description),
  );
};

export const renderNewArticle = ({ title, link, description }) => {
  $('#feeds').removeClass('d-none');
  $('#articles').append(
    $('<div class="row mt-3">').append(
      $('<div class="col-lg-8">').append(
        $('<a>').attr('href', link).append(
          $('<span>').append(title),
        ),
      ),
      $('<div class="col-lg-4">').append(
        $('<button>').attr({
          type: 'button',
          class: 'btn btn-primary btn-sm',
          'data-toggle': 'modal',
          'data-target': '#myModal',
        }).on('click', (ev) => {
          ev.preventDefault();
          $('#modalBody').text(description);
          $('#myModal').modal('show');
        }).append('Description'),
      ),
    ),
  );
};
