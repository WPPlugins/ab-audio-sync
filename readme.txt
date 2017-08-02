=== A/B Audio Sync ===
Contributors: jcornutt
Donate link: https://joscor.com/wordpress-ab-audio-sync
Tags: audio, ab testing, web audio api, mobile audio, sync, jquery, wav, mp3, music, songs, tracks, flac, aac, wordpress, html5, synchronization, synchronized audio, music player, a/b testing, a/b comparison
Requires at least: 3.2
Tested up to: 4.7.3
Stable tag: 4.7.3
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

WordPress plugin that provides A/B audio comparison and synchronization.


== Description ==

**[Click here for a live demo](https://joscor.com/wordpress-ab-audio-sync/)**

The A/B Audio Sync plugin for WordPress allows developers to queue two songs (WAV,
MP3, any format the web browser can handle) and play one at a time, with a toggle
switch between them.  This gives users the ability to switch tracks quickly, without
losing the track time, to hear differences in audio tracks.

This is great for demonstrating audio enhancement technology or production/post-production
mixes or even the differences between audio format quality.


== Installation ==

1. Download the plugin and unzip to your wp-content/plugins directory
2. Alternatively, just upload the zip file via the WordPress plugins UI
3. Activate plugin via Wordpress admin
4. Include the following elements on your page or post

`
<!-- Automatic / timed toggling between tracks every 15 seconds -->
<div class="audio-sync-group"
     data-audio-sync-toggle-timer="15"
     data-audio-sync-playing-a-text="Playing original version"
     data-audio-sync-playing-b-text="Playing enhanced version"
     data-audio-sync-buffering-text="Buffering... Please wait."
     data-audio-sync-buffered-text="Buffered!">
    <!-- Labels -->
    <p class="audio-sync-buffering-label"></p>
    <p class="audio-sync-playing-label"></p>
    <!-- Audio tracks (track A @ 50% volume) -->
    <a class="audio-sync-a" data-audio-sync-volume="50" href="PATH_TO_AUDIO_A"></a>
    <a class="audio-sync-b" href="PATH_TO_AUDIO_B"></a>
    <!-- Play button -->
    <button class="audio-btn-sync-play">Play</button>
</div>

<!-- Manual toggling between tracks -->
<div class="audio-sync-group"
     data-audio-sync-playing-a-text="Playing original version"
     data-audio-sync-playing-b-text="Playing enhanced version">
    <!-- Labels -->
    <p class="audio-sync-playing-label"></p>
    <!-- Audio tracks -->
    <a class="audio-sync-a" href="PATH_TO_AUDIO_A"></a>
    <a class="audio-sync-b" href="PATH_TO_AUDIO_B"></a>
    <!-- Play button -->
    <button class="audio-btn-sync-play">Play</button>
    <button class="audio-btn-sync-a">Audio A</button>
    <button class="audio-btn-sync-b">Audio B</button>
</div>
`

Replace *PATH_TO_AUDIO_A* and *PATH_TO_AUDIO_B*, of course with your own files. File type will be dependent on browser support.
This has been tested with MP3 and WAV audio files with no issues on Google Chrome.

The plugin looks for HTML objects with the class of *audio-sync-group* as its starting point.
From there, it will look for two link (a) or audio elements that have the class *audio-sync-a* or *audio-sync-b*.  There
can be only one of each within an audio group. There must also be *audio-btn-sync-play*
button to control play / stop.

There can be multiple audio groups on the same page and they will all act independently from eachother. This is
ideal for a "showcase" type of page with many A/B comparisons happening in one view.

Apple iOS mobile users - Web Audio API is not fully, nor correctly, implemented in iPhone devices. If you experience
issues with this plugin, please enable debug logging (see support forum sticky thread) and open a ticket.

== Changelog ==

= 1.0.0 =
* COMPLETE REWRITE
* Enhancement: Mobile support! Tested on Android 7.0, 4.4.4 Chrome and iPhone 6 Safari.
* Enhancement: Moved to Web Audio API with HTML5 audio fallback
* Enhancement: Added several new dataset options (see examples)
* Enhancement: Added automatic toggle between tracks using timer
* Change: Removed HTML5 audio players
* Fix: Warning message due to static method reference

= 0.3.4 =
* Enhancement: Added "disable right-click menu" using "data-show-menu" HTML5 attribute
* Improvement: User-selected volume now persists between play/pause cycles
* Fix: Incorrect resume state after pause

= 0.3.3 =
* Enhancement: Added "stop" button support using "data-stop" HTML5 attribute

= 0.3.2 =
* Improvement: Removed dependency that buttons be direct children of the group
* Improvement: Pause / Play button now re-synchronizes timing
* Fix: Race condition between "readyState" and "canplay"

= 0.3.1 =
* Enhancement: Added support for multiple A/B audio groups
* Improvement: Removed dependency on HTML IDs
* Fix: Audio synchronization timing
