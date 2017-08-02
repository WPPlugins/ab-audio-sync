var DEBUG = false;
var audio_groups = [];

var SEL_GROUP =         '.audio-sync-group';
var SEL_BUFFERING_LBL = '.audio-sync-buffering-label';
var SEL_PLAYING_LBL =   '.audio-sync-playing-label';
var SEL_AUDIO_A =       '.audio-sync-a';
var SEL_AUDIO_B =       '.audio-sync-b';
var SEL_PLAY_BTN =      '.audio-btn-sync-play';
var SEL_AUDIO_A_BTN =   '.audio-btn-sync-a';
var SEL_AUDIO_B_BTN =   '.audio-btn-sync-b';

var CLS_BUFFERING = 'audio-sync-buffering';
var CLS_BUFFERED =  'audio-sync-buffered';
var CLS_PLAYING =   'audio-sync-playing';
var CLS_PLAYING_A = 'audio-sync-playing-a';
var CLS_PLAYING_B = 'audio-sync-playing-b';

var DATASET_AUDIO_VOLUME =   'audioSyncVolume';
var DATASET_TOGGLE_TIMER =   'audioSyncToggleTimer';
var DATASET_BUFFERING_TEXT = 'audioSyncBufferingText';
var DATASET_BUFFERED_TEXT =  'audioSyncBufferedText';
var DATASET_PLAYING_A_TEXT = 'audioSyncPlayingAText';
var DATASET_PLAYING_B_TEXT = 'audioSyncPlayingBText';

