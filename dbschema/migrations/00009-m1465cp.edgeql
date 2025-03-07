CREATE MIGRATION m1465cpfdgx2y2p655scjcuiqagwpxs7ym6efgp2kedgkquupkf3cq
    ONTO m1avwbx6wsb2s6gaxqztwcbewchoecbkq2bx5dyhnvi7wn44dxhocq
{
  CREATE TYPE default::MessageFeedback EXTENDING default::Timestamped {
      CREATE REQUIRED LINK message: default::Message {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE CONSTRAINT std::exclusive ON (.message);
      CREATE OPTIONAL PROPERTY feedback_text: std::str;
      CREATE REQUIRED PROPERTY is_positive: std::bool;
  };
  ALTER TYPE default::Message {
      CREATE LINK message_feedback: default::MessageFeedback;
  };
};
