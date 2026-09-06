(function () {
  window.Components = window.Components || {};

  // Softer, modern confetti colors
  const PRESETS = [
    { fill: "#c084fc", left: "8vw",   top: "10vh"  },
    { fill: "#67e8f9", left: "30vw",  top: "20vh"  },
    { fill: "#fbbf24", left: "55vw",  top: "15vh"  },
    { fill: "#f472b6", left: "75vw",  top: "30vh"  },
    { fill: "#a78bfa", left: "15vw",  top: "50vh"  },
    { fill: "#34d399", left: "60vw",  top: "55vh"  },
    { fill: "#fb923c", left: "85vw",  top: "45vh"  },
    { fill: "#60a5fa", left: "40vw",  top: "70vh"  },
    { fill: "#f9a8d4", left: "20vw",  top: "80vh"  },
  ];

  window.Components.paperconfetti = {
    overlay: true,

    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-confetti";

      const count = Math.min(section.count || 9, PRESETS.length);
      for (let i = 0; i < count; i++) {
        const p = PRESETS[i];
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 40 40");
        svg.classList.add("confetti-dot");
        svg.style.fill = p.fill;
        svg.style.left = p.left;
        svg.style.top = p.top;

        // Selang-seling bentuk: persegi panjang (strip) & segitiga
        const isTriangle = i % 3 === 0;
        const shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

        if (isTriangle) {
          // Segitiga kecil
          shape.setAttribute("points", "20,4 36,34 4,34");
        } else {
          // Strip persegi panjang tipis (khas confetti kertas)
          shape.setAttribute("points", "12,6 28,6 28,34 12,34");
        }

        // Rotasi awal acak biar tiap potongan mengarah beda-beda
        const randomRotate = Math.floor(Math.random() * 360);
        shape.setAttribute(
          "transform",
          `rotate(${randomRotate} 20 20)`
        );

        svg.appendChild(shape);
        div.appendChild(svg);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const pieces = el.querySelectorAll(".confetti-dot");

      // Set posisi awal: sedikit di atas, transparan, ukuran kecil
      gsap.set(pieces, {
        visibility: "visible",
        opacity: 0,
        y: -40,
        scale: 0.6,
        rotation: 0,
      });

      tl.to(pieces, {
        duration: 0.15,
        opacity: 1,
        stagger: 0.03,
      }, 0)
      .to(pieces, {
        duration: 1,
        y: 60,              // jatuh ke bawah
        rotation: "+=180",  // sedikit berputar sambil jatuh
        ease: "power1.in",  // percepatan mirip gravitasi
        stagger: 0.03,
      }, 0)
      .to(pieces, {
        duration: 0.3,
        opacity: 0,
        ease: "power1.in",
      }, 0.7)               // mulai fade out di detik ke-0.7, selesai tepat di detik 1
      .set(el, { opacity: 0 }, 1);
    },
  };
})();