var rewire = require("rewire");
var equal = require('deep-equal');
var ntlm = rewire("./ntlm.js");

function test_create_LM_hashed_password_v1() {
  console.log('> testing create_LM_hashed_password_v1');
  const create_LM_hashed_password_v1 = ntlm.__get__("create_LM_hashed_password_v1");

  var realResponse = create_LM_hashed_password_v1('Azx123456');
  // console.log('realResponse', realResponse);

  var expectedResponse = Buffer.from([0xb7, 0xb4, 0x13, 0x5f, 0xa3, 0x05, 0x76, 0x82, 0x1e, 0x92, 0x9f, 0xfc, 0x01, 0x39, 0x51, 0x27]);
  return realResponse.equals(expectedResponse);
}

function test_create_LM_hashed_password_v1_longpassword() {
  console.log('> testing create_LM_hashed_password_v1 (long password)');
  const create_LM_hashed_password_v1 = ntlm.__get__("create_LM_hashed_password_v1");

  var realResponse = create_LM_hashed_password_v1('Azx123456Azx123456');
  // console.log('realResponse', realResponse);

  var expectedResponse = Buffer.from([0xb7, 0xb4, 0x13, 0x5f, 0xa3, 0x05, 0x76, 0x82, 0x17, 0x48, 0x74, 0x2b, 0xc4, 0xcf, 0xed, 0x38]);
  return realResponse.equals(expectedResponse);
}

function test_createType1Message() {
  console.log('> testing createType1Message');
  const createType1Message = ntlm.__get__("createType1Message");

  var options = {
    url: "https://someurl.com",
    username: 'someUsername',
    password: 'stinks',
    workstation: 'choose.something',
    domain: 'someDomain'
  };

  var realResponse = createType1Message(options);
  // console.log('type1 message:', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAABAAAAB7IIogoACgA4AAAAEAAQACgAAAAFASgKAAAAD0NIT09TRS5TT01FVEhJTkdTT01FRE9NQUlO";
  return realResponse == expectedResponse;
}

function test_createType1Message_nodomain() {
  console.log('> testing createType1Message (no domain)');
  const createType1Message = ntlm.__get__("createType1Message");

  var options = {
    url: "https://someurl.com",
    username: 'm$',
    password: 'stinks',
    workstation: 'choose.something',
    domain: ''
  };

  var realResponse = createType1Message(options);
  // console.log('type1 message:', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAABAAAAB6IIogAAAAA4AAAAEAAQACgAAAAFASgKAAAAD0NIT09TRS5TT01FVEhJTkc=";
  return realResponse == expectedResponse;
}

function test_createType1Message_noworkstation() {
  console.log('> testing createType1Message (no workstation)');
  const createType1Message = ntlm.__get__("createType1Message");

  var options = {
    url: "https://someurl.com",
    username: 'm$',
    password: 'stinks',
    workstation: '',
    domain: ''
  };

  var realResponse = createType1Message(options);
  // console.log('type1 message:', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAABAAAAB6IIogAAAAAoAAAAAAAAACgAAAAFASgKAAAADw==";
  return realResponse == expectedResponse;
}

function test_createType1Message_emptyoptions() {
  console.log('> testing createType1Message (empty options)');
  const createType1Message = ntlm.__get__("createType1Message");

  var options = {};

  var realResponse = createType1Message(options);
  // console.log('type1 message (empty options):', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAABAAAAB6IIogAAAAAoAAAAAAAAACgAAAAFASgKAAAADw==";
  return realResponse == expectedResponse;
}






