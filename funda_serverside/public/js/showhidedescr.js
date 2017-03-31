  var section = document.querySelector('.features');
  var parent = section.parentNode;
  var btn = document.createElement('button');

  parent.insertBefore(btn, section);

  var showMoreButton = document.querySelector('.description + button');
  showMoreButton.setAttribute('class', 'showmore');
  showMoreButton.textContent = 'Lees de volledige beschrijving';
