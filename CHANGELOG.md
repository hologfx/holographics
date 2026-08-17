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


