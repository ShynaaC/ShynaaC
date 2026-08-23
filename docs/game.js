(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");
  const status = document.querySelector("#status");
  const buttons = [...document.querySelectorAll("[data-control]")];

  ctx.imageSmoothingEnabled = false;

  const W = canvas.width;
  const H = canvas.height;
  const WHITE = "#f6fff8";
  const GREEN = "#31ff72";
  const DIM_GREEN = "#0c8f39";
  const INTRO = "HI THERE";
  const SUBTITLE = "I'M SHYNAA";
  const CHAR_DELAY = 100;
  const SECOND_LINE_PAUSE = 400;
  const introDuration = INTRO.length * CHAR_DELAY;
  const subtitleStartsAt = introDuration + SECOND_LINE_PAUSE;
  const controlsUnlockAt = subtitleStartsAt + SUBTITLE.length * CHAR_DELAY;

  const glyphs = {
    " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
    "'": ["00100", "00100", "00000", "00000", "00000", "00000", "00000"],
    A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
    D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
    H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
    K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
    R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
    X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
    Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
    0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
    4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    5: ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
    6: ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
    7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    9: ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  };

  const sprites = {
    player: [
      "00000100000",
      "00001110000",
      "00001110000",
      "01111111110",
      "11111111111",
      "11111111111",
      "11111111111",
    ],
    aliens: [
      [
        ["00100000100", "00010001000", "00111111100", "01101110110", "11111111111", "10111111101", "10100000101", "00011011000"],
        ["00100000100", "10010001001", "10111111101", "11101110111", "11111111111", "01111111110", "00100000100", "01000000010"],
      ],
      [
        ["00011000", "00111100", "01111110", "11011011", "11111111", "01011010", "10000001", "01000010"],
        ["00011000", "00111100", "01111110", "11011011", "11111111", "00100100", "01011010", "10100101"],
      ],
      [
        ["000011110000", "011111111110", "111111111111", "111001100111", "111111111111", "000110011000", "001101101100", "110000000011"],
        ["000011110000", "011111111110", "111111111111", "111001100111", "111111111111", "001110011100", "011001100110", "001100001100"],
      ],
    ],
    explosion: [
      "0100100010010",
      "0010010100100",
      "0001000001000",
      "1100000000011",
      "0001000001000",
      "0010010100100",
      "0100100010010",
    ],
  };

  let startTime = performance.now();
  let lastTime = startTime;
  let ready = false;
  let readyAnnounced = false;
  let score = 0;
  let playerX = 106;
  let fireCooldown = 0;
  let wonAt = 0;
  const held = { left: false, right: false, fire: false };
  const bullets = [];
  const aliens = [];

  function createAliens() {
    aliens.length = 0;
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 11; column += 1) {
        const kind = row === 0 ? 0 : row < 3 ? 1 : 2;
        const sprite = sprites.aliens[kind][0];
        aliens.push({
          x: column * 16 + 20 + Math.floor((13 - sprite[0].length) / 2),
          y: row * 17 + 91,
          kind,
          alive: true,
          explodedAt: 0,
        });
      }
    }
  }

  function resetGame(now = performance.now()) {
    score = 0;
    playerX = 106;
    bullets.length = 0;
    fireCooldown = 0;
    wonAt = 0;
    createAliens();
    if (ready) {
      status.textContent = "CONTROLS ONLINE // CLEAR THE FORMATION";
      status.classList.add("ready");
    }
    lastTime = now;
  }

  function drawSprite(sprite, x, y, color = GREEN, scale = 1) {
    ctx.fillStyle = color;
    sprite.forEach((row, py) => {
      [...row].forEach((pixel, px) => {
        if (pixel === "1") ctx.fillRect(x + px * scale, y + py * scale, scale, scale);
      });
    });
  }

  function textWidth(text, scale = 1) {
    return Math.max(0, text.length * 6 * scale - scale);
  }

  function drawText(text, x, y, color = WHITE, scale = 1) {
    ctx.fillStyle = color;
    [...text.toUpperCase()].forEach((character, index) => {
      const glyph = glyphs[character] || glyphs[" "];
      glyph.forEach((row, py) => {
        [...row].forEach((pixel, px) => {
          if (pixel === "1") {
            ctx.fillRect(x + index * 6 * scale + px * scale, y + py * scale, scale, scale);
          }
        });
      });
    });
  }

  function centerText(text, y, color, scale = 1) {
    drawText(text, Math.floor((W - textWidth(text, scale)) / 2), y, color, scale);
  }

  function overlaps(bullet, alien, sprite) {
    return (
      bullet.x < alien.x + sprite[0].length &&
      bullet.x + 1 > alien.x &&
      bullet.y < alien.y + sprite.length &&
      bullet.y + 3 > alien.y
    );
  }

  function setReady(value) {
    ready = value;
    buttons.forEach((button) => {
      button.disabled = !value;
    });

    if (value && !readyAnnounced) {
      readyAnnounced = true;
      status.textContent = "CONTROLS ONLINE // CLEAR THE FORMATION";
      status.classList.add("ready");
      canvas.focus({ preventScroll: true });
    }
  }

  function update(now, delta) {
    const elapsed = now - startTime;
    if (!ready && elapsed >= controlsUnlockAt) setReady(true);
    if (!ready || wonAt) return;

    const movement = (held.right ? 1 : 0) - (held.left ? 1 : 0);
    playerX = Math.max(0, Math.min(W - sprites.player[0].length, playerX + movement * delta * 0.095));

    fireCooldown = Math.max(0, fireCooldown - delta);
    if (held.fire && fireCooldown === 0) {
      bullets.push({ x: Math.round(playerX) + 5, y: 212 });
      fireCooldown = 240;
    }

    for (let index = bullets.length - 1; index >= 0; index -= 1) {
      const bullet = bullets[index];
      bullet.y -= delta * 0.16;
      if (bullet.y < 0) {
        bullets.splice(index, 1);
        continue;
      }

      for (const alien of aliens) {
        if (!alien.alive) continue;
        const sprite = sprites.aliens[alien.kind][0];
        if (overlaps(bullet, alien, sprite)) {
          alien.alive = false;
          alien.explodedAt = now;
          score += (3 - alien.kind) * 10;
          bullets.splice(index, 1);
          break;
        }
      }
    }

    if (aliens.every((alien) => !alien.alive)) {
      wonAt = now;
      held.fire = false;
      status.textContent = "FORMATION CLEARED // PRESS ENTER OR FIRE TO REPLAY";
    }
  }

  function draw(now) {
    const elapsed = now - startTime;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    const introCharacters = Math.min(INTRO.length, Math.floor(elapsed / CHAR_DELAY));
    centerText(INTRO.slice(0, introCharacters), 8, WHITE, 2);

    if (elapsed >= subtitleStartsAt) {
      const subtitleCharacters = Math.min(
        SUBTITLE.length,
        Math.floor((elapsed - subtitleStartsAt) / CHAR_DELAY),
      );
      centerText(SUBTITLE.slice(0, subtitleCharacters), 28, GREEN);
    }

    drawText("SCORE", 4, 48, WHITE);
    drawText(String(score).padStart(4, "0"), 4, 58, WHITE);

    const animationFrame = Math.floor(now / 320) % 2;
    for (const alien of aliens) {
      if (alien.alive) {
        drawSprite(sprites.aliens[alien.kind][animationFrame], alien.x, alien.y, GREEN);
      } else if (now - alien.explodedAt < 170) {
        drawSprite(sprites.explosion, alien.x - 1, alien.y, GREEN);
      }
    }

    ctx.fillStyle = WHITE;
    for (const bullet of bullets) {
      ctx.fillRect(Math.round(bullet.x), Math.round(bullet.y), 1, 3);
    }

    drawSprite(sprites.player, Math.round(playerX), 216, WHITE);
    ctx.fillStyle = DIM_GREEN;
    ctx.fillRect(0, 239, W, 1);
    drawText("CREDIT 00", 169, 246, WHITE);

    if (wonAt) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
      ctx.fillRect(22, 102, 180, 44);
      centerText("YOU WIN", 111, GREEN, 2);
      centerText("ENTER OR FIRE TO REPLAY", 134, WHITE);
    }
  }

  function frame(now) {
    const delta = Math.min(32, now - lastTime);
    lastTime = now;
    update(now, delta);
    draw(now);
    requestAnimationFrame(frame);
  }

  function replayIfNeeded() {
    if (wonAt) {
      resetGame();
      return true;
    }
    return false;
  }

  const keyMap = {
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
    " ": "fire",
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && wonAt) {
      event.preventDefault();
      replayIfNeeded();
      return;
    }

    const control = keyMap[event.key];
    if (!control) return;
    event.preventDefault();
    if (!ready) return;
    if (control === "fire" && replayIfNeeded()) return;
    held[control] = true;
  });

  window.addEventListener("keyup", (event) => {
    const control = keyMap[event.key];
    if (!control) return;
    event.preventDefault();
    held[control] = false;
  });

  window.addEventListener("blur", () => {
    Object.keys(held).forEach((control) => {
      held[control] = false;
    });
  });

  buttons.forEach((button) => {
    const control = button.dataset.control;
    const press = (event) => {
      event.preventDefault();
      if (!ready) return;
      if (control === "fire" && replayIfNeeded()) return;
      held[control] = true;
      button.classList.add("pressed");
      button.setPointerCapture?.(event.pointerId);
    };
    const release = (event) => {
      event.preventDefault();
      held[control] = false;
      button.classList.remove("pressed");
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  });

  setReady(false);
  resetGame(startTime);
  requestAnimationFrame(frame);
})();

