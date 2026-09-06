/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Theresia Rachel Gunawan",
  music: "./music/hbd.mpeg",      // Place your music in the music/ folder

  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#f472b6",           // Main accent color (rose pink)
    accent: "#60a5fa",            // Secondary accent color (sky blue)
    dark: {
      background: "#0f172a",      // Slate 900
      text: "#f1f5f9",            // Slate 100
    },
    light: {
      background: "#fafaf9",      // Stone 50
      text: "#1e293b",            // Slate 800
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "dark",

  // ── Sections ──────────────────────────────────────────────────
  // Add, remove, duplicate, or reorder as you wish!
  sections: [
    {
      type: "greeting",
      title: "Hi",
      subtitle: "It's your special day! <span>🎉</span>",
    },
    {
      type: "countdown",
      from: 3,                    // Countdown from this number
    },
    {
      type: "paperconfetti",
      count: 10,
    },
    {
      type: "announcement",
      text: "Happy Birthday to My Beloved Friend!! :D",
    },
    {
      type: "chatbox",
      messages: [
        "Selamat ulang tahun achel!! 🎂",
        "Semoga kamu sehat, bahagia, dan sukses selalu yaa!",
        "Oh iya...",
        "Aku sebenarnya masih punya sesuatu buat kamu 👀"
      ],
      buttonText: "Continue",
      interactive: true,
    },
    {
      type: "ideas",
      lines: [
        "Dear Rachel,",
        " ",
        "Thank you for becoming one of my biggest fans 😊",
        "Because of you, I’ve become who I am today.",
        "Let’s be friends for the next 1, 5, or maybe even 15 years! 😆",
        "Once again, happy birthday to one of my special person in this world! <span>:)</span>",
        " ",
        "With Love,",
        "Miss Pink Witch"

      ],
      bigLetters: "SO",
    },
    {
      type: "quote",
      text: "The more you praise and celebrate your life, the more there is in life to celebrate.",
      author: "Oprah Winfrey",
    },
    {
      type: "profile",
      wishTitle: "Happy Birthday!",
      wishText: "May fortune always be with you! 😌",
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 9,
    },
    {
      type: "closing",
      text: "Let's make a wish!",
      // replayText: "Okay, that's it for now, tell me if you liked it 😊",
    },
  ],
};
