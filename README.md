# Overview
# EOS Hackathon submission for team ft.spitfire
# HealthCheck DApp

HealthCheck DApp allow to store health information for patients with privacy and secturity, while allowing to collect anonymous data for the common good, to help advance health related data statistics and investigation.

To achieve this goal, the Dapp data is encrypted righ in the browser with user private key and public key of the person who he wants to share this data (like a doctor or a pharmacist or his own), so only them can access the private data.
While doing this, the Health data (that does not relate to Person) is published clear for public use.

Dapp Data
- Person Data (encrypted)
- Health Data

In current version, everything is stored in clear mode in the EOSIO RAM. No encryption is made yet.

In the future version all the data will be stored on IPFS, and just a hashes are stored on the blockchain.
The Person Data will be encryped.
To read the Person Data, the frontend gets the hash from the blockchain, get the file from IPFS using the hash, and then decrypts the data in javascript using EOS account public key.



