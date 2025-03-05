CREATE MIGRATION m1ygioglt7wpe6g6n6p3jvwunqcalh657vrmbsilak2ggcywjgok7a
    ONTO m1wose7j3tqqb33j44vndtfcip27qlmf3nl7dnuwqlyuw4z6zcnkta
{
  ALTER TYPE default::Message {
      ALTER LINK message_conversation {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