function test_parseType2Message() {
  console.log('> testing parseType2Message');
  const parseType2Message = ntlm.__get__("parseType2Message");

  var type2Message = 'NTLM ' +
  'TlRMTVNTUAACAAAAHgAeADgAAAAFgoqiBevywvJykjAAAAAAAAAAAJgAmABWAAAA' +
  'CgC6RwAAAA9EAEUAUwBLAFQATwBQAC0ASgBTADQAVQBKAFQARAACAB4ARABFAFMA' +
  'SwBUAE8AUAAtAEoAUwA0AFUASgBUAEQAAQAeAEQARQBTAEsAVABPAFAALQBKAFMA' +
  'NABVAEoAVABEAAQAHgBEAEUAUwBLAFQATwBQAC0ASgBTADQAVQBKAFQARAADAB4A' +
  'RABFAFMASwBUAE8AUAAtAEoAUwA0AFUASgBUAEQABwAIADmguzCHn9UBAAAAAA==';

  var realResponse = parseType2Message(type2Message, function (err) {
    console.log(err);
  });
  // console.log('parsed type2 message:', realResponse);

  // var dd = Array.prototype.map.call(new Uint8Array(realResponse.targetInfo),
  //                x => ('00' + x.toString(16)).slice(-2))
  //         .join('').match(/[a-fA-F0-9]{2}/g).join(', 0x');
  // console.log(dd);

  var expectedResponse = {
    signature: Buffer.from([0x4e, 0x54, 0x4c, 0x4d, 0x53, 0x53, 0x50, 0x00]),
    type: 2,
    targetNameLen: 30,
    targetNameMaxLen: 30,
    targetNameOffset: 56,
    targetName: Buffer.from([0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00]),
    negotiateFlags: -1567981051,
    serverChallenge: Buffer.from([0x05, 0xeb, 0xf2, 0xc2, 0xf2, 0x72, 0x92, 0x30]),
    reserved: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    targetInfoLen: 152,
    targetInfoMaxLen: 152,
    targetInfoOffset: 86,
    targetInfo: Buffer.from([0x02, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x01, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x04, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x03, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x07, 0x00, 0x08, 0x00, 0x39, 0xa0, 0xbb, 0x30, 0x87, 0x9f, 0xd5, 0x01, 0x00, 0x00, 0x00, 0x00])
  };

  return equal(realResponse, expectedResponse);
}


function test_createType3Message() {
  console.log('> testing createType3Message');
  const createType3Message = ntlm.__get__("createType3Message");

  var mathMock = {
    random: function () {
      return 0.8092;
    },
    floor: Math.floor
  };
  ntlm.__set__("Math", mathMock);

  var dateMock = {
    now: function () {
      return 1679346960095;
    }
  };
  ntlm.__set__("Date", dateMock);

  var type2Message = {
    signature: Buffer.from([0x4e, 0x54, 0x4c, 0x4d, 0x53, 0x53, 0x50, 0x00]),
    type: 2,
    targetNameLen: 30,
    targetNameMaxLen: 30,
    targetNameOffset: 56,
    targetName: Buffer.from([0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00]),
    negotiateFlags: -1567981051,
    serverChallenge: Buffer.from([0x05, 0xeb, 0xf2, 0xc2, 0xf2, 0x72, 0x92, 0x30]),
    reserved: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    targetInfoLen: 152,
    targetInfoMaxLen: 152,
    targetInfoOffset: 86,
    targetInfo: Buffer.from([0x02, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x01, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x04, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x03, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x07, 0x00, 0x08, 0x00, 0x39, 0xa0, 0xbb, 0x30, 0x87, 0x9f, 0xd5, 0x01, 0x00, 0x00, 0x00, 0x00])
  };

  var options = {
    url: "https://someurl.com",
    username: 'm$',
    password: 'stinks',
    workstation: 'choose.something',
    domain: ''
  };

  var realResponse = createType3Message(type2Message, options);
  // console.log('type3 message:', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAADAAAAGAAYAGwAAADIAMgAhAAAAAAAAABIAAAABAAEAEgAAAAgACAATAAAAAAAAABMAQAABYKIogUBKAoAAAAPbQAkAEMASABPAE8AUwBFAC4AUwBPAE0ARQBUAEgASQBOAEcA34OQvQRxhMrl/ZdqHfdXsc/Pz8/Pz8/PBRktHt+/zDBHvSp4tqmfpwEBAAAAAAAA8OZaK3Fb2QHPz8/Pz8/PzwAAAAACAB4ARABFAFMASwBUAE8AUAAtAEoAUwA0AFUASgBUAEQAAQAeAEQARQBTAEsAVABPAFAALQBKAFMANABVAEoAVABEAAQAHgBEAEUAUwBLAFQATwBQAC0ASgBTADQAVQBKAFQARAADAB4ARABFAFMASwBUAE8AUAAtAEoAUwA0AFUASgBUAEQABwAIADmguzCHn9UBAAAAAAAAAAA=";
  return realResponse == expectedResponse;
}

