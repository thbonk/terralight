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
import {configuration} from './Configuration';
import {currentState, saveState, State} from './State';
import {requestDaylight} from './Daylight';
import {requestSwitchState, turnSwitchOn, turnSwitchOff} from './Switch';

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
  // read sunrise and sunset
  let daylight = requestDaylight(config);
  
  state.today = new Date();
  state.today.setHours(0);
  state.today.setMinutes(0);
  state.today.setSeconds(0, 0);
  state.sunrise = daylight.sunrise;
  state.sunset = daylight.sunset;
}

// 4. read the current state of the switch
const switchIsOn = requestSwitchState(config);

// 5. switch logic:
if (!switchIsOn && isAfter(state.sunrise as Date) && !isAfter(state.sunset as Date)) {
  // - switch=0 && after sunrise && not after sunset: set switch=1
  turnSwitchOn(config);
} else if(switchIsOn && isAfter(state.sunset as Date)) {
  // - switch=1 && after sunset: set switch=0
  turnSwitchOff(config);
}

// 6. Save the current state
saveState(state);

log.info("Finished terralight...");

function isAfter(timestamp: Date): boolean {
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