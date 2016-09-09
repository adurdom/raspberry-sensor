raspberry-sensor
================

## Motivation
I've purchased a Sensor Kit for the Raspberry Pi from Sunfounder (https://github.com/sunfounder/SunFounder_SensorKit_for_RPi2). Code examples, at least those in C, are crappy at the best so I've decided to recode them in JavaScript using the rpio JavaScript module (https://github.com/jperkin/node-rpio).

## Naming convention

Program names are named following this convention: nn_[acro]_mm.js

* nn is the sequential number that uses SunFounder's for the examples.
* [acro] is an acronym that identifies the sensor programmed.
* mm is a program sequence number being 01 the number of the program that is a direct refactor of the Sunfounder's code.