function test_createType3Message_negotiateflagszero() {
  console.log('> testing createType3Message (negotiateFlags zero)');
  const createType3Message = ntlm.__get__("createType3Message");

  var mathMock = {
    random: function () {
      return 0.8092;
    },
    floor: Math.floor
  };
  ntlm.__set__("Math", mathMock);

  var dateMock = {
    now: function () {
      return 1679346960095;
    }
  };
  ntlm.__set__("Date", dateMock);

  var type2Message = {
    signature: Buffer.from([0x4e, 0x54, 0x4c, 0x4d, 0x53, 0x53, 0x50, 0x00]),
    type: 2,
    targetNameLen: 30,
    targetNameMaxLen: 30,
    targetNameOffset: 56,
    targetName: Buffer.from([0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00]),
    negotiateFlags: 0,
    serverChallenge: Buffer.from([0x05, 0xeb, 0xf2, 0xc2, 0xf2, 0x72, 0x92, 0x30]),
    reserved: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    targetInfoLen: 152,
    targetInfoMaxLen: 152,
    targetInfoOffset: 86,
    targetInfo: Buffer.from([0x02, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x01, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x04, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x03, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x07, 0x00, 0x08, 0x00, 0x39, 0xa0, 0xbb, 0x30, 0x87, 0x9f, 0xd5, 0x01, 0x00, 0x00, 0x00, 0x00])
  };

  var options = {
    url: "https://someurl.com",
    username: 'm$',
    password: 'stinks',
    workstation: 'choose.something',
    domain: ''
  };

  var realResponse = createType3Message(type2Message, options);
  // console.log('type3 message:', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAADAAAAGAAYAFoAAAAYABgAcgAAAAAAAABIAAAAAgACAEgAAAAQABAASgAAAAAAAACKAAAABIKIogUBKAoAAAAPbSRDSE9PU0UuU09NRVRISU5HEBenAMbG/BJagLAbC+ssxjoV6DmoMZnLPnIxjabRKh2kis6avHJoHUvdnSQrhLYz";
  return realResponse == expectedResponse;
}


function test_createType3Message_emptyoptions() {
  console.log('> testing createType3Message');
  const createType3Message = ntlm.__get__("createType3Message");

  var mathMock = {
    random: function () {
      return 0.8092;
    },
    floor: Math.floor
  };
  ntlm.__set__("Math", mathMock);

  var dateMock = {
    now: function () {
      return 1679346960095;
    }
  };
  ntlm.__set__("Date", dateMock);

  var type2Message = {
    signature: Buffer.from([0x4e, 0x54, 0x4c, 0x4d, 0x53, 0x53, 0x50, 0x00]),
    type: 2,
    targetNameLen: 30,
    targetNameMaxLen: 30,
    targetNameOffset: 56,
    targetName: Buffer.from([0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00]),
    negotiateFlags: -1567981051,
    serverChallenge: Buffer.from([0x05, 0xeb, 0xf2, 0xc2, 0xf2, 0x72, 0x92, 0x30]),
    reserved: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    targetInfoLen: 152,
    targetInfoMaxLen: 152,
    targetInfoOffset: 86,
    targetInfo: Buffer.from([0x02, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x01, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x04, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x03, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x07, 0x00, 0x08, 0x00, 0x39, 0xa0, 0xbb, 0x30, 0x87, 0x9f, 0xd5, 0x01, 0x00, 0x00, 0x00, 0x00])
  };

  var options = {};

  var realResponse = createType3Message(type2Message, options);
  // console.log('type3 message:', realResponse);

  var expectedResponse = "NTLM TlRMTVNTUAADAAAAGAAYAEgAAADIAMgAYAAAAAAAAABIAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAoAQAABYKIogUBKAoAAAAPwARIPPqPB18BtDy2SiF1us/Pz8/Pz8/P52yYCH+rc7F7jUeUnayiPQEBAAAAAAAA8OZaK3Fb2QHPz8/Pz8/PzwAAAAACAB4ARABFAFMASwBUAE8AUAAtAEoAUwA0AFUASgBUAEQAAQAeAEQARQBTAEsAVABPAFAALQBKAFMANABVAEoAVABEAAQAHgBEAEUAUwBLAFQATwBQAC0ASgBTADQAVQBKAFQARAADAB4ARABFAFMASwBUAE8AUAAtAEoAUwA0AFUASgBUAEQABwAIADmguzCHn9UBAAAAAAAAAAA=";
  return realResponse == expectedResponse;
}

function test_insertZerosEvery7Bits() {
  console.log('> testing insertZerosEvery7Bits');
  const insertZerosEvery7Bits = ntlm.__get__("insertZerosEvery7Bits");


  var realResponse = insertZerosEvery7Bits(Buffer.from([0x41, 0x5a, 0x58, 0x31, 0x32, 0x33, 0x34]));
  // console.log('realResponse:', realResponse);

  var expectedResponse = Buffer.from([0x40, 0xac, 0x96, 0x06, 0x12, 0x90, 0xcc, 0x68]);
  return equal(realResponse, expectedResponse);
}

