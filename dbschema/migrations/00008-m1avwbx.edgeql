CREATE MIGRATION m1avwbx6wsb2s6gaxqztwcbewchoecbkq2bx5dyhnvi7wn44dxhocq
    ONTO m1q44oqdqrshvw5dlreur6zgx6x4lnrek47s6pt73a7kkz65rem4la
{
  CREATE EXTENSION pgvector VERSION '0.5';
  CREATE SCALAR TYPE default::voyage_embedding EXTENDING ext::pgvector::vector<1024>;
  CREATE TYPE default::Document EXTENDING default::Timestamped {
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY embedding: default::voyage_embedding;
      CREATE REQUIRED PROPERTY metadata: std::json;
  };
};
