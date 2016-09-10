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
 |    Filename          : 01_2cled_02.js
 |    File Kind         : JavaScript Source File
 |    Author            : Antonio Duran
 |    Creation Date     : 10/09/2016
 |    Current Version   : 1.0
 +------------------------------------------------------------------------------
 | 2. Purpose:
 |    A new 2-LED color program this will not use PWM. 
 +------------------------------------------------------------------------------
 | 3. Revision History:
 |    Ver   When     Who      Why
 |    ----- -------- -------- --------------------------------------------------
 |    1.0   20160910 ADD      Initial implementation.
 +------------------------------------------------------------------------------
*/

//+-----------------------------------------------------------------------------
//| Imports
//+-----------------------------------------------------------------------------

var   rpio        = require('rpio');
var   readline    = require('readline');

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
//|    | o o x o o x o o o o o o o o o o o o o o | | G  +------+     |
//|    | o o o o o x o o o o o o o o o o o o o o | +-----------+  O  |
//|    +-----------|-----------------------------+      +------+     |
//|                | (11)                             R |      +-----+
//|                +------------------------------------+    
//|
//|
//|   Red:     Physical 11 (GPIO 0)
//|   Green:   Physical 12 (GPIO 1)

const PIN_RED        = 11;          //| GPIO 0
const PIN_GREEN      = 12;          //| GPIO 1

//|   Statuses

const STATUS_OFF        = 0;        //| Led is off
const STATUS_RED_ON     = 1;        //| Red led is on
const STATUS_GREEN_ON   = 2;        //| Green led is on

//|   Interface for handling console I/O.

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

//|   Status of the led (initially off).

var   theStatus         = STATUS_OFF;

//+-----------------------------------------------------------------------------
//| Functions
//+-----------------------------------------------------------------------------

//|   openPins
//|   Initializes pins.
 
function openPins() {
   console.log('>>> Opening pins ...');

   rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
   rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
}

//|   closePins
//|   Closes pins leaving the board into its initial state.

function closePins() {
   console.log('>>> Closing pins ...');

   rpio.close(PIN_RED);
   rpio.close(PIN_GREEN);
}

//|   switchGreen
//|   Switches on/off the green led.
 
function switchGreen() {
   
   if (theStatus & STATUS_GREEN_ON) {      
      console.log('>>> Switching off green');
      rpio.write(PIN_GREEN, rpio.LOW);
      theStatus &= (~ STATUS_GREEN_ON);         
   }
   else {
      console.log('>>> Switching on green');
      rpio.write(PIN_GREEN, rpio.HIGH);
      theStatus |= STATUS_GREEN_ON;         
   }
}   

//|   switchRed
//|   Switches on/off the red led.
 
function switchRed() {   
   if (theStatus & STATUS_RED_ON) {
      console.log('>>> Switching off red');
      rpio.write(PIN_RED, rpio.LOW);
      theStatus &= (~ STATUS_RED_ON);         
   }
   else {
      console.log('>>> Switching on red');
      rpio.write(PIN_RED, rpio.HIGH);
      theStatus |= STATUS_RED_ON;         
   }
}   

//|   switchOffEither
//|   Switches off either led.

function switchOffEither() {   
   if (theStatus & STATUS_RED_ON) {
      console.log('>>> Switching off red');
      rpio.write(PIN_RED, rpio.LOW);
   }

   if (theStatus & STATUS_GREEN_ON) {
      console.log('>>> Switching off green');
      rpio.write(PIN_GREEN, rpio.LOW);
   }

   theStatus = STATUS_OFF;
}

//|   printStatus
//|   Output current status.
 
function printStatus() {
   if (theStatus === STATUS_OFF) {
      console.log('>>> Red led is off');
      console.log('>>> Green led is off');
      return;
   }
   
   if (theStatus & STATUS_RED_ON) {
      console.log('>>> Red led is on');
   }
   else {
      console.log('>>> Red led is off');
   }

   if (theStatus & STATUS_GREEN_ON) {
      console.log('>>> Green led is on');
   }
   else {
      console.log('>>> Green led is off');
   }
}      

//|   printHelp
//|   Prints help message.

function printHelp() {
   console.log('Valid options (case insensitive):');
   console.log('   r       => Switch on red LED.');
   console.log('   g       => Switch on green LED.');
   console.log('   o       => Switch off either LED.');
   console.log('   s       => Print status.');
   console.log('   h, ?    => Print help message.');
   console.log('   x       => Exit program.');
}

//+-----------------------------------------------------------------------------
//| The code
//+-----------------------------------------------------------------------------

//|   Initialize GPIO

openPins();

//|   Set prompt and display it.

rl.setPrompt('Option> ');
rl.prompt();

//|   Process input line

rl.on('line', function(line) {
   switch (line.trim().charAt(0)) {
      case 'g':
      case 'G':
         switchGreen();         
         rl.prompt();
         
         break;

      case 'h':
      case 'H':
      case '?':
         printHelp();
         rl.prompt();
         
         break;
         
      case 'r':
      case 'R':
         switchRed();
         rl.prompt();
         
         break;
         
      case 'o':
      case 'O':
         switchOffEither();
         rl.prompt();
         
         break;
         
      case 'x':
      case 'X':
         rl.close();
         break;

      case 's':
      case 'S':
         printStatus();
         rl.prompt();
         break;
              
      default:
         console.log('>>> Invalid option: ' + line.trim().charAt(0));
         printHelp();
         rl.prompt();
         break;
   }
});

rl.on('close', function() {
   closePins();
   console.log('>>> Good bye!');
   process.exit(0);
});

//+-----------------------------------------------------------------------------
//| EOF
//+-----------------------------------------------------------------------------
