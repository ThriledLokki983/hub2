<?php
define('WP_CACHE', false); // Added by WP Rocket
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link https://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'dhwz');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', '?H`^Q>oH{3^-~!|(1yM]QVSpB(`Emop2.Vdu=R7QZp;DFd8H:}bSe>Fux7dAc7E0');
define('SECURE_AUTH_KEY', '|nOw->7%y|.l%2gL,^8nI}2 S4S-QH?KMKFV_nI^$Pm+:zb4jLxr<+&`@a^e<Cp~');
define('LOGGED_IN_KEY', 'J8vce7E6leBAMGunyM=2}i.BOnGe0h1dJouGLJGuU]4Gsa6B.bkzUT?msDv{Om,6');
define('NONCE_KEY', 'c%]tYh^Dx/+CoaD ]l_=:RliO#Ir8Yc>D|lY6-6U.mc_z7t7qm!(j}/>F8vYU,;z');
define('AUTH_SALT', 'ugY4iy]NNVje^zEh@kr;q/>4^@^Q8Z]c1,I[<V`N(>Wih-ACi[)0[>H1=VVv:+4y');
define('SECURE_AUTH_SALT', '^jM#R]H-S|H=V`y0uB72 ~9}-I Onc2*Jtm~s|5LpII;)yCNC,i]$@Js>es# ,nw');
define('LOGGED_IN_SALT', 'sx(KGasvnK|<V9%OAsd[6dIo 0LrbT/TPGNU3L+&^z^{#d|cI}v]C@3nNq&-1$*O');
define('NONCE_SALT', ')h|h DXW$}a`i|<H]1FZl?t|8E$/WVb&R9,iwv5N}*|m4p,-ouifw6*bN-@&95-9');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'gzwp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('WP_DEBUG_LOG', false);

// define("FTP_HOST", "localhost");
// define("FTP_USER", "grafilux_ftp");
// define("FTP_PASS", "5X!4qz0k");
//define('FTP_BASE', '/httpdocs/site/');

define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_AUTO_UPDATE_CORE', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if (!defined('ABSPATH'))
    define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
