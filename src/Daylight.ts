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
import {loggerFactory} from './LoggerConfig';
import { dateWithTime } from './DateUtils';

const log = loggerFactory.getLogger("terralight.Daylight");

interface DaylightResponseResult {
    sunrise: Date;
    sunset: Date;
    solar_noon: Date;
    day_length: number;
    civil_twilight_begin: Date;
    civil_twilight_end: Date;
    nautical_twilight_begin: Date;
    nautical_twilight_end: Date;
    astronomical_twilight_begin: Date;
    astronomical_twilight_end: Date;
};

interface DaylightResponse {
    results: DaylightResponseResult;
    status: string;
}

export interface Daylight {
    sunrise: Date;
    sunset: Date;
}

export function requestDaylight(config: Configuration): Daylight {
    let date = formattedDate();
    let url = config.daylightServiceUrl.replace('${date}', date);
    let response = restClient.get(url);
    let json = JSON.stringify(response["body"]);
    let daylightResponse: DaylightResponse = JSON.parse(json);
    let sunrise = new Date(daylightResponse.results.sunrise);
    let sunset = new Date(daylightResponse.results.sunset);

    log.info(`DaylightResponse is ${json}`)
    
    return {
        sunrise: sunrise, 
        sunset: sunset
    };
}

function formattedDate(): string {
    let now = new Date();

    return now.getFullYear() + '-' + leftpad(now.getMonth() + 1) + '-' + leftpad(now.getDate());
}

function leftpad(val: number, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }