# Orbite (Orbit)

A one-button skill game: your ship circles a sun on its own, on one of three orbits. You only choose the orbit, to dodge asteroids, collect crystals and escape the sun's flares.

*Version française : [README.md](README.md)*

## Star systems, boost, cannon and power-ups (new in 1.2.0)

- Every 40 seconds, a **new system**: yellow sun, red dwarf, pulsar, blue giant. Orbits stretch into **ellipses**, and some slowly spin.
- **→** (held): **boost**, it uses energy (the gauge at the bottom) but points count double. **←**: **brake**.
- **Power-ups** on the orbits: **shield** (one hit), **magnet** (crystals come to you), **slow-mo** (asteroids drag) and **cannon**: 5 shots with **X**, 5 points per asteroid destroyed.

## Controls

- **Space**, **click** or **↑**: move to the next outer orbit (from the outermost, you go back to the one closest to the sun).
- **↓** or **right-click**: move to the inner orbit.
- Hold **→**: boost · hold **←**: brake.
- **X** or **Shift**: fire (with the cannon power-up).
- **P**: pause.
- **Space** or **click**: set off, then play again after a crash.

## Full screen

The **Full screen** button fills the whole screen with the solar system (Escape to leave). Otherwise the game takes all the height the window leaves.

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
