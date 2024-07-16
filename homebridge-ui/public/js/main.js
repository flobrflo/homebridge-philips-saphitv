/*global $, homebridge :writable*/

let configs = [];
let tv = {};
let repairIndex = -1;

const validate = {
  mac: /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/,
  ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  pin: /^[0-9]{4}$/,
};

$('.startPairingProcess').each(function () {
  $(this).on('click', () => {
    $('.card').hide();
    $('#pairing').show();
  });
});

$('#parameterEditor').on('click', () => {
  $('.card').hide();
  homebridge.showSchemaForm();
});

$('#startPair').on('click', async () => {
  if (!validate.ip.test($('#ip').val())) {
    homebridge.toast.error('There is no valid ip configured for this tv!', 'Error');
    return;
  }

  if (!$('#name').val()) {
    homebridge.toast.error('Missing name', 'Error');
    return;
  }

  if ($('#mac').val() && !validate.mac.test($('#mac').val())) {
    homebridge.toast.error('There is no valid MAC Address configured for this tv!', 'Error');
    return;
  }

  try {
    tv['uniqueId'] = 'PhilipsTVSaphiOSPlatform_' + $('#name').val(),
    tv['ip'] = $('#ip').val(),
    tv['mac'] = $('#mac').val(),
    tv['name'] = $('#name').val(),
    tv['sources'] = $('#sources').is(':checked'),
    tv['hdmi1'] = $('#hdmi1').val(),
    tv['hdmi2'] = $('#hdmi2').val(),
    tv['hdmi3'] = $('#hdmi3').val();

    if (repairIndex >= 0) {
      configs[0].tvs[repairIndex] = tv;
    } else {
      configs[0].tvs.push(tv);
    }

    await homebridge.updatePluginConfig(configs);
    await homebridge.savePluginConfig();

    // end pair tv so reset index if it's setted
    repairIndex = -1;

    $('.card').hide();
    $('#pairSuccess').show();

  } catch (err) {
    homebridge.toast.error(err.message, 'Error');
  }
});

(async () => {
  try {
    configs = await homebridge.getPluginConfig();
    if (!configs.length) {
      configs = [{
        'tvs': [],
      }];
    } else {
      configs[0].tvs.forEach((tv, index) => {
        $('#tvs').html(
          '<button id="editTv' + index + '" class="btn center-it tvEdit">Edit "' + tv.name + '"</button><br/>'
                    + $('#tvs').html());
      });

      configs[0].tvs.forEach((tv, index) => {
        $('#editTv' + index).on('click', () => {
          $('.card').hide();
          $('#pairing').show();

          repairIndex = index;
          const repairTv = configs[0].tvs[repairIndex];

          if (repairTv.ip) {
            $('#ip').val(repairTv.ip);
          }

          if (repairTv.mac) {
            $('#mac').val(repairTv.mac);
          }

          if (repairTv.name) {
            $('#name').val(repairTv.name);
          }

          if (repairTv.sources) {
            $('#sources').prop('checked', repairTv.sources);
          }

          if (repairTv.hdmi1) {
            $('#hdmi1').val(repairTv.hdmi1);
          }
          if (repairTv.hdmi2) {
            $('#hdmi2').val(repairTv.hdmi2);
          }
          if (repairTv.hdmi3) {
            $('#hdmi3').val(repairTv.hdmi3);
          }
        });
      });
    }
    $('#connectNewTV').on('click', () => {
      $('.card').hide();
      tv = {};
      $('#instructions').show();
    });
    $('.card').hide();
    $('#welcome').show();
  } catch (e){
    console.log('ERROR', e);
  }
})();