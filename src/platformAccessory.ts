import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { PhilipsTVSaphiOSPlatform } from './platform.js';
import getTvPowerStatus from './api/getTvPowerStatus.js';
import setTvPowerStatusOff from './api/setTVPowerStatusOff.js';
import setTvPowerStatusOn from './api/setTVPowerStatusOn.js';
import setTvSource from './api/setTVSource.js';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class PhilipsTVSaphiOSAccessory {
  private service: Service;

  constructor(
    private readonly platform: PhilipsTVSaphiOSPlatform,
    private accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Philips')
      .setCharacteristic(this.platform.Characteristic.Model, 'Ambilight TV')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Philips-Serial');

    // add the tv service
    this.service = this.accessory.getService(accessory.context.device.name) ||
        this.accessory
          .addService(this.platform.Service.Television, accessory.context.device.name)
          .setCharacteristic(
            this.platform.Characteristic.SleepDiscoveryMode, this.platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.ConfiguredName, accessory.context.device.name);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(this.setTvPowerStatus.bind(this)) // SET - bind to the `setTvPowerStatus` method below
      .onGet(this.getTvStatus.bind(this));     // GET - bind to the `getTvStatus` method be

    if (!accessory.context.device.sources) {
      return;
    }

    // Ajoutez l'événement pour la sélection de la source d'entrée
    this.service.getCharacteristic(this.platform.Characteristic.ActiveIdentifier)
      .on('set', this.handleTvSource.bind(this));

    // Déclarez les sources HDMI
    const sources = [
      this.createInputSource(accessory.context.device.hdmi1 || 'HDMI1', 1, 'hdmi1'),
      this.createInputSource(accessory.context.device.hdmi2 || 'HDMI2', 2, 'hdmi2'),
      this.createInputSource(accessory.context.device.hdmi3 || 'HDMI3', 3, 'hdmi3'),
    ];

    // Ajoutez les sources au service TV
    sources.forEach(source => {
      this.service.addLinkedService(source);
    });
  }

  /**
   * Create input source
   *
   * @param name
   * @param identifier
   * @returns
   */
  createInputSource(name: string, identifier: number, subtype: string) {
    const uuid = this.platform.api.hap.uuid.generate(subtype);
    const inputSource = this.accessory.getService(name) ||
        this.accessory.addService(this.platform.Service.InputSource, name, uuid);

    inputSource
      .setCharacteristic(this.platform.Characteristic.Identifier, identifier)
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, name)
      .setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.CONFIGURED)
      .setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
    return inputSource;
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setTvPowerStatus(value: CharacteristicValue) {
    this.platform.log.debug('Set setTvPowerStatus On ->', value);
    // implement your own code to turn your device on/off
    if (value) {
      setTvPowerStatusOn(this.platform, this.accessory);
    } else {
      setTvPowerStatusOff(this.platform, this.accessory);
    }
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possible. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getTvStatus(): Promise<CharacteristicValue> {
    return getTvPowerStatus(this.platform, this.accessory) as Promise<CharacteristicValue>;
  }

  /**
   * Handle "SET" requests from HomeKit
   */
  async handleTvSource(value: CharacteristicValue) {
    this.platform.log.debug('handleTvSource ->', value);
    setTvSource(this.platform, this.accessory, value);
  }
}
