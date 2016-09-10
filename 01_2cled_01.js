/*
       +--------------------------------------------------------------+
       |                  (c) 2016, Antonio Duran                     |
       |                  antonio.duran@gmail.com                     |
       +--------------------------------------------------------------+
       | This  program  is  free  software:  you  can redistribute it |
       | and/or  modify it under the terms of the  GNU General Public |
       | License as published by the Free Software Foundation, either |
       | version  3  of  the License,  or (at your option)  any later |
       | version.                                                     |
       |                                                              |
       | This  program  is  distributed in  the hope  that it will be |
       | useful,  but WITHOUT ANY WARRANTY;  without even the implied |
       | warranty  of  MERCHANTABILITY  or  FITNESS FOR A  PARTICULAR |
       | PURPOSE.   See  the  GNU  General  Public  License for  more |
       | details.                                                     |
       |                                                              |
       | You  should  have received  a copy of the GNU General Public |
       | License    along    with    this    program.    If not,  see |
       | <http://www.gnu.org/licenses/>.                              |
       +--------------------------------------------------------------+

 +------------------------------------------------------------------------------
 | 1. Identification:
 |    Filename          : 01_2cled_01.js
 |    File Kind         : JavaScript Source File
 |    Author            : Antonio Duran
 |    Creation Date     : 08/09/2016
 |    Current Version   : 1.0
 +------------------------------------------------------------------------------
 | 2. Purpose:
 |    This program is a direct recoding in JavaScript of the dule_color_led.c
 |    that is provided together with Sunfounder's sensor kit for Raspberry Pi.
 |
 |    The original program is found at:
 |    https://github.com/sunfounder/SunFounder_SensorKit_for_RPi2/blob/master/C/01_dule_color_led/dule_color_led.c
 |
 |    The program uses wiringPi and softPwm. In this program I'll use rpio 
 |    and will use hardware PWM instead of software PWM.
 +------------------------------------------------------------------------------
 | 3. Revision History:
 |    Ver   When     Who      Why
 |    ----- -------- -------- --------------------------------------------------
 |    1.0   20160906 ADD      Initial implementation.
 +------------------------------------------------------------------------------
*/

//+-----------------------------------------------------------------------------
//| Imports
//+-----------------------------------------------------------------------------

var   rpio        = require('rpio');

//+-----------------------------------------------------------------------------
//| Constants & globals
//+-----------------------------------------------------------------------------

//|   Pins to use:
//|
//|          +------------------------------------------+
//|      (6) |                                          |
//|          |     +-------------------------------+    |    
//|          |     | (12)                          |    |    
//|    +-----|-----|-----------------------------+ |    | GND  +-----+
//|    | o o x o o x o o o o o o o o o o o o o o | | R  +------+     |
//|    | o o o o o o o o o o o o o o o o o x o o | +-----------+  O  |
//|    +-----------------------------------|-----+      +------+     |
//|                                        | (35)     G |      +-----+
//|                                        +------------+    
//|
//|   Red:     Physical 12 (GPIO 1)
//|   Green:   Physical 35 (GPIO 24)
//|
//|   Original program wires red led to GPIO 0 pin (physical pin 11) and the
//|   green led is wired to GPIO 1 pin (phys. pin 12). Since I will use hardware
//|   PWM, I should choose GPIO pins that pupport PWM so I will use the GPIO 1 
//|   (phys. 12) for the red led and GPIO 24 (phys. 35) for the green led.
//|
//|   Here is a description of the PWM enabled pins:
//|
//|   https://www.npmjs.com/package/rpio

const PIN_RED        = 12;
const PIN_GREEN      = 35;

//|   PWM setup
//|   CLOCK_DIVIDER sets the refresh rate of the PWM must be a power of 2 and 
//    the refresh rate is the quotient of the 19.2MHz/CLOCK_DIVIDER. Maximum 
//|   value of clock divider is 4096 which set a refresh rate of 4.8 kHz.
//|
//|   RANGE determines the maximum pulse width.
//|
//|   MAX_BRIGHTNESS is the maximum width for the LEDS. LEDS hit quickly the
//|   maximum brightness so I'll use a fraction of the maximum range.

const CLOCK_DIVIDER  = 8;     // 19.2 / 8 = 2.4 MHz
const RANGE          = 1024;
const MAX_BRIGHTNESS = 256;

//|   EXECUTIONS
//|   Number of executions in the loop.

const EXECUTIONS     = 5;

//|   SLEEP_MS
//|   Milliseconds to sleep.

const SLEEP_MS       = 500;

//+-----------------------------------------------------------------------------
//| The code
//+-----------------------------------------------------------------------------

//|   Initialize rpio module.

rpio.init({
      gpiomem: false,
      mapping: 'physical'});


//|   Enable PWM on the pins.

rpio.open(PIN_RED    , rpio.PWM);
rpio.open(PIN_GREEN  , rpio.PWM);

//|   Set the refresh rate.

rpio.pwmSetClockDivider(CLOCK_DIVIDER);

//|   Set the range.

rpio.pwmSetRange(PIN_RED   , RANGE);
rpio.pwmSetRange(PIN_GREEN , RANGE);

//|   Do the stuff (this is rather boring)

var red_brightness;
var green_brightness;

for (var i = 0; i < EXECUTIONS; i++) {

   console.log("Iteration: " + i);
      
   //|   Red ...
   
   red_brightness    = MAX_BRIGHTNESS;
   green_brightness  = 0;
   
   console.log("Red: " + red_brightness + ", Green: " + green_brightness);

   rpio.pwmSetData(PIN_RED    , red_brightness);
   rpio.pwmSetData(PIN_GREEN  , green_brightness);
   rpio.msleep(SLEEP_MS);
   
   //|   Green ...
   
   red_brightness    = 0;
   green_brightness  = MAX_BRIGHTNESS;

   console.log("Red: " + red_brightness + ", Green: " + green_brightness);

   rpio.pwmSetData(PIN_RED    , red_brightness);
   rpio.pwmSetData(PIN_GREEN  , green_brightness);
   rpio.msleep(SLEEP_MS);
   
   //|   Full red, full green.

   red_brightness    = MAX_BRIGHTNESS;
   green_brightness  = MAX_BRIGHTNESS;
   
   console.log("Red: " + red_brightness + ", Green: " + green_brightness);

   rpio.pwmSetData(PIN_RED    , red_brightness);
   rpio.pwmSetData(PIN_GREEN  , green_brightness);
   rpio.msleep(SLEEP_MS);
   
   //|   Full red, half green.
   
   red_brightness    = MAX_BRIGHTNESS;
   green_brightness  = MAX_BRIGHTNESS >> 1;

   console.log("Red: " + red_brightness + ", Green: " + green_brightness);

   rpio.pwmSetData(PIN_RED    , red_brightness);
   rpio.pwmSetData(PIN_GREEN  , green_brightness);
   rpio.msleep(SLEEP_MS);

   //|   Half red, half green.
   
   red_brightness    = MAX_BRIGHTNESS >> 1;
   green_brightness  = MAX_BRIGHTNESS >> 1;

   console.log("Red: " + red_brightness + ", Green: " + green_brightness);

   rpio.pwmSetData(PIN_RED    , red_brightness);
   rpio.pwmSetData(PIN_GREEN  , green_brightness);
   rpio.msleep(SLEEP_MS);
}

//|   Close pins

rpio.close(PIN_RED);
rpio.close(PIN_GREEN);

//+-----------------------------------------------------------------------------
//| EOF
//+-----------------------------------------------------------------------------

