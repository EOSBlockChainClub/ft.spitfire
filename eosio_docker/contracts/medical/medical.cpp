#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <vector>
#include <string>
#include <sstream>
#include <iostream>

using namespace eosio;

// Smart Contract Name: medical 
// Replace the contract class name when you start your own project
class medical : public eosio::contract {
  private:

    /// @abi table
    struct smedical {
      account_name patient;         // account name for the patient 
      std::string  forename;
      std::string  surname;
      std::string  dob;
      std::string  medical_history; // encrypted medical history
      std::string  pending_updates; // encrypted pending_updates 
      std::string  prescriptions;   // encrypted pending_updates 
      uint64_t     timestamp; // the store the last update block time

      // primary key
      auto primary_key() const { return patient; }

      EOSLIB_SERIALIZE( smedical, (patient)(forename)(surname)(dob)(medical_history)(pending_updates)(prescriptions)(timestamp))

    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< N(smedical), smedical > tmedical;
    tmedical _records;

  public:
    using contract::contract;

    medical( account_name creator ): contract(creator), _records(creator, creator)
    {}

    /// @abi action
    void newpatient( account_name _patient, const std::string& _forename, const std::string& _surname, const std::string& _dob) {
      print("newpatient: ", name{_patient});      

      eosio_assert( _records.find(_patient) == _records.end(), "This patient already has an account" );

      _records.emplace( _patient , [&]( auto& rcrd ) {
          rcrd.patient = _patient;
          rcrd.forename = _forename;
          rcrd.surname = _surname;
          rcrd.dob = _dob;
          rcrd.medical_history = "";
          rcrd.pending_updates = "";
          rcrd.prescriptions = "";
          rcrd.timestamp = now(); 
      });

    }

    /// @abi action
    void acceptupd( account_name _patient) {
      print("acceptupdates: ", name{_patient});      
      
      // to sign the action with the given account
      require_auth( _patient);

      auto itr = _records.find( _patient );
      eosio_assert( itr != _records.end(), "Record does not exit" );

      std::string new_medical_history = itr->medical_history + itr->pending_updates;
       _records.modify( itr, _patient, [&]( auto& rcrd ) {
            rcrd.medical_history = new_medical_history; 
            rcrd.pending_updates = "";
            rcrd.timestamp = now(); 
         });
    }

    /// @abi action
    void rejectupd( account_name _patient) {
      print("rejectupdates:", name{_patient});      
        // to sign the action with the given account
      require_auth( _patient);

      auto itr = _records.find( _patient );
      eosio_assert( itr != _records.end(), "Record does not exit" );
      _records.modify( itr, _patient, [&]( auto& rcrd ) {
            rcrd.pending_updates = "";
            rcrd.prescriptions = "";
            rcrd.timestamp = now(); 
         });
   }

    /// @abi action
    void pushupdate( account_name _doctor, account_name _patient, std::string _update ) {
      print("pushupdate", name{_doctor}, name{_patient} );

       auto itr = _records.find( _patient );
      eosio_assert( itr != _records.end(), "Record does not exit" );
      eosio_assert( itr->pending_updates == "", "A medical update is already pending." );

      _records.modify( itr, _patient, [&]( auto& rcrd ) {
            rcrd.pending_updates = _update; 
            rcrd.timestamp = now(); 
         });
    }

    /// @abi action
    void prescribe( account_name doctor, account_name patient, const std::string& prescription ) {
      print("prescribe", name{doctor});      
       // to sign the action with the given account

       auto itr = _records.find( patient );
      eosio_assert( itr != _records.end(), "Record does not exit" );

      std::string updated( std::string(itr->prescriptions) + prescription );
      print(updated);

      _records.modify( itr, patient, [&]( auto& rcrd ) {
            rcrd.prescriptions = updated; 
            rcrd.timestamp = now(); 
         });

    }

    /// @abi action
    void dispensed( account_name _pharmacist, account_name _patient ) {

      print("dispensed", name{_pharmacist}, name{_patient});      
       // to sign the action with the given account

      auto itr = _records.find( _patient );
      eosio_assert( itr != _records.end(), "Record does not exit" );

      _records.modify( itr, _patient, [&]( auto& rcrd ) {
            rcrd.prescriptions = ""; 
            rcrd.timestamp = now(); 
         });
     }

};

EOSIO_ABI( medical, (newpatient)(acceptupd)(rejectupd)(pushupdate)(prescribe)(dispensed) )