function test_bytes2binaryArray() {
  console.log('> testing bytes2binaryArray');
  const bytes2binaryArray = ntlm.__get__("bytes2binaryArray");


  var realResponse = bytes2binaryArray(Buffer.from([0x41, 0x5a, 0x58, 0x31, 0x32, 0x33, 0x34]));
  // console.log('realResponse:', realResponse);

  var expectedResponse = [
    0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1,
    0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1,
    0, 0, 1, 1, 0, 1, 0, 0
  ];
  return equal(realResponse, expectedResponse);
}

function test_binaryArray2bytes() {
  console.log('> testing binaryArray2bytes');
  const binaryArray2bytes = ntlm.__get__("binaryArray2bytes");


  var realResponse = binaryArray2bytes([
    0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1,
    0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1,
    0, 0, 1, 1, 0, 1, 0, 0
  ]);
  // console.log('realResponse:', realResponse);

  var expectedResponse = Buffer.from([0x41, 0x5a, 0x58, 0x31, 0x32, 0x33, 0x34]);
  return equal(realResponse, expectedResponse);
}

function test_create_NT_hashed_password_v1() {
  console.log('> testing create_NT_hashed_password_v1');
  const create_NT_hashed_password_v1 = ntlm.__get__("create_NT_hashed_password_v1");

  var realResponse = create_NT_hashed_password_v1('Azx123456');
  // console.log('realResponse', realResponse);

  var expectedResponse = Buffer.from([0x96, 0x1b, 0x07, 0xdb, 0xdc, 0xcf, 0x86, 0x9f, 0x2a, 0x3c, 0x99, 0x1c, 0x83, 0x94, 0x0e, 0x01]);
  return realResponse.equals(expectedResponse);
}

function test_calc_resp() {
  console.log('> testing calc_resp');
  const calc_resp = ntlm.__get__("calc_resp");

  var password_hash = Buffer.from([ 183, 180, 19, 95, 163, 5, 118, 130, 30, 146, 159, 1, 57, 81, 39, 252, 1, 57, 81, 39, 252 ]);
  var server_challenge = Buffer.from([150, 27, 7, 219, 220, 207, 134, 159]);

  var realResponse = calc_resp(password_hash, server_challenge);
  // console.log('calc_resp:', realResponse);

  var expectedResponse = Buffer.from([0xaf, 0x00, 0xee, 0x2f, 0xd7, 0x8c, 0xaf, 0x4a, 0xab, 0x57, 0xcc, 0xcb, 0xb0, 0x93, 0x58, 0x62, 0x31, 0x69, 0x02, 0x92, 0x4d, 0x34, 0xbc, 0x92]);
  return realResponse.equals(expectedResponse);
}

function test_hmac_md5() {
  console.log('> testing hmac_md5');
  const hmac_md5 = ntlm.__get__("hmac_md5");


  var realResponse = hmac_md5('somekey', 'somedata');
  // console.log('realResponse:', realResponse);

  var expectedResponse = Buffer.from([0x7e, 0x58, 0x72, 0xda, 0x5d, 0x34, 0xa8, 0x22, 0x58, 0x4a, 0x69, 0x8f, 0xe7, 0xdb, 0x6c, 0x10]);
  return equal(realResponse, expectedResponse);
}

function test_ntlm2sr_calc_resp() {
  console.log('> testing ntlm2sr_calc_resp');
  const ntlm2sr_calc_resp = ntlm.__get__("ntlm2sr_calc_resp");

  var realResponse = ntlm2sr_calc_resp(
    Buffer.from([0x1b, 0xc8, 0x2f, 0x16, 0xdd, 0xcc, 0xbd, 0x4d, 0xac, 0xfc, 0xba, 0x4d, 0xcb, 0xc3, 0x51, 0x9d]),
    Buffer.from([0x05, 0xeb, 0xf2, 0xc2, 0xf2, 0x72, 0x92, 0x30]),
    Buffer.from([0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf])
  );
  // console.log('realResponse:', realResponse);

  var expectedResponse = {
    lmChallengeResponse: Buffer.from([0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    ntChallengeResponse: Buffer.from([0x2b, 0x8f, 0x56, 0xa4, 0x3f, 0x61, 0xdd, 0x6a, 0xa1, 0xa5, 0x57, 0xbe, 0xea, 0x81, 0x4b, 0x2c, 0x36, 0x56, 0x79, 0x5d, 0x7f, 0xa5, 0x3a, 0x51])
  }
  return equal(realResponse, expectedResponse);
}

function test_calc_ntlmv2_resp() {
  console.log('> testing calc_ntlmv2_resp');
  const calc_ntlmv2_resp = ntlm.__get__("calc_ntlmv2_resp");

  var dateMock = {
    now: function () {
      return 1679346960095;
    }
  };
  ntlm.__set__("Date", dateMock);


  var realResponse = calc_ntlmv2_resp(
    Buffer.from([0x1b, 0xc8, 0x2f, 0x16, 0xdd, 0xcc, 0xbd, 0x4d, 0xac, 0xfc, 0xba, 0x4d, 0xcb, 0xc3, 0x51, 0x9d]),
    'm$',
    '',
    Buffer.from([0x02, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x01, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x04, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x03, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x07, 0x00, 0x08, 0x00, 0x39, 0xa0, 0xbb, 0x30, 0x87, 0x9f, 0xd5, 0x01, 0x00, 0x00, 0x00, 0x00]),
    Buffer.from([0x05, 0xeb, 0xf2, 0xc2, 0xf2, 0x72, 0x92, 0x30]),
    Buffer.from([0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf])
  );
  // console.log('realResponse:', realResponse);


  var expectedResponse = {
    lmChallengeResponse: Buffer.from([0xdf, 0x83, 0x90, 0xbd, 0x04, 0x71, 0x84, 0xca, 0xe5, 0xfd, 0x97, 0x6a, 0x1d, 0xf7, 0x57, 0xb1, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf]),
    ntChallengeResponse: Buffer.from([0x05, 0x19, 0x2d, 0x1e, 0xdf, 0xbf, 0xcc, 0x30, 0x47, 0xbd, 0x2a, 0x78, 0xb6, 0xa9, 0x9f, 0xa7, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0xe6, 0x5a, 0x2b, 0x71, 0x5b, 0xd9, 0x01, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0xcf, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x01, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x04, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x03, 0x00, 0x1e, 0x00, 0x44, 0x00, 0x45, 0x00, 0x53, 0x00, 0x4b, 0x00, 0x54, 0x00, 0x4f, 0x00, 0x50, 0x00, 0x2d, 0x00, 0x4a, 0x00, 0x53, 0x00, 0x34, 0x00, 0x55, 0x00, 0x4a, 0x00, 0x54, 0x00, 0x44, 0x00, 0x07, 0x00, 0x08, 0x00, 0x39, 0xa0, 0xbb, 0x30, 0x87, 0x9f, 0xd5, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  }
  return equal(realResponse, expectedResponse);
}

function test_NTOWFv2() {
  console.log('> testing NTOWFv2');
  const NTOWFv2 = ntlm.__get__("NTOWFv2");


  var realResponse = NTOWFv2(
    Buffer.from([0x1b, 0xc8, 0x2f, 0x16, 0xdd, 0xcc, 0xbd, 0x4d, 0xac, 0xfc, 0xba, 0x4d, 0xcb, 0xc3, 0x51, 0x9d]),
    'someUsername',
    'someDomain');
  // console.log('realResponse', realResponse);

  var expectedResponse = Buffer.from([0x26, 0xd9, 0xf6, 0xea, 0x4d, 0x31, 0xd7, 0xf5, 0x12, 0xfb, 0x5f, 0xb4, 0x50, 0xd0, 0x9d, 0xf4]);
  return realResponse.equals(expectedResponse);
}


console.log(test_createType1Message());
console.log(test_createType1Message_nodomain());
console.log(test_createType1Message_noworkstation());
console.log(test_createType1Message_emptyoptions());
console.log(test_parseType2Message());
console.log(test_createType3Message());
console.log(test_createType3Message_negotiateflagszero());
console.log(test_createType3Message_emptyoptions());
console.log(test_create_LM_hashed_password_v1());
console.log(test_create_LM_hashed_password_v1_longpassword());
console.log(test_insertZerosEvery7Bits());
console.log(test_bytes2binaryArray());
console.log(test_binaryArray2bytes());
console.log(test_create_NT_hashed_password_v1());
console.log(test_calc_resp());
console.log(test_hmac_md5());
console.log(test_ntlm2sr_calc_resp());
console.log(test_calc_ntlmv2_resp());
console.log(test_NTOWFv2());

