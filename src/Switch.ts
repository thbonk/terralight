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

const restClient = require('sync-rest-client');
import {Configuration} from './Configuration';

interface SwitchState {
    success: boolean;
    state: boolean;
};

export function requestSwitchState(config: Configuration): boolean {
    let response = restClient.get(config.switchStateUrl);
    let json = JSON.stringify(response["body"]);
    let switchState: SwitchState = JSON.parse(json);

    return switchState.state;
}

export function turnSwitchOn(config: Configuration) {
    let url = config.toggleSwitchUrl.replace('${state}', 'true');

    restClient.put(url);
}

export function turnSwitchOff(config: Configuration) {
    let url = config.toggleSwitchUrl.replace('${state}', 'false');

    restClient.put(url);
}
