CREATE MIGRATION m1s4uk3v2ujzthf7nw4chvdmfwxyhbjpdanyffp7dqpxkfg6eca52a
    ONTO m1pnowpvisnrpyv6b7i5pcplcuvvmhdepj547bqleygr52fhzgxguq
{
  ALTER TYPE default::Message {
      ALTER LINK message_feedback {
          USING (std::assert_single(.<message[IS default::MessageFeedback]));
      };
  };
};
