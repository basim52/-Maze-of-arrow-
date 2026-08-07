// Web Audio API Sound Synthesizer for high performance interactive SFX

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicEnabled: boolean = true;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private isBossMode: boolean = false;
  private bgmTimer: number | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private bgmNoteIndex: number = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stopBGM();
    } else if (this.musicEnabled) {
      this.startBGM();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (val && this.enabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public startBossBGM() {
    this.startBGM(true);
  }

  // Gentle BGM & Energetic Boss BGM Synthesizer
  public startBGM(isBoss: boolean = false) {
    if (!this.enabled || !this.musicEnabled) return;
    if (this.isBgmPlaying && this.isBossMode === isBoss) return;

    this.stopBGM();
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.isBgmPlaying = true;
      this.isBossMode = isBoss;

      if (isBoss) {
        // High-energy, intense Black Monster Boss music synthesizer!
        const bgmGain = this.ctx.createGain();
        bgmGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        bgmGain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 0.8);
        bgmGain.connect(this.ctx.destination);
        this.bgmGain = bgmGain;

        // Heavy energetic driving bass drone
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1600;
        filter.connect(bgmGain);

        const drone1 = this.ctx.createOscillator();
        const drone2 = this.ctx.createOscillator();
        drone1.type = 'sawtooth';
        drone2.type = 'square';
        drone1.frequency.setValueAtTime(110.0, this.ctx.currentTime); // A2
        drone2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3

        const droneGain = this.ctx.createGain();
        droneGain.gain.value = 0.16;
        drone1.connect(droneGain);
        drone2.connect(droneGain);
        droneGain.connect(filter);

        drone1.start();
        drone2.start();
        this.droneOsc1 = drone1;
        this.droneOsc2 = drone2;

        // Fast energetic minor scale boss arpeggios
        const bossScale = [220.00, 261.63, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
        const bossRiffs = [
          [0, 2, 4, 7, 4, 2, 7, 9],
          [0, 3, 5, 8, 5, 3, 8, 9],
          [1, 4, 6, 8, 6, 4, 8, 9],
        ];
        let riffStep = 0;

        const playBossPattern = () => {
          if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
          const now = this.ctx.currentTime;
          const currentRiff = bossRiffs[riffStep % bossRiffs.length];
          riffStep++;

          // 4 fast energetic notes per step
          for (let i = 0; i < 4; i++) {
            if (!this.ctx || !this.bgmGain) return;
            const noteIdx = currentRiff[(this.bgmNoteIndex + i) % currentRiff.length];
            const freq = bossScale[noteIdx % bossScale.length];

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteFilter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + i * 0.11);

            noteFilter.type = 'lowpass';
            noteFilter.frequency.setValueAtTime(2400, now + i * 0.11);

            const startTime = now + i * 0.11;
            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

            osc.connect(noteFilter);
            noteFilter.connect(gain);
            gain.connect(this.bgmGain);

            osc.start(startTime);
            osc.stop(startTime + 0.24);
          }
          this.bgmNoteIndex += 4;

          // Punchy drum kick on beat
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(150, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

          kickGain.gain.setValueAtTime(0.3, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          kickOsc.connect(kickGain);
          kickGain.connect(this.bgmGain);
          kickOsc.start(now);
          kickOsc.stop(now + 0.16);
        };

        playBossPattern();
        this.bgmTimer = window.setInterval(() => {
          playBossPattern();
        }, 480);

      } else {
        // Master BGM Gain Node - clearer and pleasant volume
        const bgmGain = this.ctx.createGain();
        bgmGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        bgmGain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 1.5); // Clearer volume
        bgmGain.connect(this.ctx.destination);
        this.bgmGain = bgmGain;

        // Warm chord backing pad
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        filter.connect(bgmGain);

        const drone1 = this.ctx.createOscillator();
        const drone2 = this.ctx.createOscillator();
        drone1.type = 'sine';
        drone2.type = 'triangle';
        drone1.frequency.setValueAtTime(261.63, this.ctx.currentTime); // C4
        drone2.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4

        const droneGain = this.ctx.createGain();
        droneGain.gain.value = 0.15;
        drone1.connect(droneGain);
        drone2.connect(droneGain);
        droneGain.connect(filter);

        drone1.start();
        drone2.start();
        this.droneOsc1 = drone1;
        this.droneOsc2 = drone2;

        // Lively puzzle melody sequence generator
        const melodyScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
        const chordProgressions = [
          [0, 2, 4, 7], // Cmaj
          [1, 3, 5, 8], // Dm/G
          [2, 4, 6, 9], // Em
          [0, 3, 5, 7], // Fmaj
        ];

        let progStep = 0;

        const playLivelyPattern = () => {
          if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
          const now = this.ctx.currentTime;
          const currentChord = chordProgressions[progStep % chordProgressions.length];
          progStep++;

          // Play a lively 3-note arpeggiated motif
          const noteIdxs = [
            currentChord[this.bgmNoteIndex % currentChord.length],
            currentChord[(this.bgmNoteIndex + 1) % currentChord.length],
            currentChord[(this.bgmNoteIndex + 3) % currentChord.length],
          ];
          this.bgmNoteIndex++;

          noteIdxs.forEach((idx, i) => {
            if (!this.ctx || !this.bgmGain) return;
            const freq = melodyScale[idx % melodyScale.length];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteFilter = this.ctx.createBiquadFilter();

            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.25);

            noteFilter.type = 'lowpass';
            noteFilter.frequency.setValueAtTime(1800, now + i * 0.25);

            // Crisp, cheerful pluck envelope
            const startTime = now + i * 0.25;
            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

            osc.connect(noteFilter);
            noteFilter.connect(gain);
            gain.connect(this.bgmGain);

            osc.start(startTime);
            osc.stop(startTime + 1.3);
          });

          // Add soft rhythmic woodblock beat
          const popOsc = this.ctx.createOscillator();
          const popGain = this.ctx.createGain();
          popOsc.type = 'sine';
          popOsc.frequency.setValueAtTime(600, now);
          popOsc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

          popGain.gain.setValueAtTime(0.12, now);
          popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          popOsc.connect(popGain);
          popGain.connect(this.bgmGain);
          popOsc.start(now);
          popOsc.stop(now + 0.09);
        };

        // Play initial motif
        playLivelyPattern();

        // Repeat lively pattern every 1.4 seconds
        this.bgmTimer = window.setInterval(() => {
          playLivelyPattern();
        }, 1400);
      }

    } catch (e) {
      console.error(e);
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); } catch (e) {}
      this.droneOsc1 = null;
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); } catch (e) {}
      this.droneOsc2 = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.bgmGain?.disconnect();
          this.bgmGain = null;
        }, 900);
      } catch (e) {}
    }
  }

  // Soft click sound
  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  }

  // Pop sound when arrow leaves board
  public playPop() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.error(e);
    }
  }

  // Swoosh sound (flying arrow)
  public playSwoosh() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Filtered noise for smooth air swoosh
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.15);
    } catch (e) {
      console.error(e);
    }
  }

  // Bump / Blocked error sound
  public playBump() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.error(e);
    }
  }

  // Smash sound for Hammer power-up
  public playSmash() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.error(e);
    }
  }

  // Thunder / Lightning strike sound (strikes 3 arrows)
  public playThunder() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.error(e);
    }
  }

  // Ice Shatter / Freeze thaw sound
  public playIceShatter() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(2800, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {
      console.error(e);
    }
  }

  // Daily Wheel tick sound
  public playWheelSpinTick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.error(e);
    }
  }

  // Victory Fanfare sound when level cleared
  public playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.08;
        const duration = idx === notes.length - 1 ? 0.4 : 0.12;

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const soundManager = new SoundManager();
