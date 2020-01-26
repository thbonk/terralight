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
import {dateWithTime} from './DateUtils';
import fs from 'fs';

const log = loggerFactory.getLogger("terralight.State");

export interface StateJSON {
    /**
     * The current date.
     */
    today: string;

    /**
     * Timestamp of the sunrise
     */
    sunrise: string;

    /**
     * Timestamp of the sunset
     */
    sunset: string;
}

/**
 * This interface provides the structure for the state loaded from a JSON file.
 */
export interface State {
    /**
     * The current date.
     */
    today: Date;

    /**
     * Timestamp of the sunrise
     */
    sunrise: Date | undefined;

    /**
     * Timestamp of the sunset
     */
    sunset: Date | undefined;
}

function loadState(): State {
    var state: State = { today: dateWithTime(0, 0, 0, 0), sunrise: undefined, sunset: undefined };

    try {
        let json = fs.readFileSync('/var/terralight/terralight.state','utf8');
        var stateJson: StateJSON = JSON.parse(json);

        if (stateJson.sunrise != undefined) {
            state.sunrise = new Date(stateJson.sunrise);
        }

        if (stateJson.sunset != undefined) {
            state.sunset = new Date(stateJson.sunset);
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
