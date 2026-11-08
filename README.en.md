# Orbite (Orbit)

A one-button skill game: your ship circles a sun on its own, on one of three orbits. You only choose the orbit, to dodge asteroids, collect crystals and escape the sun's flares.

*Version française : [README.md](README.md)*

## Controls

- **Space**, **click** or **↑**: move to the next outer orbit (from the outermost, you go back to the one closest to the sun).
- **↓** or **right-click**: move to the inner orbit.
- **P**: pause.
- **Space** or **click**: set off, then play again after a crash.

## Dangers

- **Asteroids**: in three sizes, they come in from an edge of the screen and cross it aiming close to the sun. They come more and more often. A single touch ends the game.
- **Flares**: every 15 to 25 seconds, the sun blinks and the inner orbit turns red for 2 seconds; then it burns for 2 seconds. You must have left it in time.
- The ship's speed rises over time, to more than twice its starting speed.

## Crystals and score

Three crystals are always spread over the orbits; each one collected is replaced by another. Crystals taken in a row raise the multiplier, up to ×5; it drops back to ×1 every 10 seconds.

The score is 2 points per second survived, plus 10 points per crystal times the current multiplier.

## Statistics

Best score, games played, total crystals collected and flares avoided.

## Data and sync

Your record and statistics are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Orbite → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
