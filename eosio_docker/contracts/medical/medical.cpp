#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

// Smart Contract Name: notechain
// Table struct:
//   notestruct: multi index table to store the notes
//     prim_key(uint64): primary key
//     user(account_name/uint64): account name for the user
//     note(string): the note message
//     timestamp(uint64): the store the last update block time
// Public method:
//   isnewuser => to check if the given account name has note in table or not
// Public actions:
//   update => put the note into the multi-index table and sign by the given account

// Replace the contract class name when you start your own project
class medical : public eosio::contract {
  private:
    bool isnewpatient( account_name patient) {
      medical_table medical_obj(_self, _self);
      // get object by secordary key
      auto patients = medical_obj.get_index<N(getbypatient)>();
      auto patient = patients.find(patient);

      return patient == patients.end();
    }

    /// @abi table
    struct medical_struct {
      uint64_t      prim_key;        // primary key
      account_name  patient;         // account name for the patient 
      std::string   medical_history; // encrypted medical history
      std::string   pending_updates; // encrypted pending_updates 
      std::string   prescriptions;   // encrypted pending_updates 
      uint64_t      timestamp; // the store the last update block time

      // primary key
      auto primary_key() const { return prim_key; }
      // secondary key: user
      account_name get_by_patient() const { return patient; }
    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< N(medical_struct), medical_struct,
      indexed_by< N(getbypatient), const_mem_fun<medical_struct, account_name, &medical_struct::get_by_patient> >
      > medical_table;

  public:
    using contract::contract;
 
    /// @abi action
    void viewCurrentRecord( account_name _patient {
      
      // to sign the action with the given account
      require_auth( _patient);
    }

    /// @abi action
    void viewPendingUpdates( account_name _patient) {
       // to sign the action with the given account
      require_auth( _patient);
    }

    /// @abi action
    void acceptUpdate( account_name _patient) {
       // to sign the action with the given account
      require_auth( _patient);
    }

    /// @abi action
    void rejectUpdate( account_name _patient) {
        // to sign the action with the given account
      require_auth( _patient);
   }

    /// @abi action
    void getAnonymousMedicalRecords( account_name _patient ) {
       // to sign the action with the given account
      require_auth( _patient);
    }

    /// @abi action
    void requestPatientRecordUpdate( account_name _patient ) {
       // to sign the action with the given account
      require_auth( _patient);
    }

    /// @abi action
    void addPrescription( account_name _patient) {
       // to sign the action with the given account
      require_auth( _patient);
    }

    

};

// specify the contract name, and export a public action: update
EOSIO_ABI( notechain, (update) )
