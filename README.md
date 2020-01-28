# terralight [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/thbonk/terralight) 

TerraLight is a script to control the lights of a terrarium using Apple HomeKit and Homebridge.

## Installation

For now, terralight can only be installed from github:
```bash
npm install git+https://github.com/thbonk/terralight.git -g
```

## Configuration

### terralight

terralight expects a configuration file under the path `/etc/terralight.json`. That file must have the following structure:
```json
{
	"toggleSwitchUrl": "<URL>",
    "switchStateUrl": "<URL>",
	"daylightServiceUrl": "https://api.sunrise-sunset.org/json?lat=<LAT>&lng=<LNG>&date=${date}&formatted=0",
        "logicScriptPath": "/etc/terralight-control-logic.ts"
}
```
Key | Description
---- | ----
toggleSwitchUrl | This contains the URL to toggle the light switch on or off. The URL needs a placeholder `${state}` that will be replaced with the corresponding to turn the switch on (true) or off (false).
switchStateUrl | This contains the URL to retrieve the current status of the switch.
daylightServiceUrl | This is the URL to retrieve the sunrise and sunset times. Currently there is only the sunrise-sunset.org API supported. Make sure to add the longitude and lattitude of your location. The URL needs a placeholder `${date}` that will be replaced with the current date.
logicScriptPath | This is a path to a TypeScript script, that implements the logic for turning the light on or off. 

The logic script must have this structure:
```typescript
interface State {
    /**
     * The current date.
     */
    today: Date;

    /**
     * Timestamp of the last run
     */
    lastRunAt: Date;

    /**
     * Timestamp of the sunrise
     */
    sunrise: Date | undefined;

    /**
     * Timestamp of the sunset
     */
    sunset: Date | undefined;
}

({
    controlLogic: function (now: Date, state: State, switchIsOn: boolean, turnOn: () => void, turnOff: () => void) {
        // Your logic
    }
})
```