# Changelog

## [1.12.0-beta.8](https://github.com/hologfx/holographics/compare/v1.12.0-beta.7...v1.12.0-beta.8) (2026-08-20)


### Bug Fixes

* **ci:** skip the CLA action on release-please pull requests ([f9f211c](https://github.com/hologfx/holographics/commit/f9f211cdb416810c62aa9a221d0721f9de54970f))

## [1.12.0-beta.7](https://github.com/hologfx/holographics/compare/v1.12.0-beta.6...v1.12.0-beta.7) (2026-08-20)


### Bug Fixes

* **app:** open external links in the default browser ([7a2cf57](https://github.com/hologfx/holographics/commit/7a2cf57e833e24ec81442e9e9eea73d7b4aafe9f))
* **app:** stop macOS nesting the dock icon inside its own shape ([5e78cbf](https://github.com/hologfx/holographics/commit/5e78cbfa92a522d6c78ab6e0452f2431b0f5b1fa))
* **app:** stop the app hanging on quit ([23d5a6c](https://github.com/hologfx/holographics/commit/23d5a6c5a02cc44b37fe39fc005295a067a3ad20))
* **ci:** create the git tag as soon as the release is drafted ([6c3580f](https://github.com/hologfx/holographics/commit/6c3580fecd1427ff7731e880d128114f45ed1213))
* **updates:** show the changelog and the real reason a check failed ([1c21190](https://github.com/hologfx/holographics/commit/1c21190c918ec5da6853ee85a2b4ede7e901ea6c))
* **updates:** stop the check erroring when already on the newest version ([9107110](https://github.com/hologfx/holographics/commit/910711003afe08d73a98975b2d360293385bb591))

## [1.12.0-beta.6](https://github.com/hologfx/holographics/compare/v1.12.0-beta.5...v1.12.0-beta.6) (2026-08-20)


### Features

* **updates:** publish only to GitHub Releases, with stable and beta channels ([a80cfda](https://github.com/hologfx/holographics/commit/a80cfdac7c8d029dfcabeca8a0f40694157aba68))


### Bug Fixes

* **updates:** offer beta builds on the GitHub update feed ([2448589](https://github.com/hologfx/holographics/commit/2448589c6bc034b087a7097b0e96637ae658731b))

## [1.12.0-beta.5](https://github.com/hologfx/holographics/compare/v1.12.0-beta.4...v1.12.0-beta.5) (2026-08-20)


### Features

* **updates:** publish only to GitHub Releases, with stable and beta channels ([a80cfda](https://github.com/hologfx/holographics/commit/a80cfdac7c8d029dfcabeca8a0f40694157aba68))


### Bug Fixes

* **updates:** offer beta builds on the GitHub update feed ([2448589](https://github.com/hologfx/holographics/commit/2448589c6bc034b087a7097b0e96637ae658731b))

# 1.11.0-beta.1 <span class='date'>2021-05-02</span>

## Animations update v2

This update improves on what was added in 1.11.0-beta.0 and fixes a lot of bugs that crept up (like the ticker and test pattern not animating). You can now customize the animation used for every individual widget, a long awaited feature. The reposition engine is improved to be more efficient. Lastly, two new widgets have arrived! The timeline and schedule allow you to keep your audience informed on what's past and what's coming.

### FEATURE
<ul class="FEATURE">
<li><span class="type FEATURE">FEATURE</span>New timeline and schedule widget</li>
<li><span class="type FEATURE">FEATURE</span>Change animations per widget</li>
</ul>

### FIXED
<ul class="FIXED">
<li><span class="type FIXED">FIXED</span>Fixed widgets that were broken since the last beta</li>
</ul>

### IMPROVED
<ul class="IMPROVED">
<li><span class="type IMPROVED">IMPROVED</span>Repositioning system improved to use far less performance</li>
</ul>


# 1.11.0-beta.0 <span class='date'>2020-11-23</span>

## Animations update

With this update, we've rewritten the way animations work in Holographics. Widget programmers can now override the way widgets are positioned, sized and animated. This makes the widget system a more flexible tool overall. We've also updated to the latest version of GSAP, allowing more intricate and performant animations.

### FEATURE
<ul class="FEATURE">
<li><span class="type FEATURE">FEATURE</span>New properties in widget API allowing for self sizing, animating and positioning widgets.</li>
<li><span class="type FEATURE">FEATURE</span>Several new widgets, mostly for background animations</li>
<li><span class="type FEATURE">FEATURE</span>Add showName query parameter to allow users to override widget visibility using the render URL by passing through widget names</li>
</ul>

### IMPROVED
<ul class="IMPROVED">
<li><span class="type IMPROVED">IMPROVED</span>Updated to the latest version of GSAP</li>
</ul>

### KNOWN ISSUE
<ul class="KNOWN ISSUE">
<li><span class="type KNOWN ISSUE">KNOWN ISSUE</span>Not all animations work well with all widgets, for example the 'textDecode' animation does not work with clocks or countdowns. This will be fixed in a later update.</li>
<li><span class="type KNOWN ISSUE">KNOWN ISSUE</span>You may have to delete the animations folder in your user data directory in order to get the updated animations.</li>
</ul>
