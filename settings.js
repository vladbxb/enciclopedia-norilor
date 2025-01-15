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
            // verificam sa fim siguri ca doar elementele cloud1, cloud2, cloud3, cloud4 si cloud5 sunt modificate
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
    
                // scoate animatia
                cloud.style.animation = 'none';

                // folosim un delay scurt ca sa resetam animatia
                setTimeout(() => {
                    cloud.style.animation = `moveCloud ${newDuration}s linear infinite`;
                }, 10);
            }
        });
    
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.sidebar button');
    const content = document.getElementById('settings-content');

    const initialSpeed = sessionStorage.getItem('speed') || '100';
    updateCloudSpeed(initialSpeed);

    const audioElement = document.querySelector('audio');
    const savedVolume = sessionStorage.getItem('volume') || '100.0';

    const volume = parseFloat(savedVolume);
    audioElement.volume = volume;

    const sections = {
        'general-section': `
            <h2>Setări generale</h2>
            <p>Aici poți modifica setările generale ale aplicației.</p>

        `,
        'appearance-section': `
            <h2>Setări de apariție</h2>
            <p>Ajustează viteza norilor si timpul de zi.</p>
            <div class="speed-control">
                <label for="speed-range">Viteză nori:</label>
                <input type="range" id="speed-range" min="0" max="500" value="100" step="10">
                <span id="speed-value">100%</span>
            </div>
            <div class="time-control">
                <label for="time-select">Timp implicit:</label>
                <select id="time-select">
                    <option value="day">Zi</option>
                    <option value="night">Noapte</option>
                </select>
            </div>
        `,
        'audio-section': `
            <h2>Setări audio</h2>
            <p>Controlează muzica site-ului.</p>
            <div class="volume-control">
                <label for="volume-control">Volum:</label>
                <input type="range" id="volume-control" min="0" max="100" value="100">
                <span id="volume-value">100%</span>
            </div>
        `,
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            content.innerHTML = sections[section] || `<h2>Setări necunoscute</h2>`;
            if (section === 'appearance-section') {
                addSpeedControlEvent();
                addTimeControlEvent();
            } else if (section === 'audio-section') {
                addVolumeControlEvent();
            }
        });
    });

    function addSpeedControlEvent() {
        
        const speedRange = document.getElementById('speed-range');
        const speedValue = document.getElementById('speed-value');

        // plaseaza in pagina datele salvate
        const savedSpeed = sessionStorage.getItem('speed');
        if (savedSpeed) {
            speedRange.value = savedSpeed;
            speedValue.textContent = `${savedSpeed}%`;
        }

        speedRange.addEventListener('input', () => {
            const selectedSpeed = speedRange.value;
            speedValue.textContent = `${selectedSpeed}%`;

            sessionStorage.setItem('speed', selectedSpeed);

            console.log(`Viteză selectată: ${selectedSpeed}% (salvată în sessionStorage)`);
            const initialSpeed = sessionStorage.getItem('speed') || '100';
            updateCloudSpeed(initialSpeed);
        });

        
    }

    function addTimeControlEvent() {
        const timeSelect = document.getElementById('time-select');
        
        const savedTime = sessionStorage.getItem('defaultTime');
        if (savedTime) {
            timeSelect.value = savedTime;
        }

        timeSelect.addEventListener('change', () => {
            const selectedTime = timeSelect.value;

            sessionStorage.setItem('defaultTime', selectedTime);
        });
    }

    function addVolumeControlEvent() {
        const audioElement = document.querySelector('audio');
        const volumeControl = document.getElementById('volume-control');
        const volumeValue = document.getElementById('volume-value');

        const savedVolume = sessionStorage.getItem('volume');
        if (savedVolume) {
            const volume = parseFloat(savedVolume);
            audioElement.volume = volume;
            volumeControl.value = volume * 100;
            volumeValue.textContent = `${volumeControl.value}%`;
        }

        volumeControl.addEventListener('input', () => {
            const volume = volumeControl.value / 100;
            audioElement.volume = volume;
            volumeValue.textContent = `${volumeControl.value}%`;

            sessionStorage.setItem('volume', volume);
        });
    }
});
