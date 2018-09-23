/**
  # Testnets
  https://github.com/CryptoLions/EOS-Jungle-Testnet
  Jungle chainId: `038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca`
  # Mainnets
  Find a trusted blockproducer (https://bloks.io/producers for example).
  EOS chainId: `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`
  Look for the published `bp.json` with an `api_endpoint` under the BPs
  domain (https://choosen_block_producer/bp.json for example).
*/
//chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
//httpEndpoint = 'https://mainnet.libertyblock.io:7777'
chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f';
httpEndpoint = 'http://localhost:8888';

eosConfig = {
  //chainId: chainId,
  httpEndpoint: httpEndpoint,
  verbose: true,
    //TODO: remove, get from other place:
  //keyProvider: "5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5" 
};
eos = Eos(eosConfig);
const sampleParameters = {
  httpEndpoint,
  chainId: chainId.substring(0, 10) + '..'
}
console.log(`>> eos = Eos(${JSON.stringify(sampleParameters)})`);
eosConfig.verbose = true;

const doctorAccount = { "name": "doctor", "privateKey": "5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey": "EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p" };
const personAccount = { "name": "patient", "privateKey": "5KNm1BgaopP9n5NqJDo9rbr49zJFWJTMJheLoLM5b7gjdhqAwCx", "publicKey": "EOS8LoJJUU3dhiFyJ5HmsMiAuNLGc6HMkxF4Etx6pxLRG7FU89x6X" };
const pharmacistAccount = { "name": "pharmacist", "privateKey": "5KaqYiQzKsXXXxVvrG8Q3ECZdQAj2hNcvCgGEubRvvq7CU3LySK", "publicKey": "EOS5btzHW33f9zbhkwjJTYsoyRzXUNstx1Da9X2nTzk8BQztxoP3H" };
const registrarAccount = { "name": "registrar", "privateKey": "5KZASPEgUpSfmp1nDPSZErVp4fYTrG6vXGgWSz4MgjhN35yPAJh", "publicKey": "EOS7nWanA2itjE9tcmzQBMHhyfXDYGnSiqyZ4h2k3zC2yDowNuETu" };


async function bcRegisterPerson(name)
{    
    let actionName = "update";
    let actionData = {
         //TODO: remove, get from other place:
          _user: personAccount.name,
          _note: name,
        };
    
    // eosjs function call: connect to the blockchain
    //const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [{
        account: "registrar",
        name: actionName,
        authorization: [{
          actor: personAccount.name,
          permission: 'active',
        }],
        data: actionData,
      }]},
      { 
        keyProvider : personAccount.privateKey 
      }
    );

    console.log(result);
    
    alert("Person Saved");
}

async function savePrescriptionBchain(prescription)
{
    let actionName = "update";
    let actionData = {
         //TODO: remove, get from other place:
          _user: doctorAccount.name,
          _note: prescription,
        };
    
    // eosjs function call: connect to the blockchain
    //const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [{
        account: "notechainacc",
        name: actionName,
        authorization: [{
          actor: doctorAccount.name,
          permission: 'active',
        }],
        data: actionData,
      }]},
      { 
        keyProvider : doctorAccount.privateKey 
      }
    );

    console.log(result);
    
    alert("Prescription Saved");
}

function getPatientDataFromEos()
{
    var rows = null;
    
    var jsonObj = eos.getTableRows({
      "json": true,
      "code": "registrar",   // contract who owns the table
      "scope": "registrar",  // scope of the table
      "table": "smedical",    // name of the table as specified by the contract abi
      "limit": 100,
    });
    
    jsonObj
    .then(res => {
      console.log(res.rows);
      let html = '';
      res.rows.forEach(res => html += `<tr><td>${res.fullname}</td><td>${res.dob}</td><td>${res.medical_history}</td></tr>`);
      document.getElementById("patient-view-table").innerHTML = html;
    })
    .catch(e => console.log(e));
    
    //jsonObj.then(result => $('body').append(result.rows));
    //jsonObj.then(result => alert(JSON.stringify(result.rows)));
    
}


function bcLoadApprovals()
{   
    var jsonObj = eos.getTableRows({
      "json": true,
      "code": "registrar",   // contract who owns the table
      "scope": "registrar",  // scope of the table
      "table": "smedical",    // name of the table as specified by the contract abi
      "limit": 100,
    });
    
    jsonObj
    .then(res => {
      console.log("Updates: " + res.rows[0].pending_updates);
      console.log("Prescriptions: " + res.rows[0].prescriptions);

      document.getElementById("pending_text").value = res.rows[0].pending_updates;
      document.getElementById("prescription_text").value = res.rows[0].prescriptions;
    })
    .catch(e => console.log(e));
}

async function bcAcceptAction()
{
    console.log("ACCEPT************");
    let actionName = "acceptupd";
    let actionData = {
          _patient: personAccount.name,
        };
    
    // eosjs function call: connect to the blockchain
    //const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [{
        account: "registrar",
        name: actionName,
        authorization: [{
          actor: personAccount.name,
          permission: 'active',
        }],
        data: actionData,
      }]},
      { 
        keyProvider : personAccount.privateKey 
      }
    );

    console.log(result);
    
    bcLoadApprovals();
    
}

async function bcRejectAction()
{
    console.log("REJECT************");
    let actionName = "rejectupd";
    let actionData = {
          _patient: personAccount.name,
        };
    
    // eosjs function call: connect to the blockchain
    //const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [{
        account: "registrar",
        name: actionName,
        authorization: [{
          actor: personAccount.name,
          permission: 'active',
        }],
        data: actionData,
      }]},
      { 
        keyProvider : personAccount.privateKey 
      }
    );

    console.log(result);
    
    bcLoadApprovals();
    
}

async function bcDispensedAction()
{
    console.log("Dispensed************");
    let actionName = "dispensed";
    let actionData = {
          _pharmacist: pharmacistAccount.name,
          _patient: personAccount.name,
        };
    
    // eosjs function call: connect to the blockchain
    //const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [{
        account: "registrar",
        name: actionName,
        authorization: [{
          actor: personAccount.name,
          permission: 'active',
        }],
        data: actionData,
      }]},
      { 
        keyProvider : personAccount.privateKey 
      }
    );

    console.log(result);
    
    bcLoadApprovals();

    
}

function bcLoadPatientData()
{
    console.log("LoadPatientData************");
    var jsonObj = eos.getTableRows({
      "json": true,
      "code": "registrar",   // contract who owns the table
      "scope": "registrar",  // scope of the table
      "table": "smedical",    // name of the table as specified by the contract abi
      "limit": 100,
    });
    
    jsonObj
    .then(res => {
      console.log(document.getElementById("pending_update"));
      console.log(res.rows[0].pending_updates);
      document.getElementById("pending_update").value = res.rows[0].pending_updates;
      document.getElementById("forename").value = res.rows[0].forename;
      document.getElementById("surname").value = res.rows[0].surname;
      document.getElementById("dob").value = res.rows[0].dob;
    })
    .catch(e => console.log(e));
    
}


async function bcPushUpdate()
{
    console.log("PushUpdate************");
    let actionName = "pushupdate";
    let updateData = document.getElementById("pending_update").value;
    console.log(updateData)
    let actionData = {
          _doctor: doctorAccount.name,
          _patient: personAccount.name,
          _update: updateData,
        };
    
    // eosjs function call: connect to the blockchain
    //const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [{
        account: "registrar",
        name: actionName,
        authorization: [{
          actor: personAccount.name,
          permission: 'active',
        }],
        data: actionData,
      }]},
      { 
        keyProvider : personAccount.privateKey 
      }
    );

    console.log(result);
}