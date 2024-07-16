import { PlatformAccessory } from 'homebridge';
import fetch, { AbortError } from 'node-fetch';

import { PhilipsTVSaphiOSPlatform } from '../platform.js';

type dataResponse = {
    powerstate: string;
};

/**
 * Set the power of the TV off by sending StandBy signal
 *
 * @param platform logger acces
 * @param accessory target device
 * @returns boolean success
 */
const setTvPowerStatusOff = async (platform: PhilipsTVSaphiOSPlatform, accessory: PlatformAccessory) => {

  // AbortController was added in node v14.17.0 globally
  const AbortController = globalThis.AbortController || await import('abort-controller');

  const controller = new AbortController();
  // timeout of one sec
  const timeout = setTimeout(() => {
    controller.abort();
  }, 1000);

  try {
    const response = await fetch(
      `http://${accessory.context.device.ip}:1925/6/input/key`,
      {
        method: 'post',
        body: JSON.stringify({
          'key': 'Standby',
        }),
        signal: controller.signal,
      },
    );
    const data: dataResponse = await response.json() as dataResponse;

    // commented below: no matter status is returned, if there is a response, TV is power On
    // return ['On', 'StandBy'].includes(data.powerstate);
    platform.log.debug('setTvPowerStatusOff ->', data);

    return true;
  } catch (error) {
    if (error instanceof AbortError) {
      platform.log.debug('setTvPowerStatusOff -> Request was aborted');
    }
  } finally {
    clearTimeout(timeout);
  }

  platform.log.debug('setTvPowerStatusOff ->', false);
  return false;
};

export default setTvPowerStatusOff;