// Entry point & sanitization
jQuery(document).ready(function() {
  // Banner
  debug('  ___      _______    ___            _ _         _____                    \n' +
        ' / _ \\    / / ___ \\  / _ \\          | (_)       /  ___|                   \n' +
        '/ /_\\ \\  / /| |_/ / / /_\\ \\_   _  __| |_  ___   \\ `--. _   _ _ __   ___   \n' +
        '|  _  | / / | ___ \\ |  _  | | | |/ _` | |/ _ \\   `--. \\ | | | \'_ \\ / __| \n' +
        '| | | |/ /  | |_/ / | | | | |_| | (_| | | (_) | /\\__/ / |_| | | | | (__   \n' +
        '\\_| |_/_/   \\____/  \\_| |_/\\__,_|\\__,_|_|\\___/  \\____/ \\__, |_| |_|\\___|  \n' +
        '                                                        __/ |             \n' +
        '                                                       |___/              \n');

  // Find all audio groups
  var groups = jQuery(SEL_GROUP);
  debug('Audio groups found: ' + groups.length);

  jQuery.each(groups, function(gid, group) {
    debug('groups[' + gid + ']: ' + group);

    // Find the play button(s)
    var btnPlay = jQuery(group).find(SEL_PLAY_BTN);
    if( btnPlay === null || btnPlay.length <= 0 ) {
      debug('Group[' + gid + '] does not have a play button!');
      return;
    }

    // Find the "A" button
    var btnA = jQuery(group).find(SEL_AUDIO_A_BTN);
    if( btnA === null || btnA.length <= 0 ) {
      debug('Group[' + gid + '] does not have an "A" button');
    }

    // Find the "B" button
    var btnB = jQuery(group).find(SEL_AUDIO_B_BTN);
    if( btnB === null || btnB.length <= 0 ) {
      debug('Group[' + gid + '] does not have a "B" button');
    }

    // Find the "A" audio track
    var audioA = jQuery(group).find(SEL_AUDIO_A);
    if( audioA === null || audioA.length <= 0 ) {
      debug('Group[' + gid + '] does not have an "A" audio track!');
      return;
    } else if( audioA.length > 1 ) {
      debug('Group[' + gid + '] has too many "A" audio tracks!');
      return;
    }

    // Find the "B" audio track
    var audioB = jQuery(group).find(SEL_AUDIO_B);
    if( audioB === null || audioB.length <= 0 ) {
      debug('Group[' + gid + '] does not have an "B" audio track!');
      return;
    } else if( audioB.length > 1 ) {
      debug('Group[' + gid + !'] has too many "B" audio tracks!');
      return;
    }

    var soundA, soundB;
    if( audioA.is('a') ) {
      debug('Using link (href) object for audio "A"');
      soundA = audioA.attr('href');
      if( !soundA ) {
        debug('Missing audio file for audio "A" link');
        return;
      }
    } else if( audioA.is('audio') ) {
      debug('Using HTML5 audio (src) object for audio "A"');
      soundA = audioA[0].src;
      if( !soundA ) {
        debug('Missing audio file for audio "A" HTML5 audio object');
        return;
      }
      audioA.hide();
    } else {
      debug('Could not find a usable audio file for audio "A"');
      return;
    }
    if( audioB.is('a') ) {
      debug('Using link (href) object for audio "B"');
      soundB = audioB.attr('href');
      if( !soundB ) {
        debug('Missing audio file for audio "B" link');
        return;
      }
    } else if( audioB.is('audio') ) {
      debug('Using HTML5 audio (src) object for audio "B"');
      soundB = audioB[0].src;
      if( !soundB ) {
        debug('Missing audio file for audio "B" HTML5 audio object');
        return;
      }
      audioB.hide();
    } else {
      debug('Could not find a usable audio file for audio "B"');
      return;
    }

    if( (device.mobile() || device.tablet()) && device.ios() ) {
      debug('Apple iOS detected. Disabling audio auto-enable');
      Howler.mobileAutoEnable = false;
    }

    debug('AudioA: Using audio source: ' + soundA);
    soundA = new Howl({
      src: [soundA],
      volume: parseInt(audioA[0].dataset[DATASET_AUDIO_VOLUME] || 100) / 100,
      onload: function() { debug('AudioA "onload" event!'); },
      onloaderror: function(id, err) { debug('AudioA "onloaderror" event! (err=' + err + ')'); },
      onplay: function() { debug('AudioA "onplay" event!'); },
      onend: function() { debug('AudioA "onend" event!'); },
      onpause: function() { debug('AudioA "onpause" event!'); },
      onstop: function() { debug('AudioA "onstop" event!'); },
      onmute: function() { debug('AudioA "onmute" event!'); },
      onvolume: function() { debug('AudioA "onvolume" event!'); },
      onrate: function() { debug('AudioA "onrate" event!'); },
      onseek: function() { debug('AudioA "onseek" event!'); },
      onfade: function() { debug('AudioA "onfade" event!'); }
    });
    debug('AudioB: Using audio source: ' + soundB);
    soundB = new Howl({
      src: [soundB],
      volume: parseInt(audioB[0].dataset[DATASET_AUDIO_VOLUME] || 100) / 100,
      onload: function() { debug('AudioB "onload" event!'); },
      onloaderror: function(id, err) { debug('AudioB "onloaderror" event! (err=' + err + ')'); },
      onplay: function() { debug('AudioB "onplay" event!'); },
      onend: function() { debug('AudioB "onend" event!'); },
      onpause: function() { debug('AudioB "onpause" event!'); },
      onstop: function() { debug('AudioB "onstop" event!'); },
      onmute: function() { debug('AudioB "onmute" event!'); },
      onvolume: function() { debug('AudioB "onvolume" event!'); },
      onrate: function() { debug('AudioB "onrate" event!'); },
      onseek: function() { debug('AudioB "onseek" event!'); },
      onfade: function() { debug('AudioB "onfade" event!'); }
    });

    // Web Audio is effectively muted on iOS mobile without user interaction
    if( (device.mobile() || device.tablet()) && device.ios() ) {
      debug('Adding EventListener(touchend)');
      window.addEventListener('touchend', unlockIOSAudioPlayback);
    }

    // Enable button once audio sources have loaded
    handleBufferingState(group, false);
    soundA.once('load', function() {
      debug('audio[' + gid + '].soundA has loaded');
      if( soundA.state() === 'loaded' )
        handleBufferingState(group, true);
    });
    soundB.once('load', function() {
      debug('audio[' + gid + '].soundB has loaded');
      if( soundA.state() === 'loaded' )
        handleBufferingState(group, true);
    });

    audio_groups.push({
      // jQuery group object
      group: group,
      // jQuery play button object
      btnPlay: btnPlay,
      // jQuery toggle button objects
      btnA: btnA,
      btnB: btnB,
      // Web audio objects
      audioA: audioA,
      audioA_sound: soundA,
      audioB: audioB,
      audioB_sound: soundB,
    });
  });

  // Check that at least one audio group exists
  if( audio_groups === null || audio_groups.length <= 0 ) {
    debug('No usable audio groups found');
    return;
  }

  // Disable all audio buttons in each group
  debug('Disabling group buttons');
  groups.find(SEL_PLAY_BTN).attr('disabled', 'true');
  groups.find(SEL_AUDIO_A_BTN).attr('disabled', 'true');
  groups.find(SEL_AUDIO_B_BTN).attr('disabled', 'true');
  debug('Starting ABAudioSync()');
  ABAudioSync();
});

var unlockIOSAudioPlayback = function() {
  var ctx = Howler.ctx;
  debug('Attempting to enable iOS Web Audio.');
  // create empty buffer
  var buffer = ctx.createBuffer(1, 22050, 22050);
  var source = ctx.createBufferSource();
  source.buffer = buffer;
  // connect to output (your speakers)
  source.connect(ctx.destination);
  // play the object
  if (typeof source.noteOn === 'undefined') {
    source.start(0);
  } else {
    source.noteOn(0);
  }
  // Wait to remove the listener
  source.onended = function() {
    debug('iOS unlock state (onended): ' + source);
    window.removeEventListener('touchend', unlockIOSAudioPlayback);
  };
};


function handleBufferingState(group, buffered) {
  if( !buffered ) {
    jQuery(group).find(SEL_BUFFERING_LBL)
      .text(group.dataset[DATASET_BUFFERING_TEXT] || 'Buffering audio...')
      .addClass(CLS_BUFFERING);
  } else {
    jQuery(group).find(SEL_BUFFERING_LBL)
      .text(group.dataset[DATASET_BUFFERED_TEXT] || '')
      .addClass(CLS_BUFFERED);
    jQuery(group).find(SEL_PLAY_BTN).attr('disabled', false);
  }
}


