(function () {
  window.Components = window.Components || {};

  window.Components.chatbox = {
    interactive: true,

    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-chatbox";

      const messages = section.messages || [
        section.message || "Happy Birthday! 🎂"
      ];

      div.innerHTML = `
        <div class="text-box">
          <p class="hbd-chatbox"></p>

          <button class="chat-btn" type="button">
            ${section.buttonText || "Continue"} →
          </button>
        </div>
      `;

      div._messages = messages;
      div._currentMessage = 0;

      container.appendChild(div);

      return div;
    },

    animate(tl, el) {
      console.log("chatbox: animate() dipanggil");
      const textBox = el.querySelector(".text-box");
      const chatbox = el.querySelector(".hbd-chatbox");
      const button = el.querySelector(".chat-btn");
      const messages = el._messages;

      tl.from(textBox, {
        duration: 0.7,
        scale: 0.8,
        opacity: 0,
        ease: "back.out(1.4)",
      });

      tl.call(() => {
        console.log("chatbox: tl.call jalan, showMessage dipanggil");  
        this.showMessage(chatbox, messages[0]);
      });

      button.addEventListener("click", () => {
        el._currentMessage++;

        if (el._currentMessage < messages.length) {
          this.showMessage(chatbox, messages[el._currentMessage]);
        } else {
          button.textContent = "Continue 🎉";
          if (el._continue) {
            el._continue();
          }
        }
      });
    },
    showMessage(chatbox, message) {
      console.log("chatbox: showMessage() jalan, pesan =", message); 
      chatbox.innerHTML = "";

      message.split("").forEach((char, index) => {
        const span = document.createElement("span");

        span.textContent = char;
        span.style.opacity = "0";

        chatbox.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          duration: 0.03,
          delay: index * 0.04,
        });
      });
    },

    exit(tl, el) {
    tl.to(el, {
      duration: 0.6,
      opacity: 0,
      y: -50,
      onComplete: () => {
        el.style.display = "none";  
        el.style.pointerEvents = "none";
      },
    });
},
  };
})();