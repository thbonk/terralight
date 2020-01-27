/*
    Copyright 2020 Thomas Bonk
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
      http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import {loggerFactory} from './LoggerConfig';
import {configuration, Configuration} from './Configuration';
import {currentState, saveState, State} from './State';
import {requestDaylight} from './Daylight';
import {requestSwitchState, turnSwitchOn, turnSwitchOff} from './Switch';
import {dateWithTime} from './DateUtils';
import fs from 'fs';
import * as ts from 'typescript';

type SwitchFunctionType = (config: Configuration) => void;

const log = loggerFactory.getLogger("terralight.main");

log.info("Starting terralight...");

// Program logic
// 1. read the configuration
const config = configuration;

// 2. read the current state of this script
var state = currentState;

// 3. if state is outdated, read the sunrise and sunset times for today
//    - the state is outdated, if now.date > state.date
if (stateIsOutdated(state)) {
  log.info('Current state is outdated, updating the state');

  // read sunrise and sunset
  let daylight = requestDaylight(config);
  
  state.today = dateWithTime(0, 0, 0, 0);
  state.sunrise = daylight.sunrise;
  state.sunset = daylight.sunset;
}

log.info(`The current state is ${JSON.stringify(state)}`);

// 4. read the current state of the switch
const switchIsOn = requestSwitchState(config);

log.info('The switch status is ' + (switchIsOn ? 'on' : 'off'));

// 5. switch logic:
callControlLogic(state, switchIsOn, turnSwitchOn, turnSwitchOff, config);

/*
if (!switchIsOn && nowIsAfter(state.sunrise as Date) && !nowIsAfter(state.sunset as Date)) {
  // - switch=0 && after sunrise && not after sunset: set switch=1
  log.info(`Turning switch on at ${new Date()}`);

  turnSwitchOn(config);

  log.info('Turned switch on');
} else if(switchIsOn && nowIsAfter(state.sunset as Date)) {
  // - switch=1 && after sunset: set switch=0
  log.info(`Turning switch off at ${new Date()}`);

  turnSwitchOff(config);

  log.info('Turned switch off');
}*/

// 6. Save the current state
log.info('Saving the current state');
saveState(state);

log.info("Finished terralight...");

function callControlLogic(
  state: State, 
  switchIsOn: boolean, 
  turnOn: SwitchFunctionType, 
  turnOff: SwitchFunctionType,
  config: Configuration) {

    let currentTime = new Date()
    let source = fs.readFileSync(config.logicScriptPath, 'utf8');
    let result = ts.transpile(source);
    let runnable: any = eval(result);

    runnable
      .controlLogic(currentTime, state, switchIsOn, () => turnOn(config), () => turnOff(config));


  /*let currentTime = new Date();

  eval(
    source
    + "\n"
    + "controlLogic(currentTime, state, switchIsOn, () => turnOn(config), () => turnOff(config));"
  );*/
}

function nowIsAfter(timestamp: Date): boolean {
  let now = new Date();
  let result = now.getTime() >= timestamp.getTime();

  return result;
}

function stateIsOutdated(state: State): boolean {
  let now = new Date();
  let nowMillis = now.getTime();
  let todayMillis = (state.today as Date).getTime();
  let difference = nowMillis - todayMillis;

  return (difference > 86400000) 
          || (state.sunrise == undefined) 
          || (state.sunset == undefined);
}