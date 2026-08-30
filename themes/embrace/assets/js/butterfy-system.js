
document.addEventListener('alpine:init', () => {
  Alpine.data('butterflySystem', () => ({
    mode: 'sleep', // States: sleep -> wander -> seek -> landed
    landed: false,
    hasTriggered: false,

    // Physics State (starting position will be set in init)
    x: -50,
    y: 100,
    angle: 45,
    zAngle: 0, // 3D tilt
    time: 0,

    init() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        this.mode = 'landed';
        this.landed = true;
        return;
      }

      // Start off-screen at bottom center
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight + 100;

      // Use IntersectionObserver to trigger animation when button enters viewport
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.hasTriggered) {
          this.hasTriggered = true;
          this.mode = 'wander';
          
          setTimeout(() => {
            this.mode = 'seek';
          }, 3000);
          
          requestAnimationFrame(() => this.loop());
        }
      }, { threshold: 0.1 });

      const ctaBtn = document.getElementById('ctaTarget');
      if (ctaBtn) {
        observer.observe(ctaBtn);
      }
    },

    loop() {
      if (this.mode === 'wander') {
        this.time += 0.05;
        // Organic erratic math (overlapping sine waves)
        this.x += (Math.cos(this.time) * 3) + 2; // Bias to move right
        this.y += Math.sin(this.time * 1.5) * 5;

        // Tilt the body slightly in flight
        this.angle = Math.sin(this.time) * 30;
      } else if (this.mode === 'seek') {
        this.time += 0.1;

        // 1. Find the CTA button's location
        const ctaBtn = document.getElementById('ctaTarget');
        if (!ctaBtn) return;
        const rect = ctaBtn.getBoundingClientRect();

        // Target: Top edge of the button, slightly to the left
        // The container is fixed inset-0, so viewport coordinates match perfectly
        const targetX = rect.left + 20;
        const targetY = rect.top - 20;

        // 2. Linear Interpolation (Lerp) to pull it toward the target
        this.x += (targetX - this.x) * 0.04;
        this.y += (targetY - this.y) * 0.04;

        // Add a tiny bit of erratic noise so it doesn't look like a missile
        this.x += Math.cos(this.time) * 2;
        this.y += Math.sin(this.time) * 2;

        // 3. Check distance. If close enough, snap to Landed state.
        const dist = Math.hypot(targetX - this.x, targetY - this.y);
        if (dist < 5) {
          this.mode = 'landed';
          this.landed = true;
          this.angle = -15; // Settle at a slight angle
          this.zAngle = 60; // THE Z-AXIS ROTATION: Tilt away from the screen
        }
      }

      // Keep calculating unless landed
      if (!this.landed) {
        requestAnimationFrame(() => this.loop());
      }
    }
  }));
});
