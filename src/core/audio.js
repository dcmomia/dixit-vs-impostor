
export const audioManager = {
    bgMusic: null,
    isMuted: false,
    hasStarted: false,
    init() {
        this.bgMusic = document.getElementById('bg-music');
        if (!this.bgMusic) {
            console.error("❌ Audio manager: Error al encontrar elemento #bg-music");
            return;
        }

        this.bgMusic.volume = 0.4; // Bajado ligeramente para evitar clipping en altavoces mviles
        this.bgMusic.preload = "auto";
        console.log("🎵 Audio manager: Inicializado con src:", this.bgMusic.src);

        const triggerPlay = () => {
            if (!this.hasStarted && !this.isMuted) {
                console.log("▶️ Intentando reproducir música tras interacción...");
                
                // Aseguramos que el audio est cargado
                if (this.bgMusic.readyState >= 3) {
                    this.startPlayback();
                } else {
                    this.bgMusic.addEventListener('canplaythrough', () => this.startPlayback(), { once: true });
                    this.bgMusic.load();
                }

                ['click', 'pointerdown', 'keydown'].forEach(evt => document.removeEventListener(evt, triggerPlay));
            }
        };

        ['click', 'pointerdown', 'keydown'].forEach(evt => document.addEventListener(evt, triggerPlay));
    },
    startPlayback() {
        this.bgMusic.play()
            .then(() => {
                console.log("✅ Música sonando con éxito.");
                this.hasStarted = true;
            })
            .catch(e => {
                console.warn("⚠️ Autoplay bloqueado:", e);
                this.hasStarted = false;
            });
    },
    toggleMute() {
        if (!this.bgMusic) return;
        this.isMuted = !this.isMuted;
        this.bgMusic.muted = this.isMuted;
        if (this.isMuted) {
            this.bgMusic.pause();
            console.log("🔇 Música silenciada.");
        } else {
            this.bgMusic.play().catch(e => console.warn("Autoplay prevenido:", e));
            this.hasStarted = true;
            console.log("🔊 Música reactivada.");
        }
    }
};
