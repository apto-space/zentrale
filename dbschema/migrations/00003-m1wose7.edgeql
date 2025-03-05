CREATE MIGRATION m1wose7j3tqqb33j44vndtfcip27qlmf3nl7dnuwqlyuw4z6zcnkta
    ONTO m1dbmjdtgbuwncmmm23vs3nsbn266hkfekewfkmgtmm4idgfwihyba
{
  ALTER TYPE default::Conversation {
      ALTER PROPERTY conversation_anon_user_id {
          DROP CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY conversation_message_count := (std::count(.conversation_messages));
  };
};
