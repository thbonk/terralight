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

import {factory} from './LoggerConfig';
import {configuration} from './Configuration';

const log = factory.getLogger("terralight.main");

log.info("Starting terralight...");

// Program logic
// 1. read the configuration
const config = configuration;

// 2. read the current state of this script

// 3. if state is outdated, read the sunrise and sunset times for today
//    - the state is outdated, if now.date > state.date
// 4. read the current state of the switch
// 5. switch logic:
//    - switch=0 && after sunrise: set switch=1
//    - switch=1 && after sunrise: do nothing
//    - switch=1 && after sunset: set switch=0
//    - switch=0 && after sunset: do nothing

log.info("Finished terralight...");
