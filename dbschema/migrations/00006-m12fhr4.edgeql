CREATE MIGRATION m12fhr4lacxfncl3kmkwp3ghs7pd5ppxb64vpnjqanppk4k2lpl6ea
    ONTO m1vjsakl53zp3i5mlbu24hrphjwplj6pqmqp54v43mxgw7bmwxegdq
{
  ALTER TYPE default::Conversation {
      CREATE REQUIRED PROPERTY conversation_id: std::uuid {
          SET REQUIRED USING (<std::uuid>.id);
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
