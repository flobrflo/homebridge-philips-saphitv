<p align="center">

<img src="https://github.com/homebridge/branding/raw/latest/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

<span align="center">

# Homebridge Philips SaphiTV

</span>

This is made to manage a Philips TV whick use SaphiOS.
This plugin is inspired by other great package: [`Homebrige Philips androidTv`](https://github.com/konradknitter/homebridge-philips-android-tv)

I have create mine cause other plugin doesn't work for my model: Philips `43PUS6703`.

With this package we actually can manage On/Off status and Sources HDMI.

### Installation

- Install homebridge using: npm install -g homebridge
- Install this plugin using: npm install -g  `homebridge-philips-saphitv`
- Update your configuration.

Prefer use homebridgeUI to configure plugin.

### Json Configuration
Here is a basic configuration for a philipsTV using `SaphiOS`
````
{
    "tvs": [
        {
            "uniqueId": "PhilipsTVSaphiOSPlatform_TV",
            "ip": "192.168.0.123",
            "mac": "FF:FB:DD:FF:CC:00",
            "name": "TV",
            "sources": true,
            "hdmi1": "CustomHDMI1",
            "hdmi2": "HDMI2",
            "hdmi3": "HDMI3"
        }
    ],
    "platform": "PhilipsTVSaphiOS"
}
````

uniqueId | __
------------- | -------------
PhilipsTVSaphiOSPlatform_XXX | You have to define a unique value if you use to do the configuration manualy.


IP | __
------------- | -------------
192.168.0.123 | Manage IP by displayed it onto your TV in Network Configuration

MAC | __
------------- | -------------
FF:FB:DD:FF:CC:00 | Manage MAC Adress by displayed it onto your TV in Network Configuration


Sources  | __
------------- | -------------
true  | Display a drop down to change source of the TV
false | use this if you only want manage On/Off status

HDMI  | __
------------- | -------------
hdmi1 | You can rename the input or let it set to HDMI1 by default
hdmi2 | You can rename the input or let it set to HDMI2 by default
hdmi3 | You can rename the input or let it set to HDMI3 by default