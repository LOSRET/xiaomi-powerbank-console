import type { MessageKey } from './zh-CN'

export const en: Record<MessageKey, string> = {
  'app.title': 'Xiaomi Power Bank Details',
  'app.kicker': 'WebHID · read locally',
  'app.description':
    'Connect your power bank to inspect battery health, cycle count, temperature and cell data.',

  'home.title': 'Connect your Xiaomi power bank',
  'home.body':
    'Connect your Xiaomi power bank to this computer to view device details and anomaly logs.',
  'home.offline': 'No driver installation',
  'home.private': 'Data never leaves the browser',
  'home.demoLabel': 'No device?',
  'home.supportHint': 'Desktop Chrome, Edge or Opera required',
  'home.openGuide': 'Open troubleshooting guide',

  'home.aboutTitle': 'About reading Xiaomi power bank data',
  'home.aboutBody':
    'This tool talks to a Xiaomi power bank directly from your browser over WebHID. Use it to check battery status, estimate battery health, or inspect records stored on the device when something looks wrong.',
  'home.aboutReadTitle': 'What you can read',
  'home.aboutReadBody':
    'Charge level and power state, battery health, cycle count, temperature, pack voltage, current, cell voltages, cell IDs and anomaly records.',
  'home.aboutSupportTitle': 'Supported models and connection',
  'home.aboutSupportBody':
    'Supports Xiaomi magnetic and integrated-cable power banks. Use the designated USB-C port and press the power bank button 8 times within 4 seconds to enter data transfer mode.',
  'home.aboutPrivacyTitle': 'Processed locally',
  'home.aboutPrivacyBody':
    'No backend, and device data is never uploaded. Only read commands are sent by default; Qi2.2 switching is limited to WPB1025S. Page views are counted anonymously by a third-party script that never reads device data.',
  'home.aboutModels': 'View supported models and ports',
  'home.aboutGuide': 'Read the troubleshooting guide',

  'notes.title': 'Reading the numbers',
  'notes.healthTitle': 'Battery health',
  'notes.healthBody':
    'An estimate of current capacity relative to a new pack. It changes slowly with use.',
  'notes.cyclesTitle': 'Cycle count',
  'notes.cyclesBody':
    'One full charge and discharge counts as one cycle, not one cable connection.',
  'notes.temperatureTitle': 'Temperature',
  'notes.temperatureBody':
    'The normal operating range is {range}. Above the limit, the device pauses charging or discharging to protect itself.',

  'nav.device': 'Device',
  'nav.models': 'Supported models',
  'nav.guide': 'Troubleshooting',
  'nav.skip': 'Skip to main content',

  'connect.button': 'Connect',
  'connect.connecting': 'Connecting',
  'connect.disconnect': 'Disconnect',
  'connect.demo': 'View demo data',
  'connect.supported': 'View supported models and port details',

  'how.title': 'How to view',
  'how.step1.title': 'Step 1',
  'how.step1.desc':
    'Use a USB-C cable to connect the designated USB-C port on your Xiaomi power bank to your computer.',
  'how.step1.portTip': 'The designated USB-C port varies by model.',
  'how.step1.cableTip':
    'Please use a USB-C cable that supports data transfer (one that can transfer files between your phone and computer).',
  'how.step2.title': 'Step 2',
  'how.step2.desc':
    'Press the button on the power bank 8 times in quick succession to enter data transfer mode.',
  'how.step3.title': 'Step 3',
  'how.step3.desc':
    'Click the Connect button below, then select “XiaomiPowerBank” in the pairing pop-up to complete the connection.',
  'how.step3.tip': 'Once connected, you can view your device details.',

  'dashboard.connectedTitle': 'Xiaomi Power Bank · Connected',
  'dashboard.demoTitle': 'Xiaomi Power Bank · Demo mode',
  'dashboard.lastUpdated': 'Updated {time}',
  'dashboard.live': 'Live',
  'dashboard.demo': 'Demo',
  'dashboard.overview': 'Battery overview',
  'dashboard.basicInfo': 'Basic info',
  'dashboard.batteryInfo': 'Battery info',
  'dashboard.temperature': 'Battery temperature',
  'dashboard.cells': 'Cell info',
  'dashboard.productName': 'Product name',
  'dashboard.productModel': 'Product model',
  'dashboard.deviceSn': 'Device SN',
  'dashboard.batteryHealth': 'Battery health',
  'dashboard.cycleCount': 'Cycle count',
  'dashboard.batteryModel': 'Battery model',
  'dashboard.batteryManufacturer': 'Battery manufacturer',
  'dashboard.productionDate': 'Production date',
  'dashboard.totalVoltage': 'Total pack voltage',
  'dashboard.current': 'Battery current',
  'dashboard.cellCount': 'Cell count',
  'dashboard.cell': 'Cell',
  'dashboard.cellVoltage': 'Voltage',
  'dashboard.cellSerial': 'Cell SN',
  'dashboard.temperatureSensor': 'Sensor {index}',
  'dashboard.noTemperature': 'No temperature data. Try refreshing.',
  'dashboard.noCells': 'No data. Connect a device and refresh.',
  'dashboard.temperatureRange':
    'Normal operating temperature: {range}. Brief temperature spikes are normal.',
  'dashboard.temperatureProtect':
    'If the temperature gets too high, the power bank will trigger overheat protection and stop charging/discharging. There is no need to worry.',
  'dashboard.anomalyTab': 'Anomaly log',
  'dashboard.detailsTab': 'Details',
  'dashboard.historyLoading': 'Reading anomaly records…',
  'dashboard.historyHint': 'Records are stored on the power bank. The most recent 100 are shown.',
  'dashboard.historyTime': 'Time',
  'dashboard.historyType': 'Type',
  'dashboard.historyValue': 'Value',
  'dashboard.historyEmptyTitle': 'No anomaly records',
  'dashboard.historyEmptyBody': 'This device has not stored any anomaly events.',
  'dashboard.serialUnavailable': 'SN is not available for this model',
  'dashboard.modelUnknown': 'Unknown model',
  'dashboard.demoNotice':
    'You are viewing simulated data to preview the interface and interactions.',
  'dashboard.demoAction': 'Exit demo',
  'dashboard.port': 'Designated USB-C port',
  'dashboard.protocolLog': 'HID communication log',
  'dashboard.protocolLogHint':
    'Raw frames sent to and received from this computer, useful for checking the protocol.',
  'dashboard.protocolEmpty':
    'No frames yet. Handshake and data frames appear here after connecting.',
  'dashboard.protocolClear': 'Clear',
  'dashboard.protocolCopy': 'Copy log',
  'dashboard.protocolCopied': 'Communication log copied',
  'dashboard.protocolFrames': '{count} frames',
  'dashboard.protocolCrcErrors': '{count} CRC errors',
  'dashboard.protocolTx': 'TX',
  'dashboard.protocolRx': 'RX',
  'dashboard.protocolInfo': 'INFO',
  'dashboard.protocolError': 'ERROR',
  'dashboard.protocolDevice': 'Device identity',
  'dashboard.protocolVidPid': 'VID / PID',
  'dashboard.protocolConnection': 'Connection',
  'dashboard.protocolWebHid': 'WebHID',
  'dashboard.protocolDemo': 'Local simulation',
  'dashboard.noSerial': 'SN hidden for this model',
  'dashboard.dataErrorTitle': 'Could not read device data',
  'dashboard.dataErrorBody':
    'The device is connected but did not return battery info. Reconnect it, or make sure data transfer mode is enabled.',
  'dashboard.qi2.title': 'Qi2.2 wireless charging',
  'dashboard.qi2.enabled': 'On',
  'dashboard.qi2.disabled': 'Off',
  'dashboard.qi2.onHint': 'Qi2.2 25W wireless charging is active.',
  'dashboard.qi2.offHint': 'Default wireless charging is active. You can enable Qi2.2 25W.',
  'dashboard.qi2.unavailable': 'Could not read Qi2.2 status. Refresh to try again.',

  'status.charging': 'Charging',
  'status.discharging': 'Discharging',
  'status.idle': 'Idle',
  'status.unknown': 'Unknown',
  'status.disconnected': 'Not connected',

  'fault.normal': 'Normal',
  'fault.overvoltage': 'Battery overvoltage',
  'fault.undervoltage': 'Battery undervoltage',
  'fault.overCurrent': 'Overcurrent',
  'fault.shortCircuit': 'Short circuit',
  'fault.cellVoltageDifference': 'Cell voltage difference',
  'fault.cellOvervoltage': 'Cell {cellId} overvoltage',
  'fault.cellUndervoltage': 'Cell {cellId} undervoltage',
  'fault.idleHighTemperature': 'Overheat while idle',
  'fault.chargeHighTemperature': 'Charging overheat',
  'fault.dischargeHighTemperature': 'Discharging overheat',
  'fault.chargeLowTemperature': 'Charging low temperature',
  'fault.dischargeLowTemperature': 'Discharging low temperature',
  'fault.mos': 'MOS fault',
  'fault.afe': 'AFE fault',
  'fault.unknown': 'Unknown anomaly',

  'empty.title': 'No power bank connected',
  'empty.body':
    'Device details, battery health and anomaly records will appear here after connecting.',
  'empty.details': 'Connect a device to view details',

  'notFound.title': 'Page not found',
  'notFound.body':
    'The page you requested does not exist. Return to the device page to inspect your Xiaomi power bank.',

  'modal.disconnect.title': 'Disconnect?',
  'modal.disconnect.body':
    'Disconnect? You will not be able to view power bank details after disconnecting.',
  'modal.disconnect.ok': 'Disconnect',
  'modal.disconnect.cancel': 'Cancel',
  'modal.qi2Enable.title': 'Enable Qi2.2?',
  'modal.qi2Enable.body':
    'Only available on the Xiaomi UltraThin Magnetic Power Bank 10000 45W (WPB1025S). Enabling switches wireless charging to Qi2.2 25W and may briefly interrupt it.',
  'modal.qi2Enable.ok': 'Enable',
  'modal.qi2Disable.title': 'Disable Qi2.2?',
  'modal.qi2Disable.body':
    'Wireless charging will return to the default mode and may be briefly interrupted.',
  'modal.qi2Disable.ok': 'Disable',
  'modal.disconnected.title': 'Disconnected',
  'modal.disconnected.body': 'The power bank was disconnected and has exited data transfer mode.',
  'modal.disconnected.ok': 'OK',
  'modal.unauthorized.title': 'Device not authorized',
  'modal.unauthorized.body':
    'Select “XiaomiPowerBank” in the pairing pop-up to complete the connection, then try again.',
  'modal.unauthorized.ok': 'OK',

  'unsupported.title': 'This browser cannot connect to the device',
  'unsupported.body':
    'Open this page in Chrome, Edge or Opera on a desktop computer to connect to the power bank and view its information.',

  'models.title': 'Supported models',
  'models.subtitle':
    'Connect your Xiaomi power bank to this computer to view device details and anomaly logs.',
  'models.supportedTitle': 'Supported models',
  'models.allModels': 'All models',
  'models.colId': 'No.',
  'models.colName': 'Product name',
  'models.colModel': 'Model',
  'models.colPort': 'Designated USB-C port',
  'models.colTemp': 'Operating temperature',
  'models.count': '{count} models',
  'models.note':
    'Use a data cable with the designated USB-C port listed above. Port locations vary by model; refer to the product documentation.',
  'models.portNote': 'C1 and C2 identify the designated ports on the power bank.',
  'models.back': 'Back to device',
  'models.search': 'Search model or product name',
  'models.noResults': 'No matching models',

  'guide.title': 'Common issues and troubleshooting',
  'guide.introTitle': '1. Introduction',
  'guide.introBody':
    'If the power bank detects that the temperature or voltage exceeds the safe range, it will automatically activate protection and stop charging or discharging.',
  'guide.handlingTitle': '2. How to fix common issues',
  'guide.chargeHighTempTitle': '2.1 High temperature while charging',
  'guide.chargeHighTempBody':
    'Stop charging and wait for the device to cool down before using it again. If you are using non-original accessories, replace them with original or certified charging cables and adapters.',
  'guide.dischargeHighTempTitle': '2.2 High temperature while discharging',
  'guide.dischargeHighTempBody':
    'Stop using the power bank and wait for it to cool down before continuing. If you are using non-original accessories, replace them with original or certified charging cables.',
  'guide.overvoltageTitle': '2.3 Overvoltage',
  'guide.overvoltageBody': 'Stop using the power bank and try connecting it again.',
  'guide.warmTips':
    'Note: If these issues occur frequently, the power bank may have a hardware fault. Contact customer support for inspection and repair.',
  'guide.back': 'Back to device',
  'guide.deviceLink': 'View device details',
  'guide.sideTitle': 'Safety note',
  'guide.sideBody':
    'This tool reads device state by default; only WPB1025S exposes a Qi2.2 toggle. It does not modify firmware or battery parameters. If anomalies occur frequently, contact Xiaomi support.',
  'guide.relatedTitle': 'Related pages',
  'guide.relatedModels': 'Supported models and ports',

  'toast.connected': 'Device connected',
  'toast.disconnected': 'Disconnected',
  'toast.demoLoaded': 'Demo mode enabled',
  'toast.copyFailed': 'Copy failed. Select the text manually.',
  'toast.handshakeFailed': 'Device was not authorized or did not respond. Try again.',
  'toast.commandFailed': 'The device did not respond. Reconnect it and try again.',
  'toast.historyFailed': 'Could not read the anomaly log',
  'toast.noDevice': 'No device selected',
  'toast.refreshFailed': 'Refresh failed. Try again.',
  'toast.demoExited': 'Demo mode closed',
  'toast.protocolCleared': 'Communication log cleared',
  'toast.qi2Enabled': 'Qi2.2 enabled',
  'toast.qi2Disabled': 'Qi2.2 disabled',
  'toast.qi2Failed': 'Could not change Qi2.2. Try again.',

  'error.unsupported': 'WebHID is not supported in this browser',

  'footer.note': 'Unofficial tool. Protocol derived from public WebHID behavior analysis.',
  'footer.privacy':
    'Device data stays in this browser and is never uploaded; only anonymous page views are counted.',
  'footer.models': 'Supported models',
  'footer.guide': 'Troubleshooting',
  'footer.original': 'Original site',
  'footer.source': 'Community protocol reference',
  'footer.madeWith': 'Vue 3 · WebHID · Cloudflare Pages',
  'footer.license': 'MIT License',
  'footer.disclaimer':
    'Xiaomi and related names are trademarks of Xiaomi Corporation. This tool is not affiliated with Xiaomi.',
  'footer.copyright': '© {year} Power Bank Console',

  'a11y.language': 'Switch language',
  'a11y.refresh': 'Refresh device data',
  'a11y.batteryGauge': 'Battery level {level}%',
  'a11y.cellTable': 'Cell information table',
  'a11y.historyTable': 'Anomaly log table',
  'a11y.protocolToggle': 'Expand or collapse the HID communication log',
  'a11y.step': 'Step {index}',
  'a11y.nav': 'Main navigation',
  'a11y.tabs': 'Device detail tabs',
  'a11y.footer': 'Footer',
  'a11y.qi2Toggle': 'Enable or disable Qi2.2 wireless charging',

  'unit.cycles': 'cycles',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.retry': 'Retry',
  'common.loading': 'Loading…',
  'common.back': 'Back',
  'common.previous': 'Previous page',
  'common.next': 'Next page',
}
