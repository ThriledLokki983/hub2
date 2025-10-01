<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wp_vrlocal_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'wbjl^/DXolC<HLJy2*?}NW3cD)~i;Rf_6KRCI^hN/^#G=b.r_]#W)6cH]l%znEY5' );
define( 'SECURE_AUTH_KEY',  'ZO:xFH9XB:+!*tL&9`aD#>xJzIVq%pJ&44<_-JN).vrwA}B=#}y)S>+xCLqS +@[' );
define( 'LOGGED_IN_KEY',    'I`gd(pq+pZ0uTx#GT8^fZNtwuw0zGz>HLP<w}C&G:YGTwH|M5u*zaZ;LvinBCw?B' );
define( 'NONCE_KEY',        '7iEXi:]h77$ET@i)> 4#{IjiX42oQQ::&ya*^HWy`6WvXThE8o7d7fFtb,MfrNoo' );
define( 'AUTH_SALT',        '&GkSkN._I&jC-i05PQ:{3egfOsv0WYy*ML.+_6sAAdppu&ZfUZ8Zjz/<<Fh02^SX' );
define( 'SECURE_AUTH_SALT', 'Uza1J$?=vcV2SyI,D]G|PsN?+eUBB-G-+x}z]6.aa[RA1Nm[S`e_2nP{@|Sdii1A' );
define( 'LOGGED_IN_SALT',   'S*kSm2f/%FF#Yzb;w36bK;!#&9-6,b8d-2`ul7m;Qm%02;IO!0wx->l$}8v,8;%~' );
define( 'NONCE_SALT',       'oyf9%Rl)k![rl-L8;qXx*,$Vy7`7D0J<&)gpnWbfAO;x6mQZa_kj)%NrxY8r:+d:' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'vr_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', true );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
