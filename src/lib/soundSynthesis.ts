// Web Audio API Synthesizer for Ambient Nature Sounds and Meditation Chimes
// 100% client-side, zero external assets, works offline and respects privacy.

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private currentGain: GainNode | null = null;
  private isPlaying = false;
  private activeSound: string | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Tibetan Singing Bowl / Zen Bell Chime
  public playSingingBowl(fundamentalFreq = 432): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const harmonics = [1, 2.76, 5.4, 8.93];
      const gains = [0.6, 0.25, 0.12, 0.05];
      const decayTimes = [6.0, 4.5, 3.0, 2.0];

      harmonics.forEach((mult, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamentalFreq * mult, now);

        // Gentle strike envelope
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(gains[i] * 0.4, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + decayTimes[i]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decayTimes[i] + 0.1);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Generate continuous procedural ambient sound
  public startAmbient(type: 'breeze' | 'rain' | 'stream' | 'crickets', volume = 0.2): void {
    this.stopAmbient();
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink noise generator for natural soundscapes
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoiseSource = ctx.createBufferSource();
      whiteNoiseSource.buffer = noiseBuffer;
      whiteNoiseSource.loop = true;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);

      if (type === 'breeze') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        // LFO for wind gust swelling
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
        lfoGain.gain.setValueAtTime(180, ctx.currentTime);

        lfo.connect(filter.frequency);
        lfo.start();

        whiteNoiseSource.connect(filter);
        filter.connect(masterGain);
      } else if (type === 'rain') {
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(1400, ctx.currentTime);

        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(400, ctx.currentTime);

        whiteNoiseSource.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(masterGain);
      } else if (type === 'stream') {
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(800, ctx.currentTime);
        bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

        whiteNoiseSource.connect(bandpass);
        bandpass.connect(masterGain);
      } else if (type === 'crickets') {
        // Crickets use modulated pulse oscillations
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500, ctx.currentTime);

        const amMod = ctx.createOscillator();
        amMod.frequency.setValueAtTime(32, ctx.currentTime);
        const amGain = ctx.createGain();
        amGain.gain.setValueAtTime(0.8, ctx.currentTime);
        amMod.connect(amGain.gain);

        const cricketGain = ctx.createGain();
        cricketGain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(cricketGain);
        amGain.connect(cricketGain.gain);
        cricketGain.connect(masterGain);

        osc.start();
        amMod.start();
      }

      masterGain.connect(ctx.destination);
      whiteNoiseSource.start();

      this.currentSource = whiteNoiseSource;
      this.currentGain = masterGain;
      this.isPlaying = true;
      this.activeSound = type;
    } catch {
      // Audio permission or unsupported browser
    }
  }

  public stopAmbient(): void {
    if (this.currentGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.currentGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          if (this.currentSource) {
            try {
              (this.currentSource as AudioBufferSourceNode).stop?.();
            } catch {
              // Ignore already stopped
            }
          }
          this.currentSource = null;
          this.currentGain = null;
          this.isPlaying = false;
          this.activeSound = null;
        }, 850);
      } catch {
        this.currentSource = null;
        this.currentGain = null;
        this.isPlaying = false;
        this.activeSound = null;
      }
    }
  }

  public getStatus(): { isPlaying: boolean; activeSound: string | null } {
    return { isPlaying: this.isPlaying, activeSound: this.activeSound };
  }
}

export const soundSynth = typeof window !== 'undefined' ? new SoundSynthesizer() : ({} as SoundSynthesizer);