function ABAudioSync() {
  jQuery.each(audio_groups, function(aid, audio) {
    debug('Setting Audio Group #' + aid + ' Play button click handlers');
    jQuery.each(audio.btnPlay, function(bid, btn) {
      jQuery(btn).click({group: aid, btn: bid}, btnPlay_Clicked);
    });

    if( audio.btnA ) {
      debug('Setting Audio Group #' + aid + ' "A" button click handlers');
      jQuery.each(audio.btnA, function(bid, btn) {
        jQuery(btn).click({group: aid, btn: bid}, btnA_Clicked);
      });
    }

    if( audio.btnB ) {
      debug('Setting Audio Group #' + aid + ' "B" button click handlers');
      jQuery.each(audio.btnB, function(bid, btn) {
        jQuery(btn).click({group: aid, btn: bid}, btnB_Clicked);
      });
    }
  });
}

var timer = Array();

function btnPlay_Clicked(event) {
  debug('audio[' + event.data.group + '].btnPlay[' + event.data.btn + '] was clicked');
  var gid = event.data.group;
  var group = audio_groups[gid];

  // Clear any timers active
  if( timer[gid] ) clearInterval(timer[gid]);

  if( group.audioA_sound.playing() || group.audioB_sound.playing() ) {
    // Stop all
    group.audioA_sound.stop();
    group.audioB_sound.stop();
    // Clear any end handlers
    group.audioA_sound.off('end');
    // Disable buttons
    group.btnPlay.text('Play');
    group.btnA.attr('disabled','true');
    group.btnB.attr('disabled','true');
    group.btnA.removeClass(CLS_PLAYING);
    group.btnB.removeClass(CLS_PLAYING);
    jQuery(group.group).find(SEL_PLAYING_LBL)
      .text('').removeClass(CLS_PLAYING_A).removeClass(CLS_PLAYING_B);
  } else {
    // If the track ends, "press" the stop button
    group.audioA_sound.once('end', function() { btnPlay_Clicked(event); });
    // Enable buttons
    group.btnPlay.text('Stop');
    group.btnA.attr('disabled','true');
    group.btnB.removeAttr('disabled');
    jQuery(group.group).find(SEL_PLAYING_LBL)
      .text(group.group.dataset[DATASET_PLAYING_A_TEXT] || 'Playing track A')
      .addClass(CLS_PLAYING_A).removeClass(CLS_PLAYING_B);
    // Play audioA
    group.audioB_sound.stop();
    group.audioA_sound.stop();
    group.audioA_sound.play();
    // Take care of any toggle timers defined
    if( group.group.dataset[DATASET_TOGGLE_TIMER] ) {
      var timer_s = parseInt(group.group.dataset[DATASET_TOGGLE_TIMER]);
      debug('Starting ' + timer_s + 's toggle timer for group[' + gid + ']!');
      (function(group, gid) {
        timer[gid] = setInterval(function() {
          debug('Switching tracks of group[' + gid + ']');
          switchTracks(group);
        }, timer_s * 1000);
      })(group, gid);
    }
  }
}

function switchTracks(group) {
  if( !group.audioA_sound.playing() ) {
    // Switch tracks
    debug('Switching tracks: AudioB -> AudioA');
    group.btnA.attr('disabled','true');
    group.btnB.removeAttr('disabled');
    group.btnB.removeClass(CLS_PLAYING);
    group.btnA.addClass(CLS_PLAYING);
    jQuery(group.group).find(SEL_PLAYING_LBL)
      .text(group.group.dataset[DATASET_PLAYING_A_TEXT] || 'Playing track A')
      .addClass(CLS_PLAYING_A).removeClass(CLS_PLAYING_B);
    group.audioA_sound.seek(group.audioB_sound.seek());
    group.audioB_sound.stop();
    group.audioA_sound.play();
  } else {
    // Switch tracks
    debug('Switching tracks: AudioA -> AudioB');
    group.btnB.attr('disabled','true');
    group.btnA.removeAttr('disabled');
    group.btnA.removeClass(CLS_PLAYING);
    group.btnB.addClass(CLS_PLAYING);
    jQuery(group.group).find(SEL_PLAYING_LBL)
      .text(group.group.dataset[DATASET_PLAYING_B_TEXT] || 'Playing track B')
      .addClass(CLS_PLAYING_B).removeClass(CLS_PLAYING_A);
    group.audioB_sound.seek(group.audioA_sound.seek());
    group.audioA_sound.stop();
    group.audioB_sound.play();
  }
}

function btnA_Clicked(event) {
  debug('audio[' + event.data.group + '].btnA[' + event.data.btn + '] was clicked');
  switchTracks(audio_groups[event.data.group]);
}

function btnB_Clicked(event) {
  debug('audio[' + event.data.group + '].btnB[' + event.data.btn + '] was clicked');
  switchTracks(audio_groups[event.data.group]);
}

function debug(msg) {
  if( DEBUG )
    console.debug(msg);
}
