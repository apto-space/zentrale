CREATE MIGRATION m1pnowpvisnrpyv6b7i5pcplcuvvmhdepj547bqleygr52fhzgxguq
    ONTO m1465cpfdgx2y2p655scjcuiqagwpxs7ym6efgp2kedgkquupkf3cq
{
  ALTER TYPE default::Message {
      ALTER LINK message_feedback {
          USING (.<message[IS default::MessageFeedback]);
      };
  };
};
