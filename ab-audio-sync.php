<?php
/*
Plugin Name: A/B Audio Sync
Plugin URI: https://github.com/01000101/wordpress-ab-audio-sync
Description: Allows A/B comparison of 2 audio streams as a WordPress plugin
Version: 1.0.0
Author: Joshua Cornutt
Author URI: https://joscor.com
License: MIT
*/

function audio_sync_front_scripts() {
  wp_enqueue_script('jquery');
  wp_enqueue_script('device-js', plugins_url('libs/device/device.min.js', __FILE__));
  wp_enqueue_script('howler-js', plugins_url('libs/howler/howler.core.min.js', __FILE__));
  wp_enqueue_script('ab-audio-sync', plugins_url('ab-audio-sync.js', __FILE__), array('jquery'));
}

add_action( 'wp_enqueue_scripts', 'audio_sync_front_scripts' );
