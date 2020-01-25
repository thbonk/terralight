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
import fs from 'fs';

const log = loggerFactory.getLogger("terralight.State");

/**
 * This interface provides the structure for the state loaded from a JSON file.
 */
export interface State {
    /**
     * The current date.
     */
    today: string | Date | undefined;

    /**
     * Timestamp of the sunrise
     */
    sunrise: string | Date | undefined;

    /**
     * Timestamp of the sunset
     */
    sunset: string | Date | undefined;
}

function loadState(): State {
    var state: State = { today: new Date(), sunrise: undefined, sunset: undefined };

    (state.today as Date).setHours(0);
    (state.today as Date).setMinutes(0);
    (state.today as Date).setSeconds(0, 0);

    try {
        let json = fs.readFileSync('/var/terralight/terralight.state','utf8');
        let state: State = JSON.parse(json);

        if (state.today != undefined) {
            state.today = new Date(state.today);
            state.today.setHours(0);
            state.today.setMinutes(0);
            state.today.setSeconds(0, 0);
        }

        if (state.sunrise != undefined) {
            state.sunrise = new Date(state.sunrise);
        }

        if (state.sunset != undefined) {
            state.sunset = new Date(state.sunset);
        }
    } catch {
        log.warn("Error when reading the current state; using defaults.");
    }

    return state;
}

export function saveState(state: State) {
    let json = JSON.stringify(state);

    fs.writeFileSync('/var/terralight/terralight.state', json, 'utf8');
}

export const currentState = loadState();
