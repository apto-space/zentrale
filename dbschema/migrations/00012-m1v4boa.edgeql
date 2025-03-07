CREATE MIGRATION m1v4boaqzujnezoj23hixk5bdq26olub4h6oxqq4zxya77tavreona
    ONTO m1s4uk3v2ujzthf7nw4chvdmfwxyhbjpdanyffp7dqpxkfg6eca52a
{
  ALTER TYPE default::Conversation {
      CREATE OPTIONAL PROPERTY title: std::str;
  };
};
