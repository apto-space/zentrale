CREATE MIGRATION m1l2z5nwxt636tdjeenxz4qhgoxettnyb5ifvjaivd6exwvc7x6y3a
    ONTO initial
{
  CREATE ABSTRACT TYPE default::Timestamped {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
      };
      CREATE PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_of_statement());
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::Conversation EXTENDING default::Timestamped {
      CREATE REQUIRED PROPERTY conversation_anon_user_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Message EXTENDING default::Timestamped {
      CREATE REQUIRED LINK message_conversation: default::Conversation;
      CREATE REQUIRED PROPERTY message_content: std::json;
      CREATE REQUIRED PROPERTY message_role: std::str;
  };
  ALTER TYPE default::Conversation {
      CREATE REQUIRED LINK conversation_messages := (std::assert_exists(.<message_conversation[IS default::Message]));
  };
};
