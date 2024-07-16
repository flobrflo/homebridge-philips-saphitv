import { PlatformAccessory } from 'homebridge';
import fetch, { AbortError } from 'node-fetch';
import wol from 'wol';

import { PhilipsTVSaphiOSPlatform } from '../platform.js';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Set the power of the TV on by sending StandBy signal
 *
 * @param platform logger acces
 * @param accessory target device
 * @returns boolean success
 */
const setTvPowerStatusOn = async (platform: PhilipsTVSaphiOSPlatform, accessory: PlatformAccessory) => {
  try {
    await wol.wake(accessory.context.device.mac, { address: accessory.context.device.ip }, (err, res) => {
      if (err) {
        platform.log.error('setTvPowerStatusOn error WOL -> ', err);
      }
      platform.log.debug('setTvPowerStatusOn WOL -> ', JSON.stringify(res));
    });

    await sleep(3000);
  } catch (error) {
    platform.log.error('setTvPowerStatusOn error -> ', error);
  }

  // AbortController was added in node v14.17.0 globally
  const AbortController = globalThis.AbortController || await import('abort-controller');

  const controller = new AbortController();
  // timeout of one sec
  const timeout = setTimeout(() => {
    controller.abort();
  }, 1000);

  try {
    platform.log.debug('setTvPowerStatusOn call On');
    const response2 = await fetch(
      `http://${accessory.context.device.ip}:1925/6/input/key`,
      {
        method: 'post',
        body: JSON.stringify({
          'key': 'Home',
        }),
        signal: controller.signal,
      },
    );
    const data2: string = await response2.text();
    platform.log.debug('setTvPowerStatusOn data2 ->', data2);

    return true;
  } catch (error) {
    if (error instanceof AbortError) {
      platform.log.debug('setTvPowerStatusOn -> Request was aborted');
    } else {
      platform.log.error('setTvPowerStatusOn error -> ', error);
    }
  } finally {
    clearTimeout(timeout);
  }

  platform.log.debug('setTvPowerStatusOn ->', false);
  return false;
};

export default setTvPowerStatusOn;