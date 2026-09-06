(function () {

  window.Components = window.Components || {};

  window.Components.closing = {

    interactive: true,

    render(container, section) {

      const div = document.createElement("div");
      div.className = "section section-closing";

      div.innerHTML = `
        <p class="closing-text">
          ${section.text || "Let's make a wish!"}
        </p>

        <div class="candle-wrap">

          <span class="candle-smoke">💨</span>

          <span class="candle-flame">🔥</span>

          <div class="candle-stick"></div>

          <button class="blow-btn" type="button">
            ${section.blowText || "Tiup lilinnya 🕯️"}
          </button>

        </div>

        <p class="replay-btn">
          ${section.replayText || "Replay"}
        </p>
      `;

      container.appendChild(div);

      return div;
    },

    animate(tl, el) {

      const ideaIn = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
      };

      const flame = el.querySelector(".candle-flame");
      const smoke = el.querySelector(".candle-smoke");
      const blowBtn = el.querySelector(".blow-btn");
      const replay = el.querySelector(".replay-btn");

      gsap.set(replay, {
        opacity: 0,
        pointerEvents: "none"
      });

      gsap.set(smoke, {
        opacity: 0
      });

      tl.from(
        el.querySelectorAll(".closing-text, .candle-wrap"),
        {
          duration: 1,
          ...ideaIn,
          stagger: 0.6
        }
      ).call(() => {

        gsap.to(flame, {
          duration: 0.6,
          scale: 1.15,
          y: -2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

      });

      // =========================
      // BLOW CANDLE
      // =========================

      blowBtn.addEventListener("click", () => {

        blowBtn.disabled = true;
        blowBtn.style.opacity = "0.4";
        blowBtn.style.pointerEvents = "none";

        gsap.killTweensOf(flame);

        gsap
          .timeline()
          .to(flame, {
            duration: 0.3,
            scale: 0,
            y: -14,
            rotation: 20,
            opacity: 0,
            ease: "power2.in"
          })

          .to(
            smoke,
            {
              duration: 0.5,
              opacity: 1,
              y: -20,
              ease: "power1.out"
            },
            "-=0.1"
          )

          .to(smoke, {
            duration: 0.8,
            opacity: 0,
            y: -40,
            ease: "power1.in"
          })

          .to(replay, {
            duration: 0.4,
            opacity: 1
          })

          .set(replay, {
            pointerEvents: "auto"
          });

      });

      // =========================
      // REPLAY
      // =========================

      replay.addEventListener("click", () => {
        location.reload();
      });
    }
  };

})();