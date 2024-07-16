import { PlatformAccessory } from 'homebridge';
import fetch, { AbortError } from 'node-fetch';

import { PhilipsTVSaphiOSPlatform } from '../platform.js';

type dataResponse = {
    powerstate: string;
};

/**
 * Return the status of the Philips TV: On or StandBy mean TV is power on,
 * we should obtain a timeout to detect a power off TV
 *
 * @param platform logger acces
 * @param accessory target device
 * @returns boolean
 */
const getTvPowerStatus = async (platform: PhilipsTVSaphiOSPlatform, accessory: PlatformAccessory) => {

  // AbortController was added in node v14.17.0 globally
  const AbortController = globalThis.AbortController || await import('abort-controller');

  const controller = new AbortController();
  // timeout of one sec
  const timeout = setTimeout(() => {
    controller.abort();
  }, 1000);

  try {
    const response = await fetch(
      `http://${accessory.context.device.ip}:1925/6/powerstate`,
      {signal: controller.signal},
    );
    const data: dataResponse = await response.json() as dataResponse;

    const status = ['On', 'Standby'].includes(data.powerstate);
    platform.log.debug('getTvPowerStatus ->', status, data.powerstate);

    return 1;
  } catch (error) {
    if (error instanceof AbortError) {
      platform.log.debug('getTvPowerStatus -> Request was aborted');
    }
  } finally {
    clearTimeout(timeout);
  }

  platform.log.debug('getTvPowerStatus ->', 0);
  return 0;
};

export default getTvPowerStatus;