(function () {
  window.Components = window.Components || {};

  /* ============================================================
   * LOAD HTML2CANVAS
   * ============================================================ */

  function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
      if (typeof html2canvas !== "undefined") {
        resolve();
        return;
      }

      const existing = document.querySelector(
        'script[data-html2canvas="true"]'
      );

      if (existing) {
        existing.addEventListener("load", resolve);
        existing.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

      script.dataset.html2canvas = "true";

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  /* ============================================================
   * IDEAS COMPONENT
   * ============================================================ */

  window.Components.ideas = {

    interactive: true,

    /* ==========================================================
     * RENDER
     * ========================================================== */

    render(container, section) {
      const div = document.createElement("div");

      div.className = "section section-ideas";

      div.innerHTML = `
        <style>

          /* ======================================================
           * SECTION
           * ====================================================== */

          .section-ideas {
            position: relative;
            width: 100%;
            height: 100%;
          }


          /* ======================================================
           * LETTER SCENE
           * ====================================================== */

          .letter-scene {
            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;
            justify-content: center;

            perspective: 1200px;
          }


          /* ======================================================
           * ENVELOPE
           * ====================================================== */

          .envelope {
            --envelope-width: 420px;
            --envelope-height: 240px;

            position: relative;

            width: var(--envelope-width);
            height: var(--envelope-height);

            cursor: pointer;

            transform-style: preserve-3d;

            z-index: 10;
          }


          /* ======================================================
           * LETTER
           *
           * CLOSED:
           * Letter berada tepat di dalam envelope.
           *
           * OPEN:
           * Letter bergerak ke tengah layar dan membesar.
           * ====================================================== */

          .letter {
            position: absolute;

            left: 0;
            bottom: 0;

            width: var(--envelope-width);
            height: var(--envelope-height);

            box-sizing: border-box;

            background-color: #fffdf7;

            border-radius: 5px;

            box-shadow:
              0 12px 30px rgba(0, 0, 0, 0.15);

            overflow: hidden;

            font-family:
              Georgia,
              "Times New Roman",
              serif;

            color: #6f5849;

            z-index: 2;

            /*
             * Semua perubahan posisi dan ukuran
             * dianimasikan dengan easing yang halus.
             */
            transition:
              left 0.9s cubic-bezier(0.22, 1, 0.36, 1),
              top 0.9s cubic-bezier(0.22, 1, 0.36, 1),
              bottom 0.9s cubic-bezier(0.22, 1, 0.36, 1),
              width 0.9s cubic-bezier(0.22, 1, 0.36, 1),
              height 0.9s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.9s ease;
          }


          /*
           * =====================================================
           * LETTER OPEN STATE
           *
           * Surat berpindah ke pusat scene.
           * =====================================================
           */

          .envelope.open .letter {
            left: 50%;
            top: 50%;

            bottom: auto;

            width: var(--envelope-width);
            height: min(560px, 76vh);

            transform: translate(-50%, -50%);

            box-shadow:
              0 18px 45px rgba(0, 0, 0, 0.18);

            z-index: 1000;
          }


          /* ======================================================
           * LETTER CONTENT
           * ====================================================== */

          .letter-content {
            position: relative;

            width: 100%;
            height: 100%;

            box-sizing: border-box;

            padding:
              54px
              28px
              32px
              78px;

            overflow-y: auto;

            /*
             * Paper lines
             */
            background-image:

              /*
               * Vertical red margin
               */
              linear-gradient(
                to right,

                transparent 0,
                transparent 63px,

                rgba(220, 120, 120, 0.30) 63px,
                rgba(220, 120, 120, 0.30) 65px,

                transparent 65px
              ),

              /*
               * Horizontal paper lines
               */
              repeating-linear-gradient(
                to bottom,

                transparent 0,
                transparent 30px,

                rgba(160, 160, 160, 0.20) 30px,
                rgba(160, 160, 160, 0.20) 31px
              );

            scrollbar-width: none;
          }


          .letter-content::-webkit-scrollbar {
            display: none;
          }


          /* ======================================================
           * LETTER TEXT
           * ====================================================== */

          .letter-content p {
            margin: 0;

            min-height: 32px;

            font-size: 15px;

            line-height: 32px;

            font-family:
              Georgia,
              "Times New Roman",
              serif;

            color: #6f5849;

            text-align: left;
          }


          /* ======================================================
           * ENVELOPE FRONT
           * ====================================================== */

          .envelope-front {
            position: absolute;

            inset: 0;

            background:
              linear-gradient(
                135deg,
                #f8d9d0,
                #f3c5bd
              );

            border-radius: 5px;

            z-index: 5;

            pointer-events: none;

            transition:
              opacity 0.6s ease;
          }


          /*
           * Ketika envelope dibuka,
           * bagian depan envelope menghilang
           * agar letter terlihat.
           */

          .envelope.open .envelope-front {
            opacity: 0;
          }


          /* ======================================================
           * ENVELOPE FLAP
           * ====================================================== */

          .envelope-flap {
            position: absolute;

            top: 0;
            left: 0;

            width: 100%;
            height: 55%;

            background:
              linear-gradient(
                135deg,
                #f5cfc7,
                #efbdb5
              );

            clip-path:
              polygon(
                0 0,
                50% 100%,
                100% 0
              );

            transform-origin:
              top center;

            z-index: 7;

            transition:
              transform
              0.7s
              cubic-bezier(0.22, 1, 0.36, 1);
          }


          /*
           * Flap membuka ke belakang.
           */

          .envelope.open .envelope-flap {
            transform: rotateX(180deg);
          }


          /* ======================================================
           * CONTINUE BUTTON
           * ====================================================== */

          .open-hint {
            position: absolute;

            right: 28px;
            bottom: 24px;

            padding:
              10px
              22px;

            border:
              1px solid
              rgba(180, 145, 120, 0.25);

            border-radius: 999px;

            background:
              rgba(255, 253, 247, 0.96);

            color: #b49a87;

            font-family:
              Georgia,
              "Times New Roman",
              serif;

            font-size: 15px;

            cursor: pointer;

            opacity: 0;

            pointer-events: none;

            transform:
              translateY(10px);

            z-index: 1200;

            transition:
              opacity 0.3s ease,
              transform 0.3s ease;
          }


          .open-hint.visible {
            opacity: 1;

            pointer-events: auto;

            transform:
              translateY(0);
          }


          /* ======================================================
           * SAVE LETTER BUTTON
           * ====================================================== */

          .save-letter-btn {
            position: absolute;

            top: 24px;
            left: 40px;

            padding:
              14px
              28px;

            border: none;

            border-radius: 999px;

            background: #fffdf7;

            color: #6f5849;

            font-family:
              Georgia,
              "Times New Roman",
              serif;

            font-size: 16px;

            cursor: pointer;

            box-shadow:
              0 5px 18px
              rgba(0, 0, 0, 0.08);

            opacity: 0;

            pointer-events: none;

            transform:
              translateY(-10px);

            z-index: 1300;

            transition:
              opacity 0.3s ease,
              transform 0.3s ease;
          }


          .save-letter-btn.visible {
            opacity: 1;

            pointer-events: auto;

            transform:
              translateY(0);
          }


          /* ======================================================
           * MOBILE
           * ====================================================== */

          @media (max-width: 600px) {

            .envelope {
              --envelope-width: 320px;
              --envelope-height: 190px;
            }


            .envelope.open .letter {
              width: var(--envelope-width);

              height:
                min(560px, 78vh);
            }


            .letter-content {
              padding:
                44px
                20px
                28px
                58px;
            }


            .letter-content p {
              font-size: 14px;

              line-height: 30px;
            }


            .open-hint {
              right: 16px;

              bottom: 18px;
            }


            .save-letter-btn {
              top: 18px;

              left: 18px;

              padding:
                11px
                20px;

              font-size: 14px;
            }

          }

        </style>


        <!-- =====================================================
             LETTER SCENE
             ===================================================== -->

        <div class="letter-scene">

          <div class="envelope">

            <!-- LETTER -->

            <div class="letter">

              <div class="letter-content"></div>

            </div>


            <!-- ENVELOPE FLAP -->

            <div class="envelope-flap"></div>


            <!-- ENVELOPE FRONT -->

            <div class="envelope-front"></div>

          </div>

        </div>


        <!-- =====================================================
             CONTINUE
             ===================================================== -->

        <button
          class="open-hint"
          type="button"
        >
          Click to continue →
        </button>


        <!-- =====================================================
             SAVE LETTER
             ===================================================== -->

        <button
          class="save-letter-btn"
          type="button"
        >
          Save The Letter ♡
        </button>
      `;


      /* ==========================================================
       * ELEMENTS
       * ========================================================== */

      const envelope =
        div.querySelector(".envelope");

      const letter =
        div.querySelector(".letter");

      const content =
        div.querySelector(".letter-content");

      const hint =
        div.querySelector(".open-hint");

      const saveBtn =
        div.querySelector(".save-letter-btn");


      /* ==========================================================
       * LETTER CONTENT
       *
       * Content berasal dari config.js:
       *
       * {
       *   type: "ideas",
       *   lines: [
       *     "Dear Rachel,",
       *     "",
       *     "Thank you...",
       *     ""
       *   ]
       * }
       * ========================================================== */

      const lines =
        Array.isArray(section.lines)
          ? section.lines
          : [];


      lines.forEach((line) => {

        const p =
          document.createElement("p");

        if (
          line === "" ||
          line === " "
        ) {
          p.innerHTML = "&nbsp;";
        } else {
          p.innerHTML = line;
        }

        content.appendChild(p);
      });


      /* ==========================================================
       * STATE
       * ========================================================== */

      div._isOpen = false;


      /* ==========================================================
       * ENVELOPE CLICK
       * ========================================================== */

      envelope.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          /*
           * Jangan buka dua kali.
           */

          if (div._isOpen) {
            return;
          }


          div._isOpen = true;


          /*
           * =====================================================
           * OPEN
           *
           * CSS akan melakukan:
           *
           * 1. flap membuka
           * 2. front envelope menghilang
           * 3. letter bergerak dari posisi envelope
           * 4. letter membesar
           * 5. letter berhenti di tengah layar
           * =====================================================
           */

          envelope.classList.add("open");


          /*
           * Tunggu sampai animasi selesai
           * sebelum menampilkan tombol.
           *
           * Animasi letter = 0.9s
           * Kita beri sedikit buffer.
           */

          setTimeout(() => {

            hint.classList.add("visible");

            saveBtn.classList.add("visible");

          }, 1000);

        }
      );


      /* ==========================================================
       * CONTINUE BUTTON
       * ========================================================== */

      hint.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          if (!div._isOpen) {
            return;
          }


          /*
           * Controller utama menangani
           * perpindahan section.
           */

          if (div._continue) {
            div._continue();
          }

        }
      );


      /* ==========================================================
       * SAVE LETTER
       * ========================================================== */

      saveBtn.addEventListener(
        "click",
        async (event) => {

          event.stopPropagation();


          if (!div._isOpen) {
            return;
          }


          try {

            await loadHtml2Canvas();


            /* ====================================================
             * CREATE CAPTURE ELEMENT
             * ==================================================== */

            const capture =
              document.createElement("div");


            capture.style.position = "fixed";

            capture.style.left = "-10000px";

            capture.style.top = "0";

            capture.style.width = "420px";

            capture.style.height = "560px";

            capture.style.boxSizing = "border-box";

            capture.style.backgroundColor =
              "#fffdf7";

            capture.style.overflow = "hidden";

            capture.style.fontFamily =
              'Georgia, "Times New Roman", serif';

            capture.style.color =
              "#6f5849";

            capture.style.borderRadius =
              "5px";


            /* ====================================================
             * LETTER BACKGROUND
             * ==================================================== */

            capture.style.backgroundImage = `

              linear-gradient(
                to right,

                transparent 0,
                transparent 63px,

                rgba(220, 120, 120, 0.30) 63px,
                rgba(220, 120, 120, 0.30) 65px,

                transparent 65px
              ),

              repeating-linear-gradient(
                to bottom,

                transparent 0,
                transparent 30px,

                rgba(160, 160, 160, 0.20) 30px,
                rgba(160, 160, 160, 0.20) 31px
              )

            `;


            /* ====================================================
             * CAPTURE CONTENT
             * ==================================================== */

            const captureContent =
              document.createElement("div");


            captureContent.style.width =
              "100%";

            captureContent.style.height =
              "100%";

            captureContent.style.boxSizing =
              "border-box";

            captureContent.style.padding =
              "54px 28px 32px 78px";

            captureContent.style.overflow =
              "hidden";


            /* ====================================================
             * COPY LETTER LINES
             * ==================================================== */

            lines.forEach((line) => {

              const p =
                document.createElement("p");


              p.style.margin = "0";

              p.style.minHeight = "32px";

              p.style.fontSize = "15px";

              p.style.lineHeight = "32px";

              p.style.fontFamily =
                'Georgia, "Times New Roman", serif';

              p.style.color =
                "#6f5849";

              p.style.opacity = "1";

              p.style.visibility = "visible";


              if (
                line === "" ||
                line === " "
              ) {

                p.innerHTML = "&nbsp;";

              } else {

                p.innerHTML = line;

              }


              captureContent.appendChild(p);

            });


            capture.appendChild(
              captureContent
            );


            document.body.appendChild(
              capture
            );


            /* ====================================================
             * WAIT FOR RENDER
             * ==================================================== */

            await new Promise((resolve) => {

              requestAnimationFrame(() => {

                requestAnimationFrame(
                  resolve
                );

              });

            });


            /* ====================================================
             * HTML2CANVAS
             * ==================================================== */

            const canvas =
              await html2canvas(
                capture,
                {

                  backgroundColor:
                    "#fffdf7",

                  scale: 2,

                  width: 420,

                  height: 560,

                  windowWidth: 420,

                  windowHeight: 560,

                  scrollX: 0,

                  scrollY: 0,

                  useCORS: true,

                  logging: false

                }
              );


            /* ====================================================
             * REMOVE TEMPORARY CAPTURE
             * ==================================================== */

            capture.remove();


            /* ====================================================
             * DOWNLOAD IMAGE
             * ==================================================== */

            const link =
              document.createElement("a");


            link.download =
              "my-letter.png";


            link.href =
              canvas.toDataURL(
                "image/png"
              );


            document.body.appendChild(
              link
            );


            link.click();


            link.remove();

          } catch (error) {

            console.error(
              "Failed to save letter:",
              error
            );

            alert(
              "Surat gagal disimpan."
            );

          }

        }
      );


      /* ==========================================================
       * SAVE REFERENCES
       * ========================================================== */

      div._continueButton = hint;

      div._saveLetterButton = saveBtn;


      /* ==========================================================
       * ADD COMPONENT TO CONTAINER
       * ========================================================== */

      container.appendChild(div);


      return div;
    },


    /* ============================================================
     * ANIMATE
     * ============================================================ */

    animate(tl, el) {

      console.log(
        "ideas: animate() dipanggil"
      );


      const scene =
        el.querySelector(
          ".letter-scene"
        );

      const envelope =
        el.querySelector(
          ".envelope"
        );


      /*
       * Scene muncul terlebih dahulu.
       */

      tl.from(
        scene,
        {
          duration: 0.7,

          opacity: 0,

          scale: 0.9,

          y: 10,

          ease: "power2.out"
        }
      );


      /*
       * Envelope muncul sedikit bersamaan
       * dengan scene.
       */

      tl.from(
        envelope,
        {
          duration: 0.7,

          scale: 0.9,

          opacity: 0,

          ease: "back.out(1.4)"

        },
        "<"
      );

    },


    /* ============================================================
     * EXIT
     * ============================================================ */

    exit(tl, el) {

      console.log(
        "ideas: exit() dipanggil"
      );


      const envelope =
        el.querySelector(
          ".envelope"
        );

      const hint =
        el.querySelector(
          ".open-hint"
        );

      const saveBtn =
        el.querySelector(
          ".save-letter-btn"
        );


      /* ==========================================================
       * HIDE BUTTONS
       * ========================================================== */

      hint.classList.remove(
        "visible"
      );

      saveBtn.classList.remove(
        "visible"
      );


      /* ==========================================================
       * RESET ENVELOPE
       * ========================================================== */

      envelope.classList.remove(
        "open"
      );

      el._isOpen = false;


      /* ==========================================================
       * EXIT ANIMATION
       * ========================================================== */

      tl.to(
        el,
        {
          duration: 0.6,

          opacity: 0,

          y: -50,

          onComplete: () => {

            el.style.display =
              "none";

            el.style.pointerEvents =
              "none";

          }

        }
      );

    }

  };

})();