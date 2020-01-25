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

import fs from 'fs';

/**
 * This interface provides the structure for the configuration loaded from a JSON file.
 */
interface Configuration {
    /**
     * URL to be requested for turning the light switch on or off.
     * Placeholders:
     * - ${state}: `true` to turn the switch on, `false` to turn the switch off
     */
    switchUrl: string;

    /**
     * URL to be requested for retrieving the sunrise and sunset.
     * Placeholders:
     * - ${date}: the current date in the format `YYYY-MM-DD`
     */
    daylightServiceUrl: string;
}

function loadConfiguration(): Configuration {
    let json = fs.readFileSync('/etc/terralight.json','utf8');
    let config: Configuration = JSON.parse(json);
    
    return config;
}

export const configuration = loadConfiguration();