CREATE MIGRATION m1vjsakl53zp3i5mlbu24hrphjwplj6pqmqp54v43mxgw7bmwxegdq
    ONTO m1ygioglt7wpe6g6n6p3jvwunqcalh657vrmbsilak2ggcywjgok7a
{
  ALTER TYPE default::Message {
      ALTER PROPERTY message_content {
          SET TYPE std::str USING (<std::str>.message_content);
      };
  };
};
