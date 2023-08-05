const input = document.querySelector('.login-input');
const button = document.querySelector('.login-button');
const form = document.querySelector('.login-form');

const validateInput = ({ target }) => {
    if(target.value.length > 2) {
        button.removeAttribute('disabled');
        return;
    }
        
    button.setAttribute('disabled', '');
}

const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem('player', input.value)
    window.location = 'pages/game.html'
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);


const audio = new Audio('./audio/1-06 - CHA-LA HEAD-CHA-LA (Variations).mp3')
audio.loop = true

window.addEventListener('beforeunload', () => {
    audio.pause();
  });

  window.addEventListener('load', () => {
    audio.play();
  });