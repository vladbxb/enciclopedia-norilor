function updateCloudSpeed(speedPercentage) {
    const clouds = document.querySelectorAll('.cloud'); // Select only elements with class 'cloud'
    const defaultDurations = {
        'cloud1': 50,
        'cloud2': 120,
        'cloud3': 80,
        'cloud4': 150,
        'cloud5': 60
    };

    const speedFactor = speedPercentage / 100;

    clouds.forEach(cloud => {
        let className = null;
        for (const cls in defaultDurations) {
            if (cloud.classList.contains(cls)) {
                className = cls;
                break;
            }
        }
        if (className) {
            const defaultDuration = defaultDurations[className];
            const newDuration = defaultDuration / speedFactor;

            cloud.style.animation = 'none';
            setTimeout(() => {
                cloud.style.animation = `moveCloud ${newDuration}s linear infinite`;
            }, 10);
        }
    });

    console.log(`Viteza norilor actualizată: ${speedPercentage}%`);
}

window.onload = function() {
    let defaultTime = sessionStorage.getItem('defaultTime') || 'day';
    
    let globalTime = defaultTime;
    
    
    let visibility = 'shown'
    let music = 'unmuted'

    let timeButton = document.getElementById('timeButton');
    if (timeButton)
        timeButton.addEventListener('click', toggleTimeOfDay);
    let pageButton = document.getElementById('pageButton');
    if (pageButton)
        pageButton.addEventListener('click', togglePageVisibility);
    let timeIcon = document.getElementById('timeIcon');
    let pageIcon = document.getElementById('pageIcon');
    let musicButton = document.getElementById('musicButton');
    if (musicButton)
        musicButton.addEventListener('click', toggleMusic);
    let musicIcon = document.getElementById('musicIcon')


    let musicButtonGalerie = document.getElementById('musicButton-galerie');
    if (musicButtonGalerie)
        musicButtonGalerie.addEventListener('click', toggleMusic);
    let musicIconGalerie = document.getElementById('musicIcon-galerie')
    const cloudBoxes = document.querySelectorAll('.cloud-box');
    const clouds = document.querySelectorAll('.cloud');
    const articles = document.querySelectorAll('article');

    setTimeOfDay(defaultTime);

    const audioElement = document.querySelector('audio');
    const savedVolume = sessionStorage.getItem('volume') || '100.0';

    const volume = parseFloat(savedVolume);
    audioElement.volume = volume;

    
    function setTimeOfDay(time) {
        if (time === 'day') {
            globalTime = 'day';
            timeIcon.src = 'sun.png';
            document.body.style.background = "radial-gradient(circle at bottom, #96e5ff 50%, #40a6ff 100%)";
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundRepeat = "no-repeat";
            cloudBoxes.forEach(cloudBox => {
                cloudBox.style.backgroundColor = 'rgba(255, 255, 255, .15)';
            });
            clouds.forEach(cloud => {
                // Retain only the drop-shadow
                cloud.style.filter = 'drop-shadow(5px 5px 30px black)';
            });
            articles.forEach(article => {
                article.style.textShadow = '0px 0px 15px #0090c9, 0px 0px 6px #0090c9, 0px 0px 15px #0090c9, 0px 0px 15px #0090c9';
            });
        }
        else
        {
            globalTime = 'night';
            timeIcon.src = 'moon.png';
            document.body.style.background = "radial-gradient(circle at bottom, #34495E 50%, #1C1F4A 100%)";
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundRepeat = "no-repeat";

            cloudBoxes.forEach(cloudBox => {
                cloudBox.style.backgroundColor = 'rgba(255, 230, 0, 0.15)';
            });
            clouds.forEach(cloud => {
                cloud.style.filter = 'brightness(55%) drop-shadow(5px 5px 30px black)';
            });
            articles.forEach(article => {
                article.style.textShadow = '0px 0px 15px #FFE600, 0px 0px 6px #FFE600, 0px 0px 15px #FFE600, 0px 0px 15px #FFE600';
            });
        }
    }

    function toggleTimeOfDay() {
        if (globalTime === 'day') {
            setTimeOfDay('night');
        }
        else 
        {
            setTimeOfDay('day');
        }
    }

    function togglePageVisibility() {
        if (visibility === 'shown') {
            visibility = 'hidden';
            pageIcon.src = 'file_crossed.png';
            const elements = document.querySelectorAll('.clouds-background ~ *');

            elements.forEach(element => {
                if (!element.classList.contains('image-button')) {
                    element.style.opacity = '0';
                }
            });

        }
        else 
        {
            visibility = 'shown';
            pageIcon.src = 'file.png';
            const elements = document.querySelectorAll('.clouds-background ~ *');

            elements.forEach(element => {
                if (!element.classList.contains('image-button')) {
                    element.style.opacity = '1';
                }
            });

        }
    }

    function toggleMusic() {
        if (music === 'unmuted') {
            music = 'muted';
            if (musicIcon)
                musicIcon.src = 'musical-note-muted.png';
            if (musicIconGalerie)
                musicIconGalerie.src = 'musical-note-muted.png';

            const audioElement = document.querySelector('audio');
            audioElement.muted = true;
        }
        else 
        {
            music = 'unmuted';
            if (musicIcon)
                musicIcon.src = 'musical-note.png';
            if (musicIconGalerie)
                musicIconGalerie.src = 'musical-note.png';

            const audioElement = document.querySelector('audio');
            audioElement.muted = false;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const initialSpeed = sessionStorage.getItem('speed') || '100';
    updateCloudSpeed(initialSpeed);

    // ruleaza doar daca pagina este galeria
    if (!document.body.classList.contains('body-tipuri')) {
        return;
    }

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

    // cream sectiunea favorite
    const favoriteSection = document.createElement('div');
    favoriteSection.id = 'favorite-section';
    favoriteSection.innerHTML = `
        <img src="red-needle-pin.png" alt="red pushpin">
        <div class="heading-container">
            <h1>Favorite</h1>
        </div>
        <div id="favorite-images" class="poze-nori"></div>
    `;
    // punem inainte de toate sectiunile cu poze ca sa fie prima cu prepend
    document.body.prepend(favoriteSection);

    // selectam toate pozele favorite
    const favoriteImagesContainer = document.getElementById('favorite-images');

    // functie care adauga toate pozele favorite in sectiunea favorite
    function updateFavoriteSection() {
        // ca sa dam update, "stergem" pozele precedente
        favoriteImagesContainer.innerHTML = '';
        // iteram prin fiecare poza favorita din storage (variabila favorites contine toate id urile din storage de la pozele favorite)
        favorites.forEach(id => {
            const image = document.getElementById(id);
            // daca a fost gasita o imagine, atunci
            if (image) {
                // parcurgem arborele DOM in sus pana gasim primul stramos (asa copiem figura)
                const figureClone = image.closest('figure').cloneNode(true);
                const existingButton = figureClone.querySelector('.favorite-btn');

                // figura fiind copiata, are butonul unfavorite deja, dar facem altul ca sa-l manipulam in javascript
                if (existingButton) {
                    existingButton.remove();
                }

                // facem noi butonul unfavorite din nou
                const button = document.createElement('button');
                button.textContent = 'Unfavorite';
                button.className = 'favorite-btn favorited';
                // o proprietate misto a elementelor dom care ne lasa sa modificam proprietati de forma data-* intr-un mod mai usor
                button.dataset.id = id;

                button.addEventListener('click', () => {
                    // luam indicele din arrayul favorites al elementului favorit apasat
                    const index = favorites.indexOf(id);
                    if (index !== -1) {
                        // stergem elementul din aray
                        favorites.splice(index, 1);
                        // actualizam arrayul in storage in mod conventional
                        sessionStorage.setItem('favorites', JSON.stringify(favorites));
                        // reactualizam sectiunea favorite, practic asa se reactualizeaza doar cand e apasat butonul (nu recursiv)
                        updateFavoriteSection();
                        
                        // acuma se reactualizeaza inclusiv si butonul initial

                        // ca sa schimbam butonul trebuie sa-l luam dupa id-ul lui
                        const initialButton = document.querySelector(`.favorite-btn[data-id="${id}"]`);
                        if (initialButton) {
                            initialButton.textContent = 'Favorite';
                            initialButton.classList.remove('favorited');
                        }
                    }
                });

                // acum adaugam butonul construit precedent in figura copiata 
                figureClone.appendChild(button);
                // si acum insfarsit, adaugam in sectiunea favorites figura reconstruita
                favoriteImagesContainer.appendChild(figureClone);
            }
        });
    };

    // aici marcam imaginile deja adaugate la favorite (ca sa le putem parcurge)
    updateFavoriteSection();
    favorites.forEach(id => {
        const button = document.querySelector(`.favorite-btn[data-id="${id}"]`);
        if (button) {
            button.textContent = 'Unfavorite';
            // adaugam clasa favorited ca sa tinem evidenta
            button.classList.add('favorited');
        }
    });

    // cand dai click pe un buton favorit, se modifica arrayul pentru evidenta si se da update la sectiunea favorite
    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            // daca exista id in arrayul favorite
            if (favorites.includes(id)) {
                const index = favorites.indexOf(id);
                // il stergem
                favorites.splice(index, 1);
                // si stergem statusul de favorit al imaginii
                button.textContent = 'Favorite';
                button.classList.remove('favorited');
            } else {
                // altfel, ii adaugam statusul de favorit si tinem evidenta ca este favorit in array
                favorites.push(id);
                button.textContent = 'Unfavorite';
                button.classList.add('favorited');
            }
            // apoi, reactualizam elementul in storage
            sessionStorage.setItem('favorites', JSON.stringify(favorites));
            // si dam update
            updateFavoriteSection();
        });
    });
});