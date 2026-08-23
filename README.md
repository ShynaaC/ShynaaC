<div align="center">

# SPACE INVADERS

### HI THERE — I'M SHYNAA

A tiny playable introduction, built from my C++ Space Invaders project.

[![Play Space Invaders](https://img.shields.io/badge/PLAY_SPACE_INVADERS-00ff66?style=for-the-badge&labelColor=050807)](https://shynaac.github.io/ShynaaC/)

</div>

The intro types two lines before the controls unlock. Once **HI THERE** and **I'M SHYNAA** are fully displayed, move with <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd>, and fire with <kbd>Space</kbd>. Touch controls are included for mobile players.

> GitHub READMEs cannot run C++, JavaScript, or keyboard-controlled games directly. The button opens the playable GitHub Pages version from this repository.

## Run the C++ version

The original implementation is in [`spaceinv.cpp`](./spaceinv.cpp). It requires OpenGL 3.3, GLFW, and GLEW.

```bash
g++ spaceinv.cpp -std=c++11 -lglfw -lGLEW -lGL -o spaceinv
./spaceinv
```

## Publish the playable version

The included GitHub Actions workflow publishes everything in [`docs`](./docs) to GitHub Pages on each push to `main` or `master`. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions** once, then push the files.

