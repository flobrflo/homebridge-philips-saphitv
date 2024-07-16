import { PlatformAccessory, CharacteristicValue } from 'homebridge';
import fetch from 'node-fetch';

import { PhilipsTVSaphiOSPlatform } from '../platform.js';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Set the power of the TV off by sending StandBy signal
 *
 * @param platform logger acces
 * @param accessory target device
 * @param value source
 * @returns boolean success
 */
const setTvSource = async (
  platform: PhilipsTVSaphiOSPlatform, accessory: PlatformAccessory, value: CharacteristicValue) => {
  try {
    platform.log.debug('setTvSource call Source');
    await fetch(
      `http://${accessory.context.device.ip}:1925/6/input/key`,
      {
        method: 'post',
        body: JSON.stringify({
          'key': 'Source',
        }),
      },
    );
    await sleep(400);

    for(let moveRight = 8; moveRight >= 1; moveRight--) {
      platform.log.debug('setTvSource call CursorRight');
      await fetch(
        `http://${accessory.context.device.ip}:1925/6/input/key`,
        {
          method: 'post',
          body: JSON.stringify({
            'key': 'CursorRight',
          }),
        },
      );
      await sleep(200);
    }

    let moveLeft = 0;
    switch (value) {
      case 1: // HDMI1
        moveLeft = 5;

        break;
      case 2: // HDMI2
        moveLeft = 4;

        break;
      case 3: // HDMI3
        moveLeft = 3;

        break;
      default:
    }

    if (moveLeft > 0) {
      for(moveLeft; moveLeft>=1; moveLeft--) {
        platform.log.debug('setTvSource call CursorLeft');
        await fetch(
          `http://${accessory.context.device.ip}:1925/6/input/key`,
          {
            method: 'post',
            body: JSON.stringify({
              'key': 'CursorLeft',
            }),
          },
        );
        await sleep(200);
      }
    }

    platform.log.debug('setTvSource call Confirm');
    await fetch(
      `http://${accessory.context.device.ip}:1925/6/input/key`,
      {
        method: 'post',
        body: JSON.stringify({
          'key': 'Confirm',
        }),
      },
    );

    return true;
  } catch (error) {
    platform.log.error('setTvSource error -> ', error);
  }

  platform.log.debug('setTvSource ->', false);
  return false;
};

export default setTvSource